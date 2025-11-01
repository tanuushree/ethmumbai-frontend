import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBuyTicket = () => {
    // Hardcode ticket details for now (you can update later)
    const ticketId = 1;
    const quantity = 1;
    const cartId = "temp-cart"; // placeholder, backend will handle actual creation later

    navigate("/get-tickets", {
      state: { cartId, ticketId, quantity },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to ETHMumbai</h1>
      <p className="text-lg mb-8 text-gray-600">Grab your ticket and join the event!</p>
      <button
        onClick={handleBuyTicket}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Buy Ticket
      </button>
    </div>
  );
};

export default LandingPage;
