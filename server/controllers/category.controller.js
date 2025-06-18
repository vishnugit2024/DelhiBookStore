import { Category } from "../models/category.model.js";
import { MainCategory } from "../models/mainCategory.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";

export const createCategory = async (req, res) => {
  try {
    const { SubCategoryName, Parent_name } = req.body;
    const level = Number(req.body.level);
    const isActive = req.body.isActive === "true";
    if (!SubCategoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const localPath = req.files?.["image"]?.[0]?.filename;
    if (!localPath) {
      return res.status(400).json({ message: "Image is required" });
    }

    let levelImageUrl;
    if (isActive && level) {
      console.log("isActive and level", isActive, level);

      const levelImageLocalPath = req.files?.["levelImage"]?.[0]?.filename;
      levelImageUrl = levelImageLocalPath;
      console.log("levelImageLocalPath", levelImageLocalPath);

      if (!levelImageUrl)
        return res.status(500).json({ message: "Image upload failed" });
    }
    const newCategory = await Category.create({
      SubCategoryName,
      categoryImage: localPath,
      level,
      isActive,
      levelImage: levelImageUrl,
      Parent_name,
    });

    return res
      .status(201)
      .json({ message: "Category created", category: newCategory });
  } catch (error) {
    console.error("Create Category Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in create category" });
  }
};

export const multipleCategory = async (req, res) => {
  try {
    const { categories } = req.body || {};
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required" });
    }
    const AllCategories = await Promise.all(
      categories.map(async (category) => {
        const mainCategory = await MainCategory.findOne({
          Parent_name: category.Parent_name,
        });
        if (mainCategory) {
          category.Parent_name = mainCategory._id;
        }
        return category;
      })
    );
    const result = await Category.insertMany(AllCategories);
    return res.status(201).json({
      message: "Multiple categories created successfully",
      categories: result,
    });
  } catch (error) {
    console.log("Multiple Category Error:", error);
    return res.status(500).json({
      message: "Internal Server Error in multiple category creation",
    });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const { level } = req.query || {};
    const query = {};
    if (level) {
      query.$or = [{ level: 1 }, { level: 2 }, { level: 3 }];
    }
    const categories = await Category.find(query).populate("Parent_name");
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Get All Categories Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in get all categories" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json(category);
  } catch (error) {
    console.error("Get Category by ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { SubCategoryName } = req.body;
    const level = Number(req.body.level);
    const isActive = req.body.isActive === "true";
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (req.files?.["image"]?.[0]?.path) {
      const imageUrl = req.files?.["image"]?.[0]?.filename;
      if (imageUrl) category.categoryImage = imageUrl;
    } else {
      category.categoryImage = category.categoryImage;
    }

    if (req.files?.["levelImage"]?.[0]?.path && isActive && level) {
      const levelImageUrl = req.files?.["levelImage"]?.[0]?.filename;
      if (levelImageUrl) category.levelImage = levelImageUrl;
    } else {
      category.levelImage = category.levelImage;
    }
    category.SubCategoryName = SubCategoryName ?? category.SubCategoryName;
    category.level = level ?? category.level;
    category.isActive = isActive ?? category.isActive;

    await category.save();
    return res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    console.error("Update Category Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in delete category" });
  }
};

export const getCategoryByMainCategory = async (req, res) => {
  try {
    const category = await Category.find({
      Parent_name: req.params.id,
    }).populate("Parent_name");
    return res.status(200).json(category);
  } catch (error) {
    console.error("Get Category by ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
