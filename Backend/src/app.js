const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');

const app = express();

// 1. Allow Frontend to connect (CORS)
app.use(cors()); 

// 2. Allow JSON data to be received
app.use(express.json());

// 3. Test Route (To check if server is running)
app.get('/', (req, res) => {
    res.send('CodeDrushti Backend is running!');
});

// 4. Connect the AI routes
// This means all routes in ai.routes.js will start with /ai
app.use('/ai', aiRoutes);

module.exports = app;