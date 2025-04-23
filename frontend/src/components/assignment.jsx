"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const StudentAssignmentDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const [subjects, setSubjects] = useState([]);
  const [openSubject, setOpenSubject] = useState(null);
  const studentId = user.id; // 🔁 Replace with actual logged-in student ID

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/student/assignments/${studentId}`,{withCredentials:true});
        const grouped = groupBySubject(res.data.assignments);
        setSubjects(grouped);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }
    };
    fetchAssignments();
  }, []);

  const groupBySubject = (assignments) => {
    const subjectMap = {};

    assignments.forEach((a) => {
      const subjectName = a.subjectId?.name || "Unknown Subject";
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          name: subjectName,
          pending: 0,
          submitted: 0,
          assignments: [],
        };
      }

      // TODO: Replace with actual submission status
      const status = "Pending"; // or "Submitted" / "Evaluated"

      if (status === "Pending") subjectMap[subjectName].pending++;
      else subjectMap[subjectName].submitted++;

      subjectMap[subjectName].assignments.push({
        id: a._id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate?.slice(0, 10),
        lastSubmission: a.dueDate?.slice(0, 10),
        status,
      });
    });

    return Object.values(subjectMap);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">📚 My Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border shadow-lg transition duration-300 hover:shadow-xl">
              <CardHeader
                onClick={() =>
                  setOpenSubject(openSubject === subject.name ? null : subject.name)
                }
                className="cursor-pointer bg-muted rounded-t-lg px-4 py-3"
              >
                <CardTitle className="flex justify-between items-center text-lg font-semibold">
                  <span>{subject.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {subject.pending} Pending / {subject.submitted} Submitted
                  </span>
                </CardTitle>
              </CardHeader>

              <AnimatePresence initial={false}>
                {openSubject === subject.name && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-4 pb-4">
                      <Accordion type="single" collapsible className="w-full">
                        {subject.assignments.map((assignment, i) => (
                          <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="hover:bg-muted/60 rounded-md px-2 py-2 transition">
                              <div className="flex flex-col text-left w-full">
                                <span className="font-medium text-base">{assignment.title}</span>
                                <span className="text-sm text-muted-foreground">
                                  Due: {assignment.dueDate}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="mt-2 space-y-3">
                              <p className="text-sm text-muted-foreground">{assignment.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant={
                                    assignment.status === "Pending"
                                      ? "destructive"
                                      : assignment.status === "Submitted"
                                      ? "default"
                                      : "success"
                                  }
                                >
                                  {assignment.status}
                                </Badge>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="default">
                                    Submit
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    Raise Doubt
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Request Late
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignmentDashboard;

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   FileText,
//   ArrowLeft,
//   BookOpen,
//   Upload,
//   AlertCircle,
//   Clock,
//   BadgeCheck,
// } from "lucide-react";

// const mockSubjects = [
//   {
//     name: "Data Structures",
//     pending: 2,
//     submitted: 3,
//     assignments: [
//       {
//         id: 1,
//         title: "Linked List Assignment",
//         description: "Implement all linked list operations",
//         dueDate: "2025-04-22",
//         lastSubmission: "2025-04-25",
//         status: "Pending",
//       },
//       {
//         id: 2,
//         title: "Tree Traversals",
//         description: "Preorder, Inorder, Postorder implementation",
//         dueDate: "2025-04-20",
//         lastSubmission: "2025-04-23",
//         status: "Submitted",
//       },
//     ],
//   },
//   {
//     name: "Operating Systems",
//     pending: 1,
//     submitted: 1,
//     assignments: [
//       {
//         id: 3,
//         title: "Process Scheduling",
//         description: "FCFS, SJF, Round Robin",
//         dueDate: "2025-04-21",
//         lastSubmission: "2025-04-24",
//         status: "Pending",
//       },
//     ],
//   },
// ];

// export default function AssignmentDashboard() {
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [doubt, setDoubt] = useState("");
//   const [lateReason, setLateReason] = useState("");

//   return (
//     <div className="p-6 bg-[#f9f9ff] min-h-screen">
//       {!selectedSubject ? (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mockSubjects.map((subject, idx) => (
//             <Card
//               key={idx}
//               className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-200"
//               onClick={() => setSelectedSubject(subject)}
//             >
//               <CardContent className="p-5 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                     <BookOpen className="w-5 h-5 text-purple-600" />
//                     {subject.name}
//                   </h3>
//                 </div>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-semibold text-yellow-600">
//                     Pending:
//                   </span>{" "}
//                   {subject.pending}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-semibold text-green-600">
//                     Submitted:
//                   </span>{" "}
//                   {subject.submitted}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <Button
//             variant="ghost"
//             onClick={() => setSelectedSubject(null)}
//             className="flex items-center gap-2 text-sm"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back to Subjects
//           </Button>

//           <div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               {selectedSubject.name}
//             </h2>

//             <Tabs defaultValue="view" className="w-full">
//               <TabsList className="grid w-full grid-cols-4 bg-muted">
//                 <TabsTrigger value="view">View</TabsTrigger>
//                 <TabsTrigger value="submit">Submit</TabsTrigger>
//                 <TabsTrigger value="doubt">Raise Doubt</TabsTrigger>
//                 <TabsTrigger value="late">Request Late</TabsTrigger>
//               </TabsList>

//               {/* View Assignments */}
//               <TabsContent value="view">
//                 <div className="mt-4 space-y-4">
//                   {selectedSubject.assignments.map((a) => (
//                     <Card key={a.id}>
//                       <CardContent className="p-5 space-y-1">
//                         <div className="flex items-center justify-between">
//                           <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                             <FileText className="w-4 h-4 text-blue-600" />
//                             {a.title}
//                           </h4>
//                           <StatusBadge status={a.status} />
//                         </div>
//                         <p className="text-sm text-gray-600">
//                           {a.description}
//                         </p>
//                         <div className="text-sm text-gray-500">
//                           <span className="mr-4">
//                             <Clock className="inline-block w-4 h-4 mr-1 text-gray-400" />
//                             Due: {a.dueDate}
//                           </span>
//                           <span>
//                             <AlertCircle className="inline-block w-4 h-4 mr-1 text-gray-400" />
//                             Last Submission: {a.lastSubmission}
//                           </span>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </TabsContent>

//               {/* Submit Assignment */}
//               <TabsContent value="submit">
//                 <div className="mt-4 space-y-4">
//                   <Input placeholder="Assignment Title" />
//                   <div className="flex items-center gap-2">
//                     <Upload className="text-purple-600 w-5 h-5" />
//                     <Input type="file" className="cursor-pointer" />
//                   </div>
//                   <Button className="bg-purple-600 hover:bg-purple-700 text-white">
//                     Submit Assignment
//                   </Button>
//                 </div>
//               </TabsContent>

//               {/* Raise Doubt */}
//               <TabsContent value="doubt">
//                 <div className="mt-4 space-y-4">
//                   <Textarea
//                     placeholder="Write your doubt here..."
//                     value={doubt}
//                     onChange={(e) => setDoubt(e.target.value)}
//                   />
//                   <Button
//                     onClick={() => alert(`Doubt submitted: ${doubt}`)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white"
//                   >
//                     Submit Doubt
//                   </Button>
//                 </div>
//               </TabsContent>

//               {/* Late Submission */}
//               <TabsContent value="late">
//                 <div className="mt-4 space-y-4">
//                   <Textarea
//                     placeholder="Reason for late submission..."
//                     value={lateReason}
//                     onChange={(e) => setLateReason(e.target.value)}
//                   />
//                   <Button
//                     onClick={() =>
//                       alert(`Late request submitted: ${lateReason}`)
//                     }
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     Request Late Submission
//                   </Button>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Badge component for assignment status
// function StatusBadge({ status }) {
//   const statusColors = {
//     Pending: "bg-yellow-100 text-yellow-800",
//     Submitted: "bg-green-100 text-green-800",
//     Late: "bg-red-100 text-red-800",
//   };

//   return (
//     <span
//       className={`text-xs font-semibold px-2 py-1 rounded-md ${
//         statusColors[status] || "bg-gray-100 text-gray-700"
//       }`}
//     >
//       {status}
//     </span>
//   );
// }
