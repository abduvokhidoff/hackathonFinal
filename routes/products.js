const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { protect } = require('../middleware/auth')

// CREATE product
router.post('/', protect, async (req, res) => {
	try {
		const product = await Product.create({ ...req.body, owner: req.user._id })
		res.status(201).json(product)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// GET all products
router.get('/', protect, async (req, res) => {
	try {
		const products = await Product.find().populate('owner', 'name email photo')
		res.json(products)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// GET single product
router.get('/:id', protect, async (req, res) => {
	try {
		const product = await Product.findById(req.params.id).populate(
			'owner',
			'name email photo'
		)
		if (!product) return res.status(404).json({ message: 'Product not found' })
		res.json(product)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// UPDATE product
router.put('/:id', protect, async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		if (!product) return res.status(404).json({ message: 'Product not found' })
		res.json(product)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

// DELETE product
router.delete('/:id', protect, async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id)
		if (!product) return res.status(404).json({ message: 'Product not found' })
		res.json({ message: 'Product deleted' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

module.exports = router
