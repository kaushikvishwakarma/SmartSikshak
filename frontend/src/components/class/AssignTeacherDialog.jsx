'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignTeacherDialog({ open, setOpen, classItem }) {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [zoomLink, setZoomLink] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/users/teachers', { withCredentials: true })
      .then(res => setTeachers(res.data.teachers))
      .catch(err => console.error(err));

    if (classItem) {
      setSubjects(classItem.subjects || []);
    }
  }, [classItem]);

  const handleAssign = async () => {
    try {
      const selectedSub = subjects.find(sub => sub.subjectId === selectedSubject);
      await axios.post(
        `http://localhost:8080/api/users/${selectedTeacher}/assign`,
        {
          subjectId: selectedSubject,
          subjectName: selectedSub?.subjectName,
          classId: classItem?._id,
          className: classItem?.className,
          schedule: [
            {
              day,
              startTime,
              endTime,
              zoomLink
            }
          ]
        },
        { withCredentials: true }
      );

      setOpen(false);
    } catch (err) {
      console.error('Assign failed:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
        </DialogHeader>

        <Select onValueChange={setSelectedTeacher}>
          <SelectTrigger>
            <SelectValue placeholder="Select Teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map(teacher => (
              <SelectItem key={teacher._id} value={teacher._id}>
                {teacher.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(sub => (
              <SelectItem key={sub.subjectId} value={sub.subjectId}>
                {sub.subjectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setDay}>
          <SelectTrigger>
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Start Time (e.g. 09:00 AM)"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
        />
        <Input
          placeholder="End Time (e.g. 10:00 AM)"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
        />
        <Input
          placeholder="Zoom Link (optional)"
          value={zoomLink}
          onChange={e => setZoomLink(e.target.value)}
        />

        <Button className="mt-4 w-full" onClick={handleAssign}>
          Assign
        </Button>
      </DialogContent>
    </Dialog>
  );
}


// 'use client';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
// import {Input} from '@/components/ui/input';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function AssignTeacherDialog({ open, setOpen, classItem }) {
//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedTeacher, setSelectedTeacher] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [schedule, setSchedule] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:8080/api/users/teachers', { withCredentials: true })
//       .then(res => setTeachers(res.data.teachers))
//       .catch(err => console.error(err));

//     if (classItem) {
//       setSubjects(classItem.subjects || []);
//     }
//   }, [classItem]);

//   const handleAssign = async () => {
//     console.log(subjects);
//     try {
//       const selectedSub = subjects.find(sub => sub.subjectId === selectedSubject);
//       await axios.post(
//         `http://localhost:8080/api/users/${selectedTeacher}/assign`,
//         {
//           subjectId: selectedSubject,
//           subjectName: selectedSub?.subjectName,
//           classId: classItem?._id,
//           className: classItem?.className,
//           schedule: [
//             {
//               day: 'Monday',
//               startTime: '09:00 AM',
//               endTime: '10:00 AM',
//               zoomLink: 'https://zoom.us/example' // optional
//             }
//           ]
//         },
//         { withCredentials: true }
//       );

//       setOpen(false);
//     } catch (err) {
//       console.error('Assign failed:', err);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Assign Teacher</DialogTitle>
//         </DialogHeader>

//         <Select onValueChange={setSelectedTeacher}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select Teacher" />
//           </SelectTrigger>
//           <SelectContent>
//             {teachers.map(teacher => (
//               <SelectItem key={teacher._id} value={teacher._id}>
//                 {teacher.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select onValueChange={setSelectedSubject}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select Subject" />
//           </SelectTrigger>
//           <SelectContent>
//             {subjects.map(sub => (
//               <SelectItem key={sub.subjectId} value={sub.subjectId}>
//                 {sub.subjectName}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Input
//           placeholder="Schedule (e.g. Mon 9AM)"
//           value={schedule}
//           onChange={e => setSchedule(e.target.value)}
//         />

//         <Button className="mt-4 w-full" onClick={handleAssign}>
//           Assign
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// }
