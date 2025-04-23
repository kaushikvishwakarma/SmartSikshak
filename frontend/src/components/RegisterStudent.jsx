'use client';

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from 'axios';

export default function RegisterStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    classId: '',
  });

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/class',{withCredentials:true}) // 🔁 Make sure this route returns all classes

      .then(res => setClasses(res.data))
      .catch(err => console.error('Failed to fetch classes', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleClassChange = (value) => {
    setFormData(prev => ({
      ...prev,
      classId: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        usertype: 'student',
      };
      await axios.post('http://localhost:8080/api/users/mentor/register', payload,{withCredentials:true}); // 🔁 Adjust if your endpoint differs
      alert('Student registered successfully');
      setFormData({ name: '', email: '', phone: '', password: '', classId: '' });
    } catch (err) {
      console.error('Registration failed', err);
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="rounded-2xl shadow-xl p-6">
        <CardContent className="space-y-6">
          <h2 className="text-xl font-semibold">Register New Student</h2>

          <div className="grid gap-4">
            <div>
              <Label>Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <Label>Class</Label>
              <Select onValueChange={handleClassChange} value={formData.classId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.className} {cls.section && `(${cls.section})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Register Student
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
