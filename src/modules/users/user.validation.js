
import joi from "joi"

 export const signUpSchema ={
    body:  joi.object({
        fName : joi.string().alphanum().min(2).max(10).required().messages({
            "any.required": "where is fName",
            "string.min":"name is too short"
        }),
        lName : joi.string().required(),
        email : joi.string().email({minDomainSegments: 2, maxDomainSegments: 2}).required(),
        password : joi.string().required(),
        cPassword : joi.string().valid(joi.ref("password")).required(),
        age: joi.number().required(),
        gender: joi.string().valid("male", "female").required(),
        phone : joi.string().required(),
    }).required(),

    // query: joi.object({
    //     flag : joi.boolean().required(),
    // }).required()
 }

  export const signinSchema ={
    body:  joi.object({
        email : joi.string().email({minDomainSegments: 2, maxDomainSegments: 2}).required(),
        password : joi.string().required(),
    })

 }