import  catchAsyncError  from '../middlewares/catchAsyncError.js';
import ErrorHandler from "../middlewares/errorMiddleware.js";
import  Appointment  from "../models/appointment.models.js";
import  User  from "../models/user.models.js";

export const postAppointment = catchAsyncError(async (req, res, next) => {
    const { 
        firstName,
        lastName,
        phone,
        dob,
        gender,
        email,
        appointmentDate,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address } = req.body;

    if (!firstName ||
        !lastName ||
        !phone ||
        !dob ||
        !gender ||
        !email ||
        !appointmentDate ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address) {
            return next(new ErrorHandler("Please Fill All the Credentials",400));
    }
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });
    if(isConflict.length===0){
        return next(new ErrorHandler("Doctor not found",404));
    }
    if(isConflict.length>1){
        return next(new ErrorHandler("Doctors Conflict! Please contact thround email or phone",404));
    }
    // const doctorId = isConflict[0]._id;
    // const patientId = req.user._id;

    const newAppointment = new Appointment({
        firstName,
        lastName,
        gender,
        email,
        phone,
        dob,
        appointmentDate,
        department,
        doctor:{
            firstName : doctor_firstName,
            lastName: doctor_lastName
        },
        hasVisited,
        address
        // doctorId,
        // patientId,
    });
    await newAppointment.save();

    res.status(200).json({
        success:true,
        message:"Appointment Sent Successfully",
        newAppointment
    });

});


// get all Appointments
export const getAllAppointments = catchAsyncError(async(req,res,next)=>{
    const appointments = await Appointment.find();
    if(!appointments){
        return next(new ErrorHandler("no appointments found",404));
    }


    res.status(200).json({
        success:true,
        appointments
    })
})


// updating Appointment Details
export const updateAppointmentStatus = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const appointmentPresent = await Appointment.findById(id);
    if(!appointmentPresent){
        return next(new ErrorHandler("no appointments found",400));
    }
    const appointment = await Appointment.findByIdAndUpdate(id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
        message:"Appointment Status Updated",
        appointment,
    })
})


// delete Appointment Details
export const deleteAppointment =catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message: 'Appointed deleted'
    })
})