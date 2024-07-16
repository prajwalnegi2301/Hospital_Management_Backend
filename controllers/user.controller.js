import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";

//PATIENT REGISTER
export const patientRegister = async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, gender, role, password } =
    req.body;
  if (!firstName || !email || !phone || !dob || !gender || !role || !password) {
    return next(new ErrorHandler("Empty Fields",400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exist",400));
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (lastName === "") {
    userExist.lastName = "null";
  }

  const newUser = new User({
    firstName,
    lastName,
    password: hashedPassword,
    email,
    phone,
    dob,
    gender,
    role,
  });
  const token = jwt.sign({
    id: newUser._id,
  },process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES
  });
  newUser.token = token;
  await newUser.save();
  res
  .status(200)
  .cookie("token",token,{
    expiresIn:new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
    httpOnly:true
  })
  .json({message:"new user created",success:true})
};



// PATIENT LOGIN
export const patientLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Empty Fields",400));
  }

  const userExist = await User.findOne({ email });
  if (!userExist) {
     return next(new ErrorHandler("User not found",404));
  }

  const passwordCompare = bcrypt.compareSync(password, userExist.password);
  if (!passwordCompare) {
    return next(new ErrorHandler("Incorrect password",401));
  }

  if (role !== userExist.role) {
    return next(new ErrorHandler("User with this role not found", 400));
  }

  const token = jwt.sign({
    id: userExist._id,
  },process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES
  });

  userExist.token = token;
  res
  .status(200)
  .cookie("token",token,{
    expiresIn:new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
    httpOnly:true
  })
  .json({message:"User loggedIn",success:true})

});

// ADMIN Register->
export const adminRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, dob, password, gender, role } =
    req.body;

  if (!firstName || !email || !phone || !dob || !gender || !role || !password) {
     return next(new ErrorHandler("Empty Fields",400));
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
     return next(new ErrorHandler("Admin already exists", 400));
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (lastName === "") {
    userAdmin.lastName = "null";
  }

  const newAdmin = new User({
    firstName,
    lastName,
    password: hashedPassword,
    email,
    phone,
    dob,
    gender,
    role,
  });
  const token = jwt.sign({
    id: newAdmin._id,
  },process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES
  });
  newAdmin.token = token;
  await newAdmin.save();
  res
  .status(200)
  .cookie("token",token,{
    expiresIn:new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
    httpOnly:true
  })
  .json({message:"new admin created",success:true})
});


// ADMIN Login->
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
   return next(new ErrorHandler("Empty Fields", 400));
  }

  const adminExist = await User.findOne({ email });
  if (!adminExist) {
    return next(new ErrorHandler("Admin not found", 404));
  }

  const passwordCompare = bcrypt.compareSync(password, adminExist.password);
  if (!passwordCompare) {
    return next(new ErrorHandler("Incorrect password", 400));
  }

  if (role !== adminExist.role) {
    return next(new ErrorHandler("Admin with this role not found", 400));
  }

  const token = jwt.sign(
    {
      id: adminExist._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  adminExist.token = token;
   res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({ message: "Admin Logged in Successfully", success: true });

});

// GET ALL DOCTORS->
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

// GET USER DETAILS->
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const userId = user._id;
  const findUser = await User.findById(userId);
  res.status(200).json({
    success: true,
    findUser,
  });
});

// GET Admin ->
export const getAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const findUser = await User.find({role:"Admin"});
  res.status(200).json({
    success: true,
    findUser,
  });
});


// Logout Admin->
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token","",{
    expiresIn:new Date(
      Date.now()
    ),
    httpOnly:true
  })
  .status(200)
  .json({message:"logout"})
});


// Logout Patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token","",{
    expiresIn:new Date(
      Date.now()
    ),
    httpOnly:true
  })
  .status(200)
  .json({message:"logout"})
});


// Add new Doctor
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported", 400));
  }
  const {
    firstName,
    lastName,
    phone,
    dob,
    gender,
    email,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !phone ||
    !dob ||
    !gender ||
    !email ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Provide All Credentials", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} already registered with this email`,
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const doctor = new User({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  await doctor.save();

  res.status(200).json({
    success: true,
    message: "New Doctor Registered!",
    doctor,
  });
});
