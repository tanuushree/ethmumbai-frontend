import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
("use client");

import { DaimoPayButton } from "@daimo/pay";

const BuyTickets: React.FC = () => {
  const [ticketType, setTicketType] = useState<"earlybird" | "regular">(
    "earlybird"
  );
  const [quantity, setQuantity] = useState(1);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [participants, setParticipants] = useState<
    { name: string; email: string }[]
  >([{ name: "", email: "" }]);
  const [loading, setLoading] = useState(false);

  const ticketPrices = {
    earlybird: 999,
    regular: 1999,
  };

  const [payId, setPayId] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // handle quantity update
  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prevQty) => {
      const newQuantity = type === "inc" ? prevQty + 1 : Math.max(1, prevQty - 1);

      setParticipants((prevParticipants) => {
        const diff = newQuantity - prevParticipants.length;
        if (diff > 0) {
          return [
            ...prevParticipants,
            ...Array.from({ length: diff }, () => ({ name: "", email: "" })),
          ];
        } else if (diff < 0) {
          return prevParticipants.slice(0, newQuantity);
        }
        return prevParticipants;
      });

      return newQuantity;
    });
  };

  const total = ticketPrices[ticketType] * quantity;

  // Handle input changes
  const handleBuyerChange = (field: string, value: string) => {
    setBuyerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleParticipantChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...participants];
    updated[index][field as "name" | "email"] = value;
    setParticipants(updated);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayWithINR = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay SDK. Please check your network.");
      return;
    }

    try {
      setLoading(true);

      const ticketTypeToSend = ticketType;

      const payload = {
        ticketTypeToSend,
        buyerName: buyerInfo.name,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        participants: participants.map((p, i) => ({
          ...p,
          isBuyer: i === 0,
        })),
        quantity,
      };

      const { data } = await axios.post(
        "http://localhost:3000/payments/order",
        payload
      );

      const options = {
        key: "rzp_test_RZlakbieFC6xU8", // 🔑 replace with your actual key
        amount: data.amount * 100,
        currency: data.currency,
        name: "ETHMumbai",
        description: "Conference Ticket Purchase",
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await axios.post("http://localhost:3000/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("✅ Payment Successful!");
          } catch (err) {
            console.error("Verification failed", err);
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: buyerInfo.name,
          email: buyerInfo.email,
          contact: buyerInfo.phone,
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithCrypto = async (e: React.MouseEvent) => {
    if (loading || payId) return;

    e.stopPropagation();
    try {
      setLoading(true);
      const ticketTypeToSend = ticketType;

      const payload = {
        ticketTypeToSend,
        buyerName: buyerInfo.name,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        participants,
        quantity,
      };

      // Call Daimo API (placeholder for now)
      const { data } = await axios.post(
        "http://localhost:3000/payments/create-order",
        payload
      );

      // Redirect or open Daimo Pay link
      console.log(data);
      setPayId(data.paymentId);
    } catch (error) {
      console.error("Crypto payment error:", error);
      alert("Failed to initiate crypto payment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!payId) return;

    const id = requestAnimationFrame(() => {
      const btn = wrapperRef.current?.querySelector("button");
      btn?.click(); // trigger daimo flow
    });

    return () => cancelAnimationFrame(id);
  }, [payId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">Buy Tickets</h1>
      <p className="text-center text-gray-600 mb-8">
        Secure your spot at ETHMumbai 2025
      </p>

      {/* Ticket Type */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Ticket Type</h2>
        <div className="grid gap-4">
          {[
            {
              type: "earlybird",
              label: "Early Bird",
              price: 999,
              desc: "Available until Dec 31, 2025",
            },
            {
              type: "regular",
              label: "Regular",
              price: 1999,
              desc: "Standard pricing",
            },
          ].map(({ type, label, price, desc }) => (
            <div
              key={type}
              onClick={() => setTicketType(type as "earlybird" | "regular")}
              className={`border rounded-xl p-4 cursor-pointer transition ${
                ticketType === type ? "border-black" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{label}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>Full conference access (3 days)</li>
                    <li>Hackathon participation</li>
                    <li>Meals & refreshments</li>
                    <li>ETHMumbai swag kit</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">₹{price}</p>
                  <p className="text-sm text-gray-500">per ticket</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between mt-6">
          <h3 className="font-medium">Quantity</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleQuantityChange("dec")}
              className="px-3 py-1 border rounded-lg"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => handleQuantityChange("inc")}
              className="px-3 py-1 border rounded-lg"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name *"
            className="border rounded-lg p-2"
            value={buyerInfo.name}
            onChange={(e) => handleBuyerChange("name", e.target.value)}
          />
          <input
            type="email"
            placeholder="Email *"
            className="border rounded-lg p-2"
            value={buyerInfo.email}
            onChange={(e) => handleBuyerChange("email", e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border rounded-lg p-2 md:col-span-2"
            value={buyerInfo.phone}
            onChange={(e) => handleBuyerChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Participant Info */}
      {participants.map((p, i) => (
        <div key={i} className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Participant {i + 1}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              className="border rounded-lg p-2"
              value={p.name}
              onChange={(e) =>
                handleParticipantChange(i, "name", e.target.value)
              }
            />
            <input
              type="email"
              placeholder="Email *"
              className="border rounded-lg p-2"
              value={p.email}
              onChange={(e) =>
                handleParticipantChange(i, "email", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Ticket Type</span>
          <span>{ticketType === "earlybird" ? "Early Bird" : "Regular"}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Price per ticket</span>
          <span>₹{ticketPrices[ticketType]}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Quantity</span>
          <span>{quantity}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        {/* Two payment buttons */}
        <div className="grid md:grid-cols-2 gap-3">
          <button
            onClick={handlePayWithINR}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay with INR (Razorpay)"}
          </button>

          <div
            ref={wrapperRef}
            onClick={handlePayWithCrypto}
            style={{ position: "relative", display: "inline-block" }}
            aria-busy={loading}
          >
            {loading && !payId && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 14,
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(2px)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              >
                Creating order…
              </div>
            )}
            <DaimoPayButton
              payId={payId}
              //onOpen to be changed to onPaymentStarted
              onOpen={() => {
                console.log("Payment open: ");
                fetch("http://localhost:3000/payments/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paymentType: "DAIMO",
                    paymentId: payId,
                  }),
                }).catch(console.error);
              }} /* Logs that will appear when the user initiated the payment */
              onPaymentCompleted={(e) => {
                console.log(e);
                fetch("http://localhost:3000/payments/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paymentType: "DAIMO",
                    paymentId: payId,
                  }),
                }).catch(console.error);
              }} /* Logs that will appear when the user completed the payment */
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTickets;
