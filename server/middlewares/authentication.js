const jwt = require('jsonwebtoken');

// ====================
// Verificar Token
// ====================
let verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = decoded.user;
        next();
    });

};

// ====================
// Verificar Admin Role
// ====================
let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user && user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: 'Unauthorized'
        })
    }

};


module.exports = {
    verifyToken,
    verifyAdminRole
}