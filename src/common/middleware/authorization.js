import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.models.js"
export const authorization =(roles = [])=>{
    return async (req , res, next)=>{
    
        if(!roles.includes(req.user.role)){
             return res.status(401).json({message:"UnAuthorized"})
        }
    
    next()
}}