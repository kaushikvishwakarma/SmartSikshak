import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Input
} from '@/components/ui/input';
import {
  Button
} from '@/components/ui/button';
import {
  Label
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Switch
} from '@/components/ui/switch';
import dayjs from 'dayjs';

const formSchema = z.object({
  subject: z.string().nonempty("Subject is required"),
  className: z.string().trim().min(1, "Class name is required"),
  teacher: z.string().nonempty("Teacher is required"),
  room: z.string().optional(),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], {
    errorMap: () => ({ message: "Day is required" })
  }),
  startTime: z.string().nonempty("Start time is required"),
  endTime: z.string().nonempty("End time is required"),
  recurrence: z.enum(['none', 'daily', 'weekly'], {
    errorMap: () => ({ message: "Recurrence is required" })
  }),
  withZoom: z.boolean()
});

export default function CreateTimetable() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange', 
    defaultValues: {
      recurrence: 'none',
      withZoom: false,
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, teachersRes] = await Promise.all([
          axios.get('http://localhost:8080/api/subject', { withCredentials: true }),
          axios.get('http://localhost:8080/api/users?usertype=teacher', { withCredentials: true })
        ]);
        setSubjects(subjectsRes.data || []);
        setTeachers(teachersRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // manually convert start and end time from string to Date
      const payload = {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };

      await axios.post('http://localhost:8080/api/timetable', payload, { withCredentials: true });
      alert('Class created successfully!');
      reset();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // const onSubmit = async (data) => {
  //   setLoading(true);
  //   try {
  //     await axios.post('http://localhost:8080/api/timetable', data, { withCredentials: true });
  //     alert('Class created successfully!');
  //     reset();
  //   } catch (err) {
  //     console.error(err);
  //     alert(err.response?.data?.error || 'Something went wrong!');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Card className="max-w-4xl mx-auto mt-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Create Class Timetable</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Select onValueChange={(val) => {
              setValue('subject', val, { shouldValidate: true });
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(sub => (
                  <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
          </div>

          {/* Class Name */}
          <div>
            <Label>Class Name</Label>
            <Input
              placeholder="e.g. BTech AID-A"
              value={watch("className")}
              onChange={(e) => setValue("className", e.target.value, { shouldValidate: true })}
            />
            {errors.className && <p className="text-sm text-red-500">{errors.className.message}</p>}
          </div>

          {/* Teacher */}
          <div>
            <Label>Teacher</Label>
            <Select onValueChange={val => setValue('teacher', val, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(t => (
                  <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teacher && <p className="text-sm text-red-500">{errors.teacher.message}</p>}
          </div>

          {/* Day */}
          <div>
            <Label>Day</Label>
            <Select onValueChange={val => setValue('day', val, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.day && <p className="text-sm text-red-500">{errors.day.message}</p>}
          </div>

          {/* Start Time */}
          <div>
            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              {...register('startTime')}
              onChange={(e) => setValue('startTime', e.target.value)}
            />

            {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
          </div>

          {/* End Time */}
          <div>
            <Label>End Time</Label>
            <Input
              type="datetime-local"
              {...register('endTime')}
              onChange={(e) => setValue('endTime', e.target.value)}
            />
            {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
          </div>

          {/* Room */}
          <div>
            <Label>Room</Label>
            <Input placeholder="Room Number or Zoom Label" {...register('room')} />
          </div>

          {/* Recurrence */}
          <div>
            <Label>Recurrence</Label>
            <Select onValueChange={val => setValue('recurrence', val, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurrence && <p className="text-sm text-red-500">{errors.recurrence.message}</p>}
          </div>

          {/* Zoom Option */}
          <div className="flex items-center justify-between">
            <Label>With Zoom</Label>
            <Switch
              checked={watch('withZoom')}
              onCheckedChange={val => setValue('withZoom', val)}
            />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Timetable'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios from 'axios';
// import { z } from 'zod';
// import { useEffect, useState } from 'react';
// import {
//   Card,
//   CardContent
// } from '@/components/ui/card';
// import {
//   Input
// } from '@/components/ui/input';
// import {
//   Button
// } from '@/components/ui/button';
// import {
//   Label
// } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import {
//   Switch
// } from '@/components/ui/switch';
// import { Textarea } from '@/components/ui/textarea';
// import dayjs from 'dayjs';

// const formSchema = z.object({
//   subject: z.string().nonempty(),
//   className: z.string().trim().nonempty("Class name is required"),
//   teacher: z.string().nonempty(),
//   room: z.string().optional(),
//   day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
//   startTime: z.coerce.date({ required_error: 'Start time is required' }),
//   endTime: z.coerce.date({ required_error: 'End time is required' }),
//   recurrence: z.enum(['none', 'daily', 'weekly']),
//   withZoom: z.boolean()
// });

// export default function CreateTimetable() {
//   const [subjects, setSubjects] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       recurrence: 'none',
//       withZoom: false
//     }
//   });

//   useEffect(() => {
//     // Fetch subjects and teachers
//     const fetchData = async () => {
//       const [subjectsRes, teachersRes] = await Promise.all([
//         axios.get('http://localhost:8080/api/subject', { withCredentials: true }),
//         axios.get('http://localhost:8080/api/users?usertype=teacher', { withCredentials: true })
//       ]);
//       console.log(subjectsRes.data, teachersRes.data);
//       setSubjects(subjectsRes.data || []);
//       setTeachers(teachersRes.data || []);
//     };

//     fetchData();
//   }, []);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       await axios.post('http://localhost:8080/api/timetable', {
//         ...data,
//         startTime: data.startTime,
//         endTime: data.endTime
//       }, { withCredentials: true });
//       alert('Class created successfully!');
//       reset();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.error || 'Something went wrong!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="max-w-4xl mx-auto mt-6">
//       <CardContent className="p-6">
//         <h2 className="text-xl font-bold mb-4">Create Class Timetable</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Subject */}
//           <div>
//             <Label>Subject</Label>
//             <Select onValueChange={val => setValue('subject', val)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select subject" />
//               </SelectTrigger>
//               <SelectContent>
//                 {subjects.map(sub => (
//                   <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
//           </div>

//           {/* Class Name */}
//           <div>
//             <Label>Class Name</Label>
//             <Input placeholder="e.g. BTech AID-A"
//               {...register('className')}
//               defaultValue="" />
//             {errors.className && <p className="text-sm text-red-500">{errors.className.message}</p>}
//           </div>

//           {/* Teacher */}
//           <div>
//             <Label>Teacher</Label>
//             <Select onValueChange={val => setValue('teacher', val)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select teacher" />
//               </SelectTrigger>
//               <SelectContent>
//                 {teachers.map(t => (
//                   <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.teacher && <p className="text-sm text-red-500">{errors.teacher.message}</p>}
//           </div>

//           {/* Day */}
//           <div>
//             <Label>Day</Label>
//             <Select onValueChange={val => setValue('day', val)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select day" />
//               </SelectTrigger>
//               <SelectContent>
//                 {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
//                   <SelectItem key={day} value={day}>{day}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors.day && <p className="text-sm text-red-500">{errors.day.message}</p>}
//           </div>

//           {/* Start Time */}
//           <div>
//             <Label>Start Time</Label>
//             <Input type="datetime-local" {...register('startTime')} />
//             {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
//           </div>

//           {/* End Time */}
//           <div>
//             <Label>End Time</Label>
//             <Input type="datetime-local" {...register('endTime')} />
//             {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
//           </div>

//           {/* Room */}
//           <div>
//             <Label>Room</Label>
//             <Input placeholder="Room Number or Zoom Label" {...register('room')} />
//           </div>

//           {/* Recurrence */}
//           <div>
//             <Label>Recurrence</Label>
//             <Select onValueChange={val => setValue('recurrence', val)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose recurrence" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="none">None</SelectItem>
//                 <SelectItem value="daily">Daily</SelectItem>
//                 <SelectItem value="weekly">Weekly</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Zoom Option */}
//           <div className="flex items-center justify-between">
//             <Label>With Zoom</Label>
//             <Switch checked={watch('withZoom')} onCheckedChange={val => setValue('withZoom', val)} />
//           </div>

//           {/* Submit */}
//           <Button type="submit" disabled={loading}>
//             {loading ? 'Creating...' : 'Create Timetable'}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
