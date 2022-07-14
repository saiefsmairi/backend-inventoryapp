const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')
const Area = require('../models/area')

// @desc    add new area and assign it a company
// @route   POST /area
// @access  Public
const addArea = asyncHandler(async (req, res) => {
    const { code, name, companyid } = req.body
    console.log(req.body)
    const area = await Area.create(
        {
            code,
            name
        }
    )
    const company = Company.findById({ _id: req.body.companyid })
    Area.findById({ _id: area._id }, function (err, user) {
        if (company && user) {
            try {
                Company.findByIdAndUpdate({ _id: req.body.companyid }, { $push: { areas: { area: user } } }, function (err, ff) {
                    if (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: err,
                        });
                    }
                    res.status(200).json({
                        status: 'success',
                        message: 'an area has been added to the company succesfully  ',
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
            throw new Error('no company or user with that id')
        }


    })


})


const deleteAreaFromCompany = async (req, res, next) => {

    Area.findById({ _id: req.body.areaid }, function (err, user) {

        const company = Company.findById({ _id: req.body.companyid })
        if (company) {
            try {
                Company.findByIdAndUpdate({ _id: req.body.companyid }, { $pull: { areas: { area: user } } }, function (err, ff) {
                    console.log(ff)
                    if (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'error is deleteAreaFromCompany method',
                        });

                    }
                    else {
                        Area.findByIdAndDelete(req.body.areaid);
                        res.status(200).json({
                            status: 'success',
                            message: 'an area has been deleted from the company succesfully',
                            data: {
                                company: ff,
                            },
                        });
                    }

                })
            } catch (error) {
                console.log(error)
            }

        } else {
            res.status(400)
            throw new Error('no company with that id')
        }

    });


    Area.findByIdAndDelete(req.body.areaid);

};

const deleteArea = async (req, res) => {
    id = req.params.id;
    console.log(id)
    Area.findByIdAndDelete(id, (err, data) => {
        res.status(200).json({ message: 'area deleteed' })

    });
}

const updateArea = async (req, res, next) => {
    console.log(req.body)
    const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, {});

    res.status(200).json({
        status: 'success',
        data: {
            company: updatedArea,
        },
    });
};


module.exports = {
    addArea,
    deleteAreaFromCompany,
    deleteArea,
    updateArea
}