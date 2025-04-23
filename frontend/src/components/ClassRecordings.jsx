import React, { useState } from 'react'
import { Search, Filter, Calendar, Clock, Users, Download, Play, X } from 'lucide-react'

// Mock data for class recordings
const recordings = [
  {
    id: 1,
    title: "Introduction to Data Structures",
    date: "2024-03-15",
    duration: "1:30:00",
    students: 45,
    video: "/videos/1.mp4",
    thumbnail: "/thumbnails/ds.jpg",
    subject: "Computer Science",
    teacher: "Dr. Smith"
  },
  {
    id: 2,
    title: "Advanced Calculus Lecture",
    date: "2024-03-14",
    duration: "1:45:00",
    students: 38,
    video: "/videos/2.mp4",
    thumbnail: "/thumbnails/calculus.jpg",
    subject: "Mathematics",
    teacher: "Prof. Johnson"
  },
  {
    id: 3,
    title: "Web Development Basics",
    date: "2024-03-13",
    duration: "2:00:00",
    students: 52,
    video: "/videos/3.mp4",
    thumbnail: "/thumbnails/webdev.jpg",
    subject: "Computer Science",
    teacher: "Ms. Davis"
  },
  {
    id: 4,
    title: "Physics: Quantum Mechanics",
    date: "2024-03-12",
    duration: "1:15:00",
    students: 40,
    video: "/videos/4.mp4",
    thumbnail: "/thumbnails/physics.jpg",
    subject: "Physics",
    teacher: "Dr. Wilson"
  },
  {
    id: 5,
    title: "English Literature Discussion",
    date: "2024-03-11",
    duration: "1:20:00",
    students: 35,
    video: "/videos/5.mp4",
    thumbnail: "/thumbnails/literature.jpg",
    subject: "English",
    teacher: "Prof. Brown"
  },
  {
    id: 6,
    title: "Chemistry Lab Session",
    date: "2024-03-10",
    duration: "1:50:00",
    students: 42,
    video: "/videos/6.mp4",
    thumbnail: "/thumbnails/chemistry.jpg",
    subject: "Chemistry",
    teacher: "Dr. Miller"
  }
]

const ClassRecordings = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedVideo, setSelectedVideo] = useState(null)

  const subjects = ['all', 'Computer Science', 'Mathematics', 'Physics', 'English', 'Chemistry']

  const filteredRecordings = recordings
    .filter(recording => 
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedSubject === 'all' || recording.subject === selectedSubject)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date)
      } else if (sortBy === 'students') {
        return b.students - a.students
      }
      return 0
    })

  const handleDownload = (videoPath) => {
    // Create a temporary link element
    const link = document.createElement('a')
    link.href = videoPath
    link.download = videoPath.split('/').pop()
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 p-4">
      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <video
              controls
              className="w-full rounded-lg"
              src={selectedVideo.video}
            >
              Your browser does not support the video tag.
            </video>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Subject: {selectedVideo.subject}</p>
                <p>Teacher: {selectedVideo.teacher}</p>
                <p>Date: {new Date(selectedVideo.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDownload(selectedVideo.video)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Download size={18} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Class Recordings</h1>
          <p className="text-gray-500">Access and manage all class recordings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search recordings..."
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border rounded-md appearance-none bg-white"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border rounded-md appearance-none bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="students">Sort by Students</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecordings.map(recording => (
          <div key={recording.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="relative group">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedVideo(recording)}
                    className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play size={32} />
                  </button>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {recording.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{recording.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(recording.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{recording.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Subject:</span>
                  <span>{recording.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Teacher:</span>
                  <span>{recording.teacher}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setSelectedVideo(recording)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Play size={18} />
                  Watch Recording
                </button>
                <button
                  onClick={() => handleDownload(recording.video)}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClassRecordings 