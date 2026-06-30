import React, { useState, useEffect } from 'react';
import './App.css';
import RoomList from './components/RoomList';
import Room from './components/Room';
import io from 'socket.io-client';

function App() {
  const [currentView, setCurrentView] = useState('rooms');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userName, setUserName] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const handleSelectRoom = (room) => {
    if (!userName) {
      alert('Please enter your name first');
      return;
    }
    setSelectedRoom(room);
    setCurrentView('watch');
  };

  const handleBackToRooms = () => {
    setCurrentView('rooms');
    setSelectedRoom(null);
  };

  return (
    <div className="app">
      {currentView === 'rooms' ? (
        <RoomList
          userName={userName}
          onSetUserName={setUserName}
          onSelectRoom={handleSelectRoom}
          socket={socket}
        />
      ) : (
        <Room
          room={selectedRoom}
          userName={userName}
          socket={socket}
          onBack={handleBackToRooms}
        />
      )}
    </div>
  );
}

export default App;
