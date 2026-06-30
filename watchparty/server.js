const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const rooms = new Map();

class Room {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.users = [];
    this.currentContent = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.playlist = [];
    this.createdAt = new Date();
  }

  addUser(userId, userName) {
    const user = { id: userId, name: userName, joinedAt: new Date() };
    this.users.push(user);
    return user;
  }

  removeUser(userId) {
    this.users = this.users.filter(u => u.id !== userId);
  }

  setCurrentContent(content) {
    this.currentContent = content;
    this.currentTime = 0;
    this.isPlaying = false;
  }

  addToPlaylist(content) {
    this.playlist.push(content);
  }

  removeFromPlaylist(contentId) {
    this.playlist = this.playlist.filter(c => c.id !== contentId);
  }
}

app.get('/api/rooms', (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    users: room.users.length,
    currentContent: room.currentContent,
    createdAt: room.createdAt
  }));
  res.json(roomList);
});

app.post('/api/rooms', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }
  const roomId = uuidv4();
  const room = new Room(roomId, name);
  rooms.set(roomId, room);
  res.status(201).json({
    id: roomId,
    name: room.name,
    users: room.users.length,
    createdAt: room.createdAt
  });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({
    id: room.id,
    name: room.name,
    users: room.users,
    currentContent: room.currentContent,
    isPlaying: room.isPlaying,
    currentTime: room.currentTime,
    playlist: room.playlist
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    const { roomId, userName } = data;
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    socket.join(roomId);
    room.addUser(socket.id, userName);
    io.to(roomId).emit('user_joined', {
      userId: socket.id,
      userName: userName,
      users: room.users
    });
    socket.emit('room_state', {
      users: room.users,
      currentContent: room.currentContent,
      isPlaying: room.isPlaying,
      currentTime: room.currentTime,
      playlist: room.playlist
    });
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      const user = room.users.find(u => u.id === socket.id);
      if (user) {
        room.removeUser(socket.id);
        io.to(roomId).emit('user_left', {
          userId: socket.id,
          userName: user.name,
          users: room.users
        });
        if (room.users.length === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });

  socket.on('play_content', (data) => {
    const { roomId, content } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.setCurrentContent(content);
    room.isPlaying = true;
    io.to(roomId).emit('content_playing', {
      content: room.currentContent,
      startTime: room.currentTime
    });
  });

  socket.on('toggle_play', (data) => {
    const { roomId } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.isPlaying = !room.isPlaying;
    io.to(roomId).emit('playback_toggled', {
      isPlaying: room.isPlaying
    });
  });

  socket.on('seek', (data) => {
    const { roomId, time } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.currentTime = time;
    io.to(roomId).emit('seek_to', {
      time: room.currentTime
    });
  });

  socket.on('add_to_playlist', (data) => {
    const { roomId, content } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.addToPlaylist(content);
    io.to(roomId).emit('playlist_updated', {
      playlist: room.playlist
    });
  });

  socket.on('remove_from_playlist', (data) => {
    const { roomId, contentId } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.removeFromPlaylist(contentId);
    io.to(roomId).emit('playlist_updated', {
      playlist: room.playlist
    });
  });

  socket.on('send_message', (data) => {
    const { roomId, message, userName } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    io.to(roomId).emit('receive_message', {
      userId: socket.id,
      userName: userName,
      message: message,
      timestamp: new Date()
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
