import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00'];

export default function StudentWeeklyTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjectId, setFilteredSubjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const today = dayjs().format('dddd');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/timetable/me', {
          withCredentials: true,
        });
        setTimetable(data);
      } catch (error) {
        console.error('Failed to fetch timetable', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/subject', {
          withCredentials: true,
        });
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };

    fetchData();
    fetchSubjects();
  }, []);

  const getClassAt = (day, time) => {
    return timetable.find(item => {
      const classStart = dayjs(item.startTime);
      const matchesTime = classStart.format('HH:mm') === time;
      const matchesDay = item.day === day;
      const matchesSubject = !filteredSubjectId || item.subject?._id === filteredSubjectId;
      return matchesTime && matchesDay && matchesSubject;
    });
  };

  const getColor = subject => {
    const colors = {
      Mathematics: 'bg-blue-100 text-blue-900',
      Physics: 'bg-green-100 text-green-900',
      History: 'bg-purple-200 text-purple-900',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const handleOpenReminder = (item) => {
    setSelectedClass(item);
    setReminderTime(dayjs(item.startTime).format('YYYY-MM-DDTHH:mm'));
    setIsDialogOpen(true);
  };

  const handleSaveReminder = () => {
    console.log('Reminder set for:', selectedClass.subject?.name, 'at', reminderTime);
    setIsDialogOpen(false);
    // Optional: Call backend API or schedule local notification
  };

  if (loading) return <p className="text-center text-muted-foreground">Loading timetable...</p>;

  return (
    <div className="p-4 overflow-x-auto">
      {/* Header with Filter Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📅 Weekly Timetable</h2>
        <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
          🎯 Apply Filter
        </Button>
      </div>

      {/* Timetable Grid */}
      <div className="min-w-[900px] grid grid-cols-[100px_repeat(5,1fr)] border rounded-lg shadow-md overflow-hidden">
        {/* Header Row */}
        <div className="bg-gray-100 p-3 font-bold text-sm border-r">Time</div>
        {WEEK_DAYS.map(day => (
          <div
            key={day}
            className={clsx(
              'p-3 font-bold text-sm text-center border-r last:border-none',
              day === today ? 'bg-yellow-100 border-yellow-400 border-b-2' : 'bg-gray-100'
            )}
          >
            <div>{day}</div>
            <div className="text-xs text-gray-500">
              {dayjs().day(WEEK_DAYS.indexOf(day) + 1).format('DD MMM')}
            </div>
          </div>
        ))}

        {/* Time Slots */}
        {TIME_SLOTS.map(slot => (
          <React.Fragment key={slot}>
            <div className="p-3 text-sm font-medium border-r border-t bg-gray-50">{slot}</div>
            {WEEK_DAYS.map(day => {
              const item = getClassAt(day, slot);
              const isToday = day === today;

              return (
                <div
                  key={day + slot}
                  className={clsx(
                    'p-2 border-t border-r last:border-r-0 h-36',
                    isToday && 'bg-yellow-50'
                  )}
                >
                  {item ? (
                    <Card
                      className={clsx(
                        'h-full w-full rounded-xl p-3 flex flex-col justify-between shadow-md transition hover:scale-[1.015] duration-200',
                        getColor(item.subject?.name),
                        isToday && 'ring-2 ring-yellow-500'
                      )}
                    >
                      <div>
                        <p className="font-bold text-sm">{item.subject?.name}</p>
                        <p className="text-xs mt-0.5">{item.teacher?.name}</p>
                        <p className="text-xs">{item.room}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {item.withZoom && (
                          <Button
                            size="sm"
                            className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => window.open(item.zoomLink, '_blank')}
                          >
                            Join
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleOpenReminder(item)}
                        >
                          Set Reminder
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                      -
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Reminder Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Reminder</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <>
              <div className="mb-4">
                <p className="text-sm">
                  <strong>Subject:</strong> {selectedClass.subject?.name}
                </p>
                <p className="text-sm">
                  <strong>Time:</strong> {dayjs(selectedClass.startTime).format('dddd, HH:mm')}
                </p>
              </div>
              <Input
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveReminder}>Set Reminder</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Filter Timetable by Subject</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Subject</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={filteredSubjectId || ''}
              onChange={(e) => setFilteredSubjectId(e.target.value || null)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setFilteredSubjectId(null);
              setIsFilterDialogOpen(false);
            }}>
              Clear Filter
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>Apply Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import clsx from 'clsx';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';

// const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00'];

// export default function StudentWeeklyTimetable() {
//   const [timetable, setTimetable] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [reminderTime, setReminderTime] = useState('');

//   const today = dayjs().format('dddd');
//   const currentDate = dayjs();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:8080/api/timetable/me', {
//           withCredentials: true,
//         });
//         setTimetable(data);
//       } catch (error) {
//         console.error('Failed to fetch timetable', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getClassAt = (day, time) => {
//     return timetable.find(item => {
//       const classStart = dayjs(item.startTime);
//       return item.day === day && classStart.format('HH:mm') === time;
//     });
//   };

//   const getColor = subject => {
//     const colors = {
//       Mathematics: 'bg-blue-100 text-blue-900',
//       Physics: 'bg-green-100 text-green-900',
//       History: 'bg-purple-200 text-purple-900',
//     };
//     return colors[subject] || 'bg-gray-100 text-gray-800';
//   };

//   const handleOpenReminder = (item) => {
//     setSelectedClass(item);
//     setReminderTime(dayjs(item.startTime).format('YYYY-MM-DDTHH:mm'));
//     setIsDialogOpen(true);
//   };

//   const handleSaveReminder = () => {
//     console.log('Reminder set for:', selectedClass.subject?.name, 'at', reminderTime);
//     setIsDialogOpen(false);
//     // Optional: Call backend API or schedule local notification
//   };

//   if (loading) return <p className="text-center text-muted-foreground">Loading timetable...</p>;

//   return (
//     <div className="p-4 overflow-x-auto">
//       <div className="min-w-[900px] grid grid-cols-[100px_repeat(5,1fr)] border rounded-lg shadow-md overflow-hidden">
//         {/* Header Row */}
//         <div className="bg-gray-100 p-3 font-bold text-sm border-r">Time</div>
//         {WEEK_DAYS.map(day => (
//           <div
//             key={day}
//             className={clsx(
//               'p-3 font-bold text-sm text-center border-r last:border-none',
//               day === today ? 'bg-yellow-100 border-yellow-400 border-b-2' : 'bg-gray-100'
//             )}
//           >
//             <div>{day}</div>
//             <div className="text-xs text-gray-500">
//               {dayjs().day(WEEK_DAYS.indexOf(day) + 1).format('DD MMM')}
//             </div>
//           </div>
//         ))}

//         {/* Time Slots */}
//         {TIME_SLOTS.map(slot => (
//           <React.Fragment key={slot}>
//             <div className="p-3 text-sm font-medium border-r border-t bg-gray-50">{slot}</div>
//             {WEEK_DAYS.map(day => {
//               const item = getClassAt(day, slot);
//               const isToday = day === today;

//               return (
//                 <div
//                   key={day + slot}
//                   className={clsx(
//                     'p-2 border-t border-r last:border-r-0 h-36',
//                     isToday && 'bg-yellow-50'
//                   )}
//                 >
//                   {item ? (
//                     <Card
//                       className={clsx(
//                         'h-full w-full rounded-xl p-3 flex flex-col justify-between shadow-md transition hover:scale-[1.015] duration-200',
//                         getColor(item.subject?.name),
//                         isToday && 'ring-2 ring-yellow-500'
//                       )}
//                     >
//                       <div>
//                         <p className="font-bold text-sm">{item.subject?.name}</p>
//                         <p className="text-xs mt-0.5">{item.teacher?.name}</p>
//                         <p className="text-xs">{item.room}</p>
//                       </div>
//                       <div className="flex gap-2 mt-2">
//                         {item.withZoom && (
//                           <Button
//                             size="sm"
//                             className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
//                             onClick={() => window.open(item.zoomLink, '_blank')}
//                           >
//                             Join
//                           </Button>
//                         )}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="text-xs"
//                           onClick={() => handleOpenReminder(item)}
//                         >
//                           Set Reminder
//                         </Button>
//                       </div>
//                     </Card>
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
//                       -
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Reminder Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Set Reminder</DialogTitle>
//           </DialogHeader>
//           {selectedClass && (
//             <>
//               <div className="mb-4">
//                 <p className="text-sm">
//                   <strong>Subject:</strong> {selectedClass.subject?.name}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Time:</strong> {dayjs(selectedClass.startTime).format('dddd, HH:mm')}
//                 </p>
//               </div>
//               <Input
//                 type="datetime-local"
//                 value={reminderTime}
//                 onChange={(e) => setReminderTime(e.target.value)}
//               />
//               <DialogFooter className="mt-4">
//                 <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                 <Button onClick={handleSaveReminder}>Set Reminder</Button>
//               </DialogFooter>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import clsx from 'clsx';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';

// const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00'];

// export default function StudentWeeklyTimetable() {
//   const [timetable, setTimetable] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const today = dayjs().format('dddd');
//   const currentDate = dayjs();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:8080/api/timetable/me', {
//           withCredentials: true,
//         });
//         setTimetable(data);
//       } catch (error) {
//         console.error('Failed to fetch timetable', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getClassAt = (day, time) => {
//     return timetable.find(item => {
//       const classStart = dayjs(item.startTime);
//       return item.day === day && classStart.format('HH:mm') === time;
//     });
//   };

//   const getColor = subject => {
//     const colors = {
//       Mathematics: 'bg-blue-100 text-blue-900',
//       Physics: 'bg-green-100 text-green-900',
//       History: 'bg-purple-200 text-purple-900',
//     };
//     return colors[subject] || 'bg-gray-100 text-gray-800';
//   };

//   if (loading) return <p className="text-center text-muted-foreground">Loading timetable...</p>;

//   return (
//     <div className="p-4 overflow-x-auto">
//       <div className="min-w-[900px] grid grid-cols-[100px_repeat(5,1fr)] border rounded-lg shadow-md overflow-hidden">
//         {/* Header Row */}
//         <div className="bg-gray-100 p-3 font-bold text-sm border-r">Time</div>
//         {WEEK_DAYS.map(day => (
//           <div
//             key={day}
//             className={clsx(
//               'p-3 font-bold text-sm text-center border-r last:border-none',
//               day === today ? 'bg-yellow-100 border-yellow-400 border-b-2' : 'bg-gray-100'
//             )}
//           >
//             <div>{day}</div>
//             <div className="text-xs text-gray-500">{dayjs().day(WEEK_DAYS.indexOf(day) + 1).format('DD MMM')}</div>
//           </div>
//         ))}

//         {/* Time Slots */}
//         {TIME_SLOTS.map(slot => (
//           <React.Fragment key={slot}>
//             <div className="p-3 text-sm font-medium border-r border-t bg-gray-50">{slot}</div>
//             {WEEK_DAYS.map(day => {
//               const item = getClassAt(day, slot);
//               const isToday = day === today;

//               return (
//                 <div
//                   key={day + slot}
//                   className={clsx(
//                     'p-2 border-t border-r last:border-r-0 h-36',
//                     isToday && 'bg-yellow-50'
//                   )}
//                 >
//                   {item ? (
//                     <Card
//                       className={clsx(
//                         'h-full w-full rounded-xl p-3 flex flex-col justify-between shadow-md transition hover:scale-[1.015] duration-200',
//                         getColor(item.subject?.name),
//                         isToday && 'ring-2 ring-yellow-500'
//                       )}
//                     >
//                       <div>
//                         <p className="font-bold text-sm">{item.subject?.name}</p>
//                         <p className="text-xs mt-0.5">{item.teacher?.name}</p>
//                         <p className="text-xs">{item.room}</p>
//                       </div>
//                       {item.withZoom && (
//                         <Button
//                           size="sm"
//                           className="text-xs font-medium mt-2 bg-blue-600 hover:bg-blue-700 text-white"
//                           onClick={() => window.open(item.zoomLink, '_blank')}
//                         >
//                           Join
//                         </Button>
//                       )}
//                     </Card>
//                   ) : (
//                     <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
//                       -
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// }
