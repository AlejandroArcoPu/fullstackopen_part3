const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
.then( result => {
    console.log('connected to MongoDB')
})
.catch( err => {
    console.log('error connecting to MongoDB: ', err.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject.__v
            delete returnedObject._id
        }
    }
}) 


module.exports = mongoose.model('Person', personSchema)