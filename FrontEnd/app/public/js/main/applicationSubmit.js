import { fetchApplicationDetails, displayAttachments, displaySubmitters, formatDateTime  } from "../utils/applicationUtils.js";
import { accessTokenValidate, fetchWithAccessToken } from "../utils/tokenHandle.js";
import * as URLS from "../utils/fetchURLStr.js";


// Extract application id from URL
 
let applicationId ;

// application 게시물의 세부 데이터 가져와 표시하기
async function fetchAndDisplayApplicationData() {
    const url = URLS.API.GetApplicationById(applicationId);
    fetchApplicationDetails(url, (data) => {
        document.getElementById('applicationTitle').textContent = data.title;
        document.getElementById('startDate').textContent = formatDateTime(data.startTime);
        document.getElementById('endDate').textContent = formatDateTime(data.endTime);
        document.getElementById('applicationContent').innerHTML = data.content;
        displayAttachments(data.attachmentFilePaths, 'applicationAttachmentFileList'); // 게시물 첨부 파일 표시
        handleSubmitterList(data.submitters);
    });
}

// 제출자 목록을 화면에 띄우는 메서드, 자신이 제출한 목록만 확인 가능하게끔
async function handleSubmitterList(submitters) {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) 
    {
        displayNoSubmission();
        return;
    }

    const isValid = await accessTokenValidate();
    if (!isValid) 
    {
        displayNoSubmission();
        return;
    }

    const userName = localStorage.getItem('userName');

    //user

    const userSubmission = submitters.find(submitter => submitter.name === userName);
    if (userSubmission) 
    {
        displaySubmitters([userSubmission]); // displaySubmitters 메서드 사용
    }
    else
    {
        displayNoSubmission();
    }
}

function displayNoSubmission() {
    const submittedAttachmentFileList = document.getElementById('submitterList');
    submittedAttachmentFileList.innerHTML = '<tr><td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">제출 기록이 없습니다</td></tr>';
}

function setSubmitBtn() {
    document.getElementById('submitButton').addEventListener('click', function() {
        if (confirm('제출하시겠습니까?')) {
            const userName = localStorage.getItem('userName');
            const accessToken = localStorage.getItem('access');

            if (userName && accessToken) {
                submitApplication();
            } else {
                alert('로그인이 필요합니다.');
                window.location.href = URLS.UserPage.Login;
            }
        }
    });
}

async function submitApplication() {
    const submittedFilePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item'))
        .map(item => item.dataset.filePath);

    const url = URLS.API.SubmitApplication(applicationId);
    const body = { submittedFilePaths: submittedFilePaths }; // List 형태로 변경

    try {
        const response = await fetchWithAccessToken(url, body);

        if (response.ok) 
            {
            alert('제출 완료');
            window.location.href = URLS.UserPage.Application;
        } 
        else if (response.status === 400) 
        {
            alert('Submission deadline has passed or not yet started.');
        }
        else 
        {
            const data = await response.json();
            console.error(`${response.status}: ${data.message}`);
            alert(`알 수 없는 에러 : ${response.status}: ${data.message}`);
            window.location.href = URLS.UserPage.Application;
        }
    } catch (error) {
        console.error('Error during submission:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    const urlParams = new URLSearchParams(window.location.search);
    applicationId = urlParams.get('id');
    console.log(applicationId);
    fetchAndDisplayApplicationData();
    setSubmitBtn();
});