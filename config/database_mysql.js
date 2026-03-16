const mysql = require("mysql2/promise");

const config = {
  db: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    connectTimeout: 60000,
  },
  multipleStatements: true, //for Store Procedures
  listPerPage: 10, //for pagination
};

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  return results;
}

/**
 * 
 * @param id 
 * @returns User by id
 * 
 * Store Procedure in MySQL:
 * CREATE PROCEDURE `sp_search_user_by_id`(IN userid int)
  BEGIN
    SELECT full_name, email, modified_at, register_at
    FROM user
    where id = userid;
  END
 * 
 * 
 * 
 */
async function callSpSearch(id) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.query(
    "CALL sp_search_user_by_id(" + id + ")"
  );

  return results;
}

module.exports = {
  query,
  config,
  callSpSearch,
};
