import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDb from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

await connectDb();
//Cloudinary connect
await connectCloudinary();
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
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
