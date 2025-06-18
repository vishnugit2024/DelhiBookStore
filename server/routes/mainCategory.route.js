import express from "express";
import {
    createMainCategory,
    getAllMainCategories,
    getMainCategoryById,
    updateMainCategory,
    deleteMainCategory,
} from "../controllers/mainCategory.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/create-mainCategory",verifyAdmin, createMainCategory);
router.get("/get-all-mainCategories", getAllMainCategories);
router.get("/get-single-mainCategory/:id", getMainCategoryById);
router.put("/update-mainCategory/:id", verifyAdmin,updateMainCategory);
router.delete("/delete-mainCategory/:id", verifyAdmin,deleteMainCategory);

export default router;