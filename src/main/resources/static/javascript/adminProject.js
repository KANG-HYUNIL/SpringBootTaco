document.addEventListener('DOMContentLoaded', function () {
    const termSelect = document.getElementById('termSelect');
    const projectContainer = document.getElementById('projectContainer');

    // Populate the select options based on the terms
    Object.keys(projectData).forEach(term => {
        const option = document.createElement('option');
        option.value = term;
        option.textContent = term;
        termSelect.appendChild(option);
    });

    // Create project elements and hide them initially
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
                            <button class="w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100 border-b border-black">수정</button>
                            <button class="w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100">삭제</button>
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
            projectContainer.appendChild(projectElement);
        });
    });

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

    // Event listener for term selection
    termSelect.addEventListener('change', function () {
        const selectedTerm = termSelect.value;
        displayProjects(selectedTerm);
    });
});