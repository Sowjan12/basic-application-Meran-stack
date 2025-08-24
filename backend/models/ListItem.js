
const mongoose = require('mongoose');

const listItemSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: false,
    },
}, {
    timestamps: true,
});

const ListItem = mongoose.model('ListItem', listItemSchema);

module.exports = ListItem;


