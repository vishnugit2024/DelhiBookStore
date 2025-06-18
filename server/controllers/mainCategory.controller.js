import { MainCategory } from "../models/mainCategory.model.js";

export const createMainCategory = async (req, res) => {
  try {
    const { Parent_name,Parent_id } = req.body || {};
    if (!Parent_name)
      return res.status(400).json({ error: "Parent name is required" });
    const category = new MainCategory({ Parent_name,Parent_id });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllMainCategories = async (req, res) => {
  try {
    const categories = await MainCategory.find();
    res.json(categories);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMainCategoryById = async (req, res) => {
  try {
    const category = await MainCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Not found" });
    res.json(category);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateMainCategory = async (req, res) => {
  try {
    const category = await MainCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Not found" });
    return res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMainCategory = async (req, res) => {
  try {
    const category = await MainCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Not found" });
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
