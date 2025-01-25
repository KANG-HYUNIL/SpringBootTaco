document.addEventListener("DOMContentLoaded", function() {

    //Admin 메인 페이지
    function navigateToAdminHome() {

        const url = "/admin";
        sendTokenGetURL(url);
    }

    //Admin 프로젝트 페이지
    function navigateToAdminProject() {

        const url = '/admin/project';
        sendTokenGetURL(url);
    }

    //Admin 세션 페이지
    function navigateToAdminSession() {

        const url = '/admin/session';
        sendTokenGetURL(url);
    }

    //Admin 신청 포멧 페이지
    function navigateToAdminApplication(){

        const url = '/admin/application';
        sendTokenGetURL(url);
    }

    //Admin 프로젝트 작성 페이지
    function navigateToAdminWriteProject()
    {
        //alert("project");
        const url = '/admin/project/write';
        sendTokenGetURL(url);
    }

    //Admin 세션 작성 페이지
    function navigateToAdminWriteSession()
    {
        const url = '/admin/session/write';
        sendTokenGetURL(url);
    }

    //Admin 페이지 사용 위한 Token 전송 로직
    function sendTokenGetURL(url) {
        // Access Token 가져오기
        const accessToken = localStorage.getItem('access');

        console.log("Fetching URL with access token:", url);

        //GET fetch
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access': accessToken, // Access Token 추가
            },
            credentials: 'include' // 쿠키 포함 요청
        })
        .then(response => {
            if (response.ok) {
                // 인증 성공 시 HTML 내용 반환
                return response.text();
            }
            else if (response.status === 406)
            {
                // Access Token 만료 -> Refresh Token으로 재발급 시도
                console.warn("Access token expired. Attempting to refresh...");
                return handleTokenRefresh(url);
            }
            else
            {
                // 기타 오류 처리
                return handleRequestError(response, "Access token error");
            }
        })
        .then(html => {
            if (html)
            {
                // HTML 응답을 받아 화면에 표시
                document.open(); // 기존 DOM 초기화
                document.write(html); // 새로운 HTML 렌더링
                document.close(); // DOM 렌더링 완료
            }
        })
        .catch(error => {
            // 최종적으로 처리되지 않은 에러
            console.error("Error during fetch:", error);
            redirectToLogin();
        });
    }

    //refresh token 통한 access token 재발급
    function handleTokenRefresh(originalURL)
    {
        const refreshToken = localStorage.getItem('refresh');

        if (!refreshToken)
        {
            console.error("Refresh token not found.");
            redirectToLogin();
            return Promise.reject("No refresh token found");
        }

        const url = '/reissue';

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // 쿠키 포함 요청
        })
        .then(response => {
            if (response.ok) {
                // 새 Access Token 저장
                const newAccessToken = response.headers.get('access');
                localStorage.setItem('access', newAccessToken);
                console.log("Access token refreshed. Retrying original request...");
                // 원래 요청 재시도
                return sendTokenGetURL(originalURL);
            }
            else
            {
                // Refresh Token 재발급 실패
                return handleRequestError(response, "Refresh token error");
            }
        });
    }

    //요청 오류 처리
    function handleRequestError(response, message)
    {
        return response.json().then(data => {
            alert(`${response.status}: ${data.message || message}`);
            throw new Error(data.message || message);
        });
    }

    //로그인 페이지로 리다이렉트
    function redirectToLogin() {
        // 로그인 페이지로 리다이렉트
        localStorage.setItem('redirectToAdmin', 'true');
        window.location.href = '/account/login';
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
            if (response.ok) {

                //로그아웃 성공 시 로컬 스토리지에서 토큰 제거
                localStorage.removeItem('access');
                //localStorage.removeItem('refresh');
                localStorage.removeItem('userName');
                window.location.href = '/'; //로그아웃 후 홈으로 이동
            } else {
                console.error('Logout failed');
            }
        });
    }

    //로그인 상태에 따라 네비게이션 바 업데이트
    function updateNavBar() {

        //로그인 상태에 따라 네비게이션 바 업데이트
        const userName = localStorage.getItem('userName');
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
        else {
            navBar.innerHTML = `
                <button onclick="navigateToLogin()" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">
                    로그인/회원가입
                </button>
            `;
        }
    }

    updateNavBar();

    // Export functions to be used in HTML
    window.navigateToAdminHome = navigateToAdminHome;
    window.navigateToAdminProject = navigateToAdminProject;
    window.navigateToAdminSession = navigateToAdminSession;
    window.navigateToAdminApplication = navigateToAdminApplication;
    window.navigateToLogout = navigateToLogout;
    window.navigateToAdminWriteProject = navigateToAdminWriteProject;
    window.navigateToAdminWriteSession = navigateToAdminWriteSession;
});