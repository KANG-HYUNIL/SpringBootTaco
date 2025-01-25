//웹 페이지 다운로드 시
document.addEventListener('DOMContentLoaded', () => {
    //사용자의 access token 가져오기
    const accessToken = localStorage.getItem('access');

    console.log(accessToken);

    //access Token이 존재하지 않다면, login 페이지로 바로 이동
    if (!accessToken)
    {
        //admin 페이지로 이동하기 위한 플래그 설정
        localStorage.setItem('redirectToAdmin', 'true');
        window.location.href = '/account/login';
        return;
    }

    //서버로 access token을 통해 유효성 검사 요청, admin 페이지만 이렇게 구동. 다른 페이지는 header에 token 넣어서 filter로 처리
    const url = "/validate-admin-token";

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //header에 access token
            'access': accessToken
        }
    })
    .then(response => {
        //token 인증 성공 시 pass
        if (response.ok)
        {
            return;
        }
        //406 응답 시에는 refresh token을 통해 재발급
        else if (response.status === 406)
        {
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
                    if (response.ok)
                    {
                        console.log("access reissue");
                        const accessToken = response.headers.get('access');
                        localStorage.setItem('access', accessToken);

                    }
                    else
                    {
                        // 에러 응답 시 에러 메시지를 보여줌
                        return response.json().then(data => {
                            alert(response.status + data.message + " refresh err");
                            throw new Error('refresh token error');
                        });
                    }
                })
        }
        // 그 이외에는 token이 비정상적인 상태. error 처리
        else
        {
            // 에러 응답 시 에러 메시지를 보여줌
            return response.json().then(data => {
                alert(response.status + data.message  + " access err");
                throw new Error('access token error');
            });
        }
    })
    //error 처리
    .catch(error => {
        //admin 페이지로 이동하기 위한 플래그 설정
        localStorage.setItem('redirectToAdmin', 'true');
        alert('error' + error);
        console.error('Error:', error);
        window.location.href = '/account/login';
    });
});

