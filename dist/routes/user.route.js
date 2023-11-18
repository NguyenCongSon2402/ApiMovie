"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
const router = (0, express_1.Router)();
router.post("/signup", (0, middleware_1.validateRequestSchema)(schema_1.signupSchema), controllers_1.UserController.signUp);
router.post("/login", (0, middleware_1.validateRequestSchema)(schema_1.loginSchema), controllers_1.UserController.login);
router.put("/profile", middleware_1.authenticateToken, (0, middleware_1.validateRequestSchema)(schema_1.updateUserSchema), controllers_1.UserController.updateProfile);
router.get("/profile", middleware_1.authenticateToken, controllers_1.UserController.getProfile);
// Thêm endpoint để yêu cầu đặt lại mật khẩu
router.post("/forgot-password", controllers_1.UserController.forgotPassword);
// Thêm endpoint để xử lý đặt lại mật khẩu
router.post("/reset-password/:token", controllers_1.UserController.resetPassword);
exports.default = router;
