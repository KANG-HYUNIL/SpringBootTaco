import FetchRequestBuilder from "../utils/fetchRequest.js";
import * as URLS from "../utils/fetchURLStr.js";

// signup.js

// 이메일 인증번호 요청을 처리하는 메서드
async function requestAuthCode(email) {
    
    const url = URLS.API.SignUpVerificationReq;

    const authRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod("POST")
        .addHeader("Content-Type", "application/json")
        .addBody({ email: email })
        .build();

    const response = await authRequest;
    if (response.ok) 
        {
        alert('인증번호가 전송되었습니다.');
    } 
    else 
    {
        const data = await response.json();
        alert('인증번호 전송 실패: ' + data.message);
        throw new Error(data.message);
    }
}

// 회원가입 요청을 처리하는 메서드
async function handleSignup(username, password, name, email, authCode) {
    const url = URLS.API.SignUp;

    const signupRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod("POST")
        .addHeader("Content-Type", "application/json")
        .addBody({
            id: username,
            password: password,
            name: name,
            email: email,
            authCode: authCode

        })
        .build();

    const response = await signupRequest;
    if (response.ok) 
    {
        alert('회원가입이 성공적으로 완료되었습니다.');
        window.location.href = URLS.UserPage.Login;
    } 
    else 
    {
        const data = await response.json();
        alert('회원가입 실패: ' + data.message);
        throw new Error(data.message);
    }
}

document.addEventListener("DOMContentLoaded", function() {

     // 이메일 인증번호 요청 버튼 클릭 이벤트 핸들러
    document.getElementById('sendAuthCode').addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        const button = this;

        // 버튼 비활성화 및 타이머 설정
        button.disabled = true;
        let countdown = 60;
        const originalText = button.textContent;

        const interval = setInterval(() => {
            button.textContent = `${countdown}초 후 다시 시도`;
            countdown--;
            if (countdown < 0) 
                {
                clearInterval(interval);
                button.textContent = originalText;
                button.disabled = false;
            }
        }, 1000);

        try 
        {
            await requestAuthCode(email);
        } 
        catch (error) 
        {
            clearInterval(interval);
            button.textContent = originalText;
            button.disabled = false;
        }
    });

     // 회원가입 제출 이벤트 핸들러
     document.getElementById('signupForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const authCode = document.getElementById('authCode').value;



        if (password !== confirmPassword) 
        {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try 
        {
            await handleSignup(username, password, name, email, authCode);
        } 
        catch (error) 
        {
            console.error('Signup failed:', error);
            alert('Signup failed:', error);
        }
    });



});