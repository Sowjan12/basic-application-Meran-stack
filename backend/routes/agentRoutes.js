
const express = require('express');
const { registerAgent, getAgents, getAgentById, updateAgent, deleteAgent } = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, registerAgent).get(protect, getAgents);
router.route('/:id').get(protect, getAgentById).put(protect, updateAgent).delete(protect, deleteAgent);

module.exports = router;


