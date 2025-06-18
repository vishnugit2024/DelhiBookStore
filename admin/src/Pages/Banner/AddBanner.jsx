import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { postData } from "../../services/FetchNodeServices.js";
import { fileLimit } from "../../services/fileLimit.js";

const AddBanner = () => {
  const [formData, setFormData] = useState({
    bannerName: "",
    bannerStatus: false,
    description: "",
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [collections, setCollections] = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const fetchCollections = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/sub-category/get-all-sub-categories"
      );
      setCollections(response.data.data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      toast.error("Failed to load collections");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bannerImage) {
      toast.error("Please select a banner image");
      return;
    }
    // if (!fileLimit(bannerImage)) return;
    try {
      setIsLoading(true);
      const submitData = new FormData();
      submitData.append("image", bannerImage);
      submitData.append("isActive", formData.bannerStatus);
      // submitData.append("title", formData.bannerName);
      // submitData.append("subCategory", collectionId);
      // submitData.append("description", formData.description);
      const response = await axiosInstance.post(
        "/api/v1/banner/create-banner",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Banner added successfully");
        navigate("/all-banners");
        setFormData({ bannerName: "", bannerStatus: false });
        setBannerImage(null);
        setPreviewImage(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, "Failed to add banner");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCollections();
  // }, []);
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Shop Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-banners" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* <div className="col-md-6">
            <label htmlFor="bannerName" className="form-label">
              Title
            </label>
            <input
              type="text"
              name="bannerName"
              value={formData.bannerName}
              onChange={handleChange}
              className="form-control"
              id="bannerName"
              required
            />
          </div> */}

          <div className="col-md-6">
            <label htmlFor="bannerImage" className="form-label">
              Shop Banner Image
            </label>
            <input
              type="file"
              name="bannerImage"
              className="form-control"
              id="bannerImage"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
          </div>
          {/* <div className="col-md-6">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              id="description"
              required
            />
          </div> */}
          {/* <div className="col-md-6">
            <label htmlFor="collection" className="form-label">
              Collection
            </label>
            <select
              name="collection"
              id="collection"
              className="form-select"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              required
            >
              <option value="">Select a Collection</option>
              {collections?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.subCategoryName}
                </option>
              ))}
            </select>
          </div> */}
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="bannerStatus"
                id="bannerStatus"
                checked={formData.bannerStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="bannerStatus">
                Active
              </label>
            </div>
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Banner"}
            </button>
          </div>
        </form>
      </div>

      {previewImage && (
        <div className="preview-section mt-4 text-center">
          <h5>Preview</h5>
          <img
            src={previewImage}
            alt="Preview"
            className="img-fluid mt-2"
            style={{ maxWidth: "300px", borderRadius: "5px" }}
          />
        </div>
      )}
    </>
  );
};

export default AddBanner;
