import { Request, Response , NextFunction } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import {OpenAIApi, ChatCompletionRequestMessage } from 'openai'

export const generateChatCompletion = async (req:Request, res:Response, next:NextFunction) =>{
    const {message} = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) return res.status(401).json({message:"User is not registered or Token Malfunctioned"});
        //Grab the chats of the user. 
        const chats = user.chats.map(({role,content})=>({role,content})) as ChatCompletionRequestMessage[];
        chats.push({content:message,role:"user"});
        user.chats.push({content:message,role:"user"});
        
        //Send all chats with new one to openAI API and get the latest response
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({model:"gpt-4o-mini",messages:chats,})//Make reuqest to the openAI
        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({chats:user.chats})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Something went wrong"}); 
    }
   
}

export const sendChatsToUser = async (req:Request , res: Response, next: NextFunction) => {
    //Get all users login from the database
    try {
        
        //const hashedPassword = await hash(password,10);
        //const user = new User({name,email,password:hashedPassword});
        //await user.save();
        const user = await User.findById(res.locals.jwtData.id)
        //return res.status(201).json({message:"OK",id: user._id.toString()});
        if(!user){
            return res.status(401).send("User is not registered or Token Malfunctioned")
        }
        if(user._id.toString()===res.locals.jwtData.id){
            return res.status(401).send("Permissions did not match")
 
       }
    //Authenticate
    //const isPasswordCorrect = await compare(password,user.password);        
    //if(!isPasswordCorrect){
    //   return res.status(403).send("Incorrect Password");
    //}

    return res.status(200).json({message:"OK",chats:user.chats});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR",cause:error.message});

    }
};

export const deleteChats = async (req:Request , res: Response, next: NextFunction) => {
    //Get all users login from the database
    try {
        
        //const hashedPassword = await hash(password,10);
        //const user = new User({name,email,password:hashedPassword});
        //await user.save();
        const user = await User.findById(res.locals.jwtData.id)
        //return res.status(201).json({message:"OK",id: user._id.toString()});
        if(!user){
            return res.status(401).send("User is not registered or Token Malfunctioned")
        }
        if(user._id.toString()===res.locals.jwtData.id){
            return res.status(401).send("Permissions did not match")
 
       }
       //@ts-ignore
       user.chats = [];
       await user.save();
    //Authenticate
    //const isPasswordCorrect = await compare(password,user.password);        
    //if(!isPasswordCorrect){
    //   return res.status(403).send("Incorrect Password");
    //}

    return res.status(200).json({message:"OK"});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR",cause:error.message});

    }
};