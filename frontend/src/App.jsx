import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup.jsx'
import MainLayout from './components/MainLayout.jsx'
import Home from './components/Home.jsx'
import StudentDashboard from './components/Studentdashboard.jsx'
import StudentProfile from './components/StudentProfile.jsx'
import AssignmentDashboard from './components/assignment.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import CreateTimetable from './components/CreateTimetable'
import StudentWeeklyTimetable from './components/WeeklyTimetable'
import RegisterStudentPage from './components/RegisterStudent.jsx'
import TeacherAttendanceUI from './components/TeacherAttendace.jsx'
import RegisterTeacherPage from './components/RegisterTeacher.jsx'
import ClassManagement from './components/class/Classmanagement.jsx'
import TeacherAssignments from './components/Assignment/TeacherAssignmentDashboard.jsx';
import StudentAssignments from './components/studentassignment/StudentAssignments.jsx';
import TeacherDashboardLayout from './components/TeacherDashboardLayout.jsx'
import TeacherDashboard from './components/TeacherDashboard.jsx'
import AttendanceManager from './components/AttandanceManager.jsx'
import AttendanceTable from './components/StudentAttendance.jsx'
import About from './components/kundan/About.jsx'
import Help from './components/kundan/Help.jsx'
import Error from './components/kundan/ErrorPage'
import Contact from './components/kundan/Contact'
import ClassRecordings from './components/ClassRecordings.jsx'
import DoubtsAndDiscussions from './components/DoubtsAndDiscussions.jsx'
import ProgressReport from './components/ProgressReport.jsx'
import StudyMaterial from './components/studyMaterial.jsx'
import SubjectAttendance from './components/SubjectAttendance.jsx'
import AssignmentAssessment from './components/AssignmentAssessment.jsx'
import StudentAssignmentAssessment from './components/StudentAssignmentAssessment.jsx'
// import TeacherAssignment from './components/TeacherAssignment.jsx'
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // only for homepage etc.
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/register",
    element: <Signup />,
  },
 
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  
  {
    path: "/contact",
    element: <Contact />,
  },
 

  // {path:'/createassignment',element:<TeacherAssignment/>},
  {
    path: "/studentdashboard",
    element: <DashboardLayout />, // 👈 with its own Header + Sidebar
    
    children: [
      {
        index: true,
        element: <StudentDashboard />,
      },
      {
        path: "studentprofile",
        element: <StudentProfile />,
      },
      {
        path: "studentassignment",
        element: <AssignmentDashboard />,
      },
      
      {
        path: "studentattendace",
        element: <AttendanceTable />
      },
      {
        path: "subject-attendance",
        element: <SubjectAttendance />
      },
      {
        path: "weeklytimetable",
        element: <StudentWeeklyTimetable />
      },
       {
    path: "studyMaterial",
    element: <StudyMaterial />,
  },
  {
    path: "progressreport",
    element: <ProgressReport />,
  },
  {
    path: "discussdoubt",
    element: <DoubtsAndDiscussions />,
  },
  {
    path: "classrecordings",
    element: <ClassRecordings />,
  },
  {
    path: "manageassignment",
    element: <StudentAssignments />
  },
  {
    path: "assessments",
    element: <StudentAssignmentAssessment />
  },

    ],
  },
  {
    path: "/teacherdashboard",
    element: <TeacherDashboardLayout />, // 👈 with its own Header + Sidebar
    
    children: [
      {
        index: true,
        element: <TeacherDashboard />,
      },
      {path:'viewattendance',element:<AttendanceManager/>},
      { path: "createtimetable", element: <CreateTimetable /> },
      { path: 'registerstudent', element: <RegisterStudentPage /> },
      { path: 'teacherattendance', element: <TeacherAttendanceUI /> },
      { path: 'createteacher', element: <RegisterTeacherPage /> },
      { path: 'createclass', element: <ClassManagement /> },
      { path: 'assignmentmanage', element: <TeacherAssignments /> },
      { path: 'assignment-assessment', element: <AssignmentAssessment /> },
      {
        path: "weeklytimetable",
        element: <StudentWeeklyTimetable />
      },
      {
        path: "teacherprofile",
        element: <StudentProfile />,
      },
      {
        path: "studymaterial",
        element: <StudyMaterial />,
      },
      {
        path: "progress-report",
        element: <ProgressReport />,
      },
      {
        path: "doubtanddiscussions",
        element: <DoubtsAndDiscussions />,
      },
      {
        path: "classrecordings",
        element: <ClassRecordings />,
      },
      {
        path: "progress-report",
        element: <ProgressReport />,
      },
     
    ],
  },
]);

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )

}
export default App