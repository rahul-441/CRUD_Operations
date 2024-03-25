import express from 'express';
import users from './model.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
const app = express();

dotenv.config();

// Conecting To MongoDB
const conectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DataBase :", conn.connection.host);
    }catch(e){
        console.log(e);
    }
}

conectDB();


app.use(bodyParser.json());

// Read All Users
app.get('/api/v1', async (req, res) =>{
    try{
        const usersAll = await users.find();

        res.json(usersAll);
        console.log(usersAll)
    }catch(e){
        res.status(500).json({ error: e.message });
    }
})

// Read Particular User
app.get('/api/v1/:id', async (req, res) =>{
    try{
        const {id} = req.params;

        const user = await users.findOne({_id:id});

        if(!user){
            res.send(404).send({ message: `User not found with id : ${id}`});
        }

        res.status(200).send({User_Found : id, user});
    }catch(e){
        res.status(500).json({ error: e.message });
    }
})

app.post('/api/v1/add', async(req, res) =>{
    try {
            const { name, passwd } = req.body;
            const newUser = new users({ name, passwd });

            await newUser.save();

            res.status(201).json({ message: 'User created successfully', data: newUser });
            console.log(newUser);
      } catch (error) {
            res.status(500).json({ error: error.message });
      }
})

app.put('/api/v1/update/:id', async (req, res) =>{

    try{
        const {id} = req.params;
        const {name, passwd} = req.body;

        const UpdatedUser = await users.findByIdAndUpdate(id, {name, passwd});

        res.status(200).send({message:"User updated Successfully !", UpdatedUser});
    }catch(e){
        res.status(500).json({ error: error.message });
    }
})

app.delete("/api/v1/delete/:id", async (req, res) =>{
    try{
        const {id} = req.params;
        
        const user = await users.findByIdAndDelete(id);

        res.status(200).send({message:"User Deleted Successfully !", user});

    }catch(e){
        res.status(500).json({ error: error.message });
    }

})

app.listen(3000, () =>{
    console.log("Server runing on PORT : 3000");
});



// HTTP Server :

// import http from "http";

// const hostname = "localhost";

// const server = http.createServer((req, res)=>{

//     res.statusCode = 200;

//     res.setHeader("Content-type","text/plain")

//     res.end("Hello Worrld !!!");
// })

// server.listen(3000, hostname, ()=>{
//     console.log("Server runing on PORT 3000");
// })