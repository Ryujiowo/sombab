const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");

module.exports = function () {
  const app = express();

  /*미들 웨어 설정*/ //express가 실행되면서 중간에 거쳐가는 것들
  app.use(compression()); // HTTP 요청을 압축 및 해제
  app.use(express.json()); // body값을 파싱
  app.use(express.urlencoded({ extended: true })); //form으로 제출되는 값 파싱
  app.use(methodOverride());// put, delete 요청 처리
  app.use(cors()); //웹 브라우저 cors설정을 관리
  app.use(express.static("/home/ubuntu/food-map/front"));

  // app.use(express.static(process.cwd() + '/public'));

  /*직접 구현해야 하는 모듈*/
  require("../src/routes/indexRoute")(app);

  //express객체를 반환함
  return app;
};
