import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Assuming you're using Shadcn's utility setup

const categories = [
  {
    title: "NEET",
    tags: ["class 11", "class 12", "Dropper"],
    icon: "/icons/neet.png",
    link: "/neet",
    bg: "bg-pink-50",
  },
  {
    title: "IIT JEE",
    tags: ["class 11", "class 12", "Dropper"],
    icon: "/icons/jee.png",
    link: "/jee",
    bg: "bg-orange-50",
  },
  {
    title: "School Preparation",
    tags: ["class 6", "class 7", "class 8", "More"],
    icon: "/icons/school.png",
    link: "/school",
    bg: "bg-yellow-50",
  },
  {
    title: "UPSC",
    tags: [],
    icon: "/icons/upsc.png",
    link: "/upsc",
    bg: "bg-purple-50",
  },
  {
    title: "Govt Job Exams",
    tags: ["SSC", "Banking", "Teaching", "Judiciary"],
    icon: "/icons/govt.png",
    link: "/govt-jobs",
    bg: "bg-blue-50",
  },
  {
    title: "Defence",
    tags: ["NDA", "CDS", "AFCAT", "Agniveer"],
    icon: "/icons/defence.png",
    link: "/defence",
    bg: "bg-gray-50",
  },
];

export default function CategoryGrid() {
  return (
    <div className="px-4 py-10">
      <h2 className="text-2xl font-semibold text-center mb-8">
        PW is preparing students for 35+ exam categories.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "p-6 rounded-2xl shadow-md transition-all duration-300 cursor-pointer",
              cat.bg
            )}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-4">{cat.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white rounded-full text-sm border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={cat.link}
                  className="text-indigo-600 font-medium flex items-center gap-1 hover:underline"
                >
                  Explore Category <span>→</span>
                </Link>
              </div>
              <img
                src={cat.icon}
                alt={cat.title}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
