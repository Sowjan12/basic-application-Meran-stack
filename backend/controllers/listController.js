
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const ListItem = require('../models/ListItem');
const Agent = require('../models/Agent');

// @desc    Upload CSV/Excel file and distribute items
// @route   POST /api/lists/upload
// @access  Private (Admin only)
const uploadList = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const file = req.files.file;
    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: 'Only CSV, XLSX, and XLS files are allowed.' });
    }

    let items = [];

    if (file.mimetype === 'text/csv') {
        const results = [];
        fs.createReadStream(file.tempFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                items = results.map(row => ({
                    firstName: row.FirstName,
                    phone: row.Phone,
                    notes: row.Notes || '',
                }));
                distributeAndSave(items, res);
            });
    } else {
        const workbook = xlsx.read(file.tempFilePath, { type: 'file' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);

        items = json.map(row => ({
            firstName: row.FirstName,
            phone: row.Phone,
            notes: row.Notes || '',
        }));
        distributeAndSave(items, res);
    }
};

const distributeAndSave = async (items, res) => {
    const agents = await Agent.find({});
    if (agents.length === 0) {
        return res.status(400).json({ message: 'No agents available for distribution.' });
    }

    const numAgents = agents.length;
    const itemsPerAgent = Math.floor(items.length / numAgents);
    let remainder = items.length % numAgents;

    let agentIndex = 0;
    for (let i = 0; i < items.length; i++) {
        items[i].assignedTo = agents[agentIndex]._id;
        if ((i + 1) % itemsPerAgent === 0 && remainder <= 0) {
            agentIndex = (agentIndex + 1) % numAgents;
        } else if ((i + 1) % (itemsPerAgent + 1) === 0 && remainder > 0) {
            remainder--;
            agentIndex = (agentIndex + 1) % numAgents;
        }
    }

    try {
        await ListItem.insertMany(items);
        res.status(201).json({ message: 'List uploaded and distributed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving items to database.', error: error.message });
    }
};

// @desc    Get distributed lists for an agent
// @route   GET /api/lists/agent/:id
// @access  Private (Agent/Admin)
const getAgentLists = async (req, res) => {
    const listItems = await ListItem.find({ assignedTo: req.params.id }).populate('assignedTo', 'name email');
    res.json(listItems);
};

module.exports = { uploadList, getAgentLists };


