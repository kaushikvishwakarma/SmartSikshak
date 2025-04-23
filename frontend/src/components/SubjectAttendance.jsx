import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useSelector } from 'react-redux';

const COLORS = {
  present: '#16a34a',
  absent: '#dc2626',
  late: '#facc15',
  leave: '#3b82f6',
};

const SubjectAttendance = () => {
  const user = useSelector((state) => state.auth.user);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, leave: 0 });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/student/subjects/${user._id}`, {
          withCredentials: true,
        });
        setSubjects(res.data.subjects);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    if (user?._id) {
      fetchSubjects();
    }
  }, [user]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedSubject) return;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/attendance/subject/${selectedSubject}/${user._id}`,
          { withCredentials: true }
        );
        setAttendanceData(res.data.records);
        
        // Calculate summary
        const sum = { present: 0, absent: 0, late: 0, leave: 0 };
        res.data.records.forEach(record => {
          sum[record.status.toLowerCase()]++;
        });
        setSummary(sum);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    if (selectedSubject) {
      fetchAttendance();
    }
  }, [selectedSubject, user]);

  const pieData = Object.entries(summary).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
  }));

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">Subject-wise Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Summary Chart */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-[300px] h-[300px]">
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name.toLowerCase()]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(summary).map(([status, count]) => (
                <Card key={status} className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: COLORS[status] }}>
                      {count}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{status}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Attendance Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Marked By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell className={
                    `font-semibold ${record.status === 'present' ? 'text-green-600' :
                      record.status === 'absent' ? 'text-red-600' :
                        record.status === 'late' ? 'text-yellow-600' : 'text-blue-600'}`
                  }>
                    {record.status}
                  </TableCell>
                  <TableCell>{record.session}</TableCell>
                  <TableCell>{record.remarks || '-'}</TableCell>
                  <TableCell>{record.markedBy?.name || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectAttendance; 