import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { Link } from "react-router-dom";

const features = [
  {
    icon: "🧑‍🏫",
    title: " Teacher Dashboard",
    description: "Manage classes, grades & reports",
    link:"/Signup",
  },
  {
    icon: "👨‍🎓",
    title: "Student Dashboard",
    description: "Track progress & feedback",
  },
  {
    icon: "📂",
    title: "Explore the Dashboard",
    description: "All tools, one smart platform.",
  },
  {
    icon: "❓",
    title: "24 x 7",
    description: "Doubt solving sessions",
  },
]

export default function Hero() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-gradient-to-r from-[#f4f4fc] to-[#eef3ff] min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left side text */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Revolutionizing{" "}Education with{" "} 
            <span className="text-[#5b3eff]">AI-Powered Teaching Assistance</span>
            
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
          Empowering Teachers, Engaging Students, and Reassuring Parents — with Smart AI-Powered Learning & Evaluation.
          </p>
          <Button className="mt-6 text-lg px-8 py-6">Get Started</Button>
        </div>

        {/* Right side illustration */}
        <div className="relative flex gap-4">
          <img
            src="/banners/images.jpeg"
            alt="Alakh Sir"
            className="w-50 h-50 rounded-full z-10"
          />
          <img
            src="/banners/students.jpg"
            alt="Student"
            className="w-50 h-50 rounded-full"
          />
          {/* You can add decorative elements here if needed */}
        </div>
      </div>

      {/* Feature Cards Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link to={item.link || "#"}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold">{item.title}</h4>
              <p className="text-gray-600 mt-1">{item.description}</p>
    </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
