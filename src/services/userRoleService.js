const db = require('../config/db');

async function getRoleNameById(roleId){
    const query = 'SELECT name FROM roles WHERE id = $1';
    const result = await db.query(query, [roleId]);

    if(result.rows.length === 0) return null;
    return result.rows[0].name;
}

module.exports = {
    getRoleNameById
};