import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SeatPicker from "react-seat-picker";
import "./Seats.css";

const TicketSelect = ({ userId }) => {
  const location = useLocation();
  //const { userId } = location.state;
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch("http://localhost:8000/events");
    const data = await response.json();
    setEvents(data.events);
  };

  const handleEventSelect = async (eventId) => {
    setSelectedEventId(eventId);
    const response = await fetch(
      `http://localhost:8000/list_tickets/${eventId}`
    );
    const data = await response.json();
    console.log("Ticket_data:", data.tickets);
    setRows(createRowsFromTickets(data.tickets));
  };

  const createRowsFromTickets = (tickets) => {
    // Initialize rows with 6 rows, each containing 10 null entries (representing seats).
    let newRows = Array.from({ length: 6 }, () => Array(10).fill(null));

    // Pre-defined row letters for mapping row indices to letters
    const rowLetters = ["A", "B", "C", "D", "E", "F"];

    tickets.forEach((ticket) => {
      let seatIndex = parseInt(ticket.seatNumber) - 1; // Convert seat number to 0-based index
      let rowIndex = Math.floor(seatIndex / 10); // Determine row index based on seat number
      let columnIndex = seatIndex % 10; // Determine column index based on seat number

      // Create the full seat label with row letter and column number
      let seatLabel = `${rowLetters[rowIndex]}${columnIndex + 1}`;

      // Update the seat information at the appropriate row and column
      newRows[rowIndex][columnIndex] = {
        id: ticket.ticketId,
        number: seatLabel,
        isReserved: ticket.status !== "Avalible", // Mark seat as reserved if status is not 'Available'
      };
    });

    return newRows;
  };

  const addSeatCallback = ({ row, number, id }, addCb) => {
    //setSelectedSeats((prev) => [...prev, id]);
    setSelectedSeats((prev) => {
      const newSelectedSeats = [...prev, { number, id }]; // Store both number and ID
      console.log("Selected seats after adding:", newSelectedSeats); // Log updated list of selected seats
      return newSelectedSeats;
    });
    const newTooltip = `tooltip for id-${id} added by callback`;
    addCb(row, number, id, newTooltip);
  };

  const removeSeatCallback = ({ row, number, id }, removeCb) => {
    setSelectedSeats((prev) => {
      const newSelectedSeats = prev.filter((item) => item.id !== id);
      console.log("Selected seats after removing:", newSelectedSeats); // Log updated list of selected seats
      return newSelectedSeats;
    });
    removeCb(row, number);
  };

  return (
    <div>
      <ListEvents events={events} onEventSelect={handleEventSelect} />
      {selectedEventId && rows.length > 0 && (
        <SeatPicker
          rows={rows}
          maxReservableSeats={10}
          alpha
          visible
          //selectedByDefault={false}
          addSeatCallback={addSeatCallback}
          removeSeatCallback={removeSeatCallback}
        />
      )}
      {selectedSeats.length > 0 && (
        <div>
          <h2>
            Selected Seats:{" "}
            {selectedSeats.map((seat) => seat.number).join(", ")}
          </h2>
          <button
            onClick={() =>
              navigate("/Purchase", {
                state: { selectedSeats, selectedEventId, userId },
              })
            }
          >
            Finalize Purchase
          </button>
        </div>
      )}
    </div>
  );
};

const ListEvents = ({ events, onEventSelect }) => {
  return (
    <div>
      <h2>Select Event</h2>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Date and Time</th>
            <th>Type</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.eventId}
              onClick={() => onEventSelect(event.eventId)}
            >
              <td>{event.eventName}</td>
              <td>{event.eventDate}</td>
              <td>{event.eventType}</td>
              <td>{event.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketSelect;
