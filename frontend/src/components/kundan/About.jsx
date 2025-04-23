import React from "react";

const About = () => {
  return (
    <div className="px-8 py-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">About Smart Shikshak</h1>
        <p className="text-lg text-gray-700 mb-10">
          Smart Shikshak is a comprehensive academic management platform designed to streamline daily academic activities for students, teachers, and mentors. Whether it’s tracking attendance, managing assignments, or reviewing academic reports, Smart Shikshak brings everything under one roof.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        {/* Student Section */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">🎓 For Students</h2>
          <p className="text-gray-600">
            Easily track attendance, submit assignments, check grades, and stay updated with class schedules. Your academic journey, simplified.
          </p>
        </div>

        {/* Teacher Section */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">👩‍🏫 For Teachers</h2>
          <p className="text-gray-600">
            Seamlessly create assignments, mark attendance, and manage class schedules – all in one place to boost productivity and engagement.
          </p>
        </div>

        {/* Mentor Section */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">🧠 For Mentors</h2>
          <p className="text-gray-600">
            Monitor student performance, review academic reports, and guide learners toward academic success through meaningful insights.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Smart Shikshak. All rights reserved.
      </div>
    </div>
  );
};

export default About;
