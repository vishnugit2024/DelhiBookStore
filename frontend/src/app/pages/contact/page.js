"use client";
import React, { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from "lucide-react";
import Webfeature from "@/app/components/Webfeature/Webfeature";
import axiosInstance from "@/app/redux/features/axiosInstance";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/contact-form/send-contact-form",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);
      toast.success("Your message has been sent successfully!");
      // Reset form if successful
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 text-gray-700">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium uppercase text-gray-500">
          Contact With Us
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
          You can ask us questions
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Contact us for all your questions and opinions, or you can solve your
          problems in a shorter time with our contact offices.
        </p>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* Contact Info + Form Section */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Our Offices</h2>
          <p className="mb-6 text-gray-600">
            On dekande mydturad mora även om skurkstat. Semirade timaheten rena.
            Radiogen pasam inte loba även om prerade i garanterad traditionell
            specialitet till bebel. Ev is sönde.
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Office 1 */}
            <div className="mb-8 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span>United States</span>
              </div>
              <h3 className="text-lg font-semibold">United States Office</h3>
              <p className="text-gray-600">
                205 Middle Road, 2nd Floor, New York
              </p>
              <p className="font-medium mt-1">+02 1234 567 88</p>
              <p className="text-sm">info@example.com</p>
            </div>

            {/* Office 2 */}
            <div className="mb-8 flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span>Munich</span>
              </div>
              <h3 className="text-lg font-semibold">Munich States Office</h3>
              <p className="text-gray-600">
                205 Middle Road, 2nd Floor, New York
              </p>
              <p className="font-medium mt-1">+5 456 123 22</p>
              <p className="text-sm">contact@example.com</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div>
          <p className="mb-6 text-gray-600">
            On dekande mydturad mora även om skurkstat. Semirade timaheten rena.
            Radiogen pasam inte loba även om prerade i garanterad traditionell
            specialitet till bebel.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name *"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email *"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Your phone number *"
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              rows={5}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md transition flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Social Icons */}
      <div className="mt-16 flex items-center gap-4 text-gray-600 text-sm">
        <span>Follow us:</span>
        <a
          href="#"
          className="text-white bg-blue-600 p-2 rounded-full hover:opacity-80"
        >
          <Facebook className="w-4 h-4" />
        </a>
        <a
          href="#"
          className="text-white bg-sky-400 p-2 rounded-full hover:opacity-80"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href="#"
          className="text-white bg-pink-500 p-2 rounded-full hover:opacity-80"
        >
          <Instagram className="w-4 h-4" />
        </a>
        <a
          href="#"
          className="text-white bg-blue-800 p-2 rounded-full hover:opacity-80"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>

      <Webfeature />
    </div>
  );
};

export default Contact;
