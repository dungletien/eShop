"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
exports.router = (0, express_1.Router)();
exports.router.get('/', auth_1.requireAdmin, userController_1.listUsersHandler);
exports.router.get('/me', auth_1.requireAuth, userController_1.getCurrentUserHandler);
