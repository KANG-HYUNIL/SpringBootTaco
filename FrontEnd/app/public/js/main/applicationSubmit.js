import { fetchApplicationDetails, displayAttachments, displaySubmitters } from "../utils/applicationUtils.js";
import { accessTokenValidate, fetchWithAccessToken } from "../utils/tokenHandle.js";

// Extract application id from URL
const urlParams = new URLSearchParams(window.location.search);
let applicationId = urlParams.get('id');

// application 게시물의 세부 데이터 가져와 표시하기
async function fetchAndDisplayApplicationData() {
    const url = `/api/getApplicationById?id=${applicationId}`;
    fetchApplicationDetails(url, (data) => {
        document.getElementById('applicationTitle').textContent = data.title;
        document.getElementById('startDate').textContent = data.startTime.split('T')[0];
        document.getElementById('endDate').textContent = data.endTime.split('T')[0];
        document.getElementById('applicationContent').innerHTML = data.content;
        displayAttachments(data.attachmentFilePaths);
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

    const userId = localStorage.getItem('userId');
    const userSubmission = submitters.find(submitter => submitter.id === userId);
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
    const submittedAttachmentFileList = document.getElementById('submittedAttachmentFileList');
    submittedAttachmentFileList.innerHTML = '<p class="text-sm text-gray-500">제출 기록이 없습니다</p>';
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
                window.location.href = '/account/login';
            }
        }
    });
}

async function submitApplication() {
    const filePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item'))
        .map(item => item.dataset.filePath);

    const url = `/application/submit?id=${applicationId}`;
    const body = { filePath: filePaths[0] };

    try {
        const response = await fetchWithAccessToken(url, body);

        if (response.ok) 
            {
            alert('제출 완료');
            window.location.href = '/application';
        } 
        else if (response.status === 400) 
        {
            alert('Submission deadline has passed or not yet started.');
        }
        else 
        {
            const data = await response.json();
            console.error(`${response.status}: ${data.message}`);
            alert('알 수 없는 에러 발생');
            window.location.href = '/account/login';
        }
    } catch (error) {
        console.error('Error during submission:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() { 
    fetchAndDisplayApplicationData();
    setSubmitBtn();
});