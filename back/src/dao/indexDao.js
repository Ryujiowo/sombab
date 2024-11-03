/*데이터 베이스 접근*/
const { pool } = require("../../config/database");

exports.selectRestaurant =  async function (connection, category) {
  const selectAllRestaurantQuery = `SELECT title, address, link, category FROM restaurant where status = 'A'`;
  const selectCategorizedRestaurantQuery = `SELECT title, address, link, category FROM restaurant where status = 'A' AND category = ?`;

  const Params = [category];
  
  const Query = category ? selectCategorizedRestaurantQuery : selectAllRestaurantQuery;

  const rows = await connection.query(Query, Params);

  return rows;
};
