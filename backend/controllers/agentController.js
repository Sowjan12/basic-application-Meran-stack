
const Agent = require('../models/Agent');

// @desc    Register a new agent
// @route   POST /api/agents
// @access  Private (Admin only)
const registerAgent = async (req, res) => {
    const { name, email, mobileNumber, password } = req.body;

    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
        res.status(400).json({ message: 'Agent already exists' });
    }

    const agent = await Agent.create({
        name,
        email,
        mobileNumber,
        password,
    });

    if (agent) {
        res.status(201).json({
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            mobileNumber: agent.mobileNumber,
        });
    } else {
        res.status(400).json({ message: 'Invalid agent data' });
    }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private (Admin only)
const getAgents = async (req, res) => {
    const agents = await Agent.find({});
    res.json(agents);
};

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private (Admin only)
const getAgentById = async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        res.json(agent);
    } else {
        res.status(404).json({ message: 'Agent not found' });
    }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private (Admin only)
const updateAgent = async (req, res) => {
    const { name, email, mobileNumber, password } = req.body;

    const agent = await Agent.findById(req.params.id);

    if (agent) {
        agent.name = name || agent.name;
        agent.email = email || agent.email;
        agent.mobileNumber = mobileNumber || agent.mobileNumber;
        if (password) {
            agent.password = password;
        }

        const updatedAgent = await agent.save();

        res.json({
            _id: updatedAgent._id,
            name: updatedAgent.name,
            email: updatedAgent.email,
            mobileNumber: updatedAgent.mobileNumber,
        });
    } else {
        res.status(404).json({ message: 'Agent not found' });
    }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private (Admin only)
const deleteAgent = async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        await agent.deleteOne();
        res.json({ message: 'Agent removed' });
    } else {
        res.status(404).json({ message: 'Agent not found' });
    }
};

module.exports = { registerAgent, getAgents, getAgentById, updateAgent, deleteAgent };


