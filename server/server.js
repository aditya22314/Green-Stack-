import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDb from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";

const app = express();

await connectDb();
const port = process.env.port || 4000;
//Middleware boi its like from frontend if we send some form data or body its header is in the form of ContentType: application/json so the backend need to parse it and know that its in the form of application/json
const allowedOrigins = ["http://localhost:5173"];
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.get("/", (req, res) => {
  res.send("Api is working ");
});
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
