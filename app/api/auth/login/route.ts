import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Email and password are required",
                },
                { status: 400 }
            );
        }

        // Login user
        const result = await loginUser(email, password);

        if (!result.success) {
            return NextResponse.json(result, { status: 401 });
        }

        // Create response with token
        const response = NextResponse.json(result, { status: 200 });

        // Set token in httpOnly cookie
        response.cookies.set("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60, // 24 hours
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Login failed",
            },
            { status: 500 }
        );
    }
}