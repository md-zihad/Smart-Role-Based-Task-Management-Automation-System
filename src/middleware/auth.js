const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({error: 'token missing'});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({error: 'token invalid'});
        req.user = user;
        next();
    })


};

module.exports = {authenticationToken};