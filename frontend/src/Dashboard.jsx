import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TicketSelect from "./TicketSelect";
//import Button from "/Users/milesthames/Documents/School/S24/Databases/EventsChase/frontend/src/components/Button.tsx";
import "./dashboard.css";

const Dashboard = () => {
  // getting userId from previous page
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state;

  const [showTicketSelectModal, setShowTicketSelectModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const toggleTicketSelectModal = () => {
    setShowTicketSelectModal(!showTicketSelectModal);
  };

  // gathering and displaying user information on dashboard
  const fetchUserInfo = async () => {
    const ticketResponse = await fetch(
      `http://localhost:8000/tickets/${userId}`
    );
    const ticketData = await ticketResponse.json();

    const transactionResponse = await fetch(
      `http://localhost:8000/get_transactions/${userId}`
    );
    const transactionData = await transactionResponse.json();

    setTickets(ticketData.tickets);
    setTransactions(transactionData.transactions);
  };

  return (
    <div className="dashboard-container">
      <h1>Chase Events</h1>
      <h3>Transactions</h3>
      {transactions && transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Payment Method</th>
              <th>Price</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transactionId}>
                <td>{transaction.ticketId}</td>
                <td>{transaction.paymentMethodId}</td>
                <td>{transaction.price}</td>
                <td>{transaction.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions available.</p>
      )}
      <div></div>

      <h3>My Tickets</h3>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Event</th>
            <th>Seat Number</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketId}>
              <td>{ticket.ticketId}</td>
              <td>{ticket.name}</td>
              <td>{ticket.seatNumber}</td>
              <td>{ticket.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div></div>

      <div>
        <button onClick={toggleTicketSelectModal}>Buy Tickets</button>

        {showTicketSelectModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={toggleTicketSelectModal}>
                &times;
              </span>
              <TicketSelect userId={userId} />
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => navigate("/sell", { state: { userId: userId } })}
        >
          Refund Tickets
        </button>
      </div>

      <div>
        <button
          onClick={() => navigate("/updateInfo", { state: { userId: userId } })}
        >
          Update UserInfo / Credentials
        </button>
      </div>

      <div>
        <button
          onClick={() =>
            navigate("/paymentMethods", { state: { userId: userId } })
          }
        >
          Edit Payment Methods
        </button>
      </div>

      <button onClick={() => navigate("/")}>Log out</button>
    </div>
  );
};

export default Dashboard;
