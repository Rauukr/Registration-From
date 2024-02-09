import  Express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import urlencoded from "body-parser";
import path from "path"
const __dirname = path.resolve();

const app=Express();
dotenv.config();

const Port = process.env.Port || 3000;
const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster6.eqxhuls.mongodb.net/registrationFomrDb?retryWrites=true&w=majority`);

const registerSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const Regitser=mongoose.model("Regitser" , registerSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get("/" , (req ,res)=>{
    res.sendFile(__dirname  +"/pages/index.html")
})
app.post("/register" , async (req, res)=>{
    try {
        const {email , name , password}=req.body;
        const exitingUser=await Regitser.findOne({email:email});
        if(!exitingUser){
            const registrationData=new Regitser({
                name,
                email,
                password
            });
             await registrationData.save();
             res.redirect("/success");
        }else{
            console.log("user already exit");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success" , (req ,res)=>{
    res.sendFile(__dirname + "/pages/success.html")
})
app.get("/error" , (req ,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
})

app.listen(Port ,()=>{
    console.log(`server is running on port ${Port}`);
})