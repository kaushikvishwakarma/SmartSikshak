import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const StudyMaterial = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedClass, setSelectedClass] = useState("");

    const subjects = [
        { id: "math", name: "Mathematics" },
        { id: "science", name: "Science" },
        { id: "english", name: "English" },
        { id: "history", name: "History" },
    ];

    const classes = [
        { id: "class-6", name: "Class 6" },
        { id: "class-7", name: "Class 7" },
        { id: "class-8", name: "Class 8" },
        { id: "class-9", name: "Class 9" },
        { id: "class-10", name: "Class 10" },
    ];

    const materials = [
        {
            id: 1,
            title: "Algebra Basics",
            subject: "Mathematics",
            class: "Class 8",
            type: "pdf",
            uploadedBy: "John Doe",
            date: "2024-04-20",
            description: "Basic concepts of algebra including variables, expressions, and equations.",
            tags: ["Algebra", "Basics", "Mathematics"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 2,
            title: "Chemical Reactions",
            subject: "Science",
            class: "Class 9",
            type: "video",
            uploadedBy: "Jane Smith",
            date: "2024-04-19",
            description: "Understanding different types of chemical reactions and their applications.",
            tags: ["Chemistry", "Reactions", "Science"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 3,
            title: "The Mughal Empire",
            subject: "History",
            class: "Class 7",
            type: "pdf",
            uploadedBy: "Ali Khan",
            date: "2024-04-18",
            description: "A brief history of the Mughal Empire and its impact on India.",
            tags: ["Mughals", "Empire", "History"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 4,
            title: "Photosynthesis Explained",
            subject: "Science",
            class: "Class 8",
            type: "video",
            uploadedBy: "Sara Lee",
            date: "2024-04-17",
            description: "Learn the process of photosynthesis in plants with diagrams.",
            tags: ["Photosynthesis", "Biology", "Plants"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 5,
            title: "Geometry Fundamentals",
            subject: "Mathematics",
            class: "Class 9",
            type: "pdf",
            uploadedBy: "John Doe",
            date: "2024-04-16",
            description: "An introduction to geometry including lines, angles, and shapes.",
            tags: ["Geometry", "Shapes", "Mathematics"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 6,
            title: "World War II Overview",
            subject: "History",
            class: "Class 10",
            type: "presentation",
            uploadedBy: "Emily Brown",
            date: "2024-04-15",
            description: "Key events, causes, and outcomes of World War II.",
            tags: ["WWII", "History", "War"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 7,
            title: "Introduction to HTML",
            subject: "Computer Science",
            class: "Class 10",
            type: "video",
            uploadedBy: "Rahul Mehta",
            date: "2024-04-14",
            description: "Basics of HTML structure and commonly used tags.",
            tags: ["HTML", "Web", "Coding"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 8,
            title: "Tenses in English Grammar",
            subject: "English",
            class: "Class 7",
            type: "pdf",
            uploadedBy: "Anjali Verma",
            date: "2024-04-13",
            description: "Explanation of all 12 tenses with examples and usage.",
            tags: ["Grammar", "English", "Tenses"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 9,
            title: "Periodic Table Guide",
            subject: "Science",
            class: "Class 10",
            type: "pdf",
            uploadedBy: "Jane Smith",
            date: "2024-04-12",
            description: "Detailed guide to elements in the periodic table.",
            tags: ["Chemistry", "Periodic Table", "Elements"],
            fileUrl: "CHESS RULES.pdf",
        },
        {
            id: 10,
            title: "Trigonometry Basics",
            subject: "Mathematics",
            class: "Class 10",
            type: "video",
            uploadedBy: "John Doe",
            date: "2024-04-11",
            description: "Understanding trigonometric ratios and identities.",
            tags: ["Trigonometry", "Math", "Ratios"],
            fileUrl: "CHESS RULES.pdf",
        }
    ];


    const handleUpload = (e) => {
        e.preventDefault();
        // Handle file upload logic here
        toast.success("Material uploaded successfully!");
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Study Materials</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Upload Material</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Upload Study Material</DialogTitle>
                            <DialogDescription>
                                Add new study material to help students learn better.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" placeholder="Enter material title" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Class</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Enter material description" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" type="file" />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Upload</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4 mb-6">
                <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pdf">PDFs</TabsTrigger>
                    <TabsTrigger value="video">Videos</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                    <ScrollArea className="h-[600px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {materials.map((material) => (
                                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{material.title}</CardTitle>
                                                <CardDescription>
                                                    {material.subject} • {material.class}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={material.type === "pdf" ? "default" : "secondary"}>
                                                {material.type.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 mb-4">{material.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {material.tags.map((tag) => (
                                                <Badge key={tag} variant="outline">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src={`https://ui-avatars.com/api/?name=${material.uploadedBy}`} />
                                                <AvatarFallback>{material.uploadedBy[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{material.uploadedBy}</p>
                                                <p className="text-xs text-gray-500">{material.date}</p>
                                            </div>
                                        </div>
                                        {material.fileUrl && (
                                            <a
                                                href={material.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <Button variant="outline">Download</Button>
                                            </a>
                                        )}

                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>
                {/* Add other tab contents similarly */}
            </Tabs>
        </div>
    );
};

export default StudyMaterial;
