'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const attendanceOptions = ['present', 'absent', 'late', 'leave'];
const optionFullToShort = {
  present: 'P',
  absent: 'A',
  late: 'L',
  leave: 'LV',
};
const optionShortToFull = {
  P: 'present',
  A: 'absent',
  L: 'late',
  LV: 'leave',
};
const optionColors = {
  present: '#4ade80',
  absent: '#f87171',
  late: '#facc15',
  leave: '#a78bfa',
};

export default function TeacherAttendanceUI() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [subject, setSubject] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  // Example IDs — replace with real data
  const teacherId = '661675abc88a0b001cbfe901';
  const classId = '68034dbbdd851d02626e0cea';
  const subjectId = '68034dbbdd851d02626e0ce7';

  const fetchInitialData = async () => {
    try {
      const [teacherRes, classRes, subjectRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/users/${teacherId}`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/class/${classId}`, { withCredentials: true }),
        axios.get(`http://localhost:8080/api/subject/${subjectId}`, { withCredentials: true }),
      ]);
      setTeacher(teacherRes.data);
      setClassInfo(classRes.data);
      setSubject(subjectRes.data);
    } catch (err) {
      console.error('Error fetching initial info:', err);
    }
  };

  const fetchStudents = async (selectedDate) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/users/${teacherId}/class/${classId}/subject/${subjectId}/students?date=${selectedDate}`,
        { withCredentials: true }
      );
      console.log(res);
      setStudents(res.data.students.map((s) => ({
        id: s._id,
        name: s.name,
        previousPercentage: s.attendancePercentage,
        status: s.status || '',
        note: s.note || ''
      })));
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (teacher && classInfo && subject) {
      fetchStudents(date);
    }
  }, [teacher, classInfo, subject, date]);

  const handleStatusChange = (studentId, status) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleNoteChange = (studentId, note) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, note } : student
      )
    );
  };

  const bulkMark = (shortCode) => {
    const fullStatus = optionShortToFull[shortCode] || '';
    setStudents(prev => prev.map(student => ({ ...student, status: fullStatus })));
  };

  const summary = students.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = attendanceOptions.map(option => ({
    name: option,
    value: summary[option] || 0
  }));

  const handleSubmit = async (resetAfter = false) => {
    setSubmitting(true);
    try {
      const payload = {
        teacherId,
        classId,
        subjectId,
        date,
        attendance: students.map(s => ({
          studentId: s.id,
          status: s.status,
          remarks: s.note || '',
        })),
      };

      await axios.post('http://localhost:8080/api/attendance/teachermark', payload, {
        withCredentials: true,
      });

      alert('Attendance saved successfully!');

      if (resetAfter) {
        setStudents(prev => prev.map(s => ({ ...s, status: '', note: '' })));
      }

    } catch (err) {
      console.error('Submit failed:', err);
      alert('Error saving attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading students...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="p-4 rounded-2xl shadow-md flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><strong>Teacher:</strong> {teacher?.name}</div>
          <div><strong>Class:</strong> {classInfo?.className} - {classInfo?.section}</div>
          <div><strong>Subject:</strong> {subject?.name}</div>
          <div className="flex items-center gap-2 col-span-2">
            <strong>Date:</strong>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div><strong>Day:</strong> {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
          <div><strong>Time:</strong> 10:00 AM – 11:00 AM</div>
        </div>
      </Card>

      {/* Bulk Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => bulkMark('P')}>Mark All Present</Button>
        <Button variant="destructive" onClick={() => bulkMark('A')}>Mark All Absent</Button>
      </div>

      {/* Students Table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 font-semibold bg-gray-100 px-4 py-2">
          <div>#</div><div>Student</div><div>Previous %</div><div>Attendance</div><div>Notes</div>
        </div>
        {students.map((student, idx) => (
          <div key={student.id} className="grid grid-cols-5 items-center px-4 py-2 border-t">
            <div>{idx + 1}</div>
            <div>{student.name}</div>
            <div>{student.previousPercentage ?? 'N/A'}%</div>
            <div className="flex gap-2">
              {attendanceOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleStatusChange(student.id, option)}
                  className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center transition-all ${
                    student.status === option ? 'ring-2 ring-black' : 'opacity-60'
                  }`}
                  style={{ backgroundColor: optionColors[option] }}
                >
                  {optionFullToShort[option]}
                </button>
              ))}
            </div>
            <div>
              <Input value={student.note} onChange={e => handleNoteChange(student.id, e.target.value)} placeholder="Optional note" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex items-center justify-center">
        <PieChart width={240} height={240}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={optionColors[entry.name]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button disabled={submitting} onClick={() => handleSubmit(true)}>Save & New</Button>
        <Button disabled={submitting} onClick={() => handleSubmit(false)}>Save & Close</Button>
        <Button variant="outline" onClick={() => bulkMark('')}>Clear</Button>
        <Button variant="destructive" onClick={() => fetchStudents(date)}>Cancel</Button>
      </div>
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PieChart, Pie, Cell } from 'recharts';
// import axios from 'axios';

// const attendanceOptions = ['present', 'absent', 'late', 'leave'];
// const optionFullToShort = {
//   present: 'P',
//   absent: 'A',
//   late: 'L',
//   leave: 'LV',
// };
// const optionShortToFull = {
//   P: 'present',
//   A: 'absent',
//   L: 'late',
//   LV: 'leave',
// };
// const optionColors = {
//   present: '#4ade80',
//   absent: '#f87171',
//   late: '#facc15',
//   leave: '#a78bfa',
// };

// export default function TeacherAttendanceUI() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [teacher, setTeacher] = useState(null);
//   const [classInfo, setClassInfo] = useState(null);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
//   const [submitting, setSubmitting] = useState(false);
//   const [existingAttendanceId, setExistingAttendanceId] = useState(null);

//   // Example IDs — replace with real context or props
//   const teacherId = '661675abc88a0b001cbfe901';
//      const classId = '68034dbbdd851d02626e0cea';
//    const subjectId = '68034dbbdd851d02626e0ce7';

//   const isPastDate = new Date(date) < new Date(new Date().toDateString());

//   const fetchInitialData = async () => {
//     try {
//       const [teacherRes, classRes, subjectRes] = await Promise.all([
//         axios.get(`http://localhost:8080/api/users/${teacherId}`, { withCredentials: true }),
//         axios.get(`http://localhost:8080/api/class/${classId}`, { withCredentials: true }),
//         axios.get(`http://localhost:8080/api/subject/${subjectId}`, { withCredentials: true }),
//       ]);
//       setTeacher(teacherRes.data);
      
//       setClassInfo(classRes.data);
//       setSubject(subjectRes.data);
//       console.log(classInfo)
//     } catch (err) {
//       console.error('Error fetching initial info:', err);
//     }
//   };
 

//   const fetchStudents = async (selectedDate) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:8080/api/users/${teacherId}/class/${classId}/subject/${subjectId}/students?date=${selectedDate}`,
//         { withCredentials: true }
//       );
  
//       setStudents(res.data.students.map((s) => ({
//         id: s._id,
//         name: s.name,
//         previousPercentage: s.attendancePercentage,
//         status: s.status || '',
//         note: s.note || ''
//       })));
  
//       setExistingAttendanceId(res.data.attendanceId || null); // <- This is important
  
//     } catch (err) {
//       console.error('Failed to fetch students:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     if (teacher && classInfo && subject) {
//       fetchStudents(date);
//     }
//   }, [teacher, classInfo, subject, date]);

//   const handleStatusChange = (studentId, status) => {
//     setStudents(prev =>
//       prev.map(student =>
//         student.id === studentId ? { ...student, status } : student
//       )
//     );
//   };

//   const handleNoteChange = (studentId, note) => {
//     setStudents(prev =>
//       prev.map(student =>
//         student.id === studentId ? { ...student, note } : student
//       )
//     );
//   };

//   const bulkMark = (shortCode) => {
//     const fullStatus = optionShortToFull[shortCode];
//     setStudents(prev => prev.map(student => ({ ...student, status: fullStatus })));
//   };

//   const summary = students.reduce((acc, curr) => {
//     acc[curr.status] = (acc[curr.status] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = attendanceOptions.map(option => ({
//     name: option,
//     value: summary[option] || 0
//   }));

//   const handleSubmit = async (resetAfter = false, isUpdate = false) => {
//     setSubmitting(true);
//     try {
//       const payload = {
//         teacherId,
//         classId,
//         subjectId,
//         date,
//         attendance: students.map(s => ({
//           studentId: s.id,
//           status: s.status,
//           remarks: s.note || '',
//         })),
//       };

//       const url = isUpdate && existingAttendanceId
//         ? `http://localhost:8080/api/attendance/update/${existingAttendanceId}`
//         : 'http://localhost:8080/api/attendance/teachermark';

//       const method = isUpdate && existingAttendanceId ? 'put' : 'post';

//       await axios[method](url, payload, { withCredentials: true });

//       alert(isUpdate ? 'Attendance updated successfully!' : 'Attendance saved successfully!');

//       if (resetAfter) {
//         setStudents(prev => prev.map(s => ({ ...s, status: '', note: '' })));
//       }

//     } catch (err) {
//       console.error('Submit failed:', err);
//       alert('Error saving attendance');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading students...</div>;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <Card className="p-4 rounded-2xl shadow-md flex flex-col gap-2">
//         <div className="grid grid-cols-3 gap-4 text-sm">
//           <div><strong>Teacher:</strong> {teacher?.name}</div>
//           <div><strong>Class:</strong> {classInfo?.className} - {classInfo?.section}</div>
//           <div><strong>Subject:</strong> {subject?.name}</div>
//           <div className="flex items-center gap-2">
//             <strong>Date:</strong>
//             <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//           </div>
//           <div><strong>Day:</strong> {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
//           <div><strong>Time:</strong> 10:00 AM – 11:00 AM</div>
//         </div>
//       </Card>

//       {/* Bulk Buttons */}
//       <div className="flex gap-4">
//         <Button onClick={() => bulkMark('P')}>Mark All Present</Button>
//         <Button variant="destructive" onClick={() => bulkMark('A')}>Mark All Absent</Button>
//       </div>

//       {/* Students Table */}
//       <div className="border rounded-xl overflow-hidden">
//         <div className="grid grid-cols-5 font-semibold bg-gray-100 px-4 py-2">
//           <div>#</div><div>Student</div><div>Previous %</div><div>Attendance</div><div>Notes</div>
//         </div>
//         {students.map((student, idx) => (
//           <div key={student.id} className="grid grid-cols-5 items-center px-4 py-2 border-t">
//             <div>{idx + 1}</div>
//             <div>{student.name}</div>
//             <div>{student.previousPercentage ?? 'N/A'}%</div>
//             <div className="flex gap-2">
//               {attendanceOptions.map(option => (
//                 <button
//                   key={option}
//                   onClick={() => handleStatusChange(student.id, option)}
//                   className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center transition-all ${student.status === option ? 'ring-2 ring-black' : 'opacity-60'}`}
//                   style={{ backgroundColor: optionColors[option] }}
//                 >
//                   {optionFullToShort[option]}
//                 </button>
//               ))}
//             </div>
//             <div>
//               <Input value={student.note} onChange={e => handleNoteChange(student.id, e.target.value)} placeholder="Optional note" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chart */}
//       <div className="flex items-center justify-center">
//         <PieChart width={240} height={240}>
//           <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={optionColors[entry.name]} />
//             ))}
//           </Pie>
//         </PieChart>
//       </div>

//       {/* Submit Buttons */}
//       <div className="flex flex-wrap gap-4">
//         <Button disabled={submitting} onClick={() => handleSubmit(true, !!existingAttendanceId)}>
//           {existingAttendanceId ? 'Update & New' : 'Save & New'}
//         </Button>
//         <Button disabled={submitting} onClick={() => handleSubmit(false, !!existingAttendanceId)}>
//           {existingAttendanceId ? 'Update & Close' : 'Save & Close'}
//         </Button>
//         <Button variant="outline" onClick={() => bulkMark('')}>Clear</Button>
//         <Button variant="destructive" onClick={() => fetchStudents(date)}>Cancel</Button>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PieChart, Pie, Cell } from 'recharts';
// import axios from 'axios';

// const attendanceOptions = ['present', 'absent', 'late', 'leave'];
// const optionFullToShort = {
//   present: 'P',
//   absent: 'A',
//   late: 'L',
//   leave: 'LV',
// };
// const optionShortToFull = {
//   P: 'present',
//   A: 'absent',
//   L: 'late',
//   LV: 'leave',
// };
// const optionColors = {
//   present: '#4ade80',
//   absent: '#f87171',
//   late: '#facc15',
//   leave: '#a78bfa',
// };

// export default function TeacherAttendanceUI() {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [teacher, setTeacher] = useState(null);
//   const [classInfo, setClassInfo] = useState(null);
//   const [subject, setSubject] = useState(null);
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
//   const [submitting, setSubmitting] = useState(false);

//   // Example IDs — replace from props/context in real use
//   const teacherId = '661675abc88a0b001cbfe901';
//   const classId = '68034dbbdd851d02626e0cea';
//   const subjectId = '68034dbbdd851d02626e0ce7';

//   const fetchInitialData = async () => {
//     try {
//       const [teacherRes, classRes, subjectRes] = await Promise.all([
//         axios.get(`http://localhost:8080/api/users/${teacherId}`, { withCredentials: true }),
//         axios.get(`http://localhost:8080/api/class/${classId}`, { withCredentials: true }),
//         axios.get(`http://localhost:8080/api/subject/${subjectId}`, { withCredentials: true }),
//       ]);
//       setTeacher(teacherRes.data);
//       setClassInfo(classRes.data);
//       setSubject(subjectRes.data);
//     } catch (err) {
//       console.error('Error fetching initial info:', err);
//     }
//   };

//   const fetchStudents = async (selectedDate) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:8080/api/users/${teacherId}/class/${classId}/subject/${subjectId}/students}`,
//         { withCredentials: true }
//       );
//       setStudents(res.data.map((s) => ({
//         id: s._id,
//         name: s.name,
//         previousPercentage: s.attendancePercentage,
//         status: s.status || '',
//         note: s.note || ''
//       })));
//     } catch (err) {
//       console.error('Failed to fetch students:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     if (teacher && classInfo && subject) {
//       fetchStudents(date);
//     }
//   }, [teacher, classInfo, subject, date]);

//   const handleStatusChange = (studentId, status) => {
//     setStudents(prev =>
//       prev.map(student =>
//         student.id === studentId ? { ...student, status } : student
//       )
//     );
//   };

//   const handleNoteChange = (studentId, note) => {
//     setStudents(prev =>
//       prev.map(student =>
//         student.id === studentId ? { ...student, note } : student
//       )
//     );
//   };

//   const bulkMark = (shortCode) => {
//     const fullStatus = optionShortToFull[shortCode];
//     setStudents(prev => prev.map(student => ({ ...student, status: fullStatus })));
//   };

//   const summary = students.reduce((acc, curr) => {
//     acc[curr.status] = (acc[curr.status] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = attendanceOptions.map(option => ({
//     name: option,
//     value: summary[option] || 0
//   }));

//   const handleSubmit = async (resetAfter = false) => {
//     setSubmitting(true);
//     try {
//       const payload = {
//         teacherId,
//         classId,
//         subjectId,
//         date,
//         attendance: students.map(s => ({
//           studentId: s.id,
//           status: s.status,
//           remarks: s.note || '',
//         })),
//       };

//       await axios.post('http://localhost:8080/api/attendance/teachermark', payload, {
//         withCredentials: true,
//       });

//       alert('Attendance saved successfully!');

//       if (resetAfter) {
//         setStudents(prev => prev.map(s => ({ ...s, status: '', note: '' })));
//       }

//     } catch (err) {
//       console.error('Submit failed:', err);
//       alert('Error saving attendance');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="p-6">Loading students...</div>;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <Card className="p-4 rounded-2xl shadow-md flex flex-col gap-2">
//         <div className="grid grid-cols-3 gap-4 text-sm">
//           <div><strong>Teacher:</strong> {teacher?.name}</div>
//           <div><strong>Class:</strong> {classInfo?.className} - {classInfo?.section}</div>
//           <div><strong>Subject:</strong> {subject?.name}</div>
//           <div className="flex items-center gap-2">
//             <strong>Date:</strong>
//             <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//           </div>
//           <div><strong>Day:</strong> {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
//           <div><strong>Time:</strong> 10:00 AM – 11:00 AM</div>
//         </div>
//       </Card>

//       {/* Bulk Buttons */}
//       <div className="flex gap-4">
//         <Button onClick={() => bulkMark('P')}>Mark All Present</Button>
//         <Button variant="destructive" onClick={() => bulkMark('A')}>Mark All Absent</Button>
//       </div>

//       {/* Students Table */}
//       <div className="border rounded-xl overflow-hidden">
//         <div className="grid grid-cols-5 font-semibold bg-gray-100 px-4 py-2">
//           <div>#</div><div>Student</div><div>Previous %</div><div>Attendance</div><div>Notes</div>
//         </div>
//         {students.map((student, idx) => (
//           <div key={student.id} className="grid grid-cols-5 items-center px-4 py-2 border-t">
//             <div>{idx + 1}</div>
//             <div>{student.name}</div>
//             <div>{student.previousPercentage ?? 'N/A'}%</div>
//             <div className="flex gap-2">
//               {attendanceOptions.map(option => (
//                 <button
//                   key={option}
//                   onClick={() => handleStatusChange(student.id, option)}
//                   className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center transition-all ${
//                     student.status === option ? 'ring-2 ring-black' : 'opacity-60'
//                   }`}
//                   style={{ backgroundColor: optionColors[option] }}
//                 >
//                   {optionFullToShort[option]}
//                 </button>
//               ))}
//             </div>
//             <div>
//               <Input value={student.note} onChange={e => handleNoteChange(student.id, e.target.value)} placeholder="Optional note" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chart */}
//       <div className="flex items-center justify-center">
//         <PieChart width={240} height={240}>
//           <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={optionColors[entry.name]} />
//             ))}
//           </Pie>
//         </PieChart>
//       </div>

//       {/* Submit Buttons */}
//       <div className="flex flex-wrap gap-4">
//         <Button disabled={submitting} onClick={() => handleSubmit(true)}>Save & New</Button>
//         <Button disabled={submitting} variant="default" onClick={() => handleSubmit(false)}>Save & Close</Button>
//         <Button variant="outline" onClick={() => bulkMark('')}>Clear</Button>
//         <Button variant="destructive" onClick={() => fetchStudents(date)}>Cancel</Button>
//       </div>
//     </div>
//   );
// }
