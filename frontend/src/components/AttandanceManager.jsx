import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const AttendanceManager = () => {
  const user = useSelector((state) => state.auth.user);
  const teacherId=user._id;

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendanceId, setAttendanceId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchClassesAndSubjects = async () => {
    console.log(teacherId);
    const { data } = await axios.get(`http://localhost:8080/api/teacher/assignclasses/${teacherId}`,{withCredentials:true});
    console.log(data);
    const classes = data.classes.map(item => ({
      _id: item._id,
      className: item.className,
      section: item.section,
      academicYear: item.academicYear,
    }));

    const subjects = data.classes.flatMap(item =>
      item.subjects.map(sub => ({
        ...sub,
        classId: item._id,
        className: item.className,
        section: item.section
      }))
    );

    setClasses(classes);
    setSubjects(subjects);
  };

  const fetchAttendance = async () => {
    const res = await axios.get("http://localhost:8080/api/attendance/bydate", {
      params: { teacherId, classId, subjectId, date },
    },{withCredentials:true});
    setStudents(res.data.students);
    setAttendanceId(res.data.attendanceId);
  };

  const handleStatusChange = (index, value) => {
    const updated = [...students];
    updated[index].status = value;
    setStudents(updated);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...students];
    updated[index].note = value;
    setStudents(updated);
  };

  const handleUpdate = async () => {
    if (!attendanceId) return alert("No attendance record to update");

    await axios.put(`http://localhost:8080/api/attendance/update/${attendanceId}`, {


      attendance: students.map((s) => ({
        student: s._id,
        status: s.status,
        remarks: s.note,
      }))
    },
      { withCredentials: true }
    );

    alert("Attendance updated");
  };

  useEffect(() => {
    fetchClassesAndSubjects();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Manage Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select onValueChange={setClassId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls._id} value={cls._id}>
                {cls.className} {cls.section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSubjectId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((sub) => (
              <SelectItem key={sub._id} value={sub._id}>
                {sub.subjectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={fetchAttendance}>Fetch Attendance</Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b font-semibold">
                <th className="p-2 text-left">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id} className="border-b">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">
                    <Select value={s.status} onValueChange={(val) => handleStatusChange(i, val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    <Textarea value={s.note} onChange={(e) => handleNoteChange(i, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {attendanceId && (
        <div className="flex justify-end">
          <Button onClick={handleUpdate}>Update Attendance</Button>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;
