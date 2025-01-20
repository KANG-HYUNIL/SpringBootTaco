//웹 페이지 다운로드 시
document.addEventListener('DOMContentLoaded', () => {
    //사용자의 access token 가져오기
    const accessToken = localStorage.getItem('access');

    //access Token이 존재하지 않다면, login 페이지로 바로 이동
    if (!accessToken) {
        //admin 페이지로 이동하기 위한 플래그 설정
        localStorage.setItem('redirectToAdmin', 'true');
        window.location.href = '/login';
        return;
    }

    //서버로 access token을 통해 유효성 검사 요청, admin 페이지만 이렇게 구동. 다른 페이지는 header에 token 넣어서 filter로 처리
    const url = "/validate-admin-token";

    fetch(url, {
        method: 'POST',
        headers: {
            //header에 access token
            'access': accessToken
        }
    })
    .then(response => {
        //token 인증 성공 시 pass
        if (response.ok) {
            return;
        }
        //406 응답 시에는 refresh token을 통해 재발급
        else if (response.status === 406) {
            //refresh token 가져오기 fixme
            const refreshToken = localStorage.getItem('refresh');

            const reissueURL = '/reissue';

            fetch(reissueURL, {
                method: 'POST',
                headers: {
                    "refresh" : Refresh Token
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
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}