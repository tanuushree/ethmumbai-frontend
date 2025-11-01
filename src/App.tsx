import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BuyTickets from "./pages/BuyTickets";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-tickets" element={<BuyTickets />} />
      </Routes>
    </Router>
  );
}

export default App;
