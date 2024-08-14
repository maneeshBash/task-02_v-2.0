const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// const PORT = process.env.PORT || 4040;  ------->process.env.PORT is a environment veriable for production lvl(AWS,AZURE,etc)
const PORT = 4040;

app.use(cors());  //middleware

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit; //page=2,limit=10,startIdx= (2-1)*10 =10 start index

    try {
        const response = await fetch('https://randomuser.me/api/?results=1000');
        const data = await response.json();
        const total = data.results.length;
        const users = data.results.slice(startIndex, startIndex + limit);    // 10,20
        res.json({ total, users }); //total = 1000, users = [Array of 10 users data]
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
