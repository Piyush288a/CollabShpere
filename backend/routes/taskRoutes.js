const express = require('express');
const router = express.Router();
const { updateTask, deleteTask } = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/authMiddleware');

// PATCH /api/tasks/:id — update task details/assignee/status (team members only)
router.patch('/:id', authMiddleware, updateTask);

// DELETE /api/tasks/:id — delete a task (team members only)
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;
