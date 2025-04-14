const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const workRoutes = require('./routes/Work');
const bidRoutes = require('./routes/bid'); // Import bid routes
const chatRoutes = require('./routes/chat');
const institutionRoutes = require('./routes/institution');
const NotificationRoutes = require('./routes/Notification');
const app = express();


app.use(cors());

// Or configure specifically
app.use(cors({
  origin: 'http://192.168.182.237:5000',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb+srv://workit:workit@cluster0.hhghg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,

    
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', workRoutes);
app.use('/api', bidRoutes); // Use bid routes
app.use('/api', chatRoutes);
app.use('/api', userRoutes);
app.use('/api', institutionRoutes);
app.use('/api/notifications', NotificationRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
