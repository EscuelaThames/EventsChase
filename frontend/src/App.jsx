import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import Start from "./Start";
import Dashboard from "./Dashboard";
import Purchase from "./Purchase";
import Sell from "./Sell";
import UpdateInfo from "./UpdateInfo";
import Payments from "./Payments";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/updateInfo" element={<UpdateInfo />} />
          <Route path="/paymentMethods" element={<Payments />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
