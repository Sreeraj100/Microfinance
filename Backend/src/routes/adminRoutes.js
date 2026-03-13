import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  getAllAdmins,
} from "../controllers/adminController.js";
import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All admin routes are protected by adminProtect middleware
router.get("/users", adminProtect, getAllUsers);
router.get("/users/:id", adminProtect, getUserById);
router.put("/users/:id", adminProtect, updateUser);
router.delete("/users/:id", adminProtect, deleteUser);
router.post("/create", adminProtect, createAdmin);
router.get("/all", adminProtect, getAllAdmins);

export default router;
