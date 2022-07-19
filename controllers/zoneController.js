const asyncHandler = require('express-async-handler')
const Company = require('../models/company')
const User = require('../models/user')
const Area = require('../models/area')
const Zone = require('../models/zone')

// @desc    add new zone and assign it a area
// @route   POST /zone
// @access  Public
const addZone = asyncHandler(async (req, res) => {
    const { code, name } = req.body
    console.log(req.body)
    const zone = await Zone.create(
        {
            code,
            name,
            area: req.body.areaid
        }
    )

    Area.findByIdAndUpdate({ _id: req.body.areaid }, { $push: { zones: { zone: zone } } }, function (err, ff) {
        if (err) {
            res.status(400).json({
                status: 'failed',
                message: err,
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'an Zone has been added to the area succesfully  ',
            data: {
                company: ff,
            },
        });
    })

})

const FindZoneByArea = async (req, res, next) => {
    var areas = []
    areas.push(req.body.data)
    areas.forEach(element => {
        Zone.find({ area: element }, function (err, zone) {
            res.status(200).json(zone)
        })
    });

}

const deleteZoneFromArea = async (req, res, next) => {
    console.log(req.body)
    Zone.findById({ _id: req.body.zoneid }, function (err, user) {
            try {
                Area.findByIdAndUpdate({ _id: req.body.areaid }, { $pull: { zones: { zone: user } } }, function (err, ff) {
                    console.log(ff)
                    if (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'error is deleteAreaFromCompany method',
                        });
                    }
                    else {
                        Zone.findByIdAndDelete(req.body.zoneid);
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
    });


    // Zone.findByIdAndDelete(req.body.areaid);

};

const deleteZone = async (req, res) => {
    id = req.params.id;
    console.log(id)
    Zone.findByIdAndDelete(id, (err, data) => {
        res.status(200).json({ message: 'Zone deleteed' })

    });
}


/*

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
  */

module.exports = {
    addZone,
    FindZoneByArea,
    deleteZoneFromArea,
    deleteZone
}