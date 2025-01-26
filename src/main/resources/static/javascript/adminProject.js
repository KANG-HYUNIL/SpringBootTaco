document.addEventListener("DOMContentLoaded", async function() {
    // 전체 ProjectData를 가져오는 메서드
    async function fetchProjectData()
    {
        try {
            const response = await fetch('/getProjectData');
            if (!response.ok) {
                throw new Error('Failed to fetch project data');
            }
            return await response.json();
        }
        catch (error)
        {
            console.error('Error fetching project data:', error);
            return {};
        }
    }

    // option을 설정하는 메서드
    function setOptions(projectData) {
        const termSelect = document.getElementById('termSelect');
        const terms = Object.keys(projectData);
        terms.forEach(term => {
            const option = document.createElement('option');
            option.value = term;
            option.textContent = term;
            termSelect.appendChild(option);
        });

        // Automatically select the last option
        if (terms.length > 0) {
            termSelect.selectedIndex = terms.length - 1;
        }
    }

    // html 요소를 생성하는 메서드
        function setProjectElements(projectData) {
            const projectContainer = document.getElementById('projectContainer');

            Object.keys(projectData).forEach(term => {
                projectData[term].forEach(project => {
                    const projectElement = document.createElement('div');
                    projectElement.className = 'relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hidden';
                    projectElement.dataset.term = term;
                    const imageUrl = `/file/downloadImg?filePath=${encodeURIComponent(project.thumbnail)}`;
                    projectElement.innerHTML = `
                        <div class="aspect-w-16 aspect-h-9">
                            <img src="${imageUrl}" alt="Project thumbnail" class="object-cover w-full h-full"/>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 bg-black p-6 border-t border-gray-600">
                            <div class="absolute top-2 right-2 dropdown inline-block">
                                <button class="text-gray-400 hover:text-white"><i class="fas fa-cog fa-3x"></i></button>
                                <div class="dropdown-content hidden absolute right-0 bottom-full mb-2 w-36 bg-white rounded-md shadow-lg z-10 border border-black">
                                    <button class="modify-button w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100 border-b border-black">수정</button>
                                    <button class="delete-button w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100">삭제</button>
                                </div>
                            </div>
                            <p class="text-white text-sm font-medium">${project.term}</p>
                            <h4 class="text-white text-lg font-semibold mt-1">${project.team}</h4>
                            <h3 class="text-white text-xl font-bold mt-1">${project.title}</h3>
                            <div class="hidden">
                                <span class="project-id">${project.id}</span>
                                <span class="project-content">${project.content}</span>
                                <span class="project-attachments">${project.attachmentFilePaths.join(',')}</span>
                            </div>
                        </div>
                    `;
                    projectContainer.appendChild(projectElement); // Add project element to the container

                    // Add event listener to the delete button
                    const deleteButton = projectElement.querySelector('.delete-button');
                    deleteButton.addEventListener('click', async function() {
                        if (confirm('Project 삭제?'))
                        {
                            const projectId = projectElement.querySelector('.project-id').textContent;
                            await deleteProject(projectId);
                        }
                    });

                    // Add event listener to the modify button
                    const modifyButton = projectElement.querySelector('.modify-button');
                    modifyButton.addEventListener('click', function() {
                        if (confirm('Project 수정?')) {
                            const projectId = projectElement.querySelector('.project-id').textContent;
                            localStorage.setItem('projectId', projectId);
                            location.href = '/admin/project/fix';
                        }
                    });

                });

            });
        }

    // select의 선택 항목이 변경될 때 화면에 나타나는 요소를 변경하는 메서드
    function addSelectEventListener() {
        const termSelect = document.getElementById('termSelect');
        const projectContainer = document.getElementById('projectContainer');

        // Function to display projects based on the selected term
        function displayProjects(term)
        {
            const projectElements = projectContainer.children;
            for (let projectElement of projectElements)
            {
                if (projectElement.dataset.term === term || term === "") {
                    projectElement.classList.remove('hidden');
                }
                else
                {
                    projectElement.classList.add('hidden');
                }
            }
        }

        // Event listener for term selection
        termSelect.addEventListener('change', function () {
            const selectedTerm = termSelect.value;
            displayProjects(selectedTerm);
        });
    }

    // Project 삭제 요청 메서드
    // Project 삭제 요청 메서드
        async function deleteProject(projectId) {

            // Project 삭제 요청 Url, access token, id 추출 설정
            const url = '/admin/deleteProject';
            const accessToken = localStorage.getItem('access');
            const projectDTO = { id: projectId };

            try {
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': accessToken
                    },
                    body: JSON.stringify(projectDTO),
                    credentials: 'include'
                });

                if (response.status === 406)
                {
                    await handleTokenRefresh();
                    response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'access': localStorage.getItem('access')
                        },
                        body: JSON.stringify(projectDTO),
                        credentials: 'include'
                    });
                }

                if (response.ok) {
                    alert('삭제 완료');
                    window.location.href = '/admin/';
                }
                else
                {
                    const errorData = await response.json();
                    throw new Error(`Failed to delete project: ${response.status} ${errorData.message}`);
                }
            }
            catch (error)
            {
                console.error('Error deleting project:', error);
            }
        }

    // refresh token 통한 access token 재발급

    // refresh token 통한 access token 재발급
    async function handleTokenRefresh() {
        const url = '/reissue';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok)
            {
                const newAccessToken = response.headers.get('access');
                localStorage.setItem('access', newAccessToken);
            } else
            {
                const errorData = await response.json();
                throw new Error(`Failed to refresh token: ${response.status} ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }

    // 전체 ProjectData 가져오기 -> 데이터를 토대로 option 설정 -> html 요소 생성 -> select에 이벤트 추가
    const projectData = await fetchProjectData();
    setOptions(projectData);
    setProjectElements(projectData);
    addSelectEventListener(projectData);
});