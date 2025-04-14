// const http = require('http');
// const { Server } = require('socket.io');

// // Create an HTTP server
// const server = http.createServer();

// // Initialize WebSocket server
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Allow all origins (update this in production)
//   },
// });

// // Store connected users
// const users = {};

// // Handle WebSocket connections
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Listen for user registration (e.g., when a user logs in)
//   socket.on('register', (userId) => {
//     users[userId] = socket.id; // Map userId to socketId
//     console.log('User registered:', userId);
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//     for (const [userId, socketId] of Object.entries(users)) {
//       if (socketId === socket.id) {
//         delete users[userId];
//         break;
//       }
//     }
//   });
// });

// // Function to send notification via WebSocket
// const sendNotification = (userId, message) => {
//   const socketId = users[userId];
//   if (socketId) {
//     io.to(socketId).emit('notification', message);
//     console.log('Notification sent to user:', userId);
//   } else {
//     console.error('User is not connected:', userId);
//   }
// };

// // Export the WebSocket server and sendNotification function
// module.exports = { server, sendNotification };