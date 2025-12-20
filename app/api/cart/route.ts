import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
} from "@/lib/cart";

/**
 * GET /api/cart
 * Get current user's cart
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

        // Get cart
        const result = await getCart(payload.userId);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get cart" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cart
 * Add item to cart
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
        const { productId, quantity = 1 } = body;

        if (!productId) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Add to cart
        const result = await addToCart(payload.userId, productId, quantity);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Add to cart error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add to cart" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/cart
 * Update cart item quantity
 */
export async function PUT(request: NextRequest) {
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
        const { productId, quantity } = body;

        if (!productId || quantity === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product ID and quantity are required",
                },
                { status: 400 }
            );
        }

        // Update quantity
        const result = await updateCartQuantity(
            payload.userId,
            productId,
            quantity
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error("Update cart error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update cart" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/cart
 * Remove item from cart or clear entire cart
 */
export async function DELETE(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");
        const clearAll = searchParams.get("clearAll") === "true";

        if (clearAll) {
            // Clear entire cart
            const result = await clearCart(payload.userId);
            return NextResponse.json(result);
        } else if (productId) {
            // Remove specific item
            const result = await removeFromCart(payload.userId, productId);
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product ID or clearAll parameter is required",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Delete cart error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete from cart" },
            { status: 500 }
        );
    }
}