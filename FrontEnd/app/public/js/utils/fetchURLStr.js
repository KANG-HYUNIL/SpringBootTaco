const apiStr = "/api";

// 관리자 페이지 URL
export const AdminPage = {
    Home: "/admin",

    Project: "/admin/project",
    Session: "/admin/session",
    Application: "/admin/application",

    WriteProject: "/admin/project/write",
    WriteSession: "/admin/session/write",
    WriteApplication: "/admin/application/write",

    FixSession: '/admin/session/fix',
    FixProject: '/admin/project/fix',
    FixApplication : '/admin/application/fix',

    ApplicationContent: (id) => `/admin/application/content?id=${id}`
};

// API 서버로 보내는 요청 URL
export const API = {
    Logout: "/api/logout",
    Login : "/api/login",
    SignUpVerificationReq : '/api/member/email/signup_verification_req',
    SignUp : '/api/account/signup',

    GetProjectData: "/api/getProjectData",
    WriteProject : "/api/admin/writeProject",
    FixProject : "/api/admin/fixProject",
    GetProjectById : '/api/getProjectById',
    DeleteProject : '/api/admin/deleteProject',

    FilePreUpload: '/api/file/preUpload',
    FileDownloadImg: (filePath) => `/api/file/downloadImg?filePath=${encodeURIComponent(filePath)}`,
    FileDownloadFile: (filePath) => `/api/file/downloadFile?filePath=${encodeURIComponent(filePath)}`,

    GetApplicationData: '/api/getApplicationData',
    DeleteApplication : '/api/admin/deleteApplication',
    WriteApplication: '/api/admin/writeApplication',
    FixApplication: '/api/admin/fixApplication',

    GetUserById: '/api/account/getUserById',
    GetUserByName: '/api/account/getUserByName',

    SetRoleAdmin: '/api/admin/setRoleAdmin',
    SetRoleUser: '/api/admin/setRoleUser',

    GetSessionData:  "/api/getSessionData",
    DeleteSession: '/api/admin/deleteSession',
    GetSessionById: '/api/getSessionById',
    WriteSession: '/api/admin/writeSession',
    FixSession: '/api/admin/fixSession',

    GetApplicationById: (id) => `/api/getApplicationById?id=${id}`,
    SubmitApplication: (id) => `/api/application/submit?id=${id}`,

    UserTokenValidate : '/api/validate-token',
    AdminTokenValidate : '/api/validate-admin-token'
};

// 일반 사용자 페이지 URL
export const UserPage = {
    Home: "/",
    About: "/about",
    Session: "/session",
    Project: "/project",
    FAQ: "/faq",
    Application: "/application",
    Login: "/account/login",
    SignUp: "/account/signup",
    ApplicationContent: (id) => `/application/content?id=${id}`
};