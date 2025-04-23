'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import CreateClassDialog from './CreateClassDialog.jsx';
import ClassCard from './ClassCard.jsx';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    

    axios
      .get('http://localhost:8080/api/class', {
       withCredentials:true,
      })
      .then(res => {
        setClasses(res.data);
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight">Class Management</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl px-4 py-2"
          onClick={() => setOpenCreateDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Class
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length > 0 ? (
          classes.map((classItem, index) => (
            <motion.div
              key={classItem?._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ClassCard classItem={classItem} setClasses={setClasses} setClassItem={setSelectedClass}  />
            
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500 text-lg">No classes created yet.</p>
        )}
      </div>

      <CreateClassDialog open={openCreateDialog} setOpen={setOpenCreateDialog} setClasses={setClasses} />
      
    </div>
  );
}
