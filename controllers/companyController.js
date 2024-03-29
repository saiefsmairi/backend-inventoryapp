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

    }).populate('employees.employee').populate('AdminCompany').populate('areas.area');
    //i need populate zone

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


const updateCompanyAddEmployees = async (req, res, next) => {
    User.findById({ _id: req.body.userid }, function (err, user) {

        const company = Company.findById({ _id: req.body.companyid })
        if (company) {
            try {
                Company.findByIdAndUpdate({ _id: req.body.companyid }, { $push: { employees: { employee: user } } }, function (err, ff) {
                    console.log(ff)
                    if (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'error is updateCompanyAddEmployees method',

                        });

                    }
                    res.status(200).json({
                        status: 'success',
                        message: 'an employee has been added to the company succesfully',
                        data: {
                            company: ff,
                        },
                    });
                })


            } catch (error) {
                console.log(error)
            }

        } else {
            res.status(400)
            throw new Error('no company with that id')
        }

    });

};

const deleteEmployeeFromCompany = async (req, res, next) => {

    User.findById({ _id: req.body.userid }, function (err, user) {

        const company = Company.findById({ _id: req.body.companyid })
        if (company) {
            try {
                Company.findByIdAndUpdate({ _id: req.body.companyid }, { $pull: { employees: { employee: user } } }, function (err, ff) {
                    console.log(ff)
                    if (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'error is deleteEmployeeFromCompany method',

                        });

                    }
                    res.status(200).json({
                        status: 'success',
                        message: 'an employee has been deleted from the company succesfully',
                        data: {
                            company: ff,
                        },
                    });
                })


            } catch (error) {
                console.log(error)
            }

        } else {
            res.status(400)
            throw new Error('no company with that id')
        }

    });

    
    User.findByIdAndDelete(req.body.userid) ;

};


module.exports = {
    addCompany,
    FindCompanyByAdminCompanyId,
    updateCompany,
    updateCompanyAddEmployees,
    deleteEmployeeFromCompany
}