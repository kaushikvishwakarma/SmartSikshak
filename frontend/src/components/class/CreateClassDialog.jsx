'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';

export default function CreateClassDialog({ open, setOpen, setClasses }) {
  const [form, setForm] = useState({ className: '', section: '', academicYear: '' });
  const [existingSubjects, setExistingSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [newSubjects, setNewSubjects] = useState([{ name: '', code: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/subject', { withCredentials: true })
      .then(res => setExistingSubjects(res.data || []))
      .catch(err => console.error('Error loading subjects:', err));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create new subjects first
      const createdSubjectResponses = await Promise.all(
        newSubjects.filter(s => s.name && s.code).map(subject =>
          axios.post('http://localhost:8080/api/subject', {
            ...subject,
            academicSession: form.academicYear,
            classGroup: `${form.className} ${form.section}`,
          }, { withCredentials: true })
        )
      );

      const newlyCreatedSubjects = createdSubjectResponses.map(res => res.data.subject);
      const allSubjects = [
        ...existingSubjects.filter(sub => selectedSubjectIds.includes(sub._id)),
        ...newlyCreatedSubjects,
      ];

      const classPayload = {
        ...form,
        subjects: allSubjects.map(sub => ({
          subjectId: sub._id,
          subjectName: sub.name,
          code: sub.code,
        })),
      };

      const classRes = await axios.post('http://localhost:8080/api/class', classPayload, {
        withCredentials: true,
      });

      setClasses(classRes.data);
      setOpen(false);
      setForm({ className: '', section: '', academicYear: '' });
      setSelectedSubjectIds([]);
      setNewSubjects([{ name: '', code: '' }]);
    } catch (err) {
      console.error('Error creating class:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Input
            placeholder="Class Name (e.g., BTech)"
            value={form.className}
            onChange={e => setForm({ ...form, className: e.target.value })}
          />
          <Input
            placeholder="Section (e.g., AID-A)"
            value={form.section}
            onChange={e => setForm({ ...form, section: e.target.value })}
          />
          <Input
            placeholder="Academic Year (e.g., 2024-2025)"
            value={form.academicYear}
            onChange={e => setForm({ ...form, academicYear: e.target.value })}
          />

          <div>
            <Label>Select Existing Subjects</Label>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {existingSubjects.map(subject => (
                <Button
                  key={subject._id}
                  variant={selectedSubjectIds.includes(subject._id) ? 'default' : 'outline'}
                  onClick={() =>
                    setSelectedSubjectIds(prev =>
                      prev.includes(subject._id)
                        ? prev.filter(id => id !== subject._id)
                        : [...prev, subject._id]
                    )
                  }
                >
                  {subject.name} ({subject.code})
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Add New Subjects</Label>
            {newSubjects.map((subject, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={e =>
                    setNewSubjects(newSubjects.map((s, i) =>
                      i === index ? { ...s, name: e.target.value } : s
                    ))
                  }
                />
                <Input
                  placeholder="Subject Code"
                  value={subject.code}
                  onChange={e =>
                    setNewSubjects(newSubjects.map((s, i) =>
                      i === index ? { ...s, code: e.target.value } : s
                    ))
                  }
                />
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => setNewSubjects([...newSubjects, { name: '', code: '' }])}
              className="text-blue-600"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Add Another Subject
            </Button>
          </div>

          <Button className="mt-4 w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Class'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
