const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

const uri = process.env.URL
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
  try{
      await client.connect();
      const InventoryCollection = client.db('reven').collection('inventory');

      app.get('/', async(req, res) =>{
         
         
          const size = 6

          const query = {};
          const cursor = InventoryCollection.find(query);
          const inventory = await cursor.limit(size).toArray();
          
          
          res.send(inventory);
      });

     

      

  }
  finally{}
}
run().catch(console.dir);


app.listen(port, () =>{
  console.log('John is running on  port', port);
})