import mongoose from 'mongoose';
import validator from 'validator';

const appointmentSchema = new mongoose.Schema({
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
        type:Date,
        required:[true, "DOB is required"],
    },
    gender:{
        type:String,
        required: true,
        enum:["Male", "Female", "Other"],
    },
    role:{
        type:String,
        enum:["Patient", "Admin", "Doctor"],
    },
    appointmentDate:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    doctor:{
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
        }
    },
    hasVisited:{
        type:Boolean,
        required:false,
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },

},{
    timestamps: true
})

const appointment  = mongoose.model("Appointment", appointmentSchema);
export default appointment;