import { NextFunction, Request,Response } from "express";
import User from "../models/User.js";
import {hash , compare} from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (req:Request , res: Response, next: NextFunction) => {
    //Get all users from the database
    try {
        const users = await User.find();

        return res.status(200).json({message:"OK",users});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR",cause:error.message});

    }
};

export const userSignup = async (req:Request , res: Response, next: NextFunction) => {
    //Get all users signup from the database
    try {
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(401).send("User is already registered");
        const hashedPassword = await hash(password,10);
        const user = new User({name,email,password:hashedPassword});
        await user.save();

        //Create token and store cookie
        
        res.clearCookie(COOKIE_NAME,{
            httpOnly: true, domain: "localhost", signed:true, path: "/",
        });

        const token = createToken(user._id.toString(),user.email,"7d")
        const expires = new Date();
        expires.setDate(expires.getDate()+ 7)
        res.cookie(COOKIE_NAME, token, {path:"/", domain:"localhost", expires, httpOnly:true, signed:true});
        return res.status(201).json({message:"OK", name:user.name, email:user.email});
        } catch (error) {
            console.log(error);
            return res.status(200).json({message:"ERROR",cause:error.message});
        }
};  

export const userLogin = async (req:Request , res: Response, next: NextFunction) => {
    //Get all users login from the database
    try {
        const {email,password} = req.body;
        //const hashedPassword = await hash(password,10);
        //const user = new User({name,email,password:hashedPassword});
        //await user.save();
        const user = await User.findOne({email})
        //return res.status(201).json({message:"OK",id: user._id.toString()});
        if(!user){
            return res.status(401).send("User is not registered")
        }
    //Authenticate
    const isPasswordCorrect = await compare(password,user.password);        
    if(!isPasswordCorrect){
        return res.status(403).send("Incorrect Password");
    }

    res.clearCookie(COOKIE_NAME,{
        httpOnly: true, domain: "localhost", signed:true, path: "/",
    });

    const token = createToken(user._id.toString(),user.email,"7d")
    const expires = new Date();
    expires.setDate(expires.getDate()+ 7)
    res.cookie(COOKIE_NAME, token, {path:"/", domain:"localhost", expires, httpOnly:true, signed:true});
    return res.status(200).json({message:"OK", name:user.name, email:user.email});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR",cause:error.message});

    }
};
export const verifyUser = async (req:Request , res: Response, next: NextFunction) => {
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

    return res.status(200).json({message:"OK", name:user.name, email:user.email});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR",cause:error.message});

    }
};

export const userLogout = async (req:Request , res: Response, next: NextFunction) => {
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
       res.clearCookie(COOKIE_NAME,{
        httpOnly: true, domain: "localhost", signed:true, path: "/",
    });
    //Authenticate
    //const isPasswordCorrect = await compare(password,user.password);        
    //if(!isPasswordCorrect){
    //   return res.status(403).send("Incorrect Password");
    //}

    return res.status(200).json({message:"OK", name:user.name, email:user.email});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"ERROR",cause:error.message});

    }
};