import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { serverURL } from "../../services/FetchNodeServices";
import { Parser } from "html-to-react";
import { Box, Typography, Pagination } from "@mui/material";
import fallBackImage from "../../services/DBSLOGO.jpg";

const LIMIT = 100;

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromQuery = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/v1/product/get-all-products?limit=${LIMIT}&page=${pageFromQuery}&createdNew=true`
        );

        const data = response?.data;
        if (data) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [pageFromQuery]);

  const handleDelete = async (productId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `/api/v1/product/delete-product/${productId}`
        );
        if (res.status === 200) {
          setProducts((prev) =>
            prev.filter((product) => product._id !== productId)
          );
          toast.success("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product!");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value });
  };

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>All Product List</h4>
        </div>

        <div className="links">
          <Link
            to="/upload-multiproducts-images"
            className="add-new"
            style={{ marginRight: "10px" }}
          >
            Upload Product Images <i className="fa-solid fa-plus"></i>
          </Link>
          <Link to="/add-product" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
          <Link
            to="/add-multiproduct"
            className="add-new"
            style={{ marginLeft: "10px" }}
          >
            Add Multiple Products <i className="fa-solid fa-plus"></i>
          </Link>
          <Link
            to="/multiple-subcategory-to-product"
            className="add-new"
            style={{ marginLeft: "10px" }}
          >
            Multiple product's Subcategory <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <Box mb={2} mt={2}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          🔼 Please upload images first before uploading multiple products.
        </Typography>
        <Typography variant="body2">
          Page {currentPage} of {totalPages} | Products on this page:{" "}
          {products.length}
        </Typography>
      </Box>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>S No.</th>
              <th>Title</th>
              <th>Image</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Price</th>
              {/* <th>Stock</th> */}
              <th>Discount</th>
              <th>Final Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : products?.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product._id}>
                  <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                  <td>{product?.title}</td>
                  <td>
                    <img
                      src={
                        product?.images?.[0]
                          ? `${serverURL}/public/image/${product.images[0]}`
                          : fallBackImage
                      }
                      alt={product.title}
                      style={{ width: "60px", height: "auto" }}
                    />
                  </td>
                  <td>{product?.author}</td>
                  <td>{product?.ISBN}</td>
                  <td>{product?.price}</td>
                  {/* <td>{product?.stock}</td> */}
                  <td>
                    {product?.discount || "-"}
                    {product?.discount > 100 ? " ₹" : "%"}
                  </td>
                  <td>{product?.finalPrice?.toFixed(2)}</td>
                  <td>
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    &nbsp;
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div
          className="pagination-container"
          style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </div>
      </section>
    </>
  );
};

export default AllProduct;
