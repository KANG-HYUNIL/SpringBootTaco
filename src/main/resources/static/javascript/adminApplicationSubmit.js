document.addEventListener("DOMContentLoaded", function() {
    const applicationId = localStorage.getItem('applicationId');

    function fetchApplicationData() {
        const url = `/getApplicationById?id=${applicationId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('applicationTitle').textContent = data.title;
            document.getElementById('startDate').textContent = data.startTime.split('T')[0];
            document.getElementById('endDate').textContent = data.endTime.split('T')[0];
            document.getElementById('applicationContent').innerHTML = data.content;
            displayAttachments(data.attachmentFilePaths);
            displaySubmitters(data.submitters);
        })
        .catch(error => console.error('Error fetching application data:', error));
    }

    function displayAttachments(attachmentFilePaths) {
        const attachmentFileList = document.getElementById('attachmentFileList');
        attachmentFileList.innerHTML = ''; // Clear existing files

        const ul = document.createElement('ul');
        ul.classList.add('space-y-3'); // Add vertical spacing

        attachmentFilePaths.forEach(filePath => {
            const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
            const li = document.createElement('li');
            const fileLink = document.createElement('a');
            fileLink.href = `/file/downloadFile?filePath=${encodeURIComponent(filePath)}`;
            fileLink.textContent = fileName;
            fileLink.classList.add('text-blue-500', 'hover:underline');
            li.appendChild(fileLink);
            ul.appendChild(li);
        });

        attachmentFileList.appendChild(ul);
    }


    function displaySubmitters(submitters) {
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
                fileLink.href = `/file/downloadFile?filePath=${encodeURIComponent(filePath)}`;
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

    fetchApplicationData();
});