import { User, Order } from "../models/index.js";

import { createOrder as createCashfreeOrder, getPaymentStatus, } from "../services/cashFreeServices.js";

export const createPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const orderId = `ORDER_${userId}_${Date.now()}`;
        const amount = 499;
        const orderCurrency = "INR";
        const cashfreeOrder = await createCashfreeOrder(
            orderId,
            amount,
            "INR",
            String(userId),
            "9876543210"
        );

        await Order.create({
            orderId,
            amount,
            userId,
            status: "PENDING",
            paymentSessionId: cashfreeOrder.payment_session_id,
        });

        res.status(201).json({
            orderId,
            paymentSessionId: cashfreeOrder.payment_session_id,
        });

    } catch (error) {
        console.error("CREATE PAYMENT ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({
            where: { orderId },
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        const payments = await getPaymentStatus(orderId);
        const payment = payments[0];

        if (payment.payment_status === "SUCCESS") {
            await order.update({
                status: "SUCCESSFUL",
            });

            // PENDING → SUCCESSFUL
            await User.update(
                {
                    isPremium: true,
                },
                {
                    where: {
                        id: order.userId,
                    },
                }
            );
            return res.json({
                status: "SUCCESSFUL",
                message: "Transaction successful",
            });
        }

        if (payment.payment_status === "FAILED") {

            // PENDING → FAILED
            await order.update({
                status: "FAILED",
            });
            return res.json({
                status: "FAILED",
                message: "TRANSACTION FAILED.",
            });
        }

        res.json({
            status: "PENDING",
            message: "Payment is pending",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Payment verification failed",
        });
    }
};