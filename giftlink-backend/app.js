/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
//const {loadData} = require("./util/import-mongo/index");

const app = express();
//app.use("*",cors());
const port = 3060;

// Serve static files from the public directory (for home.html)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files for React App from a subdirectory
app.use('/app', express.static(path.join(__dirname, 'public', 'react-app')));

// Route for Home Page - Serve home.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve the React app's index.html for any other requests under /app
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
const giftRoutes = require('./routes/giftRoutes');
const authRoutes = require('./routes/authRoutes');
// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes');
const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
// Gift API Task 2: add the giftRoutes to the server by using the app.use() method.
app.use('/api/gifts', giftRoutes);
app.use('/api/auth', authRoutes);
// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
app.use('/api/search', searchRoutes);

// Default route for react app
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
})

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// app.get("/",(req,res)=>{
//     res.send("Inside the server")
// })

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
