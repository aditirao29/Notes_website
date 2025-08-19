require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require("./db");
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const folderRoutes = require("./routes/folders");
const noteRoutes = require("./routes/notes");

connection()

app.use(express.json())
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);

app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);

app.get('/api/protected',(req,res) => {
    const authHeader = req.header('Authorization');
    if (!authHeader)
        return res.status(401).json({message: 'Access denied. No token provided,'});

    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({message: 'Access denied. No token provided'})
    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        res.json({ message: 'Protected content', user:decoded});
    }
    catch(error) {
        res.status(400).json({message: 'Invalid token'});
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));