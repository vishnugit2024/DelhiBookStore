import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./Db/index.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  const morgan = await import("morgan");
  app.use(morgan.default("dev"));
}

app.use("/public/image", express.static("public/images"));
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001","https://wwseals.com","https://admin.wwseals.com","https://www.wwseals.com"];
app.use(
  cors({
    origin: function (origin, callback) {
   
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

connectDB();

import userRouter from "./routes/auth.route.js";
import bannerRoute from "./routes/banner.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import couponRoute from "./routes/coupon.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import contactFormRoute from "./routes/contactForm.route.js";
import mainCategoryRoute from "./routes/mainCategory.route.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/mainCategory", mainCategoryRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/contact-form", contactFormRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/developer", (req, res) => {
  res.send(
    `<h1>It is great to see you on server of <a href="https://www.linkedin.com/in/nitin-gupta-b7a9a02a1/">Nitin Gupta</a> </h1>`
  );
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
