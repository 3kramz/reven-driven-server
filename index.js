const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5050

app.use(express.json())
app.use(cors())



const uri = process.env.URL
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
  try{
      await client.connect();
      const InventoryCollection = client.db('reven').collection('inventory');

      app.get('/home', async(req, res) =>{
         const size = 6
          const query = {};
          const cursor = InventoryCollection.find(query);
          const inventory = await cursor.limit(size).toArray();
         res.send(inventory);
      });

      app.get('/inventory/:id', async(req, res) =>{
        const id = req.params.id
        const query = { "_id": ObjectId(id)};
         const inventory = await InventoryCollection.findOne(query);
        res.send(inventory);
     });

     

      
     app.get('/',(req,res)=>{
       res.send('Reven driven server is running....')
     })
  }
  finally{}
}
run().catch(console.dir);


app.listen(port, () =>{
  console.log('Reven driven server is running on  port', port);
})