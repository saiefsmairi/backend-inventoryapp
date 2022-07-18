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
    const { Datedebut, Datefin,employee ,zone,company} = req.body
    console.log(req.body)
    const affectation = await Affectation.create(
        {
            Datedebut:moment(Datedebut).format('YYYY-MM-DD'),
            Datefin:moment(Datefin).format('YYYY-MM-DD'),
            employee,
            zone,
            company
        }
    )
    if(affectation){
        res.status(200).json(affectation)

    }
})

const findAffectationByCompany = async (req, res) => {
    Affectation.find({ company: req.params.companyid }, function (err, aff) {
        res.status(200).json(aff)
    }).populate('employee').populate('zone')


}


module.exports = {
    addaffectation,
    findAffectationByCompany
}