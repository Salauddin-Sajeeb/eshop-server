require("dotenv").config();
const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT;
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

function VerifyToken(req,res,next){
const token=req.headers.authorization.split("")[1]
const verify=jwt.verify(token,"secret");
if(!verify?.email){
  return res.send('you are not authorized')
}
req.user=verify.email;
  next()
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
      const shoescollection = productdb.collection("shoescollection");
     const userCollection=userdb.collection('usercollection')
      //proucts 

      app.post("/shoes",VerifyToken,async(req,res)=>
      {
       const showdata=req.body;
       const result=await shoescollection.insertOne(showdata) 
        res.send(result)
      });


      //users

      app.get("/user", async (req, res) => {
        const shoesData = userCollection.find();
        const result = await shoesData.toArray();
        res.send(result);
      });
      app.post('/user',async(req,res)=>
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