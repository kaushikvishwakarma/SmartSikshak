// src/components/Contact.jsx

import React from "react";

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">📞 Contact Us</h1>

      <p className="text-gray-700 mb-8">
        Got questions or feedback? We'd love to hear from you. Fill out the form or reach out
        to us directly via email or phone.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">📧 Email</h3>
            <p className="text-gray-600">support@smartshikshak.com</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">📞 Phone</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">📍 Address</h3>
            <p className="text-gray-600">Smart Shikshak HQ, IIT Madras, Chennai, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white p-6 rounded-xl shadow-lg space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
