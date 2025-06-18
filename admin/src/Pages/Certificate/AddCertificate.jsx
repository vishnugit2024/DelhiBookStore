import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { postData } from "../../services/FetchNodeServices";
import { fileLimit } from "../../services/fileLimit";

const AddCertificate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ status: false, });
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({ ...prev, status: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 

    try {
      const payload=new FormData();
      if(!fileLimit(image)) return;
      payload.append("image", image);
      payload.append("isActive", formData.status);
      const response = await axiosInstance.post(`/api/v1/certificate/create-certificate`, payload,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.status === 201) {
        toast.success(response.data.message);
        navigate("/all-certificate");
      } else {
        toast.error(response.message || "Error adding size !");
      }

    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Error adding size"
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Certificate</h4>
        </div>
        <div className="links">
          <Link to="/all-certificate" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="image" className="form-label">
              Certificate
            </label>
            <input type="file" name="image" className="form-control" id="image" onChange={handleChange} required />
          </div>
          {/* <div className="col-md-12">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="status" checked={formData.status} onChange={handleCheckboxChange} />
              <label className="form-check-label" htmlFor="status">
                Active
              </label>
            </div>
          </div> */}

          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Certificate"}{" "}
              {/* Updated button text */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCertificate;
