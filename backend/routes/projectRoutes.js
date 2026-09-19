const express = require('express');
const router = express.Router();
const {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  updateStatus,
  deleteProject,
  addBookmark,
  removeBookmark,
} = require('../controllers/projectController');
const {
  createRequest,
  listProjectRequests,
  getProjectTeam,
} = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public reads
router.get('/', listProjects);
router.get('/:id', getProjectById);

// Authenticated write operations
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.patch('/:id/status', authMiddleware, updateStatus);
router.delete('/:id', authMiddleware, deleteProject);

// Bookmarks (any authenticated user)
router.post('/:id/bookmark', authMiddleware, addBookmark);
router.delete('/:id/bookmark', authMiddleware, removeBookmark);

// Collaboration requests (Phase 5)
router.post('/:id/requests', authMiddleware, createRequest);      // send a join request
router.get('/:id/requests', authMiddleware, listProjectRequests); // owner lists incoming requests
router.get('/:id/team', authMiddleware, getProjectTeam);          // team members (owner + memberIds)

module.exports = router;
