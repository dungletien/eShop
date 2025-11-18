"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.router = router;
// Cấu hình multer để lưu file
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), "uploads", "products");
        // Tạo thư mục nếu chưa tồn tại
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique với timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    },
});
// Filter để chỉ cho phép upload hình ảnh
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Chỉ được upload file hình ảnh!"), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
// Route upload một file
router.post("/single", auth_1.requireAdmin, upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Không có file được upload" });
        }
        const imageUrl = `/uploads/products/${req.file.filename}`;
        res.json({
            message: "Upload thành công",
            imageUrl,
            filename: req.file.filename,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi upload file" });
    }
});
// Route upload nhiều file
router.post("/multiple", auth_1.requireAdmin, upload.array("images", 5), (req, res) => {
    try {
        if (!req.files ||
            !Array.isArray(req.files) ||
            req.files.length === 0) {
            return res
                .status(400)
                .json({ message: "Không có file được upload" });
        }
        const imageUrls = req.files.map((file) => `/uploads/products/${file.filename}`);
        res.json({
            message: "Upload thành công",
            imageUrls,
            filenames: req.files.map((file) => file.filename),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi upload file" });
    }
});
// Route xóa file
router.delete("/:filename", auth_1.requireAdmin, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path_1.default.join(process.cwd(), "uploads", "products", filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            res.json({ message: "Xóa file thành công" });
        }
        else {
            res.status(404).json({ message: "File không tồn tại" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi xóa file" });
    }
});
