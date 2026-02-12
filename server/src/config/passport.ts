import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            if (!email) return done(new Error("No email found from Google provider"));

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
            } else if (!user.googleId) {
                // Link Google account to existing email (optional)
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: profile.id, picture: profile.photos?.[0].value || user.picture }
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }
));

export default passport;
