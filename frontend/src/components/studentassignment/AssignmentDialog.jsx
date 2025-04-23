import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const AssignmentDialog = ({ assignment, studentId, onSubmitSuccess }) => {
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !entity) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('assignmentId', assignment._id);
       // ⬅️ Include this
      // ⬅️ Include this
      formData.append('file', file);
      console.log([...formData.entries()]);


      await axios.post(
        'http://localhost:8080/api/student/submit-assignment',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      onSubmitSuccess();
      setOpen(false);
      setEntity('');
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Submit Assignment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Entity</Label>
            <Input
              placeholder="e.g., Roll Number / ID"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload PDF</Label>
            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <div className="flex justify-end">
            <Button
              disabled={!entity || !file || loading}
              onClick={handleSubmit}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
