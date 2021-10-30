const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());



// user and password
// DreamTrevels      user database
// 75xAxIWlzsdP0stM  user password 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svxru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        //connect to database database name and collection name
        await client.connect();
        const database = client.db('dreamTreavels');
        const servicesCollection = database.collection('services');
        //connect to database

        // Post API / add service to server

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('form clint side', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })


    }
    finally {
        // await.client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('dream  server runnig');
});


app.listen(port, () => {
    console.log('Runing server on port', port);
})