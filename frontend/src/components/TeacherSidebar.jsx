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
    { label: "Profile", icon: <User />, path: "/teacherdashboard/teacherprofile" },
    { label: "Study Material", icon: <Book />, path: "/teacherdashboard/studymaterial" },
    { label: "Assignments", icon: <ClipboardList />, path: "/teacherdashboard/assignmentmanage" },
    { label: "Assignment Assessment", icon: <ClipboardList />, path: "/teacherdashboard/assignment-assessment" },
    { label: "Progress Report", icon: <BarChart2 />, path: "/teacherdashboard/progress-report" },
    { label: "Timetable", icon: <Calendar />, path: "/teacherdashboard/weeklytimetable" },
    { label: "Class Recordings", icon: <Video />, path: "/teacherdashboard/classrecordings" },
    { label: "Register Student", icon: <FileText />, path: "/teacherdashboard/registerstudent" },
    { label: "Mark Attendance", icon: <CheckCircle2 />, path: "/teacherdashboard/teacherattendance" },
    { label: "Create Class", icon: <CircleCheck />, path: "/teacherdashboard/createclass" },
    { label: "Doubts & Discussions", icon: <MessageCircle />, path: "/teacherdashboard/doubtsanddiscussions" },
    { label: "Create Teacher", icon: <MessageCircle />, path: "/teacherdashboard/createteacher" },
  ];

  return (
    <Card className="fixed top-0 left-0 h-screen w-64 border-none shadow-xl bg-gradient-to-b from-purple-100 via-white to-purple-200 rounded-none z-10">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 px-5 py-4 mt-1 bg-white border-b shadow-sm">
        <GraduationCap className="w-6 h-6 text-purple-600" />
        <span className="font-semibold text-lg text-purple-700">EduPortal</span>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-700 hover:text-purple-700 hover:bg-purple-50"
              asChild
            >
              <a href={item.path}>
                {item.icon}
                {item.label}
              </a>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

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
//     { label: "Profile", icon: <User />, path: "/teacherdashboard/teacherprofile" },
//     { label: "Study Material", icon: <Book />, path: "/teacherdashboard/studymaterial" },
//     { label: "Assignments", icon: <ClipboardList />, path: "/teacherdashboard/assignmentmanage" },
//     { label: "Progress Report", icon: <BarChart2 />, path: "/teacherdashboard/progress-report" },
//     { label: "Timetable", icon: <Calendar />, path: "/teacherdashboard/weeklytimetable" },
//     { label: "Class Recordings", icon: <Video />, path: "/teacherdashboard/classrecordings" },
//     { label: "Register Student", icon: <FileText />, path: "/teacherdashboard/registerstudent" },
//     { label: "Assessments", icon: <ClipboardList />, path: "/teacherdashboard/teacherattendance" },
//     { label: "Mark Attendance", icon: <CheckCircle2 />, path: "/teacherdashboard/teacherattendance" },
//     { label: "Create Class", icon: <CircleCheck />, path: "/teacherdashboard/createclass" },
//     { label: "Doubts & Discussions", icon: <MessageCircle />, path: "/teacherdashboard/doubtsanddiscussions" },
//     { label: "Create Teacher", icon: <MessageCircle />, path: "/teacherdashboard/createteacher" },
//   ];

//   return (
//     <Card className="fixed top-0 left-0 h-screen w-64 border-none shadow-xl bg-gradient-to-b from-blue-50 via-white to-blue-100 rounded-none z-10">
//       {/* Logo & Title */}
//       <div className="flex items-center gap-3 px-5 py-4 bg-white border-b shadow-sm">
//         <GraduationCap className="w-6 h-6 text-blue-600" />
//         <span className="font-semibold text-lg text-blue-700">EduPortal</span>
//       </div>

//       {/* Scrollable Nav */}
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
//                      ? "bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-500"
//                      : "text-gray-700 hover:bg-blue-50"
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
