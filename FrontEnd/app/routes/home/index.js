

//router 모듈화

const express = require("express");
const router = express.Router(); //라우터 객체 생성
const ctrl = require("./home.ctrl"); //home.ctrl.js 파일 불러오기

//main 페이지 관련 라우팅
router.get("/", ctrl.main.root); //get 방식으로 / 경로에 접속하면 home.ctrl.js의 output 객체의 home 메서드 실행

router.get("/about", ctrl.main.about);

router.get("/faq", ctrl.main.faq);


router.get("/project", ctrl.main.project);


router.get("/session", ctrl.main.session);


router.get("/application", ctrl.main.application);

router.get("/application/content", ctrl.main.applicationSubmit);


//account 페이지 관련 라우팅
router.get("/account/login", ctrl.account.login);

router.get("/account/signup", ctrl.account.signup);

//admin 페이지 관련 라우팅

router.get("/admin", ctrl.admin.main);


router.get("/admin/project", ctrl.admin.project);

router.get("/admin/project/write", ctrl.admin.projectCreate);

router.get("/admin/project/fix", ctrl.admin.projectFix);


router.get("/admin/session", ctrl.admin.session);

router.get("/admin/session/write", ctrl.admin.sessionCreate);

router.get("/admim/session/fix", ctrl.admin.sessionFix);


router.get("/admin/application", ctrl.admin.application);

router.get("/admin/application/write", ctrl.admin.applicationCreate);

router.get("/admin/application/fix", ctrl.admin.applicationFix);

router.get("/admin/application/content", ctrl.admin.applicationSubmit);


module.exports = router; //라우터 객체 모듈화

