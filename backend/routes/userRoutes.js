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

const router = Router();
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login/", login);
router.post("/getUserByToken/", getUserByToken);

export default router;
