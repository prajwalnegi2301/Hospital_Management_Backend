import MessageModel from "../models/message.model.js"
import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js"

const sendMessage = catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,message} =req.body;
    if(!firstName || !lastName || !email || !phone || !message){

        // Use when Error Handler was not made
        // return res.status(400).json({
        //     success: false,
        //     message: "Please fill the form",
        // });  
        
        return next(new ErrorHandler("Please fill Full Form",400));
    }
    const newMessage = new MessageModel({firstName,lastName,email,phone,message});
    await newMessage.save();
    res.status(200).json({
        success:true,
        message:" Message send successfully",
        newMessage
    });
});

export const getAllMessages = catchAsyncErrors(async(req,res,next)=>{
    const messages = await MessageModel.find();
    res.status(200).json({
        success:true,
        messages
    })
})

export default sendMessage;
