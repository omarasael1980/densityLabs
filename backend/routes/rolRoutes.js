import { Router } from "express";
import {
  createRol,
  getAllRoles,
  getRolById,
  updateRol,
  deleteRol,
} from "../controllers/rolController.js";

const router = Router();

router.post("/", createRol);
router.get("/", getAllRoles);
router.get("/:id", getRolById);
router.patch("/:id", updateRol);
router.delete("/:id", deleteRol);

export default router;
