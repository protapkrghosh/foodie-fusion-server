const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrk8jch.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      // Get the database and collection on which to run the operation
      const menuCollection = client.db("foodieDB").collection("menu");
      const reviewsCollection = client.db("foodieDB").collection("reviews");
      const cartCollection = client.db("foodieDB").collection("carts");

      // Menu
      app.get("/menu", async (req, res) => {
         const result = await menuCollection.find().toArray();
         res.send(result);
      });

      // Reviews
      app.get("/reviews", async (req, res) => {
         const result = await reviewsCollection.find().toArray();
         res.send(result);
      });

      // Cart
      app.post("/carts", async (req, res) => {
         const item = req.body;
         console.log(item, req);
         const result = await cartCollection.insertOne(item);
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("Foodie Fusion is running");
});

app.listen(port, () => {
   console.log(`Foodie Fusion is running on port ${port}`);
});
