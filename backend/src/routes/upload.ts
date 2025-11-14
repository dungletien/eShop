import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const uploadDir = path.join(process.cwd(), "uploads", "products");
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
        // Tạo tên file unique với timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    },
});

// Filter để chỉ cho phép upload hình ảnh
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được upload file hình ảnh!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// Route upload một file
router.post(
    "/single",
    requireAdmin,
    upload.single("image"),
    (req: any, res: Response) => {
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
        } catch (error) {
            res.status(500).json({ message: "Lỗi upload file" });
        }
    }
);

// Route upload nhiều file
router.post(
    "/multiple",
    requireAdmin,
    upload.array("images", 5),
    (req: any, res: Response) => {
        try {
            if (
                !req.files ||
                !Array.isArray(req.files) ||
                req.files.length === 0
            ) {
                return res
                    .status(400)
                    .json({ message: "Không có file được upload" });
            }

            const imageUrls = req.files.map(
                (file: any) => `/uploads/products/${file.filename}`
            );
            res.json({
                message: "Upload thành công",
                imageUrls,
                filenames: req.files.map((file: any) => file.filename),
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi upload file" });
        }
    }
);

// Route xóa file
router.delete("/:filename", requireAdmin, (req: Request, res: Response) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(
            process.cwd(),
            "uploads",
            "products",
            filename
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: "Xóa file thành công" });
        } else {
            res.status(404).json({ message: "File không tồn tại" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi xóa file" });
    }
});

export { router };
