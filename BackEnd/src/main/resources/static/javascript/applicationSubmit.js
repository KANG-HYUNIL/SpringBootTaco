document.addEventListener("DOMContentLoaded", function() {

    // Extract application id from URL
    const urlParams = new URLSearchParams(window.location.search);
    applicationId = urlParams.get('id');

    //application 게시물의 세부 데이터 가져와 표시하기
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
            handleSubmitterList(data.submitters);
        })
        .catch(error => console.error('Error fetching application data:', error));
    }

    //제출한 첨부파일 목록들 보여주는 메서드
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

    //제출자 목록을 화면에 띄우는 메서드, 자신이 제출한 목록만 확인 가능하게끔
    function handleSubmitterList(submitters) {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
            displayNoSubmission();
            return;
        }

        const url = '/validate-token';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access': accessToken
            }
        })
        .then(response => {
            if (response.status === 406)
            {
                handleTokenRefresh(url, null, () => handleSubmitterList(submitters));
            }
            else if (!response.ok)
            {
                throw new Error('Token validation failed');
            }
            return response.json();
        })
        .then(data => {
            const userId = data.id;
            const userSubmission = submitters.find(submitter => submitter.id === userId);
            if (userSubmission)
            {
                displayUserSubmission(userSubmission);
            }
            else
            {
                displayNoSubmission();
            }
        })
        .catch(error => console.error('Error handling submitter list:', error));
    }

    //제출자 목록을 화면에 나타내는 메서드
    function displayUserSubmission(submission) {
        const submittedAttachmentFileList = document.getElementById('submittedAttachmentFileList');
        submittedAttachmentFileList.innerHTML = ''; // Clear existing rows

        const row = document.createElement('tr');

        //id
        const idCell = document.createElement('td');
        idCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        idCell.textContent = submission.id;
        row.appendChild(idCell);

        //name
        const nameCell = document.createElement('td');
        nameCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        nameCell.textContent = submission.name;
        row.appendChild(nameCell);

        //제출한 파일
        const fileCell = document.createElement('td');
        fileCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
        const ul = document.createElement('ul');
        ul.classList.add('space-y-3'); // Add vertical spacing

        submission.submittedFilePaths.forEach(filePath => {
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

        submittedAttachmentFileList.appendChild(row);
    }

    function displayNoSubmission() {
        const submittedAttachmentFileList = document.getElementById('submittedAttachmentFileList');
        submittedAttachmentFileList.innerHTML = '<p class="text-sm text-gray-500">제출 기록이 없습니다</p>';
    }

    //첨부파일 제출 기능 처리 메서드
    function addAttachmentFunction() {
        const attachmentDropZone = document.getElementById('attachmentDropZone');
        const selectAttachmentButton = document.getElementById('selectAttachmentButton');
        const attachmentFileList = document.getElementById('attachmentFileList');

        attachmentDropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            attachmentDropZone.classList.add('border-blue-500');
        });

        attachmentDropZone.addEventListener('dragleave', () => {
            attachmentDropZone.classList.remove('border-blue-500');
        });

        attachmentDropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            attachmentDropZone.classList.remove('border-blue-500');
            const files = event.dataTransfer.files;
            handleAttachmentFile(files[0]);
        });

        selectAttachmentButton.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.onchange = (event) => {
                const files = event.target.files;
                handleAttachmentFile(files[0]);
            };
            fileInput.click();
        });

        //실제로 파일을 서버에 예비 업로드 시키는 메서드
        function handleAttachmentFile(file) {
            if (!file) return;

            const formData = new FormData();
            formData.append('multipartFile', file);

            const url = '/file/preUpload';

            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text().then(text => {
                        throw new Error(`File upload failed: ${text}`);
                    });
                }
            })
            .then(data => {
                attachmentFileList.innerHTML = ''; // Clear existing files

                const fileItem = document.createElement('div');
                fileItem.classList.add('file-item', 'flex', 'items-center', 'mt-2');
                fileItem.dataset.filePath = data.filePath;
                fileItem.dataset.fileName = data.fileName;

                const fileLabel = document.createElement('span');
                fileLabel.textContent = file.name;
                fileLabel.classList.add('text-sm', 'font-medium', 'text-gray-700');

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '&times;';
                deleteButton.classList.add('text-red-500', 'ml-2');
                deleteButton.onclick = () => {
                    attachmentFileList.removeChild(fileItem);
                };

                fileItem.appendChild(fileLabel);
                fileItem.appendChild(deleteButton);
                attachmentFileList.appendChild(fileItem);
            })
            .catch(error => {
                showErrorMessage(error.message);
            });
        }
    }

    function showErrorMessage(message) {
        alert(message);
    }

    function setSubmitBtn()
    {
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

    function submitApplication() {
        const filePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item'))
            .map(item => item.dataset.filePath);

        const url = `/application/submit?id=${applicationId}`;
        const body = JSON.stringify({ filePath: filePaths[0] });

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access': localStorage.getItem('access')
            },
            body: body,
            credentials: 'include'
        })
        .then(response => {
            if (response.ok)
            {
                alert('제출 완료');
                window.location.href = '/application';
            }
            else if (response.status === 406)
            {
                handleTokenRefresh(url, body, () => {
                    alert('제출 완료');
                    window.location.href = '/application';
                });
            }
            else if (response.status === 400)
            {
               alert('Submission deadline has passed or not yet started.');
            }

            else
            {
                return response.json().then(data => {
                    console.error(`${response.status}: ${data.message}`);
                    alert('알 수 없는 에러 발생');
                    window.location.href = '/account/login';
                });
            }
        })
        .catch(error => console.error('Error during submission:', error));
    }

    function handleTokenRefresh(originalURL, body, callback) {
        const url = '/reissue';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok)
            {
                const newAccessToken = response.headers.get('access');
                localStorage.setItem('access', newAccessToken);
                return fetch(originalURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': newAccessToken
                    },
                    body: body,
                    credentials: 'include'
                });
            }
            else
            {
                return response.json().then(data => {
                    console.error(`${response.status}: ${data.message}`);
                    alert('알 수 없는 에러 발생');
                    window.location.href = '/account/login';
                });
            }
        })
        .then(response => {
            if (response.ok) {
                callback();
            }
        })
        .catch(error => console.error('Error during token refresh:', error));
    }


    fetchApplicationData();
    setSubmitBtn();
    addAttachmentFunction();
});