const express = require('express');
const mongoose = require('mongoose');
const messageSchema=require('./models/messagesSchema');
require('dotenv').config();
const app = express();

const CORS = require('cors');
app.use(CORS());

// Middleware to parse JSON body
app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Start the server after the database connection is established
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

// Function to create or retrieve the Mongoose model for a given ID
const getModelForId = id => {
    let Msg;
    try {
        Msg = mongoose.model(id);
    } catch (error) {
        Msg = mongoose.model(id, messageSchema);
    }
    return Msg;
};

app.get('/',(req,res)=>{
    res.send("Api is LIVE");
})

// Endpoint to handle POST requests for sending messages
app.post('/SendMessages', async (req, res) => {
    try {
        const data = req.body;
        const RUID = data.RUID;
        const Msg = getModelForId(RUID);

        // Insert data into the dynamically created collection
        const msg = await Msg.create(data);
        res.status(200).json({ status:'ok' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/FetchAllMessages',async (req,res)=>{
    try{
        const SUID = req.body.SUID;
        const Msg = getModelForId(SUID);
        const messages=await Msg.find({});
        res.status(200).json(messages);
    }
    catch(error){
        res.status(500).json({message: err.message});
    }
});

// Endpoint to handle POST requests for getting undelivered messages
app.post('/GetMessages', async (req, res) => {
    try {
        const SUID = req.body.SUID;
        const Msg = getModelForId(SUID);
        const isReciever=req.body.isReciever;
        // Find undelivered messages
        const undeliveredMessages = await Msg.find({ Delivered: false });

        // Update Delivered status for retrieved messages
        if(isReciever)await Msg.updateMany({ Delivered: false }, { $set: { Delivered: true } });

        // Send undelivered messages as response
        res.status(200).json({ messages: undeliveredMessages });
    } catch (error) {
        console.error('Error fetching undelivered messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
