
import { Outlet } from "react-router-dom";
import Sidebar from "./TeacherSidebar.jsx";
import Header from "./Header.jsx";

export default function TeacherDashboardLayout() {
  return (
    <>
      <Header />
      <Sidebar /> {/* Fixed positioned */}
      <main className="pl-64 pt-4 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </>
  );
}// import { Outlet } from "react-router-dom"
// import Sidebar from "./TeacherSidebar.jsx"
// import Header from "./Header.jsx"

// export default function TeacherDashboardLayout() {
//   return (
//     <>
//      <Header/>
//     <div className="flex min-h-screen">
//       <Sidebar />
//       <main className="flex-1 p-4">
//         <Outlet />
//       </main>
//     </div>
//     </>
   
//   )
// }
