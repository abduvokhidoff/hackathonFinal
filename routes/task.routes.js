const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const upload = require('../middleware/upload')
const controller = require('../controllers/task.controller')

router.use(auth)
router.post('/', role('super_admin'), controller.createTask)
router.get('/my', role('employee'), controller.getEmployeeTasks)
router.post(
	'/:id/submit',
	role('employee'),
	upload.single('file'),
	controller.submitTask
)
router.patch('/:id/review', role('super_admin'), controller.reviewTask)
router.delete('/:id', role('super_admin'), controller.deleteTask)

module.exports = router
