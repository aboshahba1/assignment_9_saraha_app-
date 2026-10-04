import mongoose from "mongoose";
import { GendarEnum, ProviderEnum, RoleEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema({
    fName: { 
        type: String,
        required:true,
        minLength:2,
        maxLength:15,
        trim :true
     },
    lName: { 
        type: String,
        required:true, 
        minLength:2,
        maxLength:15,
        trim :true
     },
    email: { 
        type: String,
        required: [true, "Email is required"],
        unique: true, 
        trim: true,
        lowerCase:true
     },
    password: {
        type: String, 
        required: function(){
            return this.provider == ProviderEnum.system
        },
        trim:true,
        minLength:5
     },
    age: {
        type: Number, 
        required: function(){
            return this.provider == ProviderEnum.system
        },
        min: 20, max: 70 },
    gender: { 
        type: String, 
        enum: Object.values(GendarEnum), 
        default: GendarEnum.male
     },
    provider:{
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system
     },
    role:{
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user
     },
    profileImage: String,
    phone: String,
    isConfirmed:{
        type:Boolean,
        default:false
    }
}, {
    timestamps:true,
    strictQuery:true,
    strict:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;