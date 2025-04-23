// src/components/CategoryGridAlt.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";


const categories = [
  {
    title: "AI Answer Evaluation",
    description: "Evaluate answers, give feedback, and assign marks with AI.",
    icon: "/banners/aianswer.jpeg",
    link: "/evaluation",
    accent: "border-blue-500 bg-blue-100 text-blue-600",
  },
  {
    title: "QR Attendance",
    description: "Mark attendance instantly with QR scanning.",
    icon: "/banners/attendence.png",
    link: "/attendance",
    accent: "border-emerald-500 bg-emerald-100 text-emerald-600",
  },
  {
    title: "Student Dashboard",
    description: "View reports, feedback, and performance charts.",
    icon: "/banners/student.jpeg",
    link: "/StudentDashboard",
    accent: "border-amber-500 bg-amber-100 text-amber-600",
  },
  {
    title: "Teacher Dashboard",
    description: "Manage classes, track attendance, and view analytics.",
    icon: "/banners/teacher.png",
    link: "/Signup",
    accent: "border-violet-500 bg-violet-100 text-violet-600",
  },
  {
    title: "Quiz & Exams",
    description: "Create and auto-evaluate quizzes and exams.",
    icon: "/banners/quiz.webp",
    link: "/quiz",
    accent: "border-rose-500 bg-rose-100 text-rose-600",
  },
  {
    title: "Reports & Analytics",
    description: "Download PDF reports and view performance insights.",
    icon: "/banners/analytics.png",
    link: "/progression",
    accent: "border-gray-400 bg-gray-100 text-gray-700",
  },
];

export default function CategoryGridAlt() {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-12 bg-[#f9fafb]">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-800">
        Explore Core Modules of the Assistant
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={uuidv4()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.00002, delay: index * 0.01 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(cat.link)}
            className={`group border-l-4 ${cat.accent} bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 cursor-pointer`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-2 rounded-lg ${cat.accent.split(" ")[1]}`}>
                <img src={cat.icon} alt={cat.title} className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600 hover:underline">
              Explore Module →
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}