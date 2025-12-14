const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['super_admin','employee'], required: true },
  password: { type: String, required: true },
  birthdate: { type: Date, required: true },
  basicSalary: { type: Number, default: 5000000 },
  penalty: { type: Number, default: 500000 },
  bonus: { type: Number, default: 200000 },
  avance: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model('Employee', employeeSchema)
