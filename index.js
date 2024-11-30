const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kgmqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("coffeemaster");

    const addcoffee = database.collection("addcoffee");
    const addUser = database.collection("addUser");

    //receive post request from client
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await addcoffee.insertOne(newCoffee);
      res.send(result);
      console.log(newCoffee);
    });

    //get request from client
    app.get("/coffees", async (req, res) => {
      const result = await addcoffee.find().toArray();
      res.send(result);
    });

    //get a single data of coffee
    app.get("/updatecoffee/:_id", async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) };
      const result = await addcoffee.findOne(query);
      res.send(result);
    });

    //update information request from client
    app.put("/updatecoffees/:_id", async (req, res) => {
      const _id = req.params._id;
      const filter = { _id: new ObjectId(_id) };
      const options = { upsert: true };
      // const info = req.body;
      const updatedDoc = {
        $set: req.body,
      };
      const result = await addcoffee.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    //delete request of coffee from client
    app.delete("/coffees/:_id", async (req, res) => {
      const _id = req.params._id;
      const query = { _id: new ObjectId(_id) };
      const result = await addcoffee.deleteOne(query);
      res.send(result);
      console.log("deleted successful");
    });

    //added user to db
    app.post("/users", async (req, res) => {
      const userInfo = req.body;
      const result = await addUser.insertOne(userInfo);
      res.send(result);
    });

    //get user info
    app.get("/users", async (req, res) => {
      const result = await addUser.find().toArray();
      res.send(result);
    });

    // get single information of user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addUser.findOne(query);
      res.send(result);
    });

    //update user information
    app.put("/updateUsers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: req.body,
      };
      const result = await addUser.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // delete user info
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addUser.deleteOne(query);
      res.send(result);
      console.log("delete ok");
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
  res.send("hello guys");
});

app.listen(PORT, () => {
  console.log(`coffee server is running on http://localhost:${PORT}`);
});
