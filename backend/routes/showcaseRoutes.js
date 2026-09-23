const express = require('express');
const router = express.Router();
const {
  publishShowcase,
  listShowcases,
  getShowcaseById,
  likeShowcase,
  unlikeShowcase,
  listComments,
  addComment,
} = require('../controllers/showcaseController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public reads
router.get('/', listShowcases);
router.get('/:id', getShowcaseById);
router.get('/:id/comments', listComments);

// Authenticated writes
router.post('/', authMiddleware, publishShowcase);          // owner + COMPLETED project
router.post('/:id/like', authMiddleware, likeShowcase);     // idempotent
router.delete('/:id/like', authMiddleware, unlikeShowcase); // idempotent
router.post('/:id/comments', authMiddleware, addComment);

module.exports = router;
