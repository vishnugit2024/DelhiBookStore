"use client";
import React, { useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/app/redux/features/shop/shopSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyUser } from "@/app/redux/features/auth/loginSlice";
import {
  addToCartAPIThunk,
  addtoCartState,
} from "@/app/redux/AddtoCart/apiCartSlice"; // ✅ Ensure this is correct
import ShopBanner from "./ShopBanner";
import {
  addToWishlist,
  addToWishlistApi,
  addToWishlistState,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

const Shop = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector(
    (state) => state.products
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = parseInt(searchParams.get("limit")) || 30;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  useEffect(() => {
    dispatch(fetchProducts({ limit, page }));
  }, [dispatch, limit, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    router.push(`?page=${newPage}`);
  };

  const handleLimitChange = (e) => {
    const selectedLimit = e.target.value;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("limit", selectedLimit);
    setLimit(selectedLimit);
    router.push(`?${currentParams.toString()}`);
  };

  const visiblePages = 8;
  const pageGroupStart =
    Math.floor((page - 1) / visiblePages) * visiblePages + 1;
  const pageGroupEnd = Math.min(pageGroupStart + visiblePages - 1, totalPages);

  // Auth & Cart logic
  const user = useSelector((state) => state.login.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);
  console.log("apiCartItems:", apiCartItems);

  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    const exists = cartItems.some((item) => item.id === product._id);
    const insideApiExists = apiCartItems.some(
      (item) => item.productId?._id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.title,
      image: product.images[0],
      price: product.price,
      finalPrice: product.finalPrice,
      quantity: 1,
    };

    if (!user && !user?.email) {
      try {
        await dispatch(addToCart(cartItem));

        toast.success(
          exists
            ? "Quantity updated in your cart!"
            : `Great choice! ${product.title} added.`
        );
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Cart error:", error);
      }
    } else {
      dispatch(addtoCartState({ id: product._id }));
      dispatch(addToCartAPIThunk({ productId: product._id, quantity: 1 }));
      toast.success(
        insideApiExists
          ? "Quantity updated in your cart!"
          : `Great choice! ${product.title} added.`
      );
    }
  };

  const handleAddToWishlist = (_id, title, images, finalPrice, price) => {
    if (user?.email) {
      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item._id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlistState(_id));
        dispatch(removeFromWishlistApi(_id));
        toast.error("Remove from wishlist.");
      } else {
        dispatch(addToWishlistState({ _id }));
        dispatch(addToWishlistApi({ productId: _id }));
        toast.success(`"${title}" added to wishlist.`);
      }
    } else {
      const isAlreadyInWishlist = wishlistItems?.some(
        (item) => item.id === _id
      );
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlist(_id));
        toast.error("removed from wishlist.");
      } else {
        dispatch(
          addToWishlist({
            id: _id,
            name: title,
            image: images,
            price: finalPrice,
            oldPrice: price,
          })
        );
        toast.success(`"${title}" added to wishlist.`);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4 shadow"
          >
            <div className="h-32 bg-gray-300 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error loading products.
      </div>
    );
  }

  return (
    <>
      <ShopBanner />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-2 bg-gray-200">
          <div className="text-sm text-gray-600 text-left">
            {products.length > 0
              ? `Showing ${products?.length} products`
              : "No products found"}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            {/* Sort Dropdown */}
            {/* <div>
              <span>Sort by:</span>
              <select className="p-2 text-black  focus:outline-none">
                <option value="latest">Latest</option>
                <option value="popularity">Popularity</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div> */}

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select
                className="p-2 text-black focus:outline-none"
                onChange={handleLimitChange}
                value={limit}
              >
                <option value="20">20 Items</option>
                <option value="40">40 Items</option>
                <option value="50">50 Items</option>
                <option value="60">60 Items</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5">
          {products.map((product) => {
            const isInCart = user?.email
              ? apiCartItems.some(
                  (item) => item?.productId?._id === product._id
                )
              : cartItems.some((item) => item.id === product._id);

            return (
              <div
                key={product._id}
                className="grid md:flex-row flex-col border border-gray-200 bg-white px-2 py-2"
              >
                <div className="relative">
                  <div className="absolute top-2 left-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-e-2xl z-10">
                    {product.discount}%
                  </div>

                  <div
                    className="bg-white text-black absolute top-2 right-3 shadow-md rounded-2xl p-1 cursor-pointer"
                    onClick={() =>
                      handleAddToWishlist(
                        product._id,
                        product.title,
                        product.images[0],
                        product.finalPrice,
                        product.oldPrice
                      )
                    }
                  >
                    {(
                      user?.email
                        ? wishlistItems?.some(
                            (item) => item?._id === product._id
                          )
                        : wishlistItems?.some((item) => item.id === product._id)
                    ) ? (
                      "❤️"
                    ) : (
                      <Heart size={16} />
                    )}
                  </div>

                  <Link href={`/pages/shop/${product._id}`}>
                    <div className="w-30 h-30 lg:w-50 lg:h-45 md:w-45 md:h-40 flex justify-center m-auto items-center py-2 mb-2 bg-white ">
                      <Image
                        src={
                          product.images[0]
                            ? `${serverUrl}/public/image/${product.images[0]}`
                            : CallBackImg
                        }
                        // src={book}
                        alt={product.title}
                        // onError={(e) => {
                        //   e.target.onerror = null;
                        //   e.target.src = CallBackImg;
                        // }}
                        width={300}
                        height={300}
                        className="object-contain h-full"
                      />
                    </div>
                  </Link>
                </div>

                <div className="w-full">
                  <Link href={`/pages/shop/${product._id}`}>
                    <h3
                      style={{
                        background:
                          "linear-gradient(90deg, #e9d5ff 0%, #d8b4fe 50%)", // light purple gradient
                        color: "var(--purple)", // dark purple text
                        maxWidth: "fit-content",
                        padding: "0px 10px",
                        fontSize: "14px",
                      }}
                      className="my-2 text-sm md:text-md font-normal md:font-bold line-clamp-2 hover:underline rounded-l-0 rounded-r-2xl"
                    >
                      {product.title}
                    </h3>
                    <h3 className="mt-1 text-sm text-gray-800 underline font-semibold italic line-clamp-1">
                      by {product.author}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-700 leading-relaxed tracking-wide line-clamp-3">
                    {
                      new DOMParser().parseFromString(
                        product.description || "",
                        "text/html"
                      ).body.textContent
                    }
                  </p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <div className="text-lg md:text-1xl font-semibold md:font-bold text-red-500">
                      ₹ {product.finalPrice}
                    </div>
                    <div className="text-sm text-gray-800 font-bold line-through">
                      ₹ {product.price}
                    </div>
                  </div>

                  <button
                    className={
                      isInCart ? "added-to-cart-btn" : "add-to-cart-btn"
                    }
                    onClick={() => handleAddToCart(product)}
                  >
                    {isInCart ? "Added" : "Add to cart 🛒"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 overflow-auto">
        <div className="flex justify-center space-x-2 mt-4">
          {/* Prev Group Button */}
          <button
            onClick={() =>
              handlePageChange(Math.max(pageGroupStart - visiblePages, 1))
            }
            disabled={page === 1}
            className={`px-4 flex items-center py-2 border rounded-full ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            <ChevronsLeft size={20} /> Prev
          </button>

          {/* Page Buttons */}
          {Array.from(
            { length: pageGroupEnd - pageGroupStart + 1 },
            (_, i) => pageGroupStart + i
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-4 py-2 border rounded ${
                pageNum === page ? "bg-purple-600 text-white" : "bg-white"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Group Button */}
          <button
            onClick={() =>
              handlePageChange(
                Math.min(page + 1, totalPages - visiblePages + 1)
              )
            }
            disabled={pageGroupEnd === totalPages}
            className={`px-4 py-1 flex items-center border rounded-full ${
              pageGroupEnd === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Next <ChevronsRight size={25} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Shop;
