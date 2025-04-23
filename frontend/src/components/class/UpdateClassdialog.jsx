'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UpdateClassDialog({ open, setOpen, classItem, setClasses,setClassItem }) {
  const [form, setForm] = useState({
    className: '',
    section: '',
    academicYear: '',
  });

  useEffect(() => {
    if (classItem) {
      setForm({
        className: classItem.className,
        section: classItem.section,
        academicYear: classItem.academicYear,
      });
    }
  }, [classItem]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/class/${classItem._id}`,
        form,
        { withCredentials: true }
      );

      setClasses(prev =>
        prev.map(cls => (cls._id === classItem?._id ? res.data.updatedClass : cls))
      );
      setClassItem(res.data.updatedClass);
      setOpen(false);
    } catch (err) {
      console.error('Error updating class:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Class</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Class Name"
          value={form.className}
          onChange={e => setForm({ ...form, className: e.target.value })}
        />
        <Input
          placeholder="Section"
          value={form.section}
          onChange={e => setForm({ ...form, section: e.target.value })}
        />
        <Input
          placeholder="Academic Year"
          value={form.academicYear}
          onChange={e => setForm({ ...form, academicYear: e.target.value })}
        />

        <Button className="mt-4 w-full" onClick={handleUpdate}>
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}
