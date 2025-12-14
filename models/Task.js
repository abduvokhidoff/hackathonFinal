const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	attachedEmployeeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'employee',
		required: true,
	},
	taskName: { type: String, required: true },
	description: { type: String },
	file: { type: String }, // uploaded file
	completed: { type: Boolean, default: false },
	bonus: { type: Number, default: 0 },
	penalty: { type: Number, default: 0 },
	deadline: { type: Date, required: true }, // new field
	createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Task', taskSchema)
