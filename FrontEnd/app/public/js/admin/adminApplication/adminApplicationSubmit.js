import { fetchApplicationDetails, displayAttachments, displaySubmitters, formatDateTime } from "../../utils/applicationUtils.js";
import { accessTokenValidate, fetchWithAccessToken } from "../../utils/tokenHandle.js";
import * as URLS from "../../utils/fetchURLStr.js";


// Extract application id from URL
const urlParams = new URLSearchParams(window.location.search);
let applicationId = urlParams.get('id');

function fetchAndDisplayApplicationData() {
    const url = URLS.API.GetApplicationById;
    fetchApplicationDetails(url, (data) => {
        document.getElementById('applicationTitle').textContent = data.title;
        document.getElementById('startDate').textContent = formatDateTime(data.startTime);
        document.getElementById('endDate').textContent = formatDateTime(data.endTime);
        document.getElementById('applicationContent').innerHTML = data.content;
        displayAttachments(data.attachmentFilePaths);
        displaySubmitters(data.submitters);
    });
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
    fetchAndDisplayApplicationData();
    window.editApplication = editApplication;
    window.deleteApplication = deleteApplication;
});