"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QR from "../../Images/DBS/QR.png";
import book1 from "../../Images/DBS/1.jpg";
import {
  BookOpenText,
  CheckCheck,
  ChevronsLeft,
  Globe,
  Heart,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { addToCart } from "@/app/redux/AddtoCart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance, { serverUrl } from "@/app/redux/features/axiosInstance";
import { useParams, useRouter } from "next/navigation";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";
import { Parser } from "html-to-react";
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
export default function ProductDetails() {
  // Api for show ingle prodict data

  const [activeTab, setActiveTab] = useState("description");
  // const [selectedImage, setSelectedImage] = useState(
  //   book.coverImage || "/placeholder.svg"
  // );
  // const [fade, setFade] = useState(false);

  // useEffect(() => {
  //   setFade(true);
  //   const timer = setTimeout(() => setFade(false), 200); // match transition duration
  //   return () => clearTimeout(timer);
  // }, [selectedImage]);
  const htmlParser = new Parser();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: apiCartItems } = useSelector((state) => state.apiCart);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const handleAddToCart = async (product) => {
    const exists = cartItems.some((item) => item.id === product._id);
    const insideApiExists = apiCartItems.some(
      (item) => item.productId?._id === product._id
    );

    const cartItem = {
      id: product._id,
      name: product.title,
      image: product?.images[0],
      price: product.finalPrice,
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

  const router = useRouter();

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    router.push("/pages/checkout");
  };
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Check out this product!",
          text: `I found this amazing book on DELHI BOOK STORE`,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(
        "Sharing not supported in this browser. You can copy the link manually."
      );
    }
  };

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params.id;

  console.log("Product data:", book);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetail = async () => {
      try {
        const response = await axiosInstance.get(`/product/get-product/${id}`);
        setBook(response.data.product);
      } catch (err) {
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!book) {
    return (
      <div className="text-center text-gray-500">
        {loading ? "Loading..." : "Product not found."}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/pages/shop"
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronsLeft />
          Back to Books
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="border border-purple-500 rounded-lg overflow-hidden bg-white p-4 flex items-center justify-center">
            <Image
              // src={book1}
              src={
                book?.images[0]
                  ? `${serverUrl}/public/image/${book?.images[0]}`
                  : CallBackImg
              }
              width={500}
              height={500}
              alt={book.title}
              zoom={2}
            />
          </div>

          {/* Preview Thumbnails */}
          {/* <div className="grid grid-cols-4 gap-2">
            {[book.coverImage, ...book.previewImages].map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image || "/placeholder.svg")}
                className={`border rounded-lg overflow-hidden bg-white p-2 cursor-pointer transition-colors ${
                  selectedImage === image
                    ? "border-purple-800"
                    : "border-purple-600 hover:border-purple-800"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${book.title} preview ${index + 1}`}
                  width={100}
                  height={150}
                  className="object-cover aspect-[2/3]"
                />
              </div>
            ))}
          </div> */}
        </div>

        {/* Middle Column - Book Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <p className="text-lg text-gray-500">by {book.author}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 border border-purple-600 rounded-md hover:bg-purple-100"
                  onClick={() =>
                    handleAddToWishlist(
                      book._id,
                      book.title,
                      book?.images[0],
                      book.finalPrice,
                      book.oldPrice
                    )
                  }
                >
                  {(
                    user?.email
                      ? wishlistItems?.some((item) => item?._id === book._id)
                      : wishlistItems?.some((item) => item.id === book._id)
                  ) ? (
                    "❤️"
                  ) : (
                    <Heart size={20} />
                  )}
                  <span className="sr-only">Add to wishlist</span>
                </button>
                <button
                  className="p-2 border border-purple-600 rounded-md hover:bg-purple-100"
                  onClick={handleShare}
                >
                  <Share2 />
                  <span className="sr-only">Share</span>
                </button>
              </div>
            </div>

            {/* <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-500 fill-gray-500"
                    }`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <Star />
                  </div>
                ))}
                <span className="ml-2 text-sm font-medium">{book.rating}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({book.reviewCount} reviews)
              </span>
            </div> */}

            {/* <div className="flex flex-wrap gap-2 mt-3">
              {book.category.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div> */}
            {book?.category && book?.category?.SubCategoryName && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  href={`/pages/shop/productBysubcategory/${book?.category?._id}`}
                >
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {book?.category?.SubCategoryName}
                  </span>
                </Link>
              </div>
            )}
          </div>

          <hr className="border-purple-400" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe />

                <span className="font-medium">
                  Check prices for your region:
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg p-2 border-2  cursor-pointer border-purple-600 ransition-colors">
                <div className="text-center">
                  <div className="font-medium">INR</div>
                  <div className="text-2xl font-bold mt-1">₹{book.price?.toFixed()}</div>
                </div>
              </div>
              <div className=" border-2  rounded-lg p-2  cursor-pointer border-purple-600 ransition-colors">
                <div className="text-center">
                  <div className="font-medium">USD</div>
                  <div className="text-2xl font-bold mt-1">${book?.priceInDollors?.toFixed() || "N/A"}</div>
                </div>
              </div>
              <div className="border-2  rounded-lg p-2 cursor-pointer border-purple-600 ransition-colors">
                <div className="text-center">
                  <div className="font-medium">EURO</div>
                  <div className="text-2xl font-bold mt-1">£{book?.priceInEuros?.toFixed() || "N/A" }</div>
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-700">
              <BookOpenText />

              <span>
                Hardcover · {book.pages} pages · {book.language}
              </span>
            </div>

            {/* <div className="flex items-center text-sm">
              <span
                className={`font-medium ${
                  book.stock > 10
                    ? "text-green-600"
                    : book.stock > 0
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {book.stock > 10
                  ? "In Stock"
                  : book.stock > 0
                  ? `Only ${book.stock} left`
                  : "Out of Stock"}
              </span>
            </div> */}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              className={`${
                cartItems.some((item) => item.id === book.id)
                  ? "w-full bg-black text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  : "w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              }`}
              onClick={() => handleAddToCart(book)}
            >
              {cartItems.some((item) => item.id === book.id) ? (
                <>
                  Added to cart <CheckCheck />
                </>
              ) : (
                <>
                  <ShoppingCart /> Add to cart
                </>
              )}
            </button>
            {/* <Link href={"/pages/checkout"}> */}
            <button
              className="w-full border border-gray-500 hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
              onClick={() => handleBuyNow(book)}
            >
              Buy Now
            </button>
            {/* </Link> */}
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <b>ISBN:</b> {book.ISBN}
            </p>
            <p>
              <b>Publisher:</b> {book.publisher}
            </p>
            <p>
              <b>Publication Date:</b> {book.publicationDate}
            </p>
          </div>
        </div>

        {/* Right Column - Description and QR Code */}
        <div className="space-y-6">
          <div>
            <div className="flex border-b border-purple-700">
              <button
                className="px-4 py-2 font-medium text-sm border-r border-gray-300 text-black hover:text-purple-700"
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              {/* <button
                className="px-4 py-2 font-medium text-sm text-black border-r border-gray-300 hover:text-purple-700"
                onClick={() => setActiveTab("highlights")}
              >
                Highligths
              </button> */}
              <button
                className="px-4 py-2 font-medium text-sm text-black hover:text-purple-700"
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    {htmlParser.parse(book.description)}
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Format:</div>
                    <div>Hardcover</div>

                    <div className="font-medium">Pages:</div>
                    <div>{book.pages}</div>

                    <div className="font-medium">Language:</div>
                    <div>{book.language}</div>

                    <div className="font-medium">ISBN:</div>
                    <div>{book.ISBN}</div>

                    <div className="font-medium">Publisher:</div>
                    <div>{book.publisher}</div>

                    <div className="font-medium">Publication Date:</div>
                    <div>{book.publicationDate}</div>
                  </div>
                </div>
              )}

              {/* {activeTab === "highlights" && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{book.highlights}</p>
                </div>
              )} */}
            </div>
          </div>

          <div className="border border-purple-600 rounded-lg overflow-hidden">
            <div className="p-3">
              <div className="text-center space-y-2">
                <h3 className="font-medium">
                  Scan to view this book information.
                </h3>
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-lg">
                    <Image src={QR} alt="QR Code" width={180} height={180} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
