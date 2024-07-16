import express from 'express';
import { addNewDoctor, getAdmin, getAllDoctors, getUserDetails, logoutAdmin, logoutPatient, patientLogin } from '../controllers/user.controller.js';
import { patientRegister } from '../controllers/user.controller.js';
import { adminRegister } from '../controllers/user.controller.js';
import { adminLogin } from '../controllers/user.controller.js';
import {  isAdminAuthenticated, isPatientAuthenticated } from '../middlewares/auth.js';



const router = express.Router();

// Patient Register
router.post('/patient/register', patientRegister);

// Patient Login
router.post('/patient/login',patientLogin);

// Patient Logout->
router.get('/patient/logout',isPatientAuthenticated,logoutPatient);

// Get details of User
router.get('/patient/me' , getUserDetails);



// Get Info of All Doctors
router.get('/doctors',getAllDoctors);

// add new Doctor
router.post("/doctor/addnew", isAdminAuthenticated,addNewDoctor);





// Get Admin
router.get('/admin/me' , getAdmin);


// Admin Register
router.post('/admin/register',adminRegister);

//Admin Login
router.post('/admin/login', adminLogin);

// Admin Logout->
router.get('/admin/logout',isAdminAuthenticated,logoutAdmin);





export default router;