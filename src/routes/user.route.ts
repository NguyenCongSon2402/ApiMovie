import { Router } from "express";
import { UserController } from "../controllers";
import { authenticateToken, validateRequestSchema } from "../middleware";
import { loginSchema, signupSchema, updateUserSchema } from "../schema";

const router = Router();

router.post(
  "/signup",
  validateRequestSchema(signupSchema),
  UserController.signUp
);

router.post("/login", validateRequestSchema(loginSchema), UserController.login);

router.put(
  "/profile",
  authenticateToken,
  validateRequestSchema(updateUserSchema),
  UserController.updateProfile
);

router.get("/profile", authenticateToken, UserController.getProfile);

// Thêm endpoint để yêu cầu đặt lại mật khẩu
router.post("/forgot-password", UserController.forgotPassword);

// Thêm endpoint để xử lý đặt lại mật khẩu
router.post("/reset-password/:token", UserController.resetPassword);

export default router;
