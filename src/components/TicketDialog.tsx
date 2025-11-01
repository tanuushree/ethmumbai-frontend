import React, { useState } from "react";
import TicketSelector from "./TicketSelector";

interface TicketDialogProps {
  onProceed: (tickets: { earlybird: number; standard: number }) => void;
}

const TicketDialog: React.FC<TicketDialogProps> = ({ onProceed }) => {
  const [earlybirdQty, setEarlybirdQty] = useState(0);
  const [standardQty, setStandardQty] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Select Tickets</h2>
        <TicketSelector
          title="Early Bird"
          price={999}
          quantity={earlybirdQty}
          onIncrement={() => setEarlybirdQty(q => q + 1)}
          onDecrement={() => setEarlybirdQty(q => Math.max(q - 1, 0))}
        />
        <TicketSelector
          title="Standard"
          price={1999}
          quantity={standardQty}
          onIncrement={() => setStandardQty(q => q + 1)}
          onDecrement={() => setStandardQty(q => Math.max(q - 1, 0))}
        />
        <button
          onClick={() => onProceed({ earlybird: earlybirdQty, standard: standardQty })}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default TicketDialog;
