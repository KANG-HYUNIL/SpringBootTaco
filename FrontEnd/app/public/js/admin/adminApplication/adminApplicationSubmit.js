import { fetchApplicationDetails, displayAttachments, displaySubmitters } from "../../utils/applicationUtils.js";
import { accessTokenValidate, fetchWithAccessToken } from "../../utils/tokenHandle.js";

// Extract application id from URL
const urlParams = new URLSearchParams(window.location.search);
let applicationId = urlParams.get('id');

function fetchAndDisplayApplicationData() {
    const url = `/api/getApplicationById?id=${applicationId}`;
    fetchApplicationDetails(url, (data) => {
        document.getElementById('applicationTitle').textContent = data.title;
        document.getElementById('startDate').textContent = data.startTime.split('T')[0];
        document.getElementById('endDate').textContent = data.endTime.split('T')[0];
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
    window.location.href = '/admin/application/fix';
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

    const url = '/api/admin/deleteApplication';
    const applicationDTO = { id: applicationId };

    try {
        const response = await fetchWithAccessToken(url, applicationDTO);

        if (response.ok) 
        {
            alert('Application deleted successfully.');
            window.location.href = '/admin/application';
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