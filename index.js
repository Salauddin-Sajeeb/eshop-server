require("dotenv").config();
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
const port =process.env.PORT||5000;
const cors=require('cors')


const jwt = require('jsonwebtoken');
app.use(cors())
app.use(express.json())

//Autehntication JWT
function accessToken(user)
{
  const token=jwt.sign({
  email:user.email
  }, 'secret', { expiresIn: '1h' });
  return token;
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, "secret");
  if (!verify?.email) {
    return res.send("You are not authorized");
  }
  req.user = verify.email;
  next();
}

//password:Wk0T1H95gBKRF2Ue
const uri =process.env.DATABASE_URL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
  async function run() { 
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const productdb = client.db("productdb");
      const userdb=client.db('userdb')
      const cameracollection = productdb.collection("shoescollection");
     const userCollection=userdb.collection('usercollection');
      //proucts 

      app.post("/cameras",verifyToken,async(req,res)=>
      {
       const showdata=req.body;
       const result=await cameracollection.insertOne(showdata);
        res.send(result)
      });

      app.get("/cameras", async (req, res) => {
        const cameraData = cameracollection.find();
        const result = await cameraData.toArray();
        res.send(result);
      });
      app.get("/cameras/:id", async (req, res) => {
        const id = req.params.id;
        const cameraData = await cameracollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(cameraData);
      });
    app.patch("/cameras/:id",verifyToken,  async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await cameracollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });
    app.delete("/cameras/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await cameracollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

      //users
      app.get("/user", async (req, res) => {
        const user = userCollection.find();
        const result = await user.toArray();
        res.send(result);
      });
      app.post('/user', async(req,res)=>
      {
        const userinfo=req.body;
        const token=accessToken(userinfo);
       const isExist= await userCollection.findOne({email:userinfo?.email}); //checking if the user is existed
       
       if(isExist)
        {
          return res.send({
            status:'success',
            message:'login success',
            token
          })
        }
       await userCollection.insertOne(userinfo);
       res.send({token})
      })
      app.get("/user/get/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const result = await userCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      });
  
      app.get("/user/:email", async (req, res) => {
        const email = req.params.email;
        const result = await userCollection.findOne({ email });
        res.send(result);
      }); 
  
      app.patch("/user/:email", async (req, res) => {
        const email = req.params.email;
        const userData = req.body;
        const result = await userCollection.updateOne(
          { email },
          { $set: userData },
          { upsert: true }
        );
        res.send(result);
      });
      
      console.log(" successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
   
    }
  }
 
 
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(` app listening on port ${port}`)
})
run().catch(console.dir);