import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

export const createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerID,
    customerPhone
) => {
    try {
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
        const formattedExpiryDate = expiryDate.toISOString();
        const request = {
            "order_amount": orderAmount,
            "order_currency": orderCurrency,
            "order_id": orderId,
            "customer_details": {
                "customer_id": customerID,
                "customer_phone": customerPhone
            },
            "order_meta": {
                "return_url": `http://localhost:4000/payment/verify/${orderId}`,
                payment_method: "ccc,upi,nb",
            },
            order_expiry_time: formattedExpiryDate
        };
        const response = await cashfree.PGCreateOrder(request);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

export const getPaymentStatus = async (orderId) => {
    try {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        return response.data;
    } catch (error) {
        console.error("Error fetching payment status:", error);
        throw error;
    }
}
