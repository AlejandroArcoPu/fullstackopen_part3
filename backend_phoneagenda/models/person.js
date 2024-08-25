const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
  .then(() => {
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
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{5,}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Must be {2,3}-{8+}!`
    },
    required: true,
    minLength: 8
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