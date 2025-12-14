const classModel = require('../models/classModel');


async function registerClass(req, res) {
    
    try {

        const { 
            sFirstName,
            sLastName,
            className,
            dateOfBirth,
            pgFirstName,
            pgLastName,
            streetAddress,
            lga,
            state,
            phone,
            email,
            schedule,
            currency,
            fee
        } = req.body

        const Class = new classModel({

            sFirstName,
            sLastName,
            className,
            dateOfBirth,
            pgFirstName,
            pgLastName,
            streetAddress,
            lga,
            state,
            phone,
            email,
            schedule,
            currency,
            fee
        })

        await Class.save()

        return res.status(201).json({message: "Class register successfully"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


async function getStudentByClass(req, res) {

    const className = req.params.className;

    let class_name;

    try {

        class_name = await classModel.findOne({className: className})

        if (!class_name) {
            return res.status(404).json({message: "No class available by this name"})
        }
        
        const students = await classModel.find({className: className})

        if (!students || students.length === 0) {
            return res.status(404).json({message: "No student register for this class"})
        }

        return res.status(200).json({students})

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


async function getAllClass(req, res) {

    let classes;

    try {
        classes = await classModel.find()

        if (!classes || classes.length === 0) {
            return res.status(404).json({message: "No class found"})
        }

        return res.status(201).json({classes})

    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Server error"})
    }
}


module.exports = {

    registerClass,
    getAllClass,
    getStudentByClass
}