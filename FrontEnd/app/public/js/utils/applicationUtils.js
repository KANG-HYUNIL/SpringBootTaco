import FetchRequestBuilder from "./fetchRequest.js";
import * as URLS from "../utils/fetchURLStr.js";


// Function to fetch application data
export async function fetchApplicationData(url, callback) {
    try {
        const fetchRequest = new FetchRequestBuilder()
            .setUrl(url)
            .setMethod('GET')
            .addHeader('Content-Type', 'application/json')
            .setPollingCount(3)
            .build();

        const response = await fetchRequest;

        if (!response.ok) {
            throw new Error(`Failed to fetch application data: ${response.statusText}`);
        }

        const applicationData = await response.json();
        callback(applicationData); // 콜백 함수 호출
    } catch (error) {
        console.error('Error fetching application data:', error);
    }
}

// Function to display applications
export function displayApplications(applications, isAdmin = false) {
    // Sort applications by start date in ascending order
    applications.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    applications.forEach((application, index) => {
        const row = document.createElement('tr');

        // Hidden field for application id
        const idCell = document.createElement('td');
        idCell.className = 'hidden';
        idCell.textContent = application.id;
        row.appendChild(idCell);

        const numberCell = document.createElement('td');
        numberCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        const titleCell = document.createElement('td');
        titleCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        titleCell.textContent = application.title;
        titleCell.style.cursor = 'pointer';
        titleCell.addEventListener('click', () => {
            const basePath = isAdmin ? URLS.AdminPage.ApplicationContent(application.id) : URLS.UserPage.ApplicationContent(application.id);
            window.location.href = basePath;
        });
        row.appendChild(titleCell);

        const startCell = document.createElement('td');
        startCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        startCell.textContent = formatDateTime(application.startTime);
        row.appendChild(startCell);

        const endCell = document.createElement('td');
        endCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        endCell.textContent = formatDateTime(application.endTime);
        row.appendChild(endCell);

        tbody.appendChild(row);
    });
}


// Function to fetch application data for applicationSubmit.js and adminApplicationSubmit.js
export async function fetchApplicationDetails(url, callback) {
    try {
        const fetchRequest = new FetchRequestBuilder()
            .setUrl(url)
            .setMethod('GET')
            .addHeader('Content-Type', 'application/json')
            .setPollingCount(3)
            .build();

        const response = await fetchRequest;

        if (!response.ok) {
            throw new Error(`Failed to fetch application details: ${response.statusText}`);
        }

        const applicationData = await response.json();
        callback(applicationData); // 콜백 함수 호출
    } catch (error) {
        console.error('Error fetching application details:', error);
    }
}

// Function to display attachments
export function displayAttachments(attachmentFilePaths) {
    const attachmentFileList = document.getElementById('attachmentFileList');
    attachmentFileList.innerHTML = ''; // Clear existing files

    const ul = document.createElement('ul');
    ul.classList.add('space-y-3'); // Add vertical spacing

    attachmentFilePaths.forEach(filePath => {
        const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
        const li = document.createElement('li');
        const fileLink = document.createElement('a');
        fileLink.href = URLS.API.FileDownloadFile(filePath);
        fileLink.textContent = fileName;
        fileLink.classList.add('text-blue-500', 'hover:underline');
        li.appendChild(fileLink);
        ul.appendChild(li);
    });

    attachmentFileList.appendChild(ul);
}

// Function to display submitters
export function displaySubmitters(submitters) {
    const submitterList = document.getElementById('submitterList');
    submitterList.innerHTML = ''; // Clear existing rows

    submitters.forEach((submitter, index) => {
        const row = document.createElement('tr');

        const numberCell = document.createElement('td');
        numberCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        const idCell = document.createElement('td');
        idCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        idCell.textContent = submitter.id;
        row.appendChild(idCell);

        const nameCell = document.createElement('td');
        nameCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        nameCell.textContent = submitter.name;
        row.appendChild(nameCell);

        const fileCell = document.createElement('td');
        fileCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        const ul = document.createElement('ul');
        ul.classList.add('space-y-3'); // Add vertical spacing

        submitter.submittedFilePaths.forEach(filePath => {
            const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
            const li = document.createElement('li');
            const fileLink = document.createElement('a');
            fileLink.href = URLS.API.FileDownloadFile(filePath);
            fileLink.textContent = fileName;
            fileLink.classList.add('text-blue-500', 'hover:underline');
            li.appendChild(fileLink);
            ul.appendChild(li);
        });

        fileCell.appendChild(ul);
        row.appendChild(fileCell);

        submitterList.appendChild(row);
    });
}

// Function to format date and time with timezone
export function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleString(undefined, options);
}
