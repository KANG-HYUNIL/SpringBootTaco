document.addEventListener("DOMContentLoaded", function() {

    //Admin 메인 페이지
    function navigateToAdminHome() {

        const url = "/admin";

        window.location.href = '/admin/';
    }

    //Admin 프로젝트 페이지
    function navigateToAdminProject() {

        const url = '/admin/project';

        window.location.href = '/admin/project';
    }

    //Admin 세션 페이지
    function navigateToAdminSession() {

        const url = '/admin/session';

        window.location.href = '/admin/session';
    }

    //Admin 신청 포멧 페이지
    function navigateToAdminApplication(){

        const url = '/admin/application';

        window.location.href = "/admin/application";
    }

    //Admin 프로젝트 작성 페이지
    function navigateToAdminWriteProject()
    {
        const url = '/admin/project/write';
        window.location.href = "/admin/project/write";
    }

    //Admin 세션 작성 페이지
    function navigateToAdminWriteSession()
    {
        const url = '/admin/session/write';
        window.location.href = "/admin/session/write";
    }

    //Admin 페이지 사용 위한 Token 전송 로직
    function sendTokenGetURL(url)
    {
        //access token 획득
        const accessToken = localStorage.getItem('access');

        fetch(url, {
            method : 'GET',
            headers : {
                'Content-Type': 'application/json',
                'access' : accessToken
            },
            credentials: 'include' // 쿠키를 포함하여 요청
        })
        .then(response => {
        //token 인증 성공 시 pass
            if (response.ok) {
                return;
            }
            //406 응답 시에는 refresh token을 통해 재발급
            else if (response.status === 406) {
                //refresh token 가져오기 fixme
                //const refreshToken = localStorage.getItem('refresh');

                const reissueURL = '/reissue';

                fetch(reissueURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    credentials: 'include' // Include cookies for refresh token
                })
                .then(response => {
                    //200번 정상 응답 시에 accessToken과 refreshToken을 받아서 처리
                    if (response.ok) {
                        return response.json().then(data => {
                            const accessToken = response.headers.get('access'); // 헤더에서 access token을 가져옴
                            //const refreshToken = getCookie('refresh'); // 쿠키에서 refresh token을 가져옴

                            // 토큰을 로컬 스토리지에 저장
                            //refresh token은 쿠키로 자동 저장
                            localStorage.setItem('accessToken', accessToken);
                            //localStorage.setItem('refreshToken', refreshToken);

                            // token 재발급 성공 후 return
                            return;
                        });
                    } else {
                        // 에러 응답 시 Error throw
                        throw new Error('Token reissue failed');
                    }
                })
            }
            // 그 이외에는 token이 비정상적인 상태. error 처리
            else {
                throw new Error('Invalid token');
            }
        })
        //error 처리
        .catch(error => {
            //admin 페이지로 이동하기 위한 플래그 설정
            localStorage.setItem('redirectToAdmin', 'true');
            console.error('Error:', error);
            window.location.href = '/login';
        });


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
        if (userName) {
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
});