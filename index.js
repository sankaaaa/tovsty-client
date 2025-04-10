//index.js
require('dotenv').config();
const express = require('express');
const app = express();
const bookRoutes = require('./routes');
app.use(express.json());
app.use('/', bookRoutes);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
