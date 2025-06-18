import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, {
  getData,
  postData,
  serverURL,
} from "../../services/FetchNodeServices";

const AllSBanner = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/api/v1/banner/get-all-banners"
      );
      if (response.status === 200) {
        setBanners(response?.data);
      } else {
        toast.error("Failed to load banners");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred while fetching banners:-", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const data = await axiosInstance.delete(
          `/api/v1/banner/delete-banner/${id}`
        );
        if (data?.status === 200) {
          setBanners(banners.filter((banner) => banner?._id !== id));
          toast.success("Banner deleted successfully");
        } else {
          toast.error("Banner deleted Failed");
        }
      }
    } catch (error) {
      toast.error("Failed to delete the banner");
    }
  };

  const handleCheckboxChange = async (e, bannerId) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await axiosInstance.put(
        `/api/v1/banner/update-banner/${bannerId}`,
        {
          isActive: updatedStatus,
        }
      );

      if (response.status === 200) {
        const updatedProducts = banners.map((banner) => {
          if (banner._id === bannerId) {
            return { ...banner, isActive: updatedStatus };
          }
          return banner;
        });
        setBanners(updatedProducts);
      }
    } catch (error) {
      toast.error("Error updating Banner status");
      console.error("Error updating Banner status:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Banners</h4>
        </div>
        <div className="links">
          <Link to="/add-banner" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
          <Link
            to="/all-level-images"
            className="add-new"
            style={{ marginLeft: "10px" }}
          >
            Manage Other Banners <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              {/* <th scope="col">Name</th> */}
              <th scope="col">Image</th>
              {/* <th>Title</th>
                            <th>Collection</th> */}
              <th scope="col">Show in home page</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : banners?.length > 0 ? (
              banners?.map((banner, index) => (
                <tr key={banner?._id}>
                  <th scope="row">{index + 1}</th>
                  {/* <td>{banner?.name}</td> */}
                  <td>
                    <img
                      src={`${serverURL}/public/image/${banner?.bannerImage}`}
                      alt={banner?.bannerName}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  {/* <td>{banner?.title}</td>
                                    <td>{banner?.subCategory?.subCategoryName}</td> */}
                  <td>
                    <input
                      type="checkbox"
                      checked={banner?.isActive}
                      onChange={(e) => handleCheckboxChange(e, banner?._id)}
                    />
                  </td>
                  <td>
                    <Link
                      to={`/edit-banner/${banner?._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(banner?._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllSBanner;
