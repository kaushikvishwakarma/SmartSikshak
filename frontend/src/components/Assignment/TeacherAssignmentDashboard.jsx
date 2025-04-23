import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import CreateAssignmentDialog from './TeacherCreateAssignment.jsx';
import SubmissionListDialog from './SubmissionDialog.jsx';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = async () => {
    const res = await axios.get('http://localhost:8080/api/teacher/assignments', {
      withCredentials: true,
    });
    setAssignments(res.data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const cardColors = [
    'border-blue-500 bg-blue-50',
    'border-green-500 bg-green-50',
    'border-yellow-500 bg-yellow-50',
    'border-purple-500 bg-purple-50',
    'border-pink-500 bg-pink-50',
    'border-red-500 bg-red-50',
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">📚 Your Assignments</h1>
          <p className="text-muted-foreground text-sm">
            View and manage assignments you've created for your classes.
          </p>
        </div>
        <CreateAssignmentDialog onCreate={fetchAssignments} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment, index) => {
          const colorClass = cardColors[index % cardColors.length];

          return (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`hover:shadow-2xl transition-all rounded-2xl border-2 ${colorClass}`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="space-y-1">
                    <h2 className="font-semibold text-xl line-clamp-2">{assignment.title}</h2>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="text-sm flex flex-col gap-1 text-muted-foreground">
                    <p><strong>Subject:</strong> {assignment.subjectId?.name || '—'}</p>
                    <p><strong>Class:</strong> {assignment.classId?.className} {assignment.classId?.section}</p>
                    <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}</p>
                  </div>

                  <div className="pt-4">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          View Submissions
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[90vh] overflow-y-auto">
                        <div className="p-4">
                          <SubmissionListDialog assignment={selectedAssignment} />
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherAssignments;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
// import CreateAssignmentDialog from './TeacherCreateAssignment.jsx';
// import SubmissionListDialog from './SubmissionDialog.jsx';

// const TeacherAssignments = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);

//   const fetchAssignments = async () => {
//     const res = await axios.get('http://localhost:8080/api/teacher/assignments',{withCredentials:true});
//     setAssignments(res.data);
//   };

//   useEffect(() => {
//     fetchAssignments();
//   }, []);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Your Assignments</h1>
//         <CreateAssignmentDialog onCreate={fetchAssignments} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {assignments.map((assignment) => (
//           <Card key={assignment._id} className="hover:shadow-xl transition-all">
//             <CardContent className="p-4 space-y-2">
//               <h2 className="font-semibold text-xl">{assignment.title}</h2>
//               <p className="text-muted-foreground">{assignment.description}</p>
//               <p className="text-sm text-muted-foreground">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>

//               <div className="flex gap-2 pt-2">
//                 <Drawer>
//                   <DrawerTrigger asChild>
//                     <Button variant="outline" onClick={() => setSelectedAssignment(assignment)}>Submissions</Button>
//                   </DrawerTrigger>
//                   <DrawerContent>
//                     <SubmissionListDialog assignment={selectedAssignment} />
//                   </DrawerContent>
//                 </Drawer>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherAssignments;