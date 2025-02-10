import FetchRequestBuilder from "../utils/fetchRequest.js";
import {accessTokenValidate} from "../utils/tokenHandle.js";
import * as URLS from "../utils/fetchURLStr.js";

// Admin 메인 페이지
export function navigateToAdminHome() {
    window.location.href = URLS.AdminPage.Home;
}

// Admin 프로젝트 페이지
export function navigateToAdminProject() {
    window.location.href = URLS.AdminPage.Project;
}

// Admin 세션 페이지
export function navigateToAdminSession() {
    window.location.href = URLS.AdminPage.Session;
}

// Admin 신청 포멧 페이지
export function navigateToAdminApplication() {
    window.location.href = URLS.AdminPage.Application;
}

// Admin 프로젝트 작성 페이지
function navigateToAdminWriteProject() {
    window.location.href = URLS.AdminPage.WriteProject;
}

// Admin 세션 작성 페이지
function navigateToAdminWriteSession() {
    window.location.href = URLS.AdminPage.WriteSession;
}

// Admin 신청 게시물 작성 페이지
function navigateToAdminWriteApplication() {
    window.location.href = URLS.AdminPage.WriteApplication;
}

//로그인 페이지로 리다이렉트
function redirectToLogin() {
    // 로그인 페이지로 리다이렉트
    localStorage.setItem('redirectToAdmin', 'true');
    window.location.href = '/account/login';
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

document.addEventListener("DOMContentLoaded", async function() {

    // //관리자 권한 점검
    // const isValidToken = await accessTokenValidate();
    // if (!isValidToken) 
    // {
    //     redirectToLogin();
    // } 
    // else 
    // {
    //     updateNavBar();
    // }

    updateNavBar(); //fixme

    // Export functions to be used in HTML
    window.navigateToAdminHome = navigateToAdminHome;
    window.navigateToAdminProject = navigateToAdminProject;
    window.navigateToAdminSession = navigateToAdminSession;
    window.navigateToAdminApplication = navigateToAdminApplication;
    window.navigateToLogout = navigateToLogout;
    window.navigateToAdminWriteProject = navigateToAdminWriteProject;
    window.navigateToAdminWriteSession = navigateToAdminWriteSession;
    window.navigateToAdminWriteApplication = navigateToAdminWriteApplication;

});

