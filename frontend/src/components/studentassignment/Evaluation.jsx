import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function ViewEvaluationSummary({ evaluation }) {
  const [open, setOpen] = useState(false);

  if (!evaluation) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">View Summary</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Evaluation Summary</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-2">
          <div className="space-y-4 text-sm">
            <div className="border p-3 rounded-md bg-gray-50">
              <p><span className="font-semibold">Score:</span> {evaluation?.summary?.score}/10</p>
              <p><span className="font-semibold">Remark:</span> {evaluation?.summary?.remark}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-3 rounded-md bg-green-50">
                <h4 className="font-semibold mb-2">Strengths</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {evaluation?.summary?.strengths?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="border p-3 rounded-md bg-red-50">
                <h4 className="font-semibold mb-2">Improvements</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {evaluation?.summary?.improvements?.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border p-3 rounded-md bg-blue-50">
              <h4 className="font-semibold mb-2">Question-wise Feedback</h4>
              <ul className="space-y-2">
                {evaluation?.questions?.map((q, idx) => (
                  <li key={idx}>
                    <p className="font-medium">Q{idx + 1}: {q.question}</p>
                    <p className="text-sm text-muted-foreground">Feedback: {q.feedback}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
