"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = require("./routes/auth");
const products_1 = require("./routes/products");
const categories_1 = require("./routes/categories");
const cart_1 = require("./routes/cart");
const orders_1 = require("./routes/orders");
const users_1 = require("./routes/users");
const upload_1 = require("./routes/upload");
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// Cấu hình CORS chi tiết
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", auth_1.router);
app.use("/api/products", products_1.router);
app.use("/api/categories", categories_1.router);
app.use("/api/cart", cart_1.router);
app.use("/api/orders", orders_1.router);
app.use("/api/users", users_1.router);
app.use("/api/upload", upload_1.router);
app.use("/api/wishlist", wishlist_1.default);
// Serve static files from uploads directory
app.use("/uploads", express_1.default.static("uploads"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
});
