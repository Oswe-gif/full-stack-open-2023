const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password> <name>(optional) <number>(optional)')
	process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const dataBaseName='phonebook-app'
const url =
  `mongodb+srv://Oswe:${password}@cluster0.preosk9.mongodb.net/${dataBaseName}?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
	id: Number,
})
const Person = mongoose.model('Person', personSchema)

if(name === undefined && number === undefined){
	Person.find({}).then(result => {
		console.log('Phonebook:')
		result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}else{
	const persons = new Person({
		name: name,
		number: number,
		id: Math.floor(Math.random() * 500),
	})

	persons.save().then(() => {
		console.log(`Added ${persons.name} number ${persons.number} to phonebook`)
		mongoose.connection.close()
	})
}





