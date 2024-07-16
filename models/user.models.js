import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"Enter Name"],
        minLength:[3,"Name must contain atleast 3 letters"],
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        validate:[validator.isEmail, "Please Enter valid email"],
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        minLength:[10,"Please Enter 10 digit phone Number"],
    },
    dob:{
        type:String,
        required:[true, "DOB is required"],
    },
    gender:{
        type:String,
        required: true,
        enum:["Male", "Female", "Other"],
    },
    role:{
        type:String,
        required:true,
        enum:["Patient", "Admin", "Doctor"],
    },
    password:{
        type:String,
        required:[true, "Enter Password"],
        // select:false,
        minLength:[8,"Password must contain atleast 8 characters"],
    },
    token:{
        type:String,
    },
    doctorDepartment:{
        type:String,
    },
    docAvatar:{
        public_id:String,
        url:String,
    },
},{
    timestamps: true
})

const user  = mongoose.model("User", userSchema);
export default user;