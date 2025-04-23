import React from 'react'
import { MapPin, Users, BookOpen, Award, ChevronUp, ChevronDown } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

// Mock data for demonstration
const studentData = [
  { id: 1, name: "John Doe", progress: 85, location: "New York", assignments: 12, completed: 10, grade: "A" },
  { id: 2, name: "Jane Smith", progress: 72, location: "Los Angeles", assignments: 12, completed: 8, grade: "B" },
  { id: 3, name: "Mike Johnson", progress: 90, location: "Chicago", assignments: 12, completed: 11, grade: "A+" },
  { id: 4, name: "Sarah Williams", progress: 65, location: "Houston", assignments: 12, completed: 7, grade: "C" },
  { id: 5, name: "David Brown", progress: 78, location: "Phoenix", assignments: 12, completed: 9, grade: "B+" },
  { id: 6, name: "Emily Davis", progress: 88, location: "Seattle", assignments: 12, completed: 10, grade: "A" },
  { id: 7, name: "Robert Wilson", progress: 70, location: "Boston", assignments: 12, completed: 8, grade: "B" },
  { id: 8, name: "Lisa Anderson", progress: 95, location: "San Francisco", assignments: 12, completed: 11, grade: "A+" },
  { id: 9, name: "James Taylor", progress: 60, location: "Miami", assignments: 12, completed: 7, grade: "C" },
  { id: 10, name: "Emma Martinez", progress: 82, location: "Denver", assignments: 12, completed: 9, grade: "B+" },
]

// Data for charts
const gradeDistribution = [
  { name: "A+", value: 2 },
  { name: "A", value: 2 },
  { name: "B+", value: 2 },
  { name: "B", value: 2 },
  { name: "C", value: 2 },
]

const progressOverTime = [
  { month: "Jan", progress: 65 },
  { month: "Feb", progress: 70 },
  { month: "Mar", progress: 75 },
  { month: "Apr", progress: 80 },
  { month: "May", progress: 85 },
  { month: "Jun", progress: 90 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const ProgressReport = () => {
  const [activeTab, setActiveTab] = React.useState('students')
  const [sortOrder, setSortOrder] = React.useState('asc')

  const sortedStudents = [...studentData].sort((a, b) => {
    return sortOrder === 'asc' ? a.progress - b.progress : b.progress - a.progress
  })

  return (
    <div className="space-y-6 p-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Total Students</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Average Progress</h3>
            <BookOpen className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-gray-500">+2% from last month</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Top Performer</h3>
            <Award className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">Lisa Anderson</div>
            <p className="text-xs text-gray-500">95% completion rate</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Locations</h3>
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-gray-500">Active regions</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs for Detailed View */}
      <div className="space-y-4">
        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Student Progress
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'assignments'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assignment Analysis
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'locations'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Geographic Distribution
          </button>
        </div>

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Student Progress Overview</h2>
                <p className="text-sm text-gray-500">Detailed progress of each student</p>
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                Sort by Progress
                {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-4">
              {sortedStudents.map((student) => (
                <div key={student.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.completed}/{student.assignments} assignments completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{student.progress}%</p>
                      <div className="w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Assignment Analysis</h2>
            <p className="text-sm text-gray-500 mb-4">Performance across different assignments</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Most Challenging</h3>
                <p className="text-sm text-gray-500">Advanced Calculus</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-purple-500" style={{ width: '65%' }} />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Best Performing</h3>
                <p className="text-sm text-gray-500">Data Structures</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-green-500" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Geographic Distribution</h2>
            <p className="text-sm text-gray-500 mb-4">Student locations and performance by region</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentData.map((student) => (
                <div key={student.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">{student.location}</p>
                    <p className="text-sm text-gray-500">
                      {student.progress}% average progress
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
          Export Report
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
          Generate Detailed Analysis
        </button>
      </div>
    </div>
  )
}

export default ProgressReport 