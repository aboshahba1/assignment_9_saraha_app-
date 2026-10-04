import jwt from "jsonwebtoken"
import userModel from "../../DB/models/user.models.js"

export const authentication =async (req , res, next)=>{

    const { authorization } = req.headers

    if(!authorization){
        return res.status(404).json({message:"token not  exist"})
    }
    const decoded = jwt.verfiy(authorization, "ahmed@3331")

    if(!decoded ?.id ){
        return res.status(400).json({message:"Invaled token"})
    }

    const user = await userModel.findById(decoded.id)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    
    req.user= user
    next()
}