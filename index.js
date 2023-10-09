const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { ObjectId } = require('mongodb');

const port = process.env.PORT || 1830;



// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkhsa2w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
    try {
//Database
        const database = client.db("JewelryDb");
// Reviewer Database
const reviewers = database.collection("Reviewers");

// Jewelries Database
const Jewelries=database.collection("Jewelries");

// Select Jewelry Database
const SelectedJewelry = database.collection("SelectJewelry");

// Add Jewelry Database
const AddJewelry = database.collection("AddJewelry");

// Users DataBase
const usersCollection = database.collection("users");








// Reviewers API
app.get('/reviewers', async (req, res) => {
    const result = await reviewers.find().toArray();
    res.send(result);
  })


  // Jewelries API
app.get('/jewelries', async (req, res) => {
  const result = await Jewelries.find().toArray();
  res.send(result);
})


// Select Jewelry Api
app.get('/selectJewelry',  async (req, res) => {
  const email = req.query.email;
  console.log(email)
  if (!email) {
    res.send([]);
  }
  
  const query = { email: email };
  const result = await SelectedJewelry.find(query).toArray();
  res.send(result);

})


// All User Api
    
app.get('/users',  async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

app.get('/addJewelry',  async (req, res) => {
  const result = await AddJewelry.find().toArray();
  res.send(result);
});


 // Owner Api
 app.get('/users/owner/:email',  async (req, res) => {
  const email = req.params.email;

  console.log(email)

  const query = { email: email }
  const user = await usersCollection.findOne(query);
  console.log(user)
  const result = { owner:user?.role === 'owner' }
  res.send(result);
})



// Delete Jewelry
app.delete('/selectJewelry/:id', async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  const query = { _id: new ObjectId(req.params.id) };

  const result = await SelectedJewelry.deleteOne(query);
  res.send(result);
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  const query = { _id: new ObjectId(req.params.id) };

  const result = await usersCollection.deleteOne(query);
  res.send(result);
});





//  Select Jewelry Collection
    app.post('/selectJewelry', async (req, res) => {
      const item = req.body;
      console.log(item)
      const result = await SelectedJewelry.insertOne(item);
      res.send(result);
    })



    // Add Jewelry Collection
    app.post('/addJewelry', async (req, res) => {
      const item = req.body;
      console.log(item)
      const result = await AddJewelry.insertOne(item);
      res.send(result);
    })


    // User Data
    
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });



    // // Add Jewelry Collection

   
    // app.post('/addAJewelry', async (req, res) => {
    //   const user = req.body;
    //   console.log(user)
    //   const result = await  AddAClass.insertOne(user);
    //   console.log(result)
    //   res.send(result);
    // });





  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SurTaal Music Server is running');
  })
  
  app.listen(port, () => {
    console.log(`SurTaal Music Server is running port:http://localhost:${port}`)
  })