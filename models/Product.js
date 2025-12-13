const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		name: { type: String, required: true },
		price: { type: Number, required: true },
		description: String,
		photo: String,
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)
