import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { toast } from "react-toastify";
import axiosInstance from "../../services/FetchNodeServices";

const Header = () => {
  const navigate = useNavigate();
  const [sidetoggle, setSideToggle] = useState(false);

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle);
  };

  const handleLogout = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to logout?");
      if (!confirm) {
        return;
      }
      const response = await axiosInstance.post("/api/v1/auth/logout");
      if (response.status === 200) {
        toast.success("Logout successfully!");
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("logout error", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "fa-solid fa-gauge" },
    { to: "/all-orders", label: "Manage Orders", icon: "fa-solid fa-truck" },
    {
      to: "/all-category",
      label: "All Category",
      icon: "fa-solid fa-sitemap",
    },
    {
      to: "/all-sub-category",
      label: "All Sub Category",
      icon: "fa-solid fa-layer-group",
    },
     {
      to: "/all-level-images",
      label: "All Level Images",
      icon: "	fa-solid fa-signal",
    },
    { to: "/all-products", label: "All Products", icon: "fa-solid fa-cubes" },
    // { to: "/all-videos", label: "All Videos", icon: "fa-solid fa-video" },
    { to: "/all-banners", label: "Manage Banners", icon: "fa-solid fa-images" },

    // { to: "/all-color", label: "Manage Color", icon: "fa-solid fa-heartbeat" },
    { to: "/all-coupon", label: "Manage Coupons", icon: "fa-solid fa-tag" },
    { to: "/all-users", label: "All Users", icon: "fa-solid fa-users" },
    {
      to: "/all-inquiries",
      label: "All Inquiries",
      icon: "fa-solid fa-envelope-open-text",
    },
    
    // { to: "/all-become-franchise", label: "Franchise Requests", icon: "fa-solid fa-handshake" },
    // { to: "/all-wishlist", label: "manage user wishlist", icon: "fa-solid fa-brain" },
    // { to: "/all-rewardPoint", label: "Manage Reward Point", icon: "fa-solid fa-coins" },
    // { to: "/all-videos", label: "Manage Videos", icon: "fa-solid fa-video" },

    // { to: "/all-reviews", label: "All Reviews", icon: "fa-solid fa-star" },
    // { to: "/all-blogs", label: "All Blogs", icon: "fa-solid fa-pen" },
    // { to: "/news-letter", label: "News Letter", icon: "fa-solid fa-newspaper" },
  ];

  return (
    <header>
      <div className="top-head">
        <div className="right">
          <Link className="text-white text-decoration-none" to="/">
            <h2>Delhi Book Store Admin Panel</h2>
          </Link>
          <div className="bar" onClick={handletoggleBtn}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
        <div className="left">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fa-solid fa-globe"></i> Go To Website
          </a>
          <div className="logout" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>
      </div>

      <div className={`rightNav ${sidetoggle ? "active" : ""}`}>
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to} onClick={handletoggleBtn}>
                <i className={item.icon}></i> {item.label}
              </Link>
            </li>
          ))}
          <div className="logout" onClick={handleLogout}>
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Header;
