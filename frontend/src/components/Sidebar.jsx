// // src/layouts/DashboardLayout.jsx
// import { NavLink } from "react-router-dom";
// import {
//   User,
//   Book,
//   ClipboardList,
//   BarChart2,
//   Calendar,
//   Video,
//   FileText,
//   CheckCircle2,
//   CircleCheck,
//   MessageCircle,
//   LogOut,
//   GraduationCap,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card } from "@/components/ui/card";

// export default function DashboardLayout() {
//   const navItems = [
//     { label: "Profile", icon: <User />, path: "/studentdashboard/studentprofile" },
//     { label: "Study Material", icon: <Book />, path: "/studentdashboard/studyMaterial" },
//     { label: "Assignments", icon: <ClipboardList />, path: "/studentdashboard/manageassignment" },
//     { label: "Progression", icon: <BarChart2 />, path: "/studentdashboard/progressreport" },
//     { label: "Timetable", icon: <Calendar />, path: "/studentdashboard/weeklytimetable" },
//     { label: "Class Recordings", icon: <Video />, path: "/studentdashboard/classrecordings" },
//     { label: "Assessments", icon: <ClipboardList />, path: "/dashboard/assessments" },
//     { label: "Attendance Status", icon: <CheckCircle2 />, path: "/studentdashboard/studentattendace" },
//     { label: "Subject-wise Attendance", icon: <CircleCheck />, path: "/dashboard/subject-attendance" },
//     { label: "Doubts & Discussions", icon: <MessageCircle />, path: "/studentdashboard/discussdoubt" },
//   ];

//   return (
//     <Card className="fixed top-0 left-0 h-screen w-64 border-none shadow-xl bg-gradient-to-b from-purple-50 via-white to-purple-100 rounded-none z-10">
//       {/* Logo Header */}
//       <div className="flex items-center gap-3 px-5 py-3 bg-white border-b shadow-sm">
//         <GraduationCap className="w-6 h-6 text-purple-600" />
//         <span className="font-semibold text-lg text-purple-700">EduPortal</span>
//       </div>

//       {/* Scrollable Nav Items */}
//       <ScrollArea className="h-[calc(100vh-130px)] px-3 py-4">
//         <div className="space-y-1">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all 
//                  ${
//                    isActive
//                      ? "bg-purple-100 text-purple-700 font-medium border-l-4 border-purple-500"
//                      : "text-gray-700 hover:bg-purple-50"
//                  }`
//               }
//             >
//               <span className="w-5 h-5">{item.icon}</span>
//               {item.label}
//             </NavLink>
//           ))}
//         </div>
//       </ScrollArea>

//       <Separator />

//       {/* Logout Button */}
//       <div className="px-4 py-4">
//         <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:bg-red-100">
//           <LogOut className="w-4 h-4" />
//           Logout
//         </Button>
//       </div>
//     </Card>
//   );
// }
// src/layouts/DashboardLayout.jsx

import { NavLink } from "react-router-dom";
import {
  User,
  Book,
  ClipboardList,
  BarChart2,
  Calendar,
  Video,
  FileText,
  CheckCircle2,
  CircleCheck,
  MessageCircle,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function DashboardLayout() {
  const navItems = [
    { label: "Profile", icon: <User />, path: "/studentdashboard/studentprofile" },
    { label: "Study Material", icon: <Book />, path: "/studentdashboard/studyMaterial" },
    { label: "Assignments", icon: <ClipboardList />, path: "/studentdashboard/manageassignment" },
    { label: "Progression", icon: <BarChart2 />, path: "/studentdashboard/progressreport" },
    { label: "Timetable", icon: <Calendar />, path: "/studentdashboard/weeklytimetable" },
    { label: "Class Recordings", icon: <Video />, path: "/studentdashboard/classrecordings" },
    // { label: "Assessments", icon: <ClipboardList />, path: "/studentdashboard/assessments" },
    { label: "Attendance Status", icon: <CheckCircle2 />, path: "/studentdashboard/studentattendace" },
    { label: "Subject-wise Attendance", icon: <CircleCheck />, path: "/studentdashboard/subject-attendance" },
    { label: "Doubts & Discussions", icon: <MessageCircle />, path: "/studentdashboard/discussdoubt" },
  ];

  return (
    <Card className="fixed top-0 left-0 h-screen w-64 border-none shadow-xl bg-gradient-to-b from-purple-100 via-white to-purple-200 rounded-none z-10">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 px-5 py-4 mt-1 bg-white border-b shadow-sm">
        <GraduationCap className="w-6 h-6 text-purple-600" />
        <span className="font-semibold text-lg text-purple-700">EduPortal</span>
      </div>

      {/* Scrollable Nav */}
      <ScrollArea className="h-[calc(100vh-130px)] px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all 
                 ${
                   isActive
                     ? "bg-purple-100 text-purple-700 font-medium border-l-4 border-purple-500"
                     : "text-gray-700 hover:bg-purple-50"
                 }`
              }
            >
              <span className="w-5 h-5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Logout Button */}
      <div className="px-4 py-4">
        <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:bg-red-100">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </Card>
  );
}
