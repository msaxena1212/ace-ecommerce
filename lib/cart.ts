import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CartItem {
    productId: string;
    quantity: number;
}

// Add item to cart
export async function addToCart(
    userId: string,
    productId: string,
    quantity: number
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, price: true, stock: true },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < quantity) {
            throw new Error("Insufficient stock");
        }

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: true },
            });
        }

        const existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        return getCart(userId);
    } catch (error) {
        throw error;
    }
}

// Remove item from cart
export async function removeFromCart(userId: string, productId: string) {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        const cartItem = cart.items.find((item) => item.productId === productId);
        if (!cartItem) {
            throw new Error("Item not in cart");
        }

        await prisma.cartItem.delete({
            where: { id: cartItem.id },
        });

        return getCart(userId);
    } catch (error) {
        throw error;
    }
}

// Update cart item quantity
export async function updateCartQuantity(
    userId: string,
    productId: string,
    quantity: number
) {
    try {
        if (quantity <= 0) {
            return removeFromCart(userId, productId);
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stock: true },
        });

        if (!product || product.stock < quantity) {
            throw new Error("Insufficient stock");
        }

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        const cartItem = cart.items.find((item) => item.productId === productId);
        if (!cartItem) {
            throw new Error("Item not in cart");
        }

        await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity },
        });

        return getCart(userId);
    } catch (error) {
        throw error;
    }
}

// Get cart with all details
export async function getCart(userId: string) {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                sku: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            return {
                id: "",
                userId,
                items: [],
                subtotal: 0,
                tax: 0,
                total: 0,
                itemCount: 0,
            };
        }

        const subtotal = cart.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
        const total = subtotal + tax;

        return {
            id: cart.id,
            userId: cart.userId,
            items: cart.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                product: item.product,
                subtotal: item.product.price * item.quantity,
            })),
            subtotal,
            tax,
            total,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        };
    } catch (error) {
        throw error;
    }
}

// Clear entire cart
export async function clearCart(userId: string) {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        return getCart(userId);
    } catch (error) {
        throw error;
    }
}

// Validate cart before checkout
export async function validateCartForCheckout(userId: string) {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`
                );
            }
        }

        return true;
    } catch (error) {
        throw error;
    }
}
