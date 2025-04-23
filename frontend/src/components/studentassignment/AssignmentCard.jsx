import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import AssignmentDialog from './AssignmentDialog.jsx';
import ViewSummaryDialog from './Evaluation.jsx';
import ViewAssignmentDialog from './ViewAssignmentDialog.jsx'; // ✅ New Dialog

const AssignmentCard = ({ assignment, submission, studentId }) => {
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);

  const isSubmitted = !!submission;
  const isEvaluated = (submission?.status==='evaluated');

  return (
    <Card className="p-4 space-y-2 border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardContent className="space-y-3">
        {/* Title & Status */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-indigo-800">
            {assignment.title}
          </h3>
          <Badge variant={isSubmitted ? 'success' : 'destructive'}>
            {isSubmitted ? 'Submitted' : 'Pending'}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600">{assignment.description}</p>

        {/* Extra Info */}
        <div className="text-xs text-slate-500 space-y-1">
          <p>📅 Due: {format(new Date(assignment.dueDate), 'dd MMM yyyy')}</p>
          <p>👨‍🏫 Teacher: <span className="font-medium text-slate-700">{assignment.teacherId?.name || 'Unknown'}</span></p>
          <p>🏫 Class: <span className="font-medium text-slate-700">{assignment.classId?.className || 'N/A'}</span></p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3">
          {/* Submit Button */}
          {!isSubmitted && (
            <Button variant="outline" onClick={() => setOpenSubmit(true)}>
              Submit Assignment
            </Button>
          )}

          {/* View Summary */}
          {isSubmitted && isEvaluated && (
            <Button variant="secondary" onClick={() => setOpenSummary(true)}>
              View Summary
            </Button>
          )}

          {/* Awaiting Evaluation */}
          {isSubmitted && !isEvaluated && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500">
              Awaiting Evaluation
            </Badge>
          )}

          {/* View Assignment */}
          <ViewAssignmentDialog assignment={assignment} />
        </div>
      </CardContent>

      {/* Submit Dialog */}
      <AssignmentDialog
        open={openSubmit}
        setOpen={setOpenSubmit}
        assignment={assignment}
        studentId={studentId}
        onSubmitSuccess={() => {
          setOpenSubmit(false);
          window.location.reload();
        }}
      />

      {/* Evaluation Dialog */}
      {isEvaluated && (
        <ViewSummaryDialog
          open={openSummary}
          setOpen={setOpenSummary}
          evaluation={submission.evaluation}
        />
      )}
    </Card>
  );
};

export default AssignmentCard;

// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { format } from 'date-fns';
// import AssignmentDialog from './AssignmentDialog.jsx';
// import ViewSummaryDialog from './Evaluation.jsx';

// const AssignmentCard = ({ assignment, submission }) => {
//   const [openSubmit, setOpenSubmit] = useState(false);
//   const [openSummary, setOpenSummary] = useState(false);

//   const isSubmitted = !!submission;
//   const isEvaluated = submission?.evaluation;

//   return (
//     <Card className="p-4 space-y-2 border border-gray-200 shadow-md">
//       <CardContent className="space-y-1">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-primary">
//             {assignment.title}
//           </h3>
//           <Badge variant={isSubmitted ? 'success' : 'destructive'}>
//             {isSubmitted ? 'Submitted' : 'Pending'}
//           </Badge>
//         </div>
//         <p className="text-sm text-gray-600">{assignment.description}</p>
//         <p className="text-sm text-muted-foreground">
//           Due: {format(new Date(assignment.dueDate), 'dd MMM yyyy')}
//         </p>

//         <div className="flex gap-2 pt-2">
//           {!isSubmitted && (
//             <Button variant="outline" onClick={() => setOpenSubmit(true)}>
//               Submit Assignment
//             </Button>
//           )}

//           {isSubmitted && isEvaluated && (
//             <Button variant="secondary" onClick={() => setOpenSummary(true)}>
//               View Summary
//             </Button>
//           )}

//           {isSubmitted && !isEvaluated && (
//             <Badge variant="outline" className="text-yellow-600 border-yellow-500">
//               Awaiting Evaluation
//             </Badge>
//           )}
//         </div>
//       </CardContent>

//       <AssignmentDialog
         
//          assignment={assignment}
//          studentId={submission?.studentId} // 💡 Or pass from parent if available
//          onSubmitSuccess={() => {
//            setOpenSubmit(false);
//            window.location.reload(); // ✅ Optional: refresh after successful submit
//          }}
//       />

//       {isEvaluated && (
//         <ViewSummaryDialog
//           open={openSummary}
//           setOpen={setOpenSummary}
//           evaluation={submission.evaluation}
//         />
//       )}
//     </Card>
//   );
// };

// export default AssignmentCard;
