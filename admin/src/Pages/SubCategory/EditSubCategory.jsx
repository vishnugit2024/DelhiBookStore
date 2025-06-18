import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";

const EditSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    status: false,
    collection: "",
    category: "",
     level: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchSubCategoryDetails = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/category/get-single-category/${id}`);
    
      if (res.status === 200) {
        const data = res.data;
        setFormData({
          name: data.SubCategoryName,
          image: null,
          status: data.isActive,
          collection: null,
          category: data.Parent_name,
          level: data.level
        });
        console.log("data", data);
        
      }
    } catch (error) {
      toast.error("Failed to fetch subcategory details");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/mainCategory/get-all-mainCategories");
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = new FormData();
    payload.append("SubCategoryName", formData.name);
    payload.append("isActive", formData.status);
    payload.append("category", formData.category);
    payload.append("level", formData.level);
    if (formData.image) payload.append("image", formData.image);
    if (formData.collection) payload.append("levelImage", formData.collection);
   
    try {
      const res = await axiosInstance.put(`/api/v1/category/update-category/${id}`, payload, 
         (formData.image || formData.collection)
      && {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
        );
      if (res.status === 200) {
        toast.success("SubCategory updated successfully");
        navigate("/all-sub-category");
      } else {
        toast.error(res?.message || "Error updating subcategory");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategoryDetails();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Sub Category</h4>
        </div>
        <div className="links">
          <Link to="/all-sub-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>
      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label">Select Parent Category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Parent Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.Parent_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Category Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">SubCategory Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="status"
                checked={formData.status}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="status">
                Active on Collection
              </label>
            </div>
          </div>
      {formData.status && (
  <>
  

    <div className="col-md-4">
      <label htmlFor="level" className="form-label">
        Level
      </label>
      <select
        className="form-select"
        id="level"
        name="level"
        value={formData.level || ''}
        onChange={handleChange}
        required
      >
        <option value="">Select Level</option>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
      </select>
    </div>
      <div className="col-md-4">
      <label htmlFor="collection" className="form-label">
        Level Image
      </label>
      <input
        type="file"
        name="collection"
        className="form-control"
        id="collection"
        accept="image/*"
        onChange={handleChange}
      />
      {formData.collection && (
        <img
          src={URL.createObjectURL(formData.collection)}
          alt="Preview"
          width="100"
        />
      )}
    </div>
  </>
)}

          <div className="col-md-12 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update SubCategory"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSubCategory;
