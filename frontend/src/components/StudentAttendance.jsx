import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = {
  present: '#16a34a',
  absent: '#dc2626',
  late: '#facc15',
  leave: '#3b82f6',
};

const AttendanceTable = () => {
  const user = useSelector((state) => state.auth.user);
  const studentId = user?._id;
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, leave: 0 });

  useEffect(() => {
    if (!studentId) return;

    axios.get(`http://localhost:8080/api/attendance/recent/${studentId}`, { withCredentials: true })
      .then(res => {
        setAttendance(res.data.data);
        const flat = res.data.data.flatMap(entry => entry.records);
        const sum = { present: 0, absent: 0, late: 0, leave: 0 };
        flat.forEach(a => sum[a.status]++);
        setSummary(sum);
      })
      .catch(console.error);
  }, [studentId]);

  const pieData = Object.entries(summary).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border border-gray-200">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">👤 {user?.name}</h2>
            <p className="text-gray-500 text-sm">🎓 Class: {user?.className || 'N/A'}</p>
          </div>
          <div className="w-[180px] h-[180px]">
            <PieChart width={180} height={180}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={70}
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
        </CardContent>
      </Card>

      {/* Attendance by Date */}
      {attendance.map(({ date, records }) => (
        <Card key={date} className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">📅 {date}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Marked By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((rec) => (
                  <TableRow key={rec._id}>
                    <TableCell>{rec.subject.name}</TableCell>
                    <TableCell className={
                      `font-semibold ${rec.status === 'present' ? 'text-green-600' :
                        rec.status === 'absent' ? 'text-red-600' :
                          rec.status === 'late' ? 'text-yellow-600' : 'text-blue-600'}`
                    }>
                      {rec.status}
                    </TableCell>
                    <TableCell>{rec.session}</TableCell>
                    <TableCell>{rec.remarks || '-'}</TableCell>
                    <TableCell>{rec.markedBy?.name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AttendanceTable;
