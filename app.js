const express=require("express");
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const User = require('./models/userModel');
const path= require('path');
const bodyParser= require('body-parser');
const cors= require('cors')
const {notFound,errorHandler} =require('./middleware/errorMiddleware')


//routes
const userRoutes=require('./routes/userRoutes');
const taskRoutes=require('./routes/taskRoutes');


const app=express();
app.use(cors());
dotenv.config();

connectDB();  // This should be after dotenv.config();

app.use(express.json()); // to accept JSON Data
app.use(bodyParser.json({extended: true})); // to accept JSON Data

if(process.env.NODE_ENV=='production')
{
    const target=path.resolve(__dirname,'client','build','index.html');
    app.use(express.static(path.dirname(target)));

    app.get('/',(req,res)=>{
        res.sendFile(target);
    })
}



app.use('/api/user',userRoutes)
app.use('/api/task',taskRoutes)

//error handling for invalid routes
// app.use(notFound);
app.use(errorHandler);

//handle page not found in production
if(process.env.NODE_ENV=='production')
{
    app.use('*',(req,res)=>
            res.redirect('/')
        );
}


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server Started on PORT http://localhost:${PORT}`));