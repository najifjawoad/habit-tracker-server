const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3050;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://habitTrackerDB:MNqcaZm0zzQxvqlq@cluster0.fz86p7x.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("habitDB");
    const habitsCollection = db.collection("habits");

    
    app.get("/habits", async (req, res) => {
      const { email } = req.query;
      const query = email ? { creatorEmail: email } : {};
      const result = await habitsCollection.find(query).toArray();
      res.send(result);
    });

 
    app.get("/habits/:id", async (req, res) => {
      const id = req.params.id;
      const habit = await habitsCollection.findOne({ _id: new ObjectId(id) });
      if (!habit) return res.status(404).send({ message: "Habit not found" });
      res.send(habit);
    });

   
    app.post("/habits", async (req, res) => {
      const data = req.body;
      const result = await habitsCollection.insertOne(data);
      res.send(result);
    });

   
    app.patch("/habits/:id", async (req, res) => {
      const id = req.params.id;
      const { action, date } = req.body;

      try {
        let update;
        if (action === "complete") {
          
          update = { $addToSet: { completionHistory: date } }; // 
        } else if (action === "undo") {
         
          update = { $pull: { completionHistory: date } };
        } else {
         
          update = { $set: req.body };
        }

        const result = await habitsCollection.updateOne(
          { _id: new ObjectId(id) },
          update
        );

        if (result.matchedCount === 0)
          return res.status(404).send({ message: "Habit not found" });

        res.send({ message: "Habit updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

   
    app.delete("/habits/:id", async (req, res) => {
      const id = req.params.id;
      const result = await habitsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0)
        return res.status(404).send({ message: "Habit not found" });

      res.send({ message: "Habit deleted successfully" });
    });

    console.log("✅ Server connected to MongoDB!");
  } finally {
  
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
