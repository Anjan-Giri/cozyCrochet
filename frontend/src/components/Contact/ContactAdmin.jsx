import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { BiSupport } from "react-icons/bi";
import { FaRegEnvelope, FaRegQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";

const ContactAdmin = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  // Contact form categories
  const categories = [
    "General Inquiry",
    "Technical Support",
    "Billing Issue",
    "Account Help",
    "Report a Problem",
    "Feature Request",
    "Other",
  ];

  // Form data for authenticated users
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "General Inquiry",
  });

  // Form data for non-authenticated users
  const [guestFormData, setGuestFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "General Inquiry",
  });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${server}/contact/admin-contact-info`
        );
        setAdminInfo(data.adminInfo);
        setLoading(false);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch admin information"
        );
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (isAuthenticated) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setGuestFormData({
        ...guestFormData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isAuthenticated) {
        // Submit authenticated user form
        const { data } = await axios.post(
          `${server}/contact/contact-admin`,
          formData,
          { withCredentials: true }
        );
        toast.success(data.message);
        setFormData({
          subject: "",
          message: "",
          category: "General Inquiry",
        });
      } else {
        // Submit guest form
        const { data } = await axios.post(
          `${server}/contact/contact-admin-public`,
          guestFormData
        );
        toast.success(data.message);
        setGuestFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "General Inquiry",
        });
      }

      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      setLoading(false);
    }
  };

  if (loading && !adminInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-6xl bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <div className="bg-[#fce1e6] p-3 rounded-full">
              <BiSupport size={24} color="#e94560" />
            </div>
            <h1 className="pl-3 text-2xl font-bold text-gray-800">
              Contact Us (cozyCrochet)
            </h1>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gray-50 p-4 rounded-md mt-6 text-gray-700">
          <p className="text-center">
            Have questions, feedback or need assistance? Our admin team is here
            to help!
          </p>
        </div>

        {/* Admin Contact Card */}
        {adminInfo && (
          <div className="bg-white rounded-lg border-2 border-[#50007a] p-4 my-6">
            <div className="flex items-center mb-3">
              <div className="bg-[#fce1e6] p-2 rounded-full mr-3">
                <FaRegEnvelope size={20} color="#e94560" />
              </div>
              <h5 className="text-xl font-semibold text-gray-800">
                {adminInfo.name} - cozyCrochet Admin
              </h5>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-50 p-3 rounded-md w-full border-l-4 border-[#fce1e6]">
                <p className="text-gray-600">
                  Fill out the form below to contact our admin team. We'll
                  respond to your inquiry as soon as possible.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            {/* Guest Contact Information (for non-authenticated users) */}
            {!isAuthenticated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                    value={guestFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                    value={guestFormData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Message Fields */}
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                value={
                  isAuthenticated ? formData.category : guestFormData.category
                }
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject <span className="text-[#e94560]">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                value={
                  isAuthenticated ? formData.subject : guestFormData.subject
                }
                onChange={handleInputChange}
                required
                placeholder="How can we help you?"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message <span className="text-[#e94560]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#50007a] focus:border-[#50007a]"
                rows="6"
                value={
                  isAuthenticated ? formData.message : guestFormData.message
                }
                onChange={handleInputChange}
                required
                placeholder="Please provide details about your inquiry..."
              ></textarea>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex items-center mb-3">
                <FaRegQuestionCircle
                  className="mr-2 text-[#e94560]"
                  size={18}
                />
                <h5 className="font-medium text-gray-800">Before You Submit</h5>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                • For shop-specific inquiries or product questions, please use
                the "Contact Shop" form.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                • For order issues, please include your order number if
                available.
              </p>
              <p className="text-sm text-gray-600">
                • Response time is typically within 24-48 hours during business
                days.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-[#50007a] text-white rounded-md font-semibold hover:bg-[#e94560] transition duration-300 shadow-md"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>

            {/* Contact Info Message */}
            <div className="mt-6 text-center">
              {isAuthenticated && (
                <p className="text-sm text-gray-600 mb-1">
                  Your message will be sent using your account email:{" "}
                  <span className="font-medium">{user.email}</span>
                </p>
              )}
              <p className="text-sm text-gray-600">
                <span className="text-[#e94560]">*</span> Our admin team will
                reply directly to your email address
              </p>
            </div>
          </form>
        </div>

        {/* Link to Contact Shop */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Looking to contact a specific shop instead?{" "}
            <span className="text-[#50007a] font-medium hover:text-[#e94560]">
              Use the first form instead!!!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
