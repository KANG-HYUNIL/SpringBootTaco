// login.js
//로그인 버튼을 통한 submit 시 가동
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    //id 및 password 입력값 가져오기
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = "/login";

    //서버로 POST 요청을 보내 로그인 처리
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        //LoginDTO 형식에 맞추어서 body
        body: JSON.stringify({
            id: username,
            password: password
        }),
        credentials: 'include' // 쿠키를 포함하여 요청
    })
    .then(response => {
        //200번 정상 응답 시에 accessToken과 refreshToken을 받아서 처리
        if (response.ok) {
            return response.json().then(data => {
                const accessToken = response.headers.get('access'); // 헤더에서 access token을 가져옴
                //const refreshToken = getCookie('refresh'); // 쿠키에서 refresh token을 가져옴

                // 토큰을 로컬 스토리지에 저장
                //refresh token은 쿠키로 자동 저장
                localStorage.setItem('access', accessToken);
                //localStorage.setItem('refresh', refreshToken);

                //사용자의 정보 가져오기
                // 사용자 정보 가져오기

                // Id를 통한 사용자 정보 요청 URL
                const gerUserURL = '/account/getUserById';

                fetch(gerUserURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: username })
                })
                .then(response => response.json())
                .then(userData => {
                    // 사용자 이름을 로컬 스토리지에 저장
                    localStorage.setItem('userName', userData.name);
                });


                // 로그인 성공 후 리다이렉트 또는 다른 작업 수행
                const redirectToAdmin = localStorage.getItem('redirectToAdmin');
                if (redirectToAdmin === 'true') {
                    localStorage.removeItem('redirectToAdmin');
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            });
        }
        else {
            // 에러 응답 시 에러 메시지를 보여줌
            return response.json().then(data => {
                handleLoginError(response.status, data.message);
            });
        }
    })
    //서버와의 통신 중 오류 발생 시
    .catch(error => {
        console.error('Error:', error);
        handleLoginError(500, '서버와의 통신 중 오류가 발생했습니다.');
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function handleLoginError(status, message) {
    let errorMessage = '로그인에 실패했습니다.';
    if (status === 400) {
        errorMessage = '잘못된 요청입니다. 입력값을 확인하세요.';
    } else if (status === 401) {
        errorMessage = '아이디 또는 비밀번호가 잘못되었습니다.';
    } else if (status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요.';
    }
    alert(errorMessage);
}