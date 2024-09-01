import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoomForm from './components/RoomForm';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import './styles/App.css';

function App() {
  const [rooms, setRooms] = useState([]);

  const handleCreateRoom = (roomName) => {
    setRooms((prevRooms) => [...prevRooms, roomName]);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <RoomForm onCreateRoom={handleCreateRoom} />
              <RoomList rooms={rooms} />
            </>
          } />
          <Route path="/room/:room" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
