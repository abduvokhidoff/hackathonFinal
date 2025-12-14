const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const controller = require('../controllers/employee.controller')

router.use(auth, role('super_admin'))
router.get('/final', controller.getEmployeesWithFinalSalary)
router.put('/:id', controller.updateEmployee)
router.delete('/:id', controller.deleteEmployee)

module.exports = router
