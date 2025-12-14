const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
	{
		attachedEmployeeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Employee',
			required: true,
		},
		taskName: { type: String, required: true },
		description: String,
		photoOrVideo: String,
		file: String,
		completed: { type: Boolean, default: false },
		penalty: { type: Number, default: 0 },
		salary: { type: Number, default: 0 },
		bonus: { type: Number, default: 0 },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
