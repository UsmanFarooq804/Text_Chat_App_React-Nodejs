import '../components/RoomForm.css';
import React, { useState } from 'react';

function RoomForm({ onCreateRoom }) {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName) {
      onCreateRoom(roomName);
      setRoomName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button type="submit">Create Room</button>
    </form>
  );
}

export default RoomForm;
