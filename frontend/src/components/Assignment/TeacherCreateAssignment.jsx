import React, { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils'; // For conditional Tailwind utility (if using shadcn default setup)

const CreateAssignmentDialog = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    questions: [''],
    classId: '',
    subjectId: '',
    startDate: '',
    dueDate: '',
    attachments: [],
  });

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchClasses = async () => {
    const res = await axios.get('http://localhost:8080/api/teacher/classes', {
      withCredentials: true,
    });
    setClasses(res.data.classes);
  };

  const fetchSubjects = async (classId) => {
    const res = await axios.get(`http://localhost:8080/api/class/classsubjects/${classId}`, {
      withCredentials: true,
    });
    setSubjects(res.data.subjects);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleFileChange = (e) => {
    setForm({ ...form, attachments: [...e.target.files] });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'attachments') {
        value.forEach((file) => data.append('attachments', file));
      } else if (key === 'questions') {
        data.append('questions', JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    await axios.post('http://localhost:8080/api/teacher/assignments', data, { withCredentials: true });
    setOpen(false);

    setForm({
      title: '',
      description: '',
      questions: [''],
      classId: '',
      subjectId: '',
      startDate: '',
      dueDate: '',
      attachments: [],
    });

    onCreate();
  };

  const isFormValid = () => {
    const { title, description, classId, subjectId, startDate, dueDate } = form;
    return title && description && classId && subjectId && startDate && dueDate;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white hover:bg-primary/90 transition-all duration-200">
          + Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-xl p-6',
          'animate-in fade-in zoom-in duration-200'
        )}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Create New Assignment</h2>
            <p className="text-sm text-muted-foreground">Provide all necessary details to create a new assignment.</p>
          </div>

          <div className="grid gap-3">
            <Label>Title</Label>
            <Input
              value={form.title}
              placeholder="Enter assignment title"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              placeholder="Enter assignment description"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Questions</Label>
            {form.questions.map((q, idx) => (
              <Input
                key={idx}
                value={q}
                placeholder={`Question ${idx + 1}`}
                onChange={(e) => {
                  const updated = [...form.questions];
                  updated[idx] = e.target.value;
                  setForm({ ...form, questions: updated });
                }}
                className="mb-2"
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-fit flex items-center gap-1 text-primary border-primary"
              onClick={() => setForm({ ...form, questions: [...form.questions, ''] })}
            >
              <PlusIcon className="w-4 h-4" /> Add Question
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Class</Label>
              <select
                className="w-full border rounded px-3 py-2 focus:ring-primary"
                value={form.classId}
                onChange={(e) => {
                  setForm({ ...form, classId: e.target.value, subjectId: '' });
                  fetchSubjects(e.target.value);
                }}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Subject</Label>
              <select
                className="w-full border rounded px-3 py-2 focus:ring-primary"
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Attachments</Label>
            <Input type="file" multiple onChange={handleFileChange} />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="bg-green-600 hover:bg-green-700 text-white transition duration-200"
            >
              Submit Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentDialog;

// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { PlusIcon } from 'lucide-react';
// import axios from 'axios';

// const CreateAssignmentDialog = ({ onCreate }) => {
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     questions: [''],
//     classId: '',
//     subjectId: '',
//     startDate: '',
//     dueDate: '',
//     attachments: [],
//   });

//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const fetchClasses = async () => {
//     const res = await axios.get('http://localhost:8080/api/teacher/classes', { withCredentials: true });
//     setClasses(res.data.classes);
//   };

//   const fetchSubjects = async (classId) => {
//     const res = await axios.get(`http://localhost:8080/api/class/classsubjects/${classId}`, { withCredentials: true });
//     setSubjects(res.data.subjects);
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const handleFileChange = (e) => {
//     setForm({ ...form, attachments: [...e.target.files] });
//   };

//   const handleSubmit = async () => {
//     const data = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (key === 'attachments') {
//         value.forEach((file) => data.append('attachments', file));
//       } else if (key === 'questions') {
//         data.append('questions', JSON.stringify(value));
//       } else {
//         data.append(key, value);
//       }
//     });

//     await axios.post('http://localhost:8080/api/teacher/assignments', data,{withCredentials:true});
//     setOpen(false);

//     // Reset form
//     setForm({
//       title: '',
//       description: '',
//       questions: [''],
//       classId: '',
//       subjectId: '',
//       startDate: '',
//       dueDate: '',
//       attachments: [],
//     });

//     onCreate();
//   };

//   const isFormValid = () => {
//     const { title, description, classId, subjectId, startDate, dueDate } = form;
//     return title && description && classId && subjectId && startDate && dueDate;
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-primary text-white hover:bg-primary/90">+ Create Assignment</Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl space-y-5">
//         <div className="space-y-2">
//           <h2 className="text-xl font-bold">New Assignment</h2>
//           <p className="text-sm text-muted-foreground">Fill in the assignment details below.</p>
//         </div>

//         <div className="space-y-2">
//           <Label>Title</Label>
//           <Input
//             value={form.title}
//             placeholder="Enter assignment title"
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label>Description</Label>
//           <Textarea
//             value={form.description}
//             placeholder="Enter assignment description"
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label>Questions</Label>
//           {form.questions.map((q, idx) => (
//             <Input
//               key={idx}
//               value={q}
//               placeholder={`Question ${idx + 1}`}
//               className="mb-2"
//               onChange={(e) => {
//                 const updated = [...form.questions];
//                 updated[idx] = e.target.value;
//                 setForm({ ...form, questions: updated });
//               }}
//             />
//           ))}
//           <Button
//             variant="outline"
//             size="sm"
//             className="flex items-center gap-1"
//             onClick={() => setForm({ ...form, questions: [...form.questions, ''] })}
//           >
//             <PlusIcon className="w-4 h-4" /> Add Question
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label>Class</Label>
//             <select
//               className="w-full border rounded px-3 py-2"
//               value={form.classId}
//               onChange={(e) => {
//                 setForm({ ...form, classId: e.target.value, subjectId: '' });
//                 fetchSubjects(e.target.value);
//               }}
//             >
//               <option value="">Select Class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="space-y-2">
//             <Label>Subject</Label>
//             <select
//               className="w-full border rounded px-3 py-2"
//               value={form.subjectId}
//               onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
//             >
//               <option value="">Select Subject</option>
//               {subjects.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.subjectName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label>Start Date</Label>
//             <Input
//               type="date"
//               value={form.startDate}
//               onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Due Date</Label>
//             <Input
//               type="date"
//               value={form.dueDate}
//               onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label>Attachments</Label>
//           <Input type="file" multiple onChange={handleFileChange} />
//         </div>

//         <div className="flex justify-end">
//           <Button
//             onClick={handleSubmit}
//             disabled={!isFormValid()}
//             className="bg-green-600 hover:bg-green-700 text-white"
//           >
//             Submit Assignment
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateAssignmentDialog;

// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import axios from 'axios';
// import { Textarea } from '@/components/ui/textarea';

// const CreateAssignmentDialog = ({ onCreate }) => {
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     questions: [''],
//     classId: '',
//     subjectId: '',
//     startDate: '',
//     dueDate: '',
//     attachments: [],
//   });
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const fetchClasses = async () => {
//     const res = await axios.get('http://localhost:8080/api/teacher/classes',{withCredentials:true});
//     console.log(res.data);
//     setClasses(res.data.classes);
//   };

//   const fetchSubjects = async (classId) => {
//     const res = await axios.get(`http://localhost:8080/api/class/classsubjects/${classId}`,{withCredentials:true});
//     console.log(res.data);
//     setSubjects(res.data.subjects);
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const handleFileChange = (e) => {
//     setForm({ ...form, attachments: [...e.target.files] });
//   };

//   const handleSubmit = async () => {
//     const data = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (key === 'attachments') {
//         value.forEach((file) => data.append('attachments', file));
//       } else if (key === 'questions') {
//         data.append('questions', JSON.stringify(value));
//       } else {
//         data.append(key, value);
//       }
//     });

//     await axios.post('/api/teacher/assignments', data);
//     setOpen(false);
//     onCreate();
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>Create Assignment</Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-xl space-y-4">
//         <h2 className="text-lg font-semibold">Create Assignment</h2>

//         <Label>Title</Label>
//         <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

//         <Label>Description</Label>
//         <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

//         <Label>Questions</Label>
//         {form.questions.map((q, idx) => (
//           <Input key={idx} value={q} onChange={(e) => {
//             const updated = [...form.questions];
//             updated[idx] = e.target.value;
//             setForm({ ...form, questions: updated });
//           }} />
//         ))}
//         <Button variant="secondary" size="sm" onClick={() => setForm({ ...form, questions: [...form.questions, ''] })}>+ Add Question</Button>

//         <Label>Class</Label>
//         <select
//           className="w-full border rounded px-2 py-1"
//           onChange={(e) => {
//             setForm({ ...form, classId: e.target.value });
//             fetchSubjects(e.target.value);
//           }}
//         >
//           <option value="">Select</option>
//           {classes.map((cls) => (
//             <option value={cls._id} key={cls._id}>{cls.className}</option>
//           ))}
//         </select>

//         <Label>Subject</Label>
//         <select className="w-full border rounded px-2 py-1" onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
//           <option value="">Select</option>
//           {subjects.map((s) => (
//             <option key={s._id} value={s._id}>{s.subjectName}</option>
//           ))}
//         </select>

//         <Label>Start Date</Label>
//         <Input type="date" onChange={(e) => setForm({ ...form, startDate: e.target.value })} />

//         <Label>Due Date</Label>
//         <Input type="date" onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />

//         <Label>Attachments</Label>
//         <Input type="file" multiple onChange={handleFileChange} />

//         <Button onClick={handleSubmit}>Submit</Button>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateAssignmentDialog;
