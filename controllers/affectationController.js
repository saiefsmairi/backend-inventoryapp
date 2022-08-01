const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const Affectation = require('../models/affectation')
const Area = require('../models/area')
const Zone = require('../models/zone')
const moment = require('moment');

// @desc    add new affectation 
// @route   POST /affectation
// @access  Public
const addaffectation = asyncHandler(async (req, res) => {
    const { Datedebut, Datefin, employee, zone, company } = req.body
    console.log(req.body)
    const affectation = await Affectation.create(
        {
            Datedebut: moment(Datedebut).format('YYYY-MM-DD'),
            Datefin: moment(Datefin).format('YYYY-MM-DD'),
            employee,
            zone,
            company
        }
    )
    if (affectation) {
        res.status(200).json(affectation)

    }
})

const findAffectationByCompany = async (req, res) => {
    Affectation.find({ company: req.params.companyid }, function (err, aff) {
        res.status(200).json(aff)
    }).populate('employee').populate('zone')
}

const findAffectationByEmployee = async (req, res) => {
    Affectation.find({ employee: req.params.employeeid }, function (err, aff) {
        res.status(200).json(aff)
    }).populate('employee').populate('zone').populate('company')
}

const deleteAffectation = async (req, res) => {
    id = req.params.affid;
    console.log(id)
    Affectation.findByIdAndDelete(id, (err, data) => {
        res.status(200).json({ message: 'Affectation deleteed' })
        if (err) {
            res.status(400).json({
                status: 'failed',
                message: 'error is deleteAffectation method',

            });

        }
    });
}

const updateAffectation = async (req, res, next) => {
    console.log(req.params.id)
    console.log(req.body)

    const updatedAffectation = await Affectation.findByIdAndUpdate(req.params.id, req.body, {});
    res.status(200).json({
        status: 'success',
        data: {
            company: updatedAffectation,
        },
    });
};


module.exports = {
    addaffectation,
    findAffectationByCompany,
    deleteAffectation,
    updateAffectation,
    findAffectationByEmployee
}