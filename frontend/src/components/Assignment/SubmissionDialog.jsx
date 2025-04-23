import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const SubmissionListDialog = ({ assignment }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openPDF, setOpenPDF] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/assignments/${assignment._id}/submissions`,
        { withCredentials: true }
      );
      setSubmissions(res.data);
      console.log("hii");
      console.log(res);

    } catch (err) {
      console.error('Failed to fetch submissions', err);
    }
  };

  // const handleEvaluate = async (submissionId) => {
  //   try {
  //     await axios.post(
  //       `http://localhost:8080/api/assignment/evaluate/${submissionId}`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     alert("evaluated successfully");
  //     await fetchSubmissions(); // Refresh list with evaluated data
  //     const updated = submissions.find((sub) => sub._id === submissionId);
  //     console.log(updated);
  //     setSelectedSubmission(updated);
  //     setOpenSummary(true); // Auto open summary
  //   } catch (err) {
  //     console.error('Evaluation failed:', err);
  //     alert('Evaluation failed. Please try again.');
  //   }
  // };
  const handleEvaluate = async (submissionId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/assignment/evaluate/${submissionId}`,
        {},
        { withCredentials: true }
      );
      alert("evaluated successfully");

      // Fetch latest submissions
      const res = await axios.get(
        `http://localhost:8080/api/teacher/assignments/${assignment._id}/submissions`,
        { withCredentials: true }
      );
      setSubmissions(res.data);
      console.log(res);

      // Get the updated evaluated submission
      const updated = res.data.find((sub) => sub._id === submissionId);
      setSelectedSubmission(updated);
      setOpenSummary(true); // Auto open summary
    } catch (err) {
      console.error('Evaluation failed:', err);
      alert('Evaluation failed. Please try again.');
    }
  };

  useEffect(() => {
    if (assignment) fetchSubmissions();
  }, [assignment]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Submissions for: {assignment?.title}</h2>
      {console.log(submissions)};

      {submissions.map((sub) => (
        <div key={sub._id} className="border p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="font-semibold">{sub.studentId?.name}</p>
            <p className="text-sm text-muted-foreground">{sub.studentId?.email}</p>
            <p className="text-xs">
              Status:{' '}
              {sub.status === "evaluated" ? (
                <span className="text-green-600 font-medium">Evaluated</span>
              ) : (
                <span className="text-yellow-600 font-medium">Not Evaluated</span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            {/* 🔍 View PDF Dialog */}
            <Dialog open={openPDF} onOpenChange={setOpenPDF}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(sub);
                    setOpenPDF(true);
                  }}
                >
                  View PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-2">Submitted PDF</h2>
                <iframe
                  src={selectedSubmission?.pdfUrl}
                  className="w-full h-[80vh] border rounded"
                  title="Submitted Assignment"
                />
              </DialogContent>
            </Dialog>

            {/* 🧠 Evaluate Button */}
            {sub.status !== "evaluated" && (
              <Button onClick={() => handleEvaluate(sub._id)}>Evaluate</Button>
            )}

            {/* 📊 View Summary Dialog */}
            {(sub.status === "evaluated") && (
              <Dialog open={openSummary} onOpenChange={setOpenSummary}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setOpenSummary(true);
                    }}
                  >
                    View Summary
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-bold mb-2">Evaluation Summary</h2>

                  <div className="flex gap-4 mb-4">
                    <iframe
                      src={selectedSubmission?.pdfUrl}
                      className="w-1/2 h-96 border rounded"
                      title="Submitted PDF"
                    />
                    <div className="w-1/2 space-y-2">
                      <p>
                        <strong>Score:</strong> {selectedSubmission?.evaluation?.summary?.overallScore}/10
                      </p>
                      <p>
                        <strong>Remark:</strong> {selectedSubmission?.evaluation?.summary?.remark}
                      </p>
                      <div>
                        <strong>Strengths:</strong>
                        <ul className="list-disc ml-5">
                          {selectedSubmission?.evaluation?.summary?.strengths?.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Improvements:</strong>
                        <ul className="list-disc ml-5">
                          {selectedSubmission?.evaluation?.summary?.improvements?.map((i, idx) => (
                            <li key={idx}>{i}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Plagiarism Summary:</strong>
                        <ul className="list-disc ml-5">
                          <li>  {selectedSubmission?.evaluation?.summary?.plagiarismSummary?.level}</li>
                          <li>  {selectedSubmission?.evaluation?.summary?.plagiarismSummary?.reason}</li>
                          <li>  {selectedSubmission?.evaluation?.summary?.plagiarismSummary?.note}</li>
                          

                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mt-4">Question-wise Feedback:</h3>
                    <div className="space-y-2 mt-2">
                      {selectedSubmission?.evaluation?.questions?.map((q, i) => (
                        <div key={i} className="p-3 border rounded-md bg-gray-50">
                          <p><strong>Q{i + 1}:</strong> {q.question}</p>
                          <p><strong>Answer:</strong> {q.answer}</p>
                          <p><strong>Score:</strong> {q.score}/10</p>
                          <p><strong>Feedback:</strong> {q.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionListDialog;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// const SubmissionListDialog = ({ assignment }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [openPDF, setOpenPDF] = useState(false);
//   const [openSummary, setOpenSummary] = useState(false);

//   const fetchSubmissions = async () => {
//     const res = await axios.get(
//       `http://localhost:8080/api/teacher/assignments/${assignment._id}/submissions`,

//       { withCredentials: true }
//     );
//     console.log(res.data);
//     setSubmissions(res.data);
//   };

//   const handleEvaluate = async (id) => {
//     await axios.post(`http://localhost:8080/api/assignment/evaluate/${id}`, {
//       withCredentials: true,
//     });
//     fetchSubmissions();
//   };

//   useEffect(() => {
//     if (assignment) fetchSubmissions();
//   }, [assignment]);

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold">Submissions for: {assignment?.title}</h2>
//       {submissions.map((sub) => (
//         <div key={sub._id} className="border p-4 rounded-lg flex justify-between items-center">
//           <div>
//             <p className="font-semibold">{sub.studentId?.name}</p>
//             <p className="text-sm text-muted-foreground">{sub.studentId?.email}</p>
//           </div>
//           <div className="flex gap-2">
//             {/* ✅ View PDF Dialog */}
//             <Dialog open={openPDF} onOpenChange={setOpenPDF}>
//               <DialogTrigger asChild>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setSelectedSubmission(sub);
//                     setOpenPDF(true);
//                   }}
//                 >
//                   View PDF
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                 <h2 className="text-lg font-bold mb-2">Submitted PDF</h2>
//                 <iframe
//                   src={selectedSubmission?.pdfUrl}
//                   className="w-full h-[80vh] border rounded"
//                   title="Submitted Assignment"
//                 />
//               </DialogContent>
//             </Dialog>

//             {/* ✅ Evaluate Button */}
//             {!sub.evaluation && (
//               <Button onClick={() => handleEvaluate(sub._id)}>Evaluate</Button>
//             )}

//             {/* ✅ View Summary Dialog */}
//             {sub.evaluation && (
//               <Dialog open={openSummary} onOpenChange={setOpenSummary}>
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="secondary"
//                     onClick={() => {
//                       setSelectedSubmission(sub);
//                       setOpenSummary(true);
//                     }}
//                   >
//                     View Summary
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                   <h2 className="text-lg font-bold mb-2">Evaluation Summary</h2>

//                   <div className="flex gap-4 mb-4">
//                     <iframe
//                       src={selectedSubmission?.pdfUrl}
//                       className="w-1/2 h-96 border rounded"
//                       title="Submitted PDF"
//                     />
//                     <div className="w-1/2 space-y-2">
//                       <p><strong>Score:</strong> {selectedSubmission?.evaluation?.summary?.overallScore}/10</p>
//                       <p><strong>Remark:</strong> {selectedSubmission?.evaluation?.summary?.remark}</p>

//                       <div>
//                         <strong>Strengths:</strong>
//                         <ul className="list-disc ml-5">
//                           {selectedSubmission?.evaluation?.summary?.strengths?.map((s, idx) => (
//                             <li key={idx}>{s}</li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <strong>Improvements:</strong>
//                         <ul className="list-disc ml-5">
//                           {selectedSubmission?.evaluation?.summary?.improvements?.map((i, idx) => (
//                             <li key={idx}>{i}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-md font-semibold mt-4">Question-wise Feedback:</h3>
//                     <div className="space-y-2 mt-2">
//                       {selectedSubmission?.evaluation?.questions?.map((q, i) => (
//                         <div key={i} className="p-3 border rounded-md bg-gray-50">
//                           <p><strong>Q{i + 1}:</strong> {q.question}</p>
//                           <p><strong>Answer:</strong> {q.answer}</p>
//                           <p><strong>Score:</strong> {q.score}/10</p>
//                           <p><strong>Feedback:</strong> {q.feedback}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SubmissionListDialog;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// const SubmissionListDialog = ({ assignment }) => {
//   const [submissions, setSubmissions] = useState([]);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [openSummary, setOpenSummary] = useState(false);

//   const fetchSubmissions = async () => {
//     const res = await axios.get(`http://localhost:8080/api/teacher/assignments/${assignment._id}/submissions`, {
//       withCredentials: true,
//     });
//     setSubmissions(res.data);
//   };

//   const handleEvaluate = async (id) => {
//     await axios.post(`http://localhost:8080/api/assignment/evaluate/${id}`, {
//       withCredentials: true,
//     });
//     fetchSubmissions();
//   };

//   useEffect(() => {
//     if (assignment) fetchSubmissions();
//   }, [assignment]);

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold">Submissions for: {assignment?.title}</h2>
//       {submissions.map((sub) => (
//         <div key={sub._id} className="border p-4 rounded-lg flex justify-between items-center">
//           <div>
//             <p className="font-semibold">{sub.studentId?.name}</p>
//             <p className="text-sm text-muted-foreground">{sub.studentId?.email}</p>
//           </div>
//           <div className="flex gap-2">
//             <a href={sub.pdfUrl} target="_blank" rel="noopener noreferrer">
//               <Button variant="outline">View PDF</Button>
//             </a>
//             {!sub.evaluation && (
//               <Button onClick={() => handleEvaluate(sub._id)}>Evaluate</Button>
//             )}
//             {sub.evaluation && (
//               <Dialog open={openSummary} onOpenChange={setOpenSummary}>
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="secondary"
//                     onClick={() => {
//                       setSelectedSubmission(sub);
//                       setOpenSummary(true);
//                     }}
//                   >
//                     View Summary
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
//                   <h2 className="text-lg font-bold mb-2">Evaluation Summary</h2>

//                   <div className="flex gap-4 mb-4">
//                     <iframe
//                       src={selectedSubmission?.pdfUrl}
//                       className="w-1/2 h-96 border rounded"
//                       title="Submitted PDF"
//                     />
//                     <div className="w-1/2 space-y-2">
//                       <p><strong>Score:</strong> {selectedSubmission?.evaluation?.summary?.overallScore}/10</p>
//                       <p><strong>Remark:</strong> {selectedSubmission?.evaluation?.summary?.remark}</p>

//                       <div>
//                         <strong>Strengths:</strong>
//                         <ul className="list-disc ml-5">
//                           {selectedSubmission?.evaluation?.summary?.strengths?.map((s, idx) => (
//                             <li key={idx}>{s}</li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <strong>Improvements:</strong>
//                         <ul className="list-disc ml-5">
//                           {selectedSubmission?.evaluation?.summary?.improvements?.map((i, idx) => (
//                             <li key={idx}>{i}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-md font-semibold mt-4">Question-wise Feedback:</h3>
//                     <div className="space-y-2 mt-2">
//                       {selectedSubmission?.evaluation?.questions?.map((q, i) => (
//                         <div key={i} className="p-3 border rounded-md bg-gray-50">
//                           <p><strong>Q{i + 1}:</strong> {q.question}</p>
//                           <p><strong>Answer:</strong> {q.answer}</p>
//                           <p><strong>Score:</strong> {q.score}/10</p>
//                           <p><strong>Feedback:</strong> {q.feedback}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SubmissionListDialog;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Button } from '@/components/ui/button';

// const SubmissionListDialog = ({ assignment }) => {
//   const [submissions, setSubmissions] = useState([]);

//   const fetchSubmissions = async () => {
//     const res = await axios.get(`http://localhost:8080/api/teacher/assignments/${assignment._id}/submissions`,{withCredentials:true});
//     setSubmissions(res.data);
//   };

//   const handleEvaluate = async (id) => {
//     await axios.post(`http://localhost:8080/api/assignment/evaluate/${id}`,{withCredentials:true});
//     fetchSubmissions();
//   };

//   useEffect(() => {
//     if (assignment) fetchSubmissions();
//   }, [assignment]);

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold">Submissions for: {assignment?.title}</h2>
//       {submissions.map((sub) => (
//         <div key={sub._id} className="border p-4 rounded-lg flex justify-between items-center">
//           <div>
//             <p className="font-semibold">{sub.studentId.name}</p>
//             <p className="text-sm text-muted-foreground">{sub.studentId.email}</p>
//           </div>
//           <div className="flex gap-2">
//             <a href={sub.pdfUrl} target="_blank" rel="noopener noreferrer">
//               <Button variant="outline">View PDF</Button>
//             </a>
//             {!sub.evaluation && (
//               <Button onClick={() => handleEvaluate(sub._id)}>Evaluate</Button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SubmissionListDialog;
