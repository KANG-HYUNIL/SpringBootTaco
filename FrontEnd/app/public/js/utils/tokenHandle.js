import FetchRequestBuilder from "./fetchRequest.js";
import * as URLS from "../utils/fetchURLStr.js";

export async function accessTokenValidate()
{
    const accessToken = localStorage.getItem('access');

    if(!accessToken)
    {
        return false;
    }

    const url = URLS.API.UserTokenValidate;

    const fetchRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod('POST')
        .addHeader('access', accessToken)
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    const response = await fetchRequest;

    if(response.status === 406)
    {
        return reissueAccessToken();
    }
    if(response.status === 200)
    {
        return true;
    }
    else
    {
        handleRequestError(response, "Access token error");
        return false;
    }
}

export async function adminAccessTokenValidate()
{
    const accessToken = localStorage.getItem('access');

    if(!accessToken)
    {
        return false;
    }

    const url = URLS.API.AdminTokenValidate;

    const fetchRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod('POST')
        .addHeader('access', accessToken)
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    const response = await fetchRequest;

    if(response.status === 406)
    {
        return reissueAccessToken();
    }
    if(response.status === 200)
    {
        return true;
    }
    else
    {
        handleRequestError(response, "Access token error");
        return false;
    }
}


async function reissueAccessToken()
{
    const url = '/api/reissue';

    const fetchRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod('POST')
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    const response = await fetchRequest;

    if (response.status === 200)
    {
        const newAccessToken = response.headers.get('access');
        localStorage.setItem('access', newAccessToken);
        return true;
    }
    else
    {
        handleRequestError(response, "Refresh token error");
        return false;
    }

}

//url 경로로 body에 데이터를 실어서 token과 함께 요청 전달
export async function fetchWithAccessToken(url, body) {
    let accessToken = localStorage.getItem('access');

    const fetchRequest = new FetchRequestBuilder()
        .setUrl(url)
        .setMethod('POST')
        .addHeader('Content-Type', 'application/json')
        .addHeader('access', accessToken)
        .addBody(body)
        .setCredentials(true)
        .setPollingCount(3)
        .build();

    let response = await fetchRequest;

    if (response.status === 406) {
        const reissueSuccess = await reissueAccessToken();
        if (reissueSuccess) {
            accessToken = localStorage.getItem('access');
            const retryRequest = new FetchRequestBuilder()
                .setUrl(url)
                .setMethod('POST')
                .addHeader('Content-Type', 'application/json')
                .addHeader('access', accessToken)
                .addBody(body)
                .setCredentials(true)
                .setPollingCount(3)
                .build();

            response = await retryRequest;
        }
    }

    return response;
}

//요청 오류 처리
function handleRequestError(response, message)
{
    return response.json().then(data => {
        alert(`${response.status}: ${data.message || message}`);
        throw new Error(data.message || message);
    });
}
