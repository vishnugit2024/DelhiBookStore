import fetch from "node-fetch";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import {
  deleteLocalImage,
  findImageWithExtension,
} from "../utils/image.util.js";

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      highlights,
      details,
      author,
      pages,
      ISBN,
      publisher,
      publicationDate,
      language,
      newArrival,
      featuredBooks,
      bestSellingBooks,
      priceInDollors,
      priceInEuros,
      price,
      discount,
      category,
      // stock,
    } = req.body || {};
    const errorMessages = [];
    if (!title) errorMessages.push("title is required");
    if (req.files.length == 0 || !req.files)
      errorMessages.push("image is required");
    if (!description) errorMessages.push("description is required");
    // if (!highlights) errorMessages.push("highlights is required");
    // if (!details) errorMessages.push("details is required");
    if (!author) errorMessages.push("author is required");
    if (!pages) errorMessages.push("pages is required");
    if (!ISBN) errorMessages.push("ISBN is required");
    if (!publisher) errorMessages.push("publisher is required");
    if (!publicationDate) errorMessages.push("publicationDate is required");
    if (!language) errorMessages.push("language is required");
    // if (!priceInDollors) errorMessages.push("priceInDollors is required");
    // if (!priceInEuros) errorMessages.push("priceInEuros is required");
    if (!price) errorMessages.push("price is required");
    if (!discount) errorMessages.push("discount is required");
    if (!category) errorMessages.push("category is required");
    // if (!stock) errorMessages.push("stock is required");
    if (errorMessages.length > 0) {
      return res.status(400).json({ message: errorMessages });
    }
    const newArrivalBool = newArrival === "true";
    const featuredBooksBool = featuredBooks === "true";
    const bestSellingBooksBool = bestSellingBooks === "true";

    const isCategoryExists = await Category.findById(category);

    if (!isCategoryExists) {
      return res.status(400).json({ message: "category not found" });
    }

    const images = req.files.map((file) => {
      return file.filename;
    });
    const finalPrice = Number(price) - (Number(price) * Number(discount)) / 100;

    const product = await Product.create({
      title,
      description,
      // highlights,
      // details,
      author,
      pages,
      ISBN,
      publisher,
      publicationDate,
      language,
      newArrival: newArrivalBool,
      featuredBooks: featuredBooksBool,
      bestSellingBooks: bestSellingBooksBool,
      // priceInDollors: Number(priceInDollors),
      // priceInEuros: Number(priceInEuros),
      price: Number(price),
      discount: Number(discount),
      category,
      // stock,
      images,
      finalPrice,
    });

    return res.status(201).json({ message: "product created", product });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map((file) => deleteLocalImage(file.path)));
    }
    console.log("create product error", error);
    return res.status(500).json({ message: "create product server error" });
  }
};

const multipleProducts = async (req, res) => {
  try {
    const { products } = req.body || {};
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }
    let DollarPrice;
    let eurRate;
    try {
      const response = await fetch(
        "https://api.frankfurter.app/latest?from=USD&to=INR,EUR"
      );
      const data = await response.json();

      const rate = data.rates?.INR;
       eurRate = data.rates?.EUR;
      DollarPrice = Number(rate);
    } catch (error) {
      console.error("Error fetching conversion rate:", error.message);
      return res
        .status(500)
        .json({ message: "Error fetching conversion rate" });
    }

    const updatedProducts = await Promise.all(
      products.map(async (product, i) => {
        if (product.images) {
          product.images = product.images ? [product.images] : [];
          product.images = product.images.map((img) => {
            return findImageWithExtension(img);
          });
          if (product.category) {
            const existedCategory = await Category.findOne({
              category: product.categoryName,
            });
            if (existedCategory) {
              product.category = existedCategory._id;
            }
          }
          if (product.PRODUCTS_ID) {
            product.PRODUCTS_ID = Number(product.PRODUCTS_ID);
          }
          if (
            product.PRODUCTS_MRP_IN_DOLLAR &&
            !isNaN(Number(product.PRODUCTS_MRP_IN_DOLLAR))
          ) {
            product.priceInDollors = Number(product.PRODUCTS_MRP_IN_DOLLAR);
            const priceInInrInString = (
              Number(product.PRODUCTS_MRP_IN_DOLLAR) * DollarPrice
            ).toFixed(2);
            const priceInInr = parseFloat(priceInInrInString);
            product.priceInEuros = priceInInr * eurRate;
            product.price = priceInInr;
            if (product.discount) {
              product.finalPrice =
                Number(priceInInr) -
                  (Number(priceInInr) * Number(product.discount)) / 100 ??
                10000;
            } else {
              product.finalPrice = priceInInr;
            }
          } else {
            product.priceInDollors = 1111110;
            product.price = 1111110;
            product.finalPrice = 888880;
          }

          product.title = product?.PRODUCTS_NAME || "Untitled Product";
          if (product.PRODUCTS_PUBLISHER_NAME) {
            product.publisher = product.PRODUCTS_PUBLISHER_NAME;
          }
          if (product.PRODUCTS_PAGES) {
            product.pages = Number(product.PRODUCTS_PAGES) || 0;
          }
          if (product.PRODUCTS_AUTH_NAME) {
            product.author = product.PRODUCTS_AUTH_NAME;
          }
          if (product.PRODUCTS_PUBLISH_DATE) {
            product.publicationDate = product.PRODUCTS_PUBLISH_DATE;
          }
        }
        return product;
      })
    );

    const insertedProducts = await Product.insertMany(updatedProducts);

    return res.status(201).json({
      message: "Products created",
      products: insertedProducts,
      updatedProducts,
    });
  } catch (error) {
    console.log("create product error", error);
    return res
      .status(500)
      .json({ message: "create product server error", error });
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      highlights,
      details,
      author,
      pages,
      ISBN,
      publisher,
      publicationDate,
      language,
      category,
    } = req.body || {};
    let priceInDollors = Number(req.body.priceInDollors || 0);
    let priceInEuros = Number(req.body.priceInEuros || 0);
    let price = Number(req.body.price || 0);
    let stock = Number(req.body.stock || 0);
    let discount = Number(req.body.discount || 0);
    let newArrival = req.body.newArrival === "true";
    let featuredBooks = req.body.featuredBooks === "true";
    let bestSellingBooks = req.body.bestSellingBooks === "true";
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => {
        return file.filename;
      });
      if (product.images) {
        await Promise.all(
          product.images.map((image) => deleteLocalImage(image))
        );
      }
      product.images = images;
    } else {
      product.images = product.images;
    }
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.highlights = highlights ?? product.highlights;
    product.details = details ?? product.details;
    product.author = author ?? product.author;
    product.pages = pages ?? product.pages;
    product.ISBN = ISBN ?? product.ISBN;
    product.publisher = publisher ?? product.publisher;
    product.publicationDate = publicationDate ?? product.publicationDate;
    product.language = language ?? product.language;
    product.newArrival = newArrival ?? product.newArrival;
    product.featuredBooks = featuredBooks ?? product.featuredBooks;
    product.bestSellingBooks = bestSellingBooks ?? product.bestSellingBooks;
    product.priceInDollors = priceInDollors ?? product.priceInDollors;
    product.priceInEuros = priceInEuros ?? product.priceInEuros;
    product.price = price ?? product.price;
    product.discount = discount ?? product.discount;
    if (category) {
      let isCategoryExists = await Category.findById(category);
      if (!isCategoryExists) {
        return res.status(400).json({ message: "category not found" });
      }
      product.category = category;
    } else {
      product.category = product.category;
    }
    product.stock = stock ?? product.stock;
    await product.save();
    return res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map((file) => deleteLocalImage(file.path)));
    }
    console.log("update product error", error);
    return res.status(500).json({ message: "update product server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 0;
    const createdNew = req?.query?.createdNew || false; 
    const skip = (page - 1) * limit;
    const query = {};
    if (req?.query?.newArrival) {
      query.newArrival = true;
    }
    if (req?.query?.featuredBooks) {
      query.featuredBooks = true;
    }
    if (req?.query?.bestSellingBooks) {
      query.bestSellingBooks = true;
    }
    const products = await Product.find(query)
      .populate("category")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: createdNew ? -1 : 1 });

    const totalCount = await Product.countDocuments();

    return res.status(200).json({
      message: "all products",
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    console.log("get all products error", error);
    return res.status(500).json({ message: "get all products server error" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product found", product });
  } catch (error) {
    console.log("get single product error", error);
    return res.status(500).json({ message: "get single product server error" });
  }
};

const getNewArrival = async (req, res) => {
  try {
    const products = await Product.find({ newArrival: true });
    return res.status(200).json({ message: "new arrival", products });
  } catch (error) {
    console.log("get new arrival error", error);
    return res.status(500).json({ message: "get new arrival server error" });
  }
};
const getFeaturedBooks = async (req, res) => {
  try {
    const products = await Product.find({ featuredBooks: true });
    return res.status(200).json({ message: "featured books", products });
  } catch (error) {
    console.log("get featured books error", error);
    return res.status(500).json({ message: "get featured books server error" });
  }
};
const getBestSellingBooks = async (req, res) => {
  try {
    const products = await Product.find({ bestSellingBooks: true });
    return res.status(200).json({ message: "best selling books", products });
  } catch (error) {
    console.log("get best selling books error", error);
    return res
      .status(500)
      .json({ message: "get best selling books server error" });
  }
};
const getProductByCategory = async (req, res) => {
  try {
    const category = await Product.find({ category: req.params.id });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json(category);
  } catch (error) {
    console.error("Get Category by ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product deleted", product });
  } catch (error) {
    console.log("delete product error", error);
    return res.status(500).json({ message: "delete product server error" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const query = req.query.search;
    const matchingCategories = await Category.find({
      categoryName: { $regex: query, $options: "i" },
    });
    const categoryIds = matchingCategories.map((cat) => cat._id);
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { ISBN: { $regex: query, $options: "i" } },
        { category: { $in: categoryIds } },
      ],
    }).populate("category");

    return res.status(200).json({ message: "search products", products });
  } catch (error) {
    console.log("search products error", error);
    return res.status(500).json({ message: "search products server error" });
  }
};

const uploadMultipleProducts = async (req, res) => {
  try {
    return res.status(200).json({ message: "upload multiple products" });
  } catch (error) {
    console.log("upload multiple products error", error);
    return res
      .status(500)
      .json({ message: "upload multiple products server error" });
  }
};

const multipleSubcategoryToProduct = async (req, res) => {
  try {
    const { subCategories } = req.body || {};

    if (
      !subCategories ||
      !Array.isArray(subCategories) ||
      subCategories.length === 0
    ) {
      return res.status(400).json({ message: "No subcategories provided" });
    }

    const bulkOps = await Promise.all(
      subCategories.map(async (subCategory) => {
        const subCategoryDoc = await Category.findOne({
          Sub_CATEGORIES_ID: subCategory.Sub_CATEGORIES_ID,
        });

        if (!subCategoryDoc) return null;

        return {
          updateOne: {
            filter: { PRODUCTS_ID: subCategory.PRODUCTS_ID },
            update: { $set: { category: subCategoryDoc._id } },
          },
        };
      })
    );

    const validOps = bulkOps.filter(Boolean);

    if (validOps.length > 0) {
      await Product.bulkWrite(validOps);
    }

    return res.status(200).json({ message: "multiple subcategory to product" });
  } catch (error) {
    console.log("multiple subcategory to product error", error);
    return res
      .status(500)
      .json({ message: "multiple subcategory to product server error" });
  }
};
export {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  multipleProducts,
  getNewArrival,
  getFeaturedBooks,
  getBestSellingBooks,
  getProductByCategory,
  searchProducts,
  uploadMultipleProducts,
  multipleSubcategoryToProduct,
};
