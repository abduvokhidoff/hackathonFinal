const Employee = require('../models/Employee')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
	const {
		name,
		role,
		password,
		birthdate,
		basicSalary,
		penalty,
		bonus,
		avance,
	} = req.body
	const hashedPassword = await bcrypt.hash(password, 10)
	const employee = await Employee.create({
		name,
		role,
		password: hashedPassword,
		birthdate,
		basicSalary,
		penalty,
		bonus,
		avance,
	})
	res.status(201).json(employee)
}

exports.login = async (req, res) => {
	const { name, password } = req.body
	const employee = await Employee.findOne({ name })
	if (!employee) return res.status(404).json({ message: 'Employee not found' })

	const match = await bcrypt.compare(password, employee.password)
	if (!match) return res.status(401).json({ message: 'Wrong password' })

	const token = jwt.sign(
		{ id: employee._id, role: employee.role },
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	)
	res.json({ token, employee })
}
