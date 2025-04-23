'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

export default function RegisterTeacherPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    address: '',
  });

  const [teacherId, setTeacherId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignment, setAssignment] = useState({
    subjectId: '',
    subjectName: '',
    classId: '',
    className: '',
    schedule: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8080/api/subject',{withCredentials:true}).then(res => setSubjects(res.data));
    axios.get('http://localhost:8080/api/class',{withCredentials:true}).then(res => setClasses(res.data));
  }, []);
  console.log(subjects);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/users/registerteacher', formData,{withCredentials:true});
      setTeacherId(res.data._id);
      alert('Teacher registered. Now assign a class.');
      setDialogOpen(true);
    } catch (err) {
      alert('Registration failed');
      console.error(err);
    }
  };

  const handleAssignmentChange = (key, value) => {
    setAssignment(prev => ({ ...prev, [key]: value }));
  };

  const handleAssignClass = async () => {
    try {
      await axios.post(`http://localhost:8080/api/teacher/${teacherId}/assign`, assignment,{withCredentials:true});
      alert('Class assigned successfully');
      setDialogOpen(false);
      setAssignment({
        subjectId: '',
        subjectName: '',
        classId: '',
        className: '',
        schedule: '',
      });
    } catch (err) {
      alert('Assignment Done');
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="rounded-2xl shadow-xl p-6">
        <CardContent className="space-y-6">
          <h2 className="text-xl font-semibold">Register New Teacher</h2>

          <div className="grid gap-4">
            <div>
              <Label>Name</Label>
              <Input name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Mobile Number</Label>
              <Input name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Address</Label>
              <Input name="address" value={formData.address} onChange={handleInputChange} />
            </div>
          </div>

          <Button className="w-full" onClick={handleRegister}>
            Register Teacher
          </Button>

          {teacherId && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">Assign Class</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Class to Teacher</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Select
                      onValueChange={(value) => {
                        const selected = subjects.find((s) => s._id === value);
                        handleAssignmentChange('subjectId', value);
                        handleAssignmentChange('subjectName', selected?.name || '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Class</Label>
                    <Select
                      onValueChange={(value) => {
                        const selected = classes.find((c) => c._id === value);
                        handleAssignmentChange('classId', value);
                        handleAssignmentChange('className', `${selected?.className} ${selected?.section || ''}`.trim());
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.className} {cls.section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Schedule (e.g., Mon-Wed 10AM)</Label>
                    <Input
                      value={assignment.schedule}
                      onChange={(e) => handleAssignmentChange('schedule', e.target.value)}
                    />
                  </div>

                  <Button onClick={handleAssignClass} className="w-full">
                    Assign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
