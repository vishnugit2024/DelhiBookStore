import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema({
  Parent_id: {
    type: String,
  },

  Parent_name: {
    type: String,
    required: true,
  },
});

export const MainCategory = mongoose.model("MainCategory", mainCategorySchema);
