const { getRoleNameById } = require('../services/userRoleService');


function allowRoles(...allowedRoles) {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if(!user){
                return res.status(401).json({message: 'Unauthorized: No user information found'});
            }

            const roleName = await getRoleNameById(user.role_id);

            if(!roleName){
                return res.status(403).json({message: 'Forbidden: User role not found'});
            }

            if(!allowedRoles.includes(roleName)){
                return res.status(403).json({message: 'Forbidden: Insufficient role permissions'});
            }

            next();
        } catch(err){
            console.log(err);
            res.status(500).json({message: 'RBAC check failed'});
        }

    };
}

module.exports = allowRoles;