/*실제 요청이 들어왔을 때 필요한 로직 구현*/
const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const indexDao = require("../dao/indexDao");

//식당 조회
exports.readRestaurant = async function (req, res) {
  const {category} = req.query;

  //카테고리 값이 넘어 왔다면, 유효한 값인지 체크
  if(category) {
    const validCategory = [
      "한식",
      "중식",
      "일식",
      "양식",
      "아시안",
      "분식",
      "커피/디저트",
      "야식",
      "간편식",
      "기타",
    ];
    if (!validCategory.includes(category)){
      return res.send({
        isSuccess: false,
        code: 400, // 요청 실패시(에러) 400번대 코드, 성공은 200
        message: "유효한 카테고리가 아닙니다.",
      });
    }
  }

  try {
    //pool : 커넥션 객체를 가져오는 방식 , db에 접근할 수 있는 객체 
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //비구조할당 ex) const [a,b,c] = [1,2,3]
      //첫번째 요소만 rows에 할당
      const [rows] = await indexDao.selectRestaurant(connection, category);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시(에러) 400번대 코드, 성공은 200
        message: "식당 목록 요청 성공",
      });//비동기처리(에러잡기)밑에거
    } catch (err) {
      logger.error(`readRestaurant Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readRestaurant DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

// 예시 코드
exports.example = async function (req, res) {
  try {
    //pool : 커넥션 객체를 가져오는 방식 , db에 접근할 수 있는 객체 
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      //비구조할당 ex) const [a,b,c] = [1,2,3]
      //첫번째 요소만 rows에 할당
      const [rows] = await indexDao.exampleDao(connection);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시(에러) 400번대 코드, 성공은 200
        message: "요청 성공",
      });//비동기처리(에러잡기)밑에거
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};
