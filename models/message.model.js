import mongoose from 'mongoose';
import validator from 'validator';

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        minLength:[3,"First Name Must Contain At Least 3 Characters"],
    },
    lastName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Please provide a valid email"],
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"Phone Number must be atleast 10 Digits"],
    },
    message:{
        type:String,
        require:true,
        minLength:[10, "Message must contain at least 10 characters"],
    },
},{
    timestamps: true,
});

const MessageModel = mongoose.model("Message",messageSchema);

export default MessageModel;

