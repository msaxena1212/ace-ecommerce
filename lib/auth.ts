import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRATION = 24 * 60 * 60; // 24 hours

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

// Login user and return JWT token
export async function loginUser(email: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
                phone: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            } as JWTPayload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
            },
        };
    } catch (error) {
        throw error;
    }
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return payload as JWTPayload;
    } catch (error) {
        return null;
    }
}

// Get current user from token
export async function getCurrentUser(token: string | undefined) {
    if (!token) {
        throw new Error("No token provided");
    }

    const payload = verifyToken(token);
    if (!payload) {
        throw new Error("Invalid token");
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
        },
    });

    return user;
}

// Extract token from request cookies
export function getTokenFromRequest(req: Request): string | null {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";");
    const authCookie = cookies.find((c) => c.trim().startsWith("authToken="));

    if (!authCookie) return null;

    return authCookie.split("=")[1];
}
