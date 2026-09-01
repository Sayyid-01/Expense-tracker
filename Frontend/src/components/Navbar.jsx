
import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

const API = "http://localhost:4000/payment";

const Navbar = () => {
    const [loading, setLoading] = useState(false);

    // Only check isPremium from localStorage
    const isPremium = localStorage.getItem("isPremium") === "true";

    const handlePremium = async () => {
        try {
            setLoading(true);

            // Token is from sessionStorage
            const token = sessionStorage.getItem("token");

            // Create order in backend
            const response = await fetch(
                API + "/create_order",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Open Cashfree
            const cashfree = await load({
                mode: "sandbox",
            });

            await cashfree.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_modal",
            });

            // Verify payment
            const verifyResponse = await fetch(
                `${API}/verify/${data.orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await verifyResponse.json();

            if (result.status === "SUCCESSFUL") {
                alert("Transaction successful");

                // Store  premium status in localStorage
                localStorage.setItem("isPremium", "true");

                // Refreshinsg UI
                window.location.reload();

            } else if (result.status === "FAILED") {
                alert("TRANSACTION FAILED.");
            }

        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong");

        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">
                Expense Tracker
            </h1>

            {isPremium ? (
                <button
                    disabled
                    className="cursor-default rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white"
                >
                    Premium Member
                </button>
            ) : (
                <button
                    onClick={handlePremium}
                    disabled={loading}
                    className="rounded-lg bg-yellow-500 px-5 py-2.5 font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                    {loading
                        ? "Processing..."
                        : "Buy Premium Membership"}
                </button>
            )}
        </nav>
    );
};

export default Navbar;
