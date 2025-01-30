document.addEventListener("DOMContentLoaded", function() {
    function navigateToHome() {
        window.location.href = '/';
    }

    function navigateToAbout() {
        window.location.href = '/about';
    }

    function navigateToSession() {
        window.location.href = '/session';
    }

    function navigateToProject() {
        window.location.href = '/project';
    }

    function navigateToFAQ() {
        window.location.href = '/faq';
    }

    function navigateToLogin() {
        window.location.href = '/account/login';
    }

    function navigateToSignUp() {
        window.location.href = "/account/signup";
    }

    //로그아웃 메서드
    function navigateToLogout() {
        //로그아웃 시에는 refreshToken을 서버로 보내서 redis에서 제거할 수 있게 함
        //const refreshToken = localStorage.getItem('refresh');

        //로그아웃 요청을 보낼 URL
        const url = '/logout';

        //서버로 POST 요청을 보내 로그아웃 처리
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                //'refresh': refreshToken
            },
            credentials: 'include' // 쿠키를 포함하여 요청
        })
        .then(response => {


            //로그아웃 성공 시 로컬 스토리지에서 토큰 제거
            localStorage.removeItem('access');
            //localStorage.removeItem('refresh');
            localStorage.removeItem('userName');
            window.location.href = '/'; //로그아웃 후 홈으로 이동

        });
    }

    //로그인 상태에 따라 네비게이션 바 업데이트
    function updateNavBar() {

        //로그인 상태에 따라 네비게이션 바 업데이트
        const userName = localStorage.getItem('userName');
        console.log(userName);
        const navBar = document.getElementById('navBar');

        //로그인 상태라면 사용자의 이름 표시
        if (userName)
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

    //updateNavBar();

    // HTML에서 사용할 수 있도록 함수 내보내기
    window.navigateToHome = navigateToHome;
    window.navigateToAbout = navigateToAbout;
    window.navigateToSession = navigateToSession;
    window.navigateToProject = navigateToProject;
    window.navigateToFAQ = navigateToFAQ;
    window.navigateToLogin = navigateToLogin;
    window.navigateToSignUp = navigateToSignUp;
    window.navigateToLogout = navigateToLogout;

    updateNavBar();
});