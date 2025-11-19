import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BuyTickets from "./pages/BuyTickets";
import { Providers } from "./providers";

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/get-tickets" element={<BuyTickets />} />
        </Routes>
      </Router>
    </Providers>
  );
}

export default App;
