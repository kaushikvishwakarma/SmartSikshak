import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
//kundan added
import About from "./About";
import { Link } from "react-router-dom";


import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { setAuthUser } from "@/redux/authSlice";

const roleBasedCategories = {
  student: [
    {
      title: "Assignments",
      description: "Submit assignments and check results.",
      subcategories: [
        { label: "Submit Assignment", link: "/student/submit-assignment", icon: "\uD83D\uDCE4" },
        { label: "View Grades", link: "/student/view-grades", icon: "\uD83D\uDCC8" },
      ],
    },
    {
      title: "Attendance",
      description: "Track attendance for each subject.",
      subcategories: [
        { label: "Subject-wise", link: "/student/subject-attendance", icon: "\uD83D\uDCDA" },
        { label: "Total", link: "/student/total-attendance", icon: "\uD83D\uDCCA" },
      ],
    },
    {
      title: "Schedule",
      description: "Stay updated with your classes.",
      subcategories: [
        { label: "Class Timetable", link: "/student/timetable", icon: "\uD83D\uDCC5" },
        { label: "Extra Classes", link: "/student/extra-classes", icon: "\uD83C\uDD95" },
      ],
    },
  ],
  teacher: [
    {
      title: "Assignments",
      description: "Create and review assignments.",
      subcategories: [
        { label: "Create Assignment", link: "/teacher/create-assignment", icon: "\u270D\uFE0F" },
        { label: "Review Submissions", link: "/teacher/review-submissions", icon: "\u2705" },
      ],
    },
    {
      title: "Attendance",
      description: "Mark and monitor attendance.",
      subcategories: [
        { label: "Mark Attendance", link: "/teacher/mark-attendance", icon: "\uD83D\uDCCB" },
        { label: "View Records", link: "/teacher/view-attendance", icon: "\uD83D\uDCCA" },
      ],
    },
    {
      title: "Schedule",
      description: "Organize your teaching schedule.",
      subcategories: [
        { label: "Manage Timetable", link: "/teacher/manage-timetable", icon: "\uD83D\uDCC3" },
        { label: "Extra Classes", link: "/teacher/extra-classes", icon: "\u2795" },
      ],
    },
  ],
  mentor: [
    {
      title: "Reports",
      description: "Academic progress and milestones.",
      subcategories: [
        { label: "Academic Reports", link: "/mentor/academic-reports", icon: "\uD83D\uDCC4" },
        { label: "Achievements", link: "/mentor/achievements", icon: "\uD83C\uDFC6" },
      ],
    },
    {
      title: "Monitoring",
      description: "Monitor student activities.",
      subcategories: [
        { label: "Student Overview", link: "/mentor/students", icon: "\uD83D\uDC68\u200D\uD83C\uDF93" },
        { label: "Zoom Classes", link: "/mentor/zoom-classes", icon: "\uD83D\uDCF9" },
      ],
    },
  ],
};

export default function Header() {
  const dispatch=useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const role = user?.usertype || "student";
  const categories = roleBasedCategories[role];
  const [open,setOpen]=useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const logoutHandler = async () => {
    try {
        const res = await axios.delete('http://localhost:8080/api/users/logout', { withCredentials: true });

            dispatch(setAuthUser(null));
            
           
    } catch (error) {
        console.log(error);
    }
}

  useEffect(() => {
    setActiveIndex(0);
  }, [role]);

  return (
    <header className="w-full shadow-sm border-b sticky top-0 bg-white z-50">
      <div className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
        <Link to="/">
          <div className="w-11 h-11 flex items-center justify-center rounded-full bg-blue-100 text-white font-semibold text-lg">
          
            <img
            src="/banners/logos.png"
            alt="Alakh Sir"
            className="w-10 h-10 rounded-full object-cover"
          />
          </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="font-medium text-indigo-600 flex items-center gap-1 px-4 py-2 border border-indigo-600 rounded-md hover:bg-indigo-50 transition">
              All Features <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[850px] p-4 grid grid-cols-2 gap-6 bg-white shadow-xl border rounded-md" align="start">
              <div className="space-y-2 text-sm">
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${idx === activeIndex ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50"}`}
                  >
                    <p className="font-semibold text-gray-900">{cat.title}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-tight">{cat.description}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="wait">
                  {categories[activeIndex].subcategories.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="p-4 rounded-md bg-white border shadow-sm flex items-center gap-2 hover:bg-indigo-50 cursor-pointer"
                      onClick={() => navigate(item.link)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="flex items-center gap-8 px-6 py-3">
  <Link
    to="/about"
    className="text-gray-700 font-medium text-sm hover:text-indigo-600 transition duration-200 relative group"
  >
    About Us
    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
  </Link>

  <Link
    to="/help"
    className="text-gray-700 font-medium text-sm hover:text-indigo-600 transition duration-200 relative group"
  >
    Help
    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
  </Link>

  <Link
    to="/contact"
    className="text-gray-700 font-medium text-sm hover:text-indigo-600 transition duration-200 relative group"
  >
    Contact
    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
  </Link>
</nav>


        </div>

        {!user ? (
          <Button onClick={() => navigate("/register")} className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-md">
            Login / Register
          </Button>
        ) : (
          <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-100 px-2 py-1 rounded-md"
          >
            <img
              src={user?.profilePicture || "/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
            <span className="font-medium text-sm transition-all duration-300">{user?.name}</span>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border w-40 z-50"
              >
                <div className="flex flex-col py-2">
                  <button
                    onClick={() => {
                      navigate("/teacherdashboard/teacherprofile");
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      logoutHandler();
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-left text-sm hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
          
        )}
      </div>
    </header>
  );
}

// import React, { useState, useEffect } from "react";
// import { ChevronDown } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// const roleBasedCategories = {
//   student: [
//     {
//       title: "Assignments",
//       subcategories: [
//         { label: "Submit Assignment", link: "/student/submit-assignment", icon: "📤" },
//         { label: "View Grades", link: "/student/view-grades", icon: "📈" },
//       ],
//     },
//     {
//       title: "Attendance",
//       subcategories: [
//         { label: "Subject-wise", link: "/student/subject-attendance", icon: "📚" },
//         { label: "Total", link: "/student/total-attendance", icon: "📊" },
//       ],
//     },
//     {
//       title: "Schedule",
//       subcategories: [
//         { label: "Class Timetable", link: "/student/timetable", icon: "📅" },
//         { label: "Extra Classes", link: "/student/extra-classes", icon: "🆕" },
//       ],
//     },
//   ],
//   teacher: [
//     {
//       title: "Assignments",
//       subcategories: [
//         { label: "Create Assignment", link: "/teacher/create-assignment", icon: "✍️" },
//         { label: "Review Submissions", link: "/teacher/review-submissions", icon: "✅" },
//       ],
//     },
//     {
//       title: "Attendance",
//       subcategories: [
//         { label: "Mark Attendance", link: "/teacher/mark-attendance", icon: "📋" },
//         { label: "View Records", link: "/teacher/view-attendance", icon: "📊" },
//       ],
//     },
//     {
//       title: "Schedule",
//       subcategories: [
//         { label: "Manage Timetable", link: "/teacher/manage-timetable", icon: "🗓️" },
//         { label: "Extra Classes", link: "/teacher/extra-classes", icon: "➕" },
//       ],
//     },
//   ],
//   mentor: [
//     {
//       title: "Reports",
//       subcategories: [
//         { label: "Academic Reports", link: "/mentor/academic-reports", icon: "📄" },
//         { label: "Achievements", link: "/mentor/achievements", icon: "🏆" },
//       ],
//     },
//     {
//       title: "Monitoring",
//       subcategories: [
//         { label: "Student Overview", link: "/mentor/students", icon: "👨‍🎓" },
//         { label: "Zoom Classes", link: "/mentor/zoom-classes", icon: "📹" },
//       ],
//     },
//   ],
// };

// export default function Header() {
//   const user = useSelector((state) => state.auth.user);
//   const navigate = useNavigate();
//   const role = user?.usertype || "student";
//   const categories = roleBasedCategories[role];

//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     setActiveIndex(0);
//   }, [role]);

//   return (
//     <header className="w-full shadow-sm border-b sticky top-0 bg-white z-50">
//       <div className="w-full flex items-center justify-between px-6 py-4">
//         <div className="flex items-center space-x-6">
//           <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white font-semibold text-lg">
//             PW
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger className="font-medium text-indigo-600 flex items-center gap-1 px-4 py-2 border border-indigo-600 rounded-md hover:bg-indigo-50 transition">
//               All Features <ChevronDown className="w-4 h-4" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-[800px] p-4 grid grid-cols-2 gap-6 bg-white shadow-xl border rounded-md" align="start">
//               <div className="space-y-4 text-sm">
//                 {categories.map((cat, idx) => (
//                   <div
//                     key={idx}
//                     className={`hover:text-indigo-600 cursor-pointer ${idx === activeIndex ? "text-indigo-600 font-semibold" : ""}`}
//                     onMouseEnter={() => setActiveIndex(idx)}
//                   >
//                     <p className="font-semibold">{cat.title}</p>
//                   </div>
//                 ))}
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <AnimatePresence mode="wait">
//                   {categories[activeIndex].subcategories.map((item, idx) => (
//                     <motion.div
//                       key={item.label}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2, delay: idx * 0.05 }}
//                       className="p-4 rounded-md bg-white border shadow-sm flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => navigate(item.link)}
//                     >
//                       <span className="text-xl">{item.icon}</span>
//                       <span className="font-medium text-sm">{item.label}</span>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <nav className="flex items-center space-x-6 text-sm font-medium text-gray-800">
//             <a href="#">Vidyapeeth</a>
//             <a href="#">Upskilling</a>
//             <a href="#">PW Store</a>
//             <a href="#">Test Series</a>
//             <a href="#">CuriousJr</a>
//             <a href="#">Power Batch</a>
//           </nav>
//         </div>

//         {!user ? (
//           <Button onClick={() => navigate("/register")} className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-md">
//             Login / Register
//           </Button>
//         ) : (
//           <div className="relative">
//             <div
//               className="flex items-center gap-2 cursor-pointer transition-all hover:bg-gray-100 px-2 py-1 rounded-md"
//               onClick={() => navigate("/profile")}
//             >
//               <img
//                 src={user?.profilePicture || "/default-avatar.png"}
//                 alt="avatar"
//                 className="w-8 h-8 rounded-full border border-gray-300"
//               />
//               <span className="font-medium text-sm transition-all duration-300">{user?.name}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
