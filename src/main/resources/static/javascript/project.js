document.addEventListener('DOMContentLoaded', async function () {
    const termSelect = document.getElementById('termSelect');
    const projectContainer = document.getElementById('projectContainer');

    // Fetch project data
    async function fetchProjectData() {
        try {
            const response = await fetch('/getProjectData');
            if (!response.ok) {
                throw new Error('Failed to fetch project data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching project data:', error);
            return {};
        }
    }

    // Populate the select options based on the terms
    function setOptions(projectData) {
        const terms = Object.keys(projectData);
        terms.forEach(term => {
            const option = document.createElement('option');
            option.value = term;
            option.textContent = term;
            termSelect.appendChild(option);
        });
        // Automatically select the last option
        if (terms.length > 0)
        {
            termSelect.selectedIndex = terms.length - 1;
        }
    }

    // Create project elements and hide them initially
    function setProjectElements(projectData) {
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
                projectContainer.appendChild(projectElement);

                // Add event listener to the project element for popup
                projectElement.addEventListener('click', function() {
                    showPopup(project);
                });

            });
        });
    }

    // Function to display projects based on the selected term
    function displayProjects(term) {
        const projectElements = projectContainer.children;
        for (let projectElement of projectElements) {
            if (projectElement.dataset.term === term || term === "") {
                projectElement.classList.remove('hidden');
            } else {
                projectElement.classList.add('hidden');
            }
        }
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

    // Function to show popup with project details
    function showPopup(project) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
        popup.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full overflow-y-auto max-h-full relative">
                <button class="absolute top-2 right-2 text-black hover:text-gray-700" onclick="closePopup()">
                    <i class="fas fa-times fa-2x"></i>
                </button>
                <img src="/file/downloadImg?filePath=${encodeURIComponent(project.thumbnail)}" alt="Thumbnail" class="w-full h-auto mb-4"/>
                <div class="border-t border-gray-300 mt-4 pt-4"></div>
                <p class="text-lg font-semibold mb-2">팀명: ${project.team}</p>
                <h3 class="text-2xl font-bold mb-4">프로젝트명: ${project.title}</h3>
                <div class="border-t border-gray-300 mt-4 pt-4"></div>
                <p class="mb-4">${project.content}</p>
                <div class="border-t border-gray-300 mt-4 pt-4">
                    <h4 class="text-lg font-semibold mb-2">첨부 파일 목록:</h4>
                    <ul>
                        ${project.attachmentFilePaths.map(filePath => {
                            const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
                            return `<li><a href="/file/downloadFile?filePath=${encodeURIComponent(filePath)}" class="text-blue-500 hover:underline">${fileName}</a></li>`;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    }


    // Event listener for term selection
    termSelect.addEventListener('change', function () {
        const selectedTerm = termSelect.value;
        displayProjects(selectedTerm);
    });

    // Fetch data and initialize the page
    const projectData = await fetchProjectData();
    setOptions(projectData);
    setProjectElements(projectData);
    addSelectEventListener(projectData);
});