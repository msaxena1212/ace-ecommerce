import { PrismaClient } from "@prisma/client";
import { getCart, clearCart } from "./cart";

const prisma = new PrismaClient();

interface ShippingAddress {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

// Create order from cart
export async function createOrder(
    userId: string,
    paymentMethod: string,
    addressId?: string,
    shippingAddress?: ShippingAddress
) {
    try {
        const cart = await getCart(userId);

        if (!cart.items || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // Validate payment method
        const validPaymentMethods = [
            "CREDIT_CARD",
            "DEBIT_CARD",
            "UPI",
            "NET_BANKING",
            "COD",
        ];
        if (!validPaymentMethods.includes(paymentMethod)) {
            throw new Error("Invalid payment method");
        }

        // Get address
        let address;
        if (addressId) {
            address = await prisma.address.findFirst({
                where: {
                    id: addressId,
                    userId,
                },
            });

            if (!address) {
                throw new Error("Address not found");
            }
        } else if (shippingAddress) {
            // Create new address
            address = await prisma.address.create({
                data: {
                    userId,
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    country: shippingAddress.country,
                    isDefault: false,
                },
            });
        } else {
            throw new Error("Address is required");
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                orderNumber: generateOrderNumber(),
                status: "PENDING",
                paymentMethod,
                paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
                subtotal: cart.subtotal,
                tax: cart.tax,
                total: cart.total,
                shippingFee: 0,
                addressId: address.id,
                items: {
                    createMany: {
                        data: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                            subtotal: item.subtotal,
                        })),
                    },
                },
            },
            include: { items: true },
        });

        // Update product stock
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        // Clear cart
        await clearCart(userId);

        return order;
    } catch (error) {
        throw error;
    }
}

// Get single order
export async function getOrder(orderId: string, userId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                sku: true,
                            },
                        },
                    },
                },
                address: true,
            },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return order;
    } catch (error) {
        throw error;
    }
}

// Get user's orders
export async function getUserOrders(
    userId: string,
    limit: number = 10,
    offset: number = 0
) {
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
                address: true,
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset,
        });

        const total = await prisma.order.count({
            where: { userId },
        });

        return {
            orders,
            total,
            limit,
            offset,
        };
    } catch (error) {
        throw error;
    }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
    try {
        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];

        if (!validStatuses.includes(status)) {
            throw new Error("Invalid order status");
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { items: true },
        });

        return order;
    } catch (error) {
        throw error;
    }
}

// Cancel order
export async function cancelOrder(orderId: string, userId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: { items: true },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        if (["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.status)) {
            throw new Error(`Cannot cancel order with status:
