//하나의 전체 모듈 가져옴
const express = require("./config/express");
//특정 부분(logger)만 구조 분해 할당으로 가져옴 //log ->프로세스 돌리면서 나는 에러 로그 등 기록하는거
const { logger } = require("./config/winston"); 



//나는 express 프레임워크를 실행시키겠다.
const port = 3000;
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
