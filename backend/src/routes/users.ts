import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
    listUsersHandler,
    getCurrentUserHandler,
} from "../controllers/userController";

export const router = Router();

router.get("/", requireAdmin, listUsersHandler);    
router.get("/me", requireAuth, getCurrentUserHandler);
