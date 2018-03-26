var mysql = require('./mysql');
var utils = require('../utils');

module.exports = {
    createId() {
        let prefix = '';
        let date = new Date();
        prefix += ('' + date.getFullYear())[3];
        prefix += utils.zero(date.getMonth() + 1);
        prefix += utils.zero(date.getDate());
        prefix += date.getDay();
        return utils.createId(prefix, 4, this);
    },
    add(){
        return mysql.query(`insert into \`leizuoa\`.\`stockout\` set ${mysql.escape(data)}`);
    },
    getList(){
        return mysql.query('');
    }

}