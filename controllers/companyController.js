const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')

// @desc    create a new company
// @route   POST /company
// @access  Public
const addCompany = asyncHandler(async (req, res) => {
    const { city, companyadress, companyname, country, postalcode, idcompanyadmin } = req.body


    if (!city || !companyadress || !companyname || !country || !postalcode) {
        res.status(400).json({ message: "Please add all fields" });

    }

    User.findById(idcompanyadmin, (err, data) => {
        const company = Company.create({
            city,
            companyadress,
            companyname,
            country,
            postalcode,
            AdminCompany: data
        })

        if (company) {
            res.status(201).json(
                company
            )
        } else {
            res.status(400).json({ message: "Invalid company data" });

        }

    }
    );

})

const FindCompanyByAdminCompanyId = async (req, res) => {
    Company.find({ AdminCompany: req.params.id }, function (err, company) {
      
        res.status(200).json(company)

    });

}

const updateCompany = async (req, res, next) => {
    console.log(req.body)
    const updatedUser = await Company.findByIdAndUpdate(req.params.id, req.body, {});
  
    res.status(200).json({
      status: 'success',
      data: {
        company: updatedUser,
      },
    });
  };


module.exports = {
    addCompany,
    FindCompanyByAdminCompanyId,
    updateCompany
}