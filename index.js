const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 3050

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://habitTrackerDB:MNqcaZm0zzQxvqlq@cluster0.fz86p7x.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('habitDB');
    const habitsCollection = db.collection('habits');
    

    // habits related API's
    app.get('/habits', async(req, res)=>
    {  
        const result = await habitsCollection.find().toArray();
        console.log(result);
        res.send(result);
    })

    app.post('/habits' , async (req, res)=>
    {   
        const data = req.body;
        const result = habitsCollection.insertOne(data)
        res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})