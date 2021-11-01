const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const { json } = require('express');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



// user and password
// DreamTrevels      user database
// 75xAxIWlzsdP0stM  user password 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svxru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        //connect to database database name and collection name
        await client.connect();
        console.log('connect to database test');
        const database = client.db('dreamTreavels');
        console.log('hitted');
        const servicesCollection = database.collection('services');
        // for card 
        const OrderCollection = database.collection('cardItem');
        //connect to database



        // post order single offer 
        // post  api
        app.post('/carts', async (req, res) => {
            const event = req.body;
            const result = await OrderCollection.insertOne(event);
            res.json(result);
        })

        // get api for offer all
        app.get('/carts', async (req, res) => {
            const cursor = OrderCollection.find({})
            const item = await cursor.toArray();
            res.json(item);
        })


        // delete
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const singlCart = await OrderCollection.deleteOne(query)
            res.send(singlCart);
        })


        // email api
        app.get('/carts/:email', async (req, res) => {

            const result = await OrderCollection.find({ email: req.params.email }).toArray();
            // console.log({email:req.params.email});
            res.send(result);
        })





        // Post API / add service to server
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })

        // get API 
        //GET all services or api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        //Get sigle Service by id

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting speic service', id);
            const query = { _id: ObjectId(id) };

            // const options = {
            //     // projection: { _id: 0 },
            //     projection: { _id: 0 },
            // };

            const service = await servicesCollection.findOne(query);
            res.send(service);
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