const mongoose = require('mongoose')

const RecordSchema = new mongoose.Schema({
    description:{
        type: String
        
    },
    status:{
        type: String
    }
}, {
    timestamps:true
})
const PatientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    illness:{
        type: String,
        required: true
    }, 
    records:[RecordSchema],
    owner:{ // ref to user auth
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
}, {
    timestamps: true
})

 const Record = mongoose.model('Record',RecordSchema)
 const Patient = mongoose.model('Patient',PatientSchema)
 module.exports = {
     Record,
     Patient
 }