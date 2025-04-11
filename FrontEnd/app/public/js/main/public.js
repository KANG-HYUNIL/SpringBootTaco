
import FetchRequestBuilder from "../utils/fetchRequest.js";
import * as URLS from "../utils/fetchURLStr.js";

//일반 사용자 페이지가 공통적으로 활용할 메서드들

function navigateToHome() {
    window.location.href = URLS.UserPage.Home;
}

function navigateToAbout() {
    window.location.href = URLS.UserPage.About;
}

function navigateToSession() {
    window.location.href = URLS.UserPage.Session;
}

function navigateToProject() {
    window.location.href = URLS.UserPage.Project;
}

function navigateToFAQ() {
    window.location.href = URLS.UserPage.FAQ;
}

function navigateToApplication() {
    window.location.href = URLS.UserPage.Application;
}

function navigateToLogin() {
    window.location.href = URLS.UserPage.Login;
}

function navigateToSignUp() {
    window.location.href = URLS.UserPage.SignUp;
}

async function navigateToLogout() {

    const url = URLS.API.Logout;
    const fetchRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod("POST")
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    const response = await fetchRequest;

    //로그아웃 성공 시 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('access');
    localStorage.removeItem('userName');
    window.location.href = '/'; //로그아웃 후 홈으로 이동

}

//로그인 상태에 따라 네비게이션 바 업데이트
function updateNavBar() {

    //로그인 상태에 따라 네비게이션 바 업데이트
    const userName = localStorage.getItem('userName');
    console.log(userName);
    const navBar = document.getElementById('navBar');
    const accessToken = localStorage.getItem('access');

    //로그인 상태라면 사용자의 이름 표시
    if (userName && accessToken)
    {
        navBar.innerHTML = `
            <span class="text-sm font-medium text-gray-900">안녕하세요, ${userName} 님</span>
            <button onclick="navigateToLogout()" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">
                로그아웃
            </button>
        `;
    }
    //로그인 상태가 아니라면 로그인/회원가입 버튼 표시
    else
    {
        navBar.innerHTML = `
            <button onclick="navigateToLogin()" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">
                로그인/회원가입
            </button>
        `;
    }
}


document.addEventListener("DOMContentLoaded", function() {

    // HTML에서 사용할 수 있도록 함수 내보내기
    window.navigateToHome = navigateToHome;
    window.navigateToAbout = navigateToAbout;
    window.navigateToSession = navigateToSession;
    window.navigateToProject = navigateToProject;
    window.navigateToFAQ = navigateToFAQ;
    window.navigateToLogin = navigateToLogin;
    window.navigateToSignUp = navigateToSignUp;
    window.navigateToLogout = navigateToLogout;
    window.navigateToApplication = navigateToApplication;
    updateNavBar();

});