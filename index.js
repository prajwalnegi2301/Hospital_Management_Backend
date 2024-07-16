import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import dbConnect from "./database/dbConnection.js";
import messageRouter from "./routes/message.routes.js";
import cloudinary from 'cloudinary';
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from './routes/user.routes.js';
import appointmentRouter from "./routes/appointment.routes.js"

const app = express();

dotenv.config();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use('/api/v1/message',messageRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/appointment', appointmentRouter);

dbConnect();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(errorMiddleware);

const PORT = 4000 || process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server listening on port ${process.env.PORT}`);
});



export default app;
