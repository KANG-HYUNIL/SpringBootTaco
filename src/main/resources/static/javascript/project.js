document.addEventListener('DOMContentLoaded', function () {

    // select 및 projectContainer를 가져온다.
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

            // projectElement를 만들어서 projectContainer에 추가한다.
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

    // Function to display projects based on the selected term
    function displayProjects(term) {
        // projectContainer의 모든 projectElement를 가져온다.
        const projectElements = projectContainer.children;
        for (let projectElement of projectElements) {
            if (projectElement.dataset.term === term)// 선택된 term과 같은 project만 보여준다.
            {
                projectElement.classList.remove('hidden');
            }
            else  //
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
});