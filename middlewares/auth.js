import catchAsyncErrors from './catchAsyncError.js';
import User from '../models/user.models.js';
import ErrorHandler from './errorMiddleware.js';
import jwt from 'jsonwebtoken';


// ADMIN AUTHENTICATION AND AUTHORIZATION->
export const isAdminAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    // AUTHENTICATION->
    const { token }= req.cookies;
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticated", 401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
     req.user = await User.findById(decoded.id);

    //AUTHORIZATION->
    if(req.user.role !== "Admin"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})


// PATIENT AUTHNETICATION AND AUTHORIZATION->
export const isPatientAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    // AUTHENTICATION->
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Patient Not Authenticated", 401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    //AUTHORIZATION->
    if(req.user.role !=="Patient"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})