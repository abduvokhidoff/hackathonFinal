const Task = require('../models/Task')
const Employee = require('../models/Employee')
const mongoose = require('mongoose')

// SUPER_ADMIN creates a task
exports.createTask = async (req, res) => {
	try {
		const {
			attachedEmployeeId,
			taskName,
			description,
			bonus = 0,
			penalty = 0,
			deadline,
		} = req.body

		if (!mongoose.Types.ObjectId.isValid(attachedEmployeeId)) {
			return res.status(400).json({ message: 'Invalid employee ID' })
		}

		if (!deadline) {
			return res.status(400).json({ message: 'Deadline is required' })
		}

		const task = await Task.create({
			attachedEmployeeId,
			taskName,
			description,
			bonus,
			penalty,
			deadline,
		})

		res.status(201).json(task)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// EMPLOYEE views their tasks
exports.getEmployeeTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ attachedEmployeeId: req.user.id })
		res.json(tasks)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// EMPLOYEE submits task with file
exports.submitTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		if (task.attachedEmployeeId.toString() !== req.user.id)
			return res.status(403).json({ message: 'Not allowed' })

		if (!req.file) return res.status(400).json({ message: 'File is required' })

		task.file = req.file.path
		await task.save()

		res.json({ message: 'Task submitted', task })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// SUPER_ADMIN reviews task
exports.reviewTask = async (req, res) => {
	try {
		const { approve } = req.body
		const task = await Task.findById(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		const employee = await Employee.findById(task.attachedEmployeeId)
		if (!employee)
			return res.status(404).json({ message: 'Employee not found' })

		if (approve) {
			task.completed = true

			// 1️⃣ Deadline-based penalty
			const now = new Date()
			if (task.deadline && now <= task.deadline) {
				// Finished before deadline -> reduce penalty
				employee.penalty = Math.max(0, employee.penalty - 100000)
			}

			// 2️⃣ Add task-specific bonus/penalty
			employee.bonus += task.bonus
			employee.penalty += task.penalty

			// 3️⃣ Monthly bonus for 3+ completed tasks
			const startOfMonth = new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				1
			)
			const completedTasksThisMonth = await Task.countDocuments({
				attachedEmployeeId: employee._id,
				completed: true,
				createdAt: { $gte: startOfMonth },
			})

			if (completedTasksThisMonth >= 3) {
				employee.bonus += 300000
			}

			await employee.save()
		}

		await task.save()
		res.json({ message: approve ? 'Task approved' : 'Task rejected', task })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// Delete task
exports.deleteTask = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id))
			return res.status(400).json({ message: 'Invalid task ID' })

		const task = await Task.findByIdAndDelete(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		res.json({ message: 'Task deleted' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
