// login.js
import FetchRequestBuilder from "../utils/fetchRequest.js";
import * as URLS from "../utils/fetchURLStr.js";

// 사용자 정보를 가져오는 메서드
async function fetchUserInfo(username) {
    const getUserURL = URLS.API.GetUserById;

    const userRequest = new FetchRequestBuilder()
        .setUrl(getUserURL)
        .setMethod("POST")
        .addHeader("Content-Type", "application/json")
        .addBody({ id: username })
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    const response = await userRequest;
    if (response.ok) 
    {
        const data = await response.json();
        localStorage.setItem('userName', data.name);
        return data;
    } 
    else 
    {
        const data = await response.json();
        handleLoginError(response.status, data.message);
        throw new Error(data.message);
    }
}

// 로그인 요청을 처리하는 메서드
async function handleLogin(username, password) {
    const url = URLS.API.Login;

    const loginRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod("POST")
        .addHeader("Content-Type", "application/json")
        .addBody({ id: username, password: password })
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    const response = await loginRequest;
    if (response.ok) 
    {
        const data = await response.json();
        const accessToken = response.headers.get('access');
        localStorage.setItem('access', accessToken);
        return data;
    } 
    else 
    {
        const data = await response.json();
        handleLoginError(response.status, data.message);
        throw new Error(data.message);
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    // id 및 password 입력값 가져오기
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try 
    {
        await handleLogin(username, password);
        await fetchUserInfo(username);

        // 로그인 성공 후 리다이렉트 또는 다른 작업 수행
        const redirectToAdmin = localStorage.getItem('redirectToAdmin');
        if (redirectToAdmin === 'true') 
        {
            localStorage.removeItem('redirectToAdmin');
            window.location.href = URLS.AdminPage.Home;
        } 
        else 
        {
            window.location.href = URLS.UserPage.Home;
        }
    } 
    catch (error) 
    {
        console.error('Login failed:', error);
    }
});


function handleLoginError(status, errorMessage) {
    let defaultMessage = '로그인에 실패했습니다. : ';
    let textMessage = '';
    if (status === 400) {
        textMessage = '잘못된 요청입니다. 입력값을 확인하세요. ';

    } else if (status === 401) {
        textMessage = '아이디 또는 비밀번호가 잘못되었습니다. ';

    } else if (status === 500) {
        textMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도하세요. ';

    }
    else {
        textMessage = status
    }
    console.error(errorMessage);
    alert(defaultMessage + textMessage);
}