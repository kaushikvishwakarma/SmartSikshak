// components/ViewAssignmentDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ViewAssignmentDialog = ({ assignment }) => {
  const questions = JSON.parse(assignment.questions || "[]");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">View Assignment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-indigo-700 text-xl">{assignment.title}</DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            Created by <span className="font-medium text-slate-800">{assignment.teacherId?.name}</span> | Class: <span className="font-medium text-slate-800">{assignment.className || "N/A"}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {questions.map((q, idx) => (
            <div key={idx} className="p-2 bg-slate-100 rounded shadow-sm">
              <span className="font-semibold text-slate-700">Q{idx + 1}:</span> {q}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAssignmentDialog;
