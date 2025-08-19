const router = require('express').Router();
const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/',async (req,res) => {
    try {
        const {error} = validate(req.body);
        if(error)
            return res.status(400).send({message:error.details[0].message});
        const existing = await User.findOne({email: req.body.email});
        if(existing)
            return res.status(409).send({message: 'User with given email already exist!'});
        const saltRounds = Number(process.env.SALT) || 10;
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

        await new User({...req.body, password: hashPassword}).save();
        res.status(201).send({message: "User created successfully"})
    }
    catch(error) {
        res.status(500).send({message: 'Internal Server Error'})
    }
})

module.exports = router;

