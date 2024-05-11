import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./form.css";

const Payments = () => {
  const location = useLocation();
  const { userId } = location.state;
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [exprMonth, setExprMonth] = useState("");
  const [exprYear, setExprYear] = useState("");
  const [billingAdd, setBillingAdd] = useState("");
  const [cvv, setCvv] = useState("");
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
  });

  const fetchPaymentMethods = async () => {
    const response = await fetch(
      `http://localhost:8000/get_payment_methods/${userId}`
    );
    const data = await response.json();
    setSavedPaymentMethods(data.paymentMethods);
  };

  const removePaymentMethod = async (paymentMethodId) => {
    const response = await fetch(
      `http://localhost:8000/delete_payment_method/${paymentMethodId}`
    );
    const data = await response.json();
    alert(data.message);
  };

  const addPaymentMethod = async (e) => {
    e.preventDefault();

    const data = {
      cardNumber,
      expirationMonth: exprMonth,
      expirationYear: exprYear,
      billingAddress: billingAdd,
      cvv,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/create_payment_method/${userId}`,
        options
      );
      const message = await response.json();

      alert(message.message);
    } catch (error) {
      alert("Failed to create paymentMethod", error);
    }
  };

  return (
    <div className="mainContainer">
      <h1>Edit Payment Methods</h1>

      <ul>
        {savedPaymentMethods.map((method) => (
          <li key={method.savedPaymentMethodId}>Card: {method.cardNumber}</li>
        ))}
      </ul>

      <form onSubmit={addPaymentMethod}>
        <label>
          Card Number:
          <input type="text" onChange={(e) => setCardNumber(e.target.value)} />
        </label>
        <label>
          Expiration Month:
          <input type="text" onChange={(e) => setExprMonth(e.target.value)} />
        </label>
        <label>
          Expiration Year:
          <input type="text" onChange={(e) => setExprYear(e.target.value)} />
        </label>
        <label>
          Billing Adddress:
          <input type="text" onChange={(e) => setBillingAdd(e.target.value)} />
        </label>
        <label>
          CVV:
          <input type="text" onChange={(e) => setCvv(e.target.value)} />
        </label>

        <button type="submit">Add Payment Method</button>
      </form>

      <button
        onClick={() => navigate("/dashboard", { state: { userId: userId } })}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Payments;
