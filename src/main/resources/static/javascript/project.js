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