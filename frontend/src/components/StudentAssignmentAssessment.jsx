import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { useSelector } from 'react-redux';

const StudentAssignmentAssessment = () => {
  const user = useSelector((state) => state.auth.user);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/student/assignments', {
          withCredentials: true,
        });
        setAssignments(res.data.assignments);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    };

    if (user?._id) {
      fetchAssignments();
    }
  }, [user]);

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/student/submissions/${user._id}`,
        { withCredentials: true }
      );
      const filteredSubmissions = res.data.submissions.filter(
        sub => sub.assignmentId._id === assignmentId
      );
      setSubmissions(filteredSubmissions);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">Assignment Assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Assignment Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select onValueChange={(value) => {
              const assignment = assignments.find(a => a._id === value);
              setSelectedAssignment(assignment);
              fetchSubmissions(value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment._id} value={assignment._id}>
                    {assignment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          {selectedAssignment && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={submission.status === 'evaluated' ? 'success' : 'warning'}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{submission.evaluation?.score || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setOpenDialog(true);
                          }}
                        >
                          {submission.status === 'evaluated' ? 'View Evaluation' : 'View Submission'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(submission.pdfUrl, '_blank')}
                        >
                          View PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSubmission?.status === 'evaluated' ? 'Evaluation Details' : 'Submission Details'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSubmission?.status === 'evaluated' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Score</h3>
                  <p>{selectedSubmission.evaluation.score}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Feedback</h3>
                  <p>{selectedSubmission.evaluation.feedback}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Strengths</h3>
                  <p>{selectedSubmission.evaluation.strengths}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Areas for Improvement</h3>
                  <p>{selectedSubmission.evaluation.improvements}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Submission Status</h3>
                  <p>Your submission is being evaluated. Please check back later for feedback.</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAssignmentAssessment; 