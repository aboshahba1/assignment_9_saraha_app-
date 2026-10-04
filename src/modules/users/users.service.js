import userModel from "../../DB/models/user.models.js";
import * as dbService from "../../DB/db.service.js"
import { encrypt, decrypt } from "../../common/security/encrypt.js";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";
import { json } from "express";
import { ProviderEnum } from "../../common/enum/user.enum.js";
import joi from "joi"

const client = new OAuth2Client();

export const signUp = async (req, res) => {
    try {


        const {fName, lName, email, password ,age,gender, phone} =(req.body)
        if(await dbService.findOne({
            model:userModel,
            filter:{email :email.toLowerCase()}
         })){
            return res.status(409).json({message : "email already exist"})
        }
        const encryptedPhone = encrypt(phone);
        const hashedPassword = await bcrypt.hash(password, 10);

        const paths = []
        for (const file of req.files.attachments) {
            paths.push(file.path)
        }

        const user = await dbService.create({
            model: userModel,
            data:{ fName,
                 lName,email,
                 password:hashedPassword,
                 age,
                 gender,
                 phone: encryptedPhone,
                 profileImage: req.files.attachment[0].path,
                 coverImages: paths

                }
        })
        return res.status(201).json({message:'user created', user})
    } catch (error) {
        if(error?.code==11000)
            return   res.status(500).json({message:"email is already exsite"})
        res.status(500).json({message:'fail to signup', error})
    }
}

export const signUpWithGmail = async (req, res) => {
    try {
        const {idToken} = req.body
      
        const decoded = await client.verifyIdToken({
            idToken,
            audience:" 455258291290-lp24bajrh81610al94qhbu5dol2o1s2i.apps.googleusercontent.com" // client id mafrod agebo mn front  3aly 7sb project 
        })
       const {family_name, given_name, picture,email_verfied , email} = decoded.getPayload();
        
        let user =await userModel.findOne({email:email.toLowerCase()})

        if(!user){
        await userModel.create({
            fName:given_name,
            lName: family_name,
            email,
            profileImage: picture,
            isConfirmed : email_verfied,
            provider: ProviderEnum.google
        })
        }

        if(user.provider == ProviderEnum.system){
            return res.status(400),json({message:"login with system only "})
        }
         const access_token = jwt.sign({id: user._id, email: user.email },"ahmed1234",{
            expiresIn: 60*5,
        })

        const refresh_token = jwt.sign({id: user._id, email: user.email},"ahmed112")


    } catch (error) {
        res.status(500).json({message:error.message, stack: error.stack})
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } =(req.body)

        const user = await dbService.findOne({
            model:userModel,
            filter:{ email :email.toLowerCase(),
                // isConfirmed: true,
                provider:ProviderEnum.system
         }
        })
        if(!user){
            return res.status(404).json({message : "email not exist or you can login on your signup "})
        }
        // //  if(user.isConfirmed !== true){
        //     return res.status(400).json({message : "email not confirmed"})
        //  }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(409).json({
                message: "inValid password"
            });
        }
        
        const access_token = jwt.sign({id: user._id, email: user.email },"ahmed1234",{
            expiresIn: 60,
            audience:"http://localhost:4000",
            issuer:"http://localhost:3000",
            notBefore: 30,
            noTimestamp: true
        })

        const refresh_token = jwt.sign({id: user._id, email: user.email},"ahmed112@3331")

        return res.status(201).json({message:'done', tokens:{ access_token, refresh_token}})
    } catch (error) { 
        res.status(500).json({message:'fail to signin', error})
    }
}


export const getProfile = async (req, res) => {
   
        res.status(500).json({message:"done", user: req.user})
}