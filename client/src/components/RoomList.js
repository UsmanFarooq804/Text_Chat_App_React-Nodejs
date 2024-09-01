import '../components/RoomList.css';
import React from 'react';
import { Link } from 'react-router-dom';

function RoomList({ rooms }) {
  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room}>
            <Link to={`/room/${room}`}>{room}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
