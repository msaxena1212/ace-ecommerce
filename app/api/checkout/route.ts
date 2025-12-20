import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { createOrder, getUserOrders, getOrder } from "@/lib/checkout";

/**
 * POST /api/checkout
 * Create order from cart
 */
export async function POST(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify token
        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { success: false, error: "Invalid token" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            paymentMethod,
            addressId,
            shippingAddress,
        } = body;

        // Validate payment method
        if (!paymentMethod) {
            return NextResponse.json(
                { success: false, error: "Payment method is required" },
                { status: 400 }
            );
        }

        // Create order
        const result = await createOrder(
            payload.userId,
            paymentMethod,
            addressId,
            shippingAddress
        );

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { success: false, error: "Checkout failed" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/checkout/orders
 * Get all orders for current user
 */
export async function GET(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify token
        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { success: false, error: "Invalid token" },
                { status: 401 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");
        const orderId = searchParams.get("orderId");

        // Get specific order or all orders
        if (orderId) {
            const result = await getOrder(orderId, payload.userId);
            return NextResponse.json(result);
        } else {
            const result = await getUserOrders(payload.userId, limit, offset);
            return NextResponse.json(result);
        }
    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to retrieve orders" },
            { status: 500 }
        );
    }
}