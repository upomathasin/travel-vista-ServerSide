require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running !!!!!");
});
app.listen(port, () => {
  console.log("listening on port ", port);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.SECRET_MONGOURI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    app.post("/placeOrder/:email", async (req, res) => {
      const collection = client.db("bookings").collection(req.params?.email);

      const result = await collection.insertOne(req.body);
      res.send(result);
    });
    app.get("/orders/:email", async (req, res) => {
      const email = req.params?.email;

      const collection = client.db("bookings").collection(email);
      const result = await collection.find().toArray();
      res.send(result);

      //  console.log(result);
    });

    app.get("/offers", async (req, res) => {
      const collection = client.db("offers").collection("collection");
      const result = await collection.find().toArray();
      res.send(result);
      //console.log(result);
    });

    app.get("/placeOrder/:id", async (req, res) => {
      const id = req.params.id;
      const collection = client.db("offers").collection("collection");
      const data = await collection.findOne({ _id: new ObjectId(id) });
      //console.log(data);
      res.send(data);
    });

    app.delete("/orders/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;

      const collection = client.db("bookings").collection(email);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
