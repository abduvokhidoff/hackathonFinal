const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect } = require('../middleware/auth')

// GET all users
router.get('/', protect, async (req, res) => {
	try {
		const users = await User.find().select('-password')
		res.json(users)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// GET single user
router.get('/:id', protect, async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password')
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// UPDATE user
router.put('/:id', protect, async (req, res) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// DELETE user
router.delete('/:id', protect, async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json({ message: 'User deleted' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
