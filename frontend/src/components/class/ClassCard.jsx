import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import UpdateClassDialog from './UpdateClassdialog.jsx';
import AssignTeacherDialog from './AssignTeacherDialog.jsx';

export default function ClassCard({ classItem,setClasses,setClassItem }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);

  return (
    <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-sky-100 to-white hover:scale-[1.02] transition-transform">
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-blue-700">{classItem?.className} - {classItem?.section}</h3>
        <p className="text-gray-500">Year: {classItem?.academicYear}</p>
        <p className="text-sm text-gray-600 mt-2">Subjects: {classItem?.subjects?.length}</p>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpenUpdate(true)}>Update</Button>
          <Button onClick={() => setOpenAssign(true)}>Assign Teacher</Button>
        </div>
      </CardContent>

      <UpdateClassDialog open={openUpdate} setOpen={setOpenUpdate} classItem={classItem} setClasses={setClasses} setClassItem ={setClassItem}/>
      <AssignTeacherDialog open={openAssign} setOpen={setOpenAssign} classItem={classItem} />
    </Card>
  );
}
