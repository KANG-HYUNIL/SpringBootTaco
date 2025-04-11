
//html 웹 페이지 파일만 다루는 컨트롤러

//main 페이지
const main = {
    root : async(req, res) => {
        res.render('index');
    },

    about : async(req, res) => {
        res.render('main/about');
    },

    faq : async(req, res) => {
        res.render('main/faq');
    },

    project : async(req, res) => {
        res.render('main/project');
    },

    session : async(req, res) => {
        res.render('main/session')
    },

    application : async(req, res) => {
        res.render('main/application');
    },

    applicationSubmit : async(req, res) => {
        res.render('main/applicationSubmit');
    }

    
};


//admin 페이지
const admin = {
    main : async(req, res) => {
        res.render('admin/admin');
    },

    project : async(req, res) => {
        res.render('admin/adminProject/adminProject');
    },

    projectCreate : async(req, res)=> {
        res.render('admin/adminProject/adminProjectCreate');
    },

    projectFix : async(req, res) => {
        res.render('admin/adminProject/adminProjectCreate');
    },

    session : async(req, res) => {
        res.render('admin/adminSession/adminSession');
    },

    sessionCreate : async(req, res) => {
        res.render('admin/adminSession/adminSessionCreate');
    },

    sessionFix : async(req, res) => {
        res.render('admin/adminSession/adminSessionCreate');
    },

    application : async(req, res) => {
        res.render('admin/adminApplication/adminApplication');
    },

    applicationCreate : async(req, res) => {
        res.render('admin/adminApplication/adminApplicationCreate');
    },

    applicationSubmit : async(req, res) => {
        res.render('admin/adminApplication/adminApplicationSubmit');
    },

    applicationFix : async(req, res) => {
        res.render('admin/adminApplication/adminApplicationCreate');
    }
};

//계정 관련 페이지
const account = {
    login : async(req, res) => {
        res.render('account/login');
    },

    signup : async(req, res) => {
        res.render('account/signup');
    }
};


module.exports = {
    main,
    admin,
    account
}


