import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Purchase = () => {
  // you would like to buy these tickets
  // use selectedEventId to get the name of the event
  // list tickets from selected seats

  // which payment method would you like to use
  // list payment methods

  // click purchase
  // uses selected payment method and ticketId's to create the transaction
  // uses assign_ticket to get to set assign the ticket

  // returns to dashboard

  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, selectedEventId, userId } = location.state;
  //const [eventName, setEventName] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    fetchEventName();
    fetchPaymentMethods();
  }, []);

  const fetchEventName = async () => {
    const response = await fetch(
      `http://localhost:8000/get_event/${selectedEventId}`
    );
    const data = await response.json();
    setEventName(data.event.eventName);
  };

  const fetchPaymentMethods = async () => {
    const response = await fetch(
      `http://localhost:8000/get_payment_methods/${userId}`
    );
    const data = await response.json();
    setPaymentMethods(data.paymentMethods);
  };

  // TODO add multiple payment methods
  const purchaseTickets = async () => {
    for (const seat of selectedSeats) {
      console.log("seatid:", seat.id);
      const data = {
        userId: userId,
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
        `http://localhost:8000/assign_ticket/${seat.id}`,
        options
      );
      const message = await response.json();

      if (!response.ok) {
        alert(`Failed to purchase ticket ${seat.number}: ${message.message}`);
        return;
      }
    }
    alert("All selected tickets successfully purchased.");
    navigate("/dashboard", { state: { userId: userId } });
  };

  return (
    <div>
      <h2>Seats</h2>
      <h2>{selectedSeats.map((seat) => seat.number).join(", ")}</h2>
      <div></div>

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

      <button onClick={purchaseTickets}>Purchase Tickets</button>
    </div>
  );
};

export default Purchase;
