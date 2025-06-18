import express from "express"
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { upload, uploadImages } from "../middlewares/multer.middleware.js";
import { createProduct, deleteProduct, getAllProducts, getBestSellingBooks, getFeaturedBooks, getNewArrival, getProductByCategory, getSingleProduct, multipleProducts, multipleSubcategoryToProduct, searchProducts, updateProduct, uploadMultipleProducts } from "../controllers/product.controller.js";
import { multerErrorHandler } from "../middlewares/multerErrorHadler.middleware.js";
const router = express.Router();

router.post("/create-product",verifyAdmin,upload.array("images",5),multerErrorHandler,createProduct)
router.post("/multiple-product",verifyAdmin,multipleProducts)
router.put("/update-product/:id",verifyAdmin,upload.array("images",5),multerErrorHandler,updateProduct)
router.get("/get-all-products",getAllProducts)
router.get("/get-product/:id",getSingleProduct)
router.get("/get-new-arrival",getNewArrival)
router.get("/get-featured-books",getFeaturedBooks)
router.get("/get-best-selling-books",getBestSellingBooks)
router.get("/product-by-category/:id", getProductByCategory);
router.delete("/delete-product/:id",verifyAdmin,deleteProduct)
router.get("/search-products",searchProducts)
router.post("/upload-multiple-products",verifyAdmin,uploadImages.array("images"),multerErrorHandler,uploadMultipleProducts)
router.post("/multiple-subcategory-to-product",verifyAdmin,multipleSubcategoryToProduct)

export default router