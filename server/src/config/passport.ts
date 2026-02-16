import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "/api/auth/google/callback",
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) return done(null, false, { message: "No email found from Google provider" });

            console.log(`Google Auth attempt for email: ${email}`);

            // Check if user exists
            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                // Create new Google user
                user = await prisma.user.create({
                    data: {
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        googleId: profile.id,
                        provider: 'google'
                    }
                });
                console.log(`New user created via Google: ${email}`);
            } else {
                // Update existing user with Google info if not present
                const updateData: any = {};
                if (!user.googleId) updateData.googleId = profile.id;
                if (!user.picture) updateData.picture = profile.photos?.[0].value;
                if (user.provider !== 'google' && user.provider !== 'local') updateData.provider = 'google';

                if (Object.keys(updateData).length > 0) {
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: updateData
                    });
                    console.log(`User updated with Google info: ${email}`);
                }
            }

            return done(null, user);
        } catch (error) {
            console.error("Error in Google Strategy:", error);
            return done(error as Error, false);
        }
    }
));

export default passport;

