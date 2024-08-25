const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log('you need to specify at least a password')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://alejandroarpu:${password}@cluster0.934ew.mongodb.net/phoneAgenda?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person',personSchema)

if(process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name,person.number)
    })
    mongoose.connection.close()
  })
} else {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}