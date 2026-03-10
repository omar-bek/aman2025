const express = require('express');
const router = express.Router();
const { getConcerns, getConcern, createConcern, suggestConcern } = require('../controllers/concern');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getConcerns)
  .post(protect, authorize('parent'), createConcern);

router.route('/ai/suggest').post(protect, authorize('parent'), suggestConcern);

router.route('/:id').get(protect, getConcern);

module.exports = router;

