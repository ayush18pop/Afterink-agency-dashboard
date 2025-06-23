const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
<<<<<<< HEAD
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date,
    default: Date.now
  },
=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
  // ✅ CEO-controlled overall task progress
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Hold', 'Completed'],
    default: 'Not Started'
  },
  logs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeLog'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
