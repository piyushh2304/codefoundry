import { Router } from 'express';
import passport from 'passport';
import { register, login, googleCallback, getMe } from '../controller/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`
    })(req, res, next);
}, googleCallback);

export default router;