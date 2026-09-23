const express = require('express');
const router = express.Router();
const {
  listUsers,
  setUserStatus,
  listProjects,
  deleteProject,
  listReports,
  decideReport,
  getStatistics,
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All admin routes require a valid JWT AND the admin role.
router.use(authMiddleware, adminMiddleware);

router.get('/users', listUsers);
router.patch('/users/:id/status', setUserStatus);
router.get('/projects', listProjects);
router.delete('/projects/:id', deleteProject);
router.get('/reports', listReports);
router.patch('/reports/:id', decideReport);
router.get('/statistics', getStatistics);

module.exports = router;
