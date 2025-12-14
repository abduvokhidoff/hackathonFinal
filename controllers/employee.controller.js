const Employee = require('../models/Employee')

// Get all employees with final salary calculation
exports.getEmployeesWithFinalSalary = async (req, res) => {
	const employees = await Employee.find({ role: 'EMPLOYEE' })
	const result = employees.map(emp => {
		const finalSalary = emp.basicSalary - emp.avance + emp.bonus - emp.penalty
		return {
			_id: emp._id,
			name: emp.name,
			role: emp.role,
			birthdate: emp.birthdate,
			basicSalary: emp.basicSalary,
			avance: emp.avance,
			bonus: emp.bonus,
			penalty: emp.penalty,
			finalSalary,
		}
	})
	res.json(result)
}

exports.updateEmployee = async (req, res) => {
	const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	})
	res.json(employee)
}

exports.deleteEmployee = async (req, res) => {
	await Employee.findByIdAndDelete(req.params.id)
	res.json({ message: 'Employee deleted' })
}
