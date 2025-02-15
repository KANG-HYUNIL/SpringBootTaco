
//서버 port 번호
const PORT = 8080;

//express 모듈 불러오기
const express = require("express");

//express 객체 생성
const app = express(); 

//app의 view 폴더 연결, 
app.set("views", "./app/views");
app.set("view engine", "ejs");

const home = require("./app/routes/home/index"); //index.js 파일 불러오기

app.use(express.static(`${__dirname}/app/public`)) //정적 파일 제공

app.use("/", home); //use() 메서드로 미들웨어 등록

//server luanch
app.listen(PORT , () => {
    console.log("Server is running on http://localhost:" + PORT);
});