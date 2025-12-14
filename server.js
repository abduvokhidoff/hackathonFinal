require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/employees', require('./routes/employee.routes'))
app.use('/api/tasks', require('./routes/task.routes'))

app.get('/', (req, res) => res.send('Employee Management API Running'))

app.listen(process.env.PORT, () =>
	console.log(`Server running on port ${process.env.PORT}`)
)
