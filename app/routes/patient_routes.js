const express = require('express')
const router = express.Router()

const {
    Patient,
    Record
} = require('../models/patient')

const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const requireOwnership = customErrors.requireOwnership;

// import passport
const passport = require('passport')

//use authenticate
const requireToken = passport.authenticate('bearer', {
    session: false
})



//index
router.get('/patients', requireToken, (req, res) => {
    const userId = req.user._id
    // console.log(userid)
    Patient.find({
            "owner": userId
        })
        .then(
            patients => {
                res.status(200).json({
                    patients
                })
            })
        .catch(
            err => console.log(err)
        )
})



// create  -post
router.post('/patients', requireToken, (req, res) => {
    const newPatient = req.body.patient
    const userId = req.user._id
    newPatient.owner = userId
    Patient.create(newPatient)
        .then(
            patient => {
                res.status(201).json({
                    patient: patient
                })
            }
        )
        .catch(
            err => console.log(err))
})



// show - get
router.get('/patients/:patientid', requireToken, (req, res, next) => {
    const patientid = req.params.patientid
    Patient.findById(patientid)
        .then(
            patient => {
                // requireOwnership(req, patient)
                res.status(200).json({
                    patient: patient
                })
            }
        )
        .catch(next)

})
//create Record for the patient "for Embaded"
router.post('/patients/:patientid', requireToken, (req, res, next) => {
    // const record = req.body.record;
    const newRecord = new Record(req.body.record)
    const patientId = req.params.patientid
    Patient.update(
        {_id: patientId},
        {$push: {records: newRecord}}
        )
        .then(
            updateProcess => res.send(updateProcess)
        )
        .catch(
            err => res.send(err)
        )
})

//update

router.patch('/patients/:patientid', requireToken, (req, res, next) => {
    const patientid = req.params.patientid
    const updatePatient = req.body.patient
    // console.log(updatePatient)
    Patient.findById(patientid)
        .then(
            patient => {
                requireOwnership(req, patient)
                return patient.update(updatePatient)
            }
        )
        .then(() => res.sendStatus(204))
        .catch(next)
})

// destroy - delete
router.delete('/patients/:patientid', requireToken, (req, res, next) => {
    const patientid = req.params.patientid
    Patient.findById(patientid)
        .then(
            patient => {
                requireOwnership(req, patient)
                return patient.remove()
            }
        ).then(() => res.sendStatus(204))
        .catch(next)
})






module.exports = router