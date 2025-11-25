import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middleware/auth";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = Router();

// Configure Cloudinary from env (support CLOUDINARY_URL or individual vars)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Filter to allow only images
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được upload file hình ảnh!"), false);
    }
};

// Use memory storage so we can stream buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// Helper to upload buffer to Cloudinary using upload_stream
const streamUpload = (buffer: Buffer, publicId?: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const options: any = { resource_type: "image" };
        if (publicId) options.public_id = publicId;
        // Keep files under optional folder if publicId contains folder prefix
        cloudinary.uploader
            .upload_stream(options, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
            .end(buffer);
    });
};

// Route upload one file -> streams to Cloudinary
router.post(
    "/single",
    requireAdmin,
    upload.single("image"),
    async (req: any, res: Response) => {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Không có file được upload" });
            }

            // Generate a stable public_id similar to previous local filename convention
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(req.file.originalname) || ".jpg";
            const publicId = `products/product-${uniqueSuffix}`; // stored as public_id in Cloudinary

            const result = await streamUpload(req.file.buffer, publicId);

            // Return secure_url and public_id for client to store
            res.json({
                message: "Upload thành công",
                imageUrl: result.secure_url,
                publicId: result.public_id,
                raw: result,
            });
        } catch (error: any) {
            console.error("Upload single error:", error);
            res.status(500).json({
                message: "Lỗi upload file",
                detail: error.message || error,
            });
        }
    }
);

// Route upload multiple files -> stream each to Cloudinary
router.post(
    "/multiple",
    requireAdmin,
    upload.array("images", 5),
    async (req: any, res: Response) => {
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

            const uploadPromises = req.files.map(
                async (file: any, idx: number) => {
                    const uniqueSuffix =
                        Date.now() +
                        "-" +
                        Math.round(Math.random() * 1e9) +
                        `-${idx}`;
                    const publicId = `products/product-${uniqueSuffix}`;
                    const result = await streamUpload(file.buffer, publicId);
                    return {
                        imageUrl: result.secure_url,
                        publicId: result.public_id,
                        raw: result,
                    };
                }
            );

            const results = await Promise.all(uploadPromises);

            res.json({
                message: "Upload thành công",
                images: results.map((r) => ({
                    imageUrl: r.imageUrl,
                    publicId: r.publicId,
                })),
                raw: results,
            });
        } catch (error: any) {
            console.error("Upload multiple error:", error);
            res.status(500).json({
                message: "Lỗi upload file",
                detail: error.message || error,
            });
        }
    }
);

// Route delete: try Cloudinary destroy (using provided publicId or filename), and fallback to deleting local file if exists
router.delete(
    "/:filename",
    requireAdmin,
    async (req: Request, res: Response) => {
        try {
            const { filename } = req.params;

            // Attempt to delete from Cloudinary. The client should pass the publicId (e.g. products/product-123...) as filename param if stored that way.
            let cloudResult: any = null;
            try {
                const publicId = filename.includes("/")
                    ? filename
                    : `products/${path.parse(filename).name}`;
                cloudResult = await cloudinary.uploader.destroy(publicId, {
                    resource_type: "image",
                });
            } catch (cloudErr) {
                console.warn("Cloudinary delete warning:", cloudErr);
                // continue to try local delete
            }

            // Also attempt to delete local file if present (backwards compatibility)
            const localFilePath = path.join(
                process.cwd(),
                "uploads",
                "products",
                filename
            );
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }

            res.json({ message: "Xóa file thực hiện xong", cloudResult });
        } catch (error) {
            console.error("Delete file error:", error);
            res.status(500).json({
                message: "Lỗi xóa file",
                detail: (error as any).message || error,
            });
        }
    }
);

export { router };
