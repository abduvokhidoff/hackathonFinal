const Task = require('../models/Task')
const Employee = require('../models/Employee')

// SUPER_ADMIN creates a task
exports.createTask = async (req, res) => {
	const task = await Task.create(req.body)
	res.status(201).json(task)
}

// EMPLOYEE views their tasks
exports.getEmployeeTasks = async (req, res) => {
	const tasks = await Task.find({ attachedEmployeeId: req.user.id })
	res.json(tasks)
}

// EMPLOYEE submits task with file
exports.submitTask = async (req, res) => {
	const task = await Task.findById(req.params.id)
	if (task.attachedEmployeeId.toString() !== req.user.id)
		return res.status(403).json({ message: 'Not allowed' })

	task.file = req.file.path
	await task.save()
	res.json({ message: 'Task submitted', task })
}

// SUPER_ADMIN reviews task
exports.reviewTask = async (req, res) => {
	const { approve } = req.body
	const task = await Task.findById(req.params.id)
	if (approve) {
		task.completed = true
		const employee = await Employee.findById(task.attachedEmployeeId)
		if (employee) {
			employee.bonus += task.bonus
			employee.penalty += task.penalty
			await employee.save()
		}
	}
	await task.save()
	res.json({ message: approve ? 'Task approved' : 'Task rejected', task })
}

// Delete task
exports.deleteTask = async (req, res) => {
	await Task.findByIdAndDelete(req.params.id)
	res.json({ message: 'Task deleted' })
}
