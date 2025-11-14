import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { router as authRouter } from "./routes/auth";
import { router as productRouter } from "./routes/products";
import { router as categoryRouter } from "./routes/categories";
import { router as cartRouter } from "./routes/cart";
import { router as orderRouter } from "./routes/orders";
import { router as userRouter } from "./routes/users";
import { router as uploadRouter } from "./routes/upload";
import wishlistRouter from "./routes/wishlist";

const app = express();

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// Cấu hình CORS chi tiết
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/wishlist", wishlistRouter);

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
});
