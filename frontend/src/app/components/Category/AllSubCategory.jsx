"use client";
import { serverUrl } from "@/app/redux/features/axiosInstance";
import { fetchSubCategories } from "@/app/redux/features/getAllCategory/categorySlice";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CallBackImg from "../../Images/DBS/DBSLOGO.jpg";

export default function AllSubCategory() {
  const dispatch = useDispatch();
  const param = useParams();
  const categoryId = param.id;
  const { subCategories, loading, error } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchSubCategories(categoryId));
  }, [dispatch, categoryId]);

  console.log("SubCategories:", categoryId);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto grid-cols-2 md:grid-cols-4 gap-4 p-4">
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
        Error loading SubCategories
      </div>
    );
  }

  console.log("SubCategories:", subCategories);

  return (
    <section className="w-full py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by {subCategories[0]?.Parent_name?.Parent_name}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of books across different SubCategories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {subCategories.map((category) => (
            <Link
              key={category._id}
              href={`/pages/shop/productBysubcategory/${category._id}`}
              passHref
              className="group block bg-purple-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative w-full h-40 sm:h-56 lg:h-55">
                <Image
                  src={
                    category.categoryImage
                      ? `${serverUrl}/public/image/${category.categoryImage}`
                      : CallBackImg
                  }
                  alt={category.SubCategoryName}
                  fill
                  className="object-fill group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Name */}
              <div className="p-4">
                <h3 className="text-sm md:text-md font-semibold text-white text-center">
                  {category.SubCategoryName}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
