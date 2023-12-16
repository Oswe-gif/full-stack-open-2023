const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const validatorLenghtNumber=(number) => {
	const splitNumber =number.split('-')
	return ((splitNumber[0].length===2 && splitNumber[1].length >= 6) || (splitNumber[0].length===3 && splitNumber[1].length>= 5))
}
const validatorSeparatedNumber=(number) => {
	const regex = /^[0-9]*$/
	const splitNumber =number.split('-')
	return (splitNumber.length === 2 && regex.test(splitNumber[0]) && regex.test(splitNumber[1]) && (splitNumber[0].length===2 || splitNumber[0].length===3))
}
const validatedNumber = [
  	{ validator: validatorSeparatedNumber, message: 'The ({VALUE}) must be formed of two parts that are separated by -, the first part must have two or three numbers and the second part also consists of numbers' },
  	{ validator: validatorLenghtNumber, message: 'The ({VALUE}) must have length of 8 or more' }
]

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	//number: String,
	number:{
		type: String,
		require: true,
		validate: validatedNumber
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})


module.exports = mongoose.model('Person', personSchema)