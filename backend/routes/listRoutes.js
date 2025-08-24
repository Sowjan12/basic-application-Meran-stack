
const express = require('express');
const { uploadList, getAgentLists } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');
const fileupload = require('express-fileupload');

const router = express.Router();

router.use(fileupload({ useTempFiles: true }));

router.post('/upload', protect, uploadList);
router.get('/agent/:id', protect, getAgentLists);

module.exports = router;


