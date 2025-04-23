// src/components/Help.jsx

import React from "react";

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Help & Support</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">📌 How to Use the Platform?</h2>
        <p className="text-gray-700">
          Navigate through your dashboard to access features like assignments, timetable,
          and attendance. Use the sidebar for quick access to different sections.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">👨‍🏫 For Students</h2>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Go to Student Dashboard to view and submit assignments.</li>
          <li>Check the Weekly Timetable to stay updated with classes.</li>
          <li>Update your profile anytime from the Student Profile section.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">👩‍🏫 For Teachers</h2>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Manage your classes and assignments from the Teacher Dashboard.</li>
          <li>Use the Timetable creator to set weekly schedules.</li>
          <li>Track attendance using the Attendance Panel.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">💬 Need more help?</h2>
        <p className="text-gray-700">
          If you're facing any issues, feel free to contact us at{" "}
          <a href="mailto:support@smartshikshak.com" className="text-indigo-600 font-medium">
            support@smartshikshak.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default Help;
