import React, { useState } from 'react'
import { Search, MessageSquare, ThumbsUp, ThumbsDown, Send, Filter } from 'lucide-react'

// Mock data for discussions
const discussions = [
  {
    id: 1,
    title: "Help with Calculus Problem",
    author: "John Doe",
    date: "2024-03-15",
    subject: "Mathematics",
    content: "I'm having trouble understanding how to solve this integral problem. Can someone help me with the steps?",
    upvotes: 12,
    downvotes: 2,
    comments: [
      {
        id: 1,
        author: "Dr. Smith",
        date: "2024-03-15",
        content: "Let me help you with that. First, you need to apply integration by parts...",
        upvotes: 8,
        downvotes: 0
      },
      {
        id: 2,
        author: "Jane Smith",
        date: "2024-03-15",
        content: "I found this video helpful for understanding similar problems: [link]",
        upvotes: 5,
        downvotes: 1
      }
    ]
  },
  {
    id: 2,
    title: "Data Structures Question",
    author: "Mike Johnson",
    date: "2024-03-14",
    subject: "Computer Science",
    content: "What's the difference between a stack and a queue? When should I use each?",
    upvotes: 15,
    downvotes: 1,
    comments: [
      {
        id: 1,
        author: "Prof. Davis",
        date: "2024-03-14",
        content: "Great question! A stack follows LIFO (Last In First Out) while a queue follows FIFO (First In First Out)...",
        upvotes: 10,
        downvotes: 0
      }
    ]
  },
  {
    id: 3,
    title: "Physics Lab Report Help",
    author: "Sarah Williams",
    date: "2024-03-13",
    subject: "Physics",
    content: "I need help formatting my lab report. What sections should I include?",
    upvotes: 8,
    downvotes: 0,
    comments: [
      {
        id: 1,
        author: "Dr. Wilson",
        date: "2024-03-13",
        content: "A standard lab report should include: Introduction, Materials, Methods, Results, Discussion, and Conclusion...",
        upvotes: 6,
        downvotes: 0
      }
    ]
  }
]

const DoubtsAndDiscussions = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [newComment, setNewComment] = useState('')
  const [expandedDiscussion, setExpandedDiscussion] = useState(null)

  const subjects = ['all', 'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'English']

  const filteredDiscussions = discussions
    .filter(discussion => 
      (discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       discussion.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedSubject === 'all' || discussion.subject === selectedSubject)
    )

  const handleVote = (type, id, isComment = false) => {
    // Implement voting logic here
    console.log(`Voted ${type} on ${isComment ? 'comment' : 'discussion'} ${id}`)
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Doubts & Discussions</h1>
          <p className="text-gray-500">Ask questions and engage with the community</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search discussions..."
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
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map(discussion => (
          <div key={discussion.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{discussion.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>By {discussion.author}</span>
                  <span>{new Date(discussion.date).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                    {discussion.subject}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote('up', discussion.id)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"
                >
                  <ThumbsUp size={16} />
                  <span>{discussion.upvotes}</span>
                </button>
                <button
                  onClick={() => handleVote('down', discussion.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <ThumbsDown size={16} />
                  <span>{discussion.downvotes}</span>
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{discussion.content}</p>
            
            {/* Comments Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Comments ({discussion.comments.length})</h4>
                <button
                  onClick={() => setExpandedDiscussion(expandedDiscussion === discussion.id ? null : discussion.id)}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  {expandedDiscussion === discussion.id ? 'Collapse' : 'View All'}
                </button>
              </div>
              
              {expandedDiscussion === discussion.id && (
                <div className="mt-4 space-y-4">
                  {discussion.comments.map(comment => (
                    <div key={comment.id} className="pl-4 border-l-2 border-purple-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-1 text-gray-700">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote('up', comment.id, true)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700"
                          >
                            <ThumbsUp size={14} />
                            <span className="text-xs">{comment.upvotes}</span>
                          </button>
                          <button
                            onClick={() => handleVote('down', comment.id, true)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <ThumbsDown size={14} />
                            <span className="text-xs">{comment.downvotes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Comment Form */}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 border rounded-md"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create New Discussion Button */}
      <div className="fixed bottom-6 right-6">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <MessageSquare size={20} />
          <span>New Discussion</span>
        </button>
      </div>
    </div>
  )
}

export default DoubtsAndDiscussions 