
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
