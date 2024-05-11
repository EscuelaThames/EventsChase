import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./form.css";

const Sell = () => {
  // display tickets that have userId associated with it
  // select ticket you want to refund
  // keep track of selected tickets
  // refund button
  // refund the tickets

  const location = useLocation();
  const navigate = useNavigate();
  const [ownedTickets, setOwnedTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { userId } = location.state;

  useEffect(() => {
    fetchTickets();
    fetchPaymentMethods();
  }, []);

  const fetchTickets = async () => {
    const response = await fetch(`http://localhost:8000/tickets/${userId}`);
    const data = await response.json();
    setOwnedTickets(data.tickets);
  };

  const fetchPaymentMethods = async () => {
    const response = await fetch(
      `http://localhost:8000/get_payment_methods/${userId}`
    );
    const data = await response.json();
    setPaymentMethods(data.paymentMethods);
  };

  const toggleTicketSelection = (ticketId) => {
    setSelectedTickets((previousSelectedTickets) => {
      if (previousSelectedTickets.includes(ticketId)) {
        return previousSelectedTickets.filter((id) => id !== ticketId);
      } else {
        return [...previousSelectedTickets, ticketId];
      }
    });
  };

  const removeTickets = async () => {
    if (selectedTickets.length === 0) {
      alert("Please select a ticket to refund");
      return;
    }

    for (const ticket of selectedTickets) {
      console.log("ticketId to be deleted", ticket);
      const data = {
        userId,
        paymentMethodId: selectedPaymentMethod.paymentMethodId,
      };
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(
        `http://localhost:8000/remove_ticket/${ticket}`,
        options
      );
      const message = await response.json();

      if (!response.ok) {
        alert(`Failed to purchase ticket ${seat.number}: ${message.message}`);
        return; // Stop further processing on failure
      }
    }
    alert("All selected tickets successfully refunded.");
    navigate("/dashboard", { state: { userId: userId } });
  };

  return (
    <div className="mainContainer">
      <h2>Owned Tickets</h2>
      <ul>
        {ownedTickets.map((ticket) => (
          <li
            key={ticket.ticketId}
            onClick={() => toggleTicketSelection(ticket.ticketId)}
            style={{
              cursor: "pointer",
              color: selectedTickets.includes(ticket.ticketId)
                ? "blue"
                : "black",
            }}
          >
            Ticket: {ticket.ticketId}
          </li>
        ))}
      </ul>

      <h2>Select Payment Method</h2>
      <ul>
        {paymentMethods.map((method) => (
          <li
            key={method.paymentMethodId}
            onClick={() => setSelectedPaymentMethod(method)}
            style={{
              cursor: "pointer",
              color:
                selectedPaymentMethod?.paymentMethodId ===
                method.paymentMethodId
                  ? "blue"
                  : "black",
            }}
          >
            Card: {method.cardNumber}
          </li>
        ))}
      </ul>

      <button onClick={removeTickets}>Refund Tickets</button>
    </div>
  );
};

export default Sell;
