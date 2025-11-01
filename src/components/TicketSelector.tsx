import React from "react";

interface TicketSelectorProps {
  title: string;
  price: number;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const TicketSelector: React.FC<TicketSelectorProps> = ({ title, price, quantity, onIncrement, onDecrement }) => {
  return (
    <div className="border p-4 rounded-md flex justify-between items-center mb-4">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-600">Price: ₹{price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onDecrement} className="px-2 py-1 bg-gray-200 rounded">-</button>
        <span>{quantity}</span>
        <button onClick={onIncrement} className="px-2 py-1 bg-gray-200 rounded">+</button>
      </div>
    </div>
  );
};

export default TicketSelector;
