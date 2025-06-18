"use client";
import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import ShopBanner from "@/app/components/Shop/ShopBanner";
import book1 from "../../../../Images/DBS/1.jpg";
import { fetchProductsByCategory } from "@/app/redux/features/productByCategory/productByCategorySlice";
import {
  addToCartAPIThunk,
  addtoCartState,
} from "@/app/redux/AddtoCart/apiCartSlice";
import {
  addToWishlist,
  addToWishlistApi,
  addToWishlistState,
  removeFromWishlist,
  removeFromWishlistApi,
  removeFromWishlistState,
} from "@/app/redux/wishlistSlice";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import CallBackImg from "../../../../Images/DBS/DBSLOGO.jpg";

const Page = () => {
  const dispatch = useDispatch();
  const { id: subcategoryId } = useParams();
  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const user = useSelector((state) => state.login.user);
  const { products, loading, error } = useSelector(
    (state) => state.productByCategory
  );
  let cartItemsValue = [];
  if (user?.email) {
    cartItemsValue = apiCartItems;
  } else {
    cartItemsValue = cartItems;
  }
  useEffect(() => {
    if (subcategoryId) {
      dispatch(fetchProductsByCategory(subcategoryId));
    }
  }, [dispatch, subcategoryId]);

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
        Error loading Product By SubCategory
      </div>
    );
  }
  const handleAddToCart = async (product) => {
    const exists = cartItems.some((item) => item.id === product._id);
    const insideApiExists = apiCartItems.some(
      (item) => item.id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.title,
      image: book1,
      price: product.finalPrice,
      totalPrice: product.finalPrice,
      quantity: 1,
    };

    if (!user && !user?.email) {
      try {
        await dispatch(addToCart(cartItem)).unwrap();

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

  const handleAddToWishlist = (_id, title, img, finalPrice, price) => {
    if (user?.email) {
      const isAlreadyInWishlist = wishlistItems?.some(
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
      const isAlreadyInWishlist = wishlistItems.some((item) => item.id === _id);
      if (isAlreadyInWishlist) {
        dispatch(removeFromWishlist(_id));
        toast.error("removed from wishlist.");
      } else {
        dispatch(
          addToWishlist({
            id: _id,
            name: title,
            image: img,
            price: finalPrice,
            oldPrice: price,
          })
        );
        toast.success(`"${title}" added to wishlist.`);
      }
    }
  };
  return (
    <>
      <ShopBanner />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-2 bg-gray-200">
          <div className="text-sm text-gray-600 text-left">
            {products?.length > 0
              ? `Showing ${products?.length} products`
              : "No products found"}
          </div>
          <div>
            <span>Sort by:</span>
            <select className="p-2 text-black focus:outline-none">
              <option value="latest">Latest</option>
              <option value="popularity">Popularity</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 bg-white p-2 rounded"
            >
              {/* Image & Wishlist */}
              <div className="relative">
                {/* Discount badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 left-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-e-2xl z-10">
                    {product.discount}%
                  </div>
                )}

                {/* Wishlist icon */}
                <div
                  className="bg-white text-black absolute top-2 right-3 shadow-md rounded-2xl p-1 cursor-pointer"
                  onClick={() =>
                    handleAddToWishlist(
                      product._id,
                      product.title,
                      product.img,
                      product.finalPrice,
                      product.oldPrice
                    )
                  }
                >
                  {(
                    user?.email
                      ? wishlistItems?.some((item) => item?._id === product._id)
                      : wishlistItems?.some((item) => item.id === product._id)
                  ) ? (
                    "❤️"
                  ) : (
                    <Heart size={16} />
                  )}
                </div>

                {/* Product Image */}
                <Link href={`/pages/shop/${product._id}`}>
                  <div className="w-30 h-30 lg:w-50 lg:h-45 md:w-45 md:h-40 flex justify-center m-auto items-center py-2 mb-2 bg-white ">
                    <Image
                      src={
                        product.images[0]
                          ? `${serverUrl}/public/image/${product.images[0]}`
                          : CallBackImg
                      }
                      // src={book1}
                      alt={product.title}
                      width={120}
                      height={120}
                      className="object-contain h-full"
                    />
                  </div>
                </Link>
              </div>

              {/* Product Content */}
              <div>
                <Link href={`/pages/shop/${product._id}`}>
                  <h3
                    className="my-2 text-sm md:text-md font-bold hover:underline line-clamp-2"
                    style={{
                      background:
                        "linear-gradient(90deg, #e9d5ff 0%, #d8b4fe 50%)",
                      padding: "0px 10px",
                      maxWidth: "fit-content",
                      borderRadius: "0 10px 10px 0",
                    }}
                  >
                    {product.title}
                  </h3>
                  <h3 className="mt-1 text-sm text-gray-800 underline font-semibold italic line-clamp-1">
                    by {product.author}
                  </h3>
                </Link>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {
                    new DOMParser().parseFromString(
                      product.description || "",
                      "text/html"
                    ).body.textContent
                  }
                </p>

                <div className="flex items-baseline gap-2 mt-2">
                  <div className="text-lg font-bold text-red-500">
                    ₹{product.finalPrice}
                  </div>
                  <div className="text-sm text-gray-800 line-through">
                    ₹{product.price}
                  </div>
                </div>

                <button
                  className={`${
                    (
                      user?.email
                        ? cartItemsValue.some(
                            (item) => item?.productId?._id === product._id
                          )
                        : cartItemsValue.some((item) => item.id === product._id)
                    )
                      ? "added-to-cart-btn"
                      : "add-to-cart-btn"
                  }`}
                  onClick={() => handleAddToCart(product)}
                >
                  {(
                    user?.email
                      ? cartItemsValue.some(
                          (item) => item?.productId?._id === product._id
                        )
                      : cartItemsValue.some((item) => item.id === product._id)
                  )
                    ? "Added"
                    : "Add to cart 🛒"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
