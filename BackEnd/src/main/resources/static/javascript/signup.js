// signup.js
document.addEventListener("DOMContentLoaded", function() {

    //이메일 통한 인증번호 전달 요청 전송
    document.getElementById('sendAuthCode').addEventListener('click', function() {

        //이메일 주소 값 가져오기
        const email = document.getElementById('email').value;

        const url = '/member/email/signup_verification_req'; //회원가입 이메일 인증번호 요청 경료

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //EmailRequestDTO 양식에 맞추어서
            body: JSON.stringify({ email: email })
        })
        .then(response => {
            // 응답의 상태 코드에 대한 처리
            if (response.ok) {
                alert('인증번호가 전송되었습니다.'); //정상 응답
            } else {
                return response.json().then(data => {
                    alert('인증번호 전송 실패: ' + data.message); //비정상 응답
                });
            }
        })
        .catch(error => { //에러 처리
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        });
    });

    //회원가입 제출 처리
    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();

        //id, pw, 반복 pw, 이름, 이메일 주소, 인증 번호 각각 획득
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const authCode = document.getElementById('authCode').value;

        //pw 반복 검증
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const url = '/account/signup'; //회원가입 요청 경로

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //SignUpDTO 양식에 맞추어서
            body: JSON.stringify({
                id: username,
                password: password,
                name: name,
                email: email,
                authCode: authCode,
                role : "ROLE_USER"
            })
        })
        .then(response => {
            //정상 응답 처리
            if (response.ok) {
                alert('회원가입이 성공적으로 완료되었습니다.');
                window.location.href = '/account/login'; //로그인 경로로 이동
            }
            //비정상 응답 처리
            else {
                return response.json().then(data => {
                    alert('회원가입 실패: ' + data.message); //회원가입 실패 원인 메세지 출력
                });
            }
        })
        //에러 처리
        .catch(error => {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.');
        });
    });
});