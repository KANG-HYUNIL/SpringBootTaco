import { fetchApplicationDetails, displayAttachments, displaySubmitters, formatDateTime } from "../../utils/applicationUtils.js";
import { fetchWithAccessToken } from "../../utils/tokenHandle.js";
import * as URLS from "../../utils/fetchURLStr.js";


// Extract application id from URL

let applicationId;

function fetchAndDisplayApplicationData() {
    const url = URLS.API.GetApplicationById(applicationId);
    console.log("url " + url);
    fetchApplicationDetails(url, (data) => {
        document.getElementById('applicationTitle').textContent = data.title;
        document.getElementById('startDate').textContent = formatDateTime(data.startTime);
        document.getElementById('endDate').textContent = formatDateTime(data.endTime);
        document.getElementById('applicationContent').innerHTML = data.content;
        displayAttachments(data.attachmentFilePaths, 'applicationAttachmentFileList'); // 게시물 첨부 파일 표시
        handleSubmitterList(data.submitters);
    });
}

// 제출자 목록을 화면에 띄우는 메서드, 제출자가 하나라도 존재하면 displaySubmitters 메서드를 호출하고, 제출자가 하나도 없으면 displayNoSubmission 메서드를 호출
function handleSubmitterList(submitters) {
    if (submitters.length === 0) {
        displayNoSubmission();
    } else {
        displaySubmitters(submitters);
    }
}

function displayNoSubmission() {
    const submitterList = document.getElementById('submitterList');
    submitterList.innerHTML = '<tr><td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">제출 기록이 없습니다</td></tr>';
}

function editApplication() {
    if (!applicationId)
    {
        alert('Application ID not found.');
        return;
    }

    localStorage.setItem('applicationId', applicationId);
    window.location.href = URLS.AdminPage.FixApplication;
}

async function deleteApplication() {
    if (!applicationId) 
    {
        alert('Application ID not found.');
        return;
    }

    const isConfirmed = confirm('Are you sure you want to delete this application?');
    if (!isConfirmed) 
    {
        return;
    }

    const url = URLS.API.DeleteApplication;
    const applicationDTO = { id: applicationId };

    try {
        const response = await fetchWithAccessToken(url, applicationDTO);

        if (response.ok) 
        {
            alert('Application deleted successfully.');
            window.location.href = URLS.AdminPage.Application;
        } 
        else 
        {
            const errorData = await response.json();
            throw new Error(`Failed to delete application: ${response.status} ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting application:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() { 

    // Extract application id from URL
    const urlParams = new URLSearchParams(window.location.search);
    applicationId = urlParams.get('id');
    console.log(applicationId);
    fetchAndDisplayApplicationData();
    window.editApplication = editApplication;
    window.deleteApplication = deleteApplication;
});