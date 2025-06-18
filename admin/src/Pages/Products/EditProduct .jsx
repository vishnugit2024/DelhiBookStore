import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices.js";
import { fileLimit } from "../../services/fileLimit.js";
import "./product.css";

const EditProduct = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    images: [],
    category: "",
    price: 0,
    discount: 0,
    // stock: 0,
    finalPrice: 0,
    description: "",
    newArrival: "",
    featuredBooks: "",
    bestSellingBooks: "",
    author: "",
    pages: 0,
    ISBN: "",
    publisher: "",
    publicationDate: "",
    language: "",
  });

  useEffect(() => {
    fetchCategory();
    if (productId) fetchProductDetails(productId);
  }, [productId]);

  const fetchCategory = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/category/get-all-categories");
      setCategoryList(res?.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories.");
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const res = await axiosInstance.get(`/api/v1/product/get-product/${id}`);
  
      if (res?.data) {
        
        setFormData( res.data.product );
        setFormData((prev) => ({ ...prev, category: res.data.product?.category?._id }));
        
      }
    } catch (err) {
      toast.error("Failed to load product.");
    }
  };
 
  // const fetchSubcategories = async (categoryId) => {
  //   try {
  //     const res = await axiosInstance.get(`/api/v1/category/get-subcategories-by-category/${categoryId}`);
  //     setSubcategoryList(res?.data?.data || []);
  //   } catch (err) {
  //     toast.error("Failed to fetch subcategories.");
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJoditChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({ ...prev, images: [...files] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  useEffect(() => {
    const total = parseFloat(formData.price * (1 - formData.discount / 100)).toFixed(2);
    setFormData((prev) => ({ ...prev, finalPrice: total }));
  }, [formData.price, formData.discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    if (formData.images && Array.isArray(formData.images)) {
      for (const image of formData.images) {
        if (!fileLimit(image)) {
          setIsLoading(false);
          return;
        }
      }
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => payload.append(key, item));
      } else {
        payload.append(key, value);
      }
    });

    try {
      const response = await axiosInstance.put(
        `/api/v1/product/update-product/${productId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Product updated successfully");
        navigate("/all-products");
      }
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3 mt-2" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label">Product Name*</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Author*</label>
            <input
              type="text"
              name="author"
              className="form-control"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Pages*</label>
            <input
              type="number"
              name="pages"
              className="form-control"
              value={formData.pages}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">ISBN*</label>
            <input
              type="text"
              name="ISBN"
              className="form-control"
              value={formData.ISBN}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Category*</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            >
              <option value="">Select Category</option>
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.SubCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Publisher*</label>
            <input
              type="text"
              name="publisher"
              className="form-control"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Publication Date*</label>
            <input
              type="text"
              name="publicationDate"
              className="form-control"
              value={formData.publicationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Language*</label>
            <input
              type="text"
              name="language"
              className="form-control"
              value={formData.language}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Images</label>
            <input
              type="file"
              multiple
              name="images"
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Product Description*</label>
            <JoditEditor value={formData.description} onChange={handleJoditChange} />
          </div>

          <div className="row">
            <div className="col-md-2">
              <label className="form-label">Price*</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Discount %*</label>
              <input
                type="number"
                name="discount"
                className="form-control"
                value={formData.discount}
                onChange={handleChange}
                min={0}
                max={100}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Final Price*</label>
              <input
                type="number"
                name="finalPrice"
                className="form-control"
                value={formData.finalPrice}
                readOnly
              />
            </div>

            {/* <div className="col-md-2">
              <label className="form-label">Stock</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={formData.stock}
                onChange={handleChange}
              />
            </div> */}
          </div>
<div className="row mt-3">
  <div className="col-md-4">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id="newArrival"
        checked={formData.newArrival}
        onChange={(e) =>
          setFormData({ ...formData, newArrival: e.target.checked })
        }
      />
      <label className="form-check-label" htmlFor="newArrival">
        New Arrival
      </label>
    </div>
  </div>
  <div className="col-md-4">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id="featuredBooks"
        checked={formData.featuredBooks}
        onChange={(e) =>
          setFormData({
            ...formData,
            featuredBooks: e.target.checked,
          })
        }
      />
      <label className="form-check-label" htmlFor="featuredBooks">
        Featured Books
      </label>
    </div>
  </div>
  <div className="col-md-4">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id="bestSellingBooks"
        checked={formData.bestSellingBooks }
        onChange={(e) =>
          setFormData({
            ...formData,
            bestSellingBooks: e.target.checked,
          })
        }
      />
      <label className="form-check-label" htmlFor="bestSellingBooks">
        Best Selling Books
      </label>
    </div>
  </div>
</div>

          <div className="col-md-12 mt-4 text-center">
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
