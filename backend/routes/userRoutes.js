import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  getUserByToken,
} from "../controllers/userController.js";
import { Router } from "express";
import authMiddleware from "../middleware/autMiddleware.js";

const router = Router();
router.post("/", createUser);
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/login/", login);
router.post("/getUserByToken/", getUserByToken);

export default router;
