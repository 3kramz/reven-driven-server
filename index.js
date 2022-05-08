const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json())
app.use(cors())



const uri = process.env.URL

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
  try{
      await client.connect();
      const InventoryCollection = client.db('reven').collection('inventory');
      // port for home component
      app.get('/home', async(req, res) =>{
         const size = 6
          const query = {};
          const cursor = InventoryCollection.find(query);
          const inventory = await cursor.limit(size).toArray();
         res.send(inventory);
      });

      // port for manage inventory
      app.get('/manageInv', async(req, res) =>{
         const query = {};
         const cursor = InventoryCollection.find(query);
         const inventory = await cursor.toArray();
        res.send(inventory);
     }); 

      app.get('/inventory/:id', async(req, res) =>{
        const id = req.params.id
        const query = { "_id": ObjectId(id)};
         const inventory = await InventoryCollection.findOne(query);
        res.send(inventory);
     });


       // update user
       app.put('/inventory/:id', async(req, res) =>{
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: ObjectId(id)};
       const option = { upsert: true };
        const newData = { 
          $set: {
            stock:data.stock,
            sold: data.sold
          }
        };
        const result = await InventoryCollection.updateOne(filter, newData, option);
        res.send(result);
    })
  // Post Inventory
      app.post('/addServices', async (req, res) => {
        const newInventory = req.body;
        const result = await InventoryCollection.insertOne(newInventory);
        res.send(result);
    });

    //  Delete inventory 
    app.delete('/manage/:id', async(req, res) =>{
      const id = req.params.id
      const query = { "_id": ObjectId(id)};
     const result = await InventoryCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        res.send(result);
      } else {
        res.send(failed);
      }    
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