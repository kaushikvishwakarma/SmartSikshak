import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AssignmentCard from "./AssignmentCard.jsx";

const StudentAssignments = () => {
   const user = useSelector((state) => state.auth.user);
   console.log("hii");
  console.log(user);
  const studentId=user._id;
  console.log(studentId);
    
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [groupedBySubject, setGroupedBySubject] = useState({});

  useEffect(() => {
    const fetchAssignmentsAndSubmissions = async () => {
      if (!studentId) return; // 🛑 Don't fetch until user data is ready
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/student/assignments`,{withCredentials:true}),
          axios.get(`http://localhost:8080/api/student/submissions/${studentId}`,{withCredentials:true}),
        ]);
        console.log(assignmentRes,submissionRes);

        setAssignments(assignmentRes.data.assignments);
        setSubmissions(submissionRes.data.submissions);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAssignmentsAndSubmissions();
  }, [studentId]);

  useEffect(() => {
    const grouped = {};
    assignments.forEach((assignment) => {
      const subjectName = assignment.name;
      if (!grouped[subjectName]) grouped[subjectName] = [];
      grouped[subjectName].push(assignment);
    });
    setGroupedBySubject(grouped);
  }, [assignments]);

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions.find((sub) => sub.assignmentId._id === assignmentId);
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedBySubject).map(([subjectName, subjectAssignments]) => (
        <Card key={subjectName} className="shadow-md border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-indigo-700">
              All Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                submission={getSubmissionForAssignment(assignment._id)}
                studentId={studentId}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentAssignments;
