const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb code

console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.033buvy.mongodb.net/?retryWrites=true&w=majority`;

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

    const blogCollection = client.db("Chapter").collection("Blogs");
    const addBlogCollection = client.db("Chapter").collection("addBlog");
    // Blog collection
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // addBlog collection
    app.post("/blog", async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);
      const result = await addBlogCollection.insertOne(newBlog);
      res.send(result);
    });

    app.get("/blog", async (req, res) => {
      const cursor = addBlogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // update blog collection
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addBlogCollection.findOne(query);
      res.send(result);
    });

    app.put("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateBlog = req.body;
      const blog = {
        $set: {
          title: updateBlog.name,
          category: updateBlog.category,
          date: updateBlog.date,
          short_description: updateBlog.short_description,
          long_description: updateBlog.long_description,
          photoUrl: updateBlog.photoUrl,
        },
      };
      const result = await addBlogCollection.updateOne(filter, blog, options);
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
  res.send("Chapter is running");
});

app.listen(port, (req, res) => {
  console.log(`CHAPTER is running on port ${port}`);
});
