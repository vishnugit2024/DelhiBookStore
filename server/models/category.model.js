import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  SubCategoryName: {
    type: String,
    required: true,
  },
  Parent_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MainCategory",
  },
  Sub_CATEGORIES_ID:{
   type:String,
  },
  categoryImage: {
    type: String,
    // required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 3,
  },
  levelImage: {
    type: String,
  },
});

export const Category = mongoose.model("Category", categorySchema);
