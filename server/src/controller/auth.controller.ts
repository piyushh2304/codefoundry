import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';


//helper to generate token 
const generateToken = (user: any) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, JWT_SECRET, {
        expiresIn: '7d'
    })
}


export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "all fields required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, passwordHash: hashedPassword, name, provider: 'local' },
        });

        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, picture: user.picture } });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server error', error });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = generateToken(user);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, picture: user.picture } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const googleCallback = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        const token = generateToken(user);
        res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/login?error=GoogleAuthFailed`);
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ id: user.id, email: user.email, name: user.name, picture: user.picture, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};