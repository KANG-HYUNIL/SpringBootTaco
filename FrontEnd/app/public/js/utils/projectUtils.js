import FetchRequestBuilder from "./fetchRequest.js";

export async function fetchProjectData() {
    try {
        const url = "/api/getProjectData";
        const fetchRequest = new FetchRequestBuilder()
            .setUrl(url)
            .setMethod("GET")
            .setCredentials(false)
            .setPollingCount(3)
            .build();

        const response = await fetchRequest;
        if (!response.ok) {
            throw new Error('Failed to fetch project data');
        }

        return await response.json();
    } catch (err) {
        console.error("Error:", err);
        return {};
    }
}

export function setOptions(projectData, termSelect) {
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

export function displayProjects(term, projectContainer) {
    const projectElements = projectContainer.children;
    for (let projectElement of projectElements) {
        if (projectElement.dataset.term === term || term === "") {
            projectElement.classList.remove('hidden');
        } else {
            projectElement.classList.add('hidden');
        }
    }
}

export function addSelectEventListener(termSelect, projectContainer) {
    termSelect.addEventListener('change', function () {
        const selectedTerm = termSelect.value;
        displayProjects(selectedTerm, projectContainer);
    });

    // Automatically select the last option
    termSelect.selectedIndex = 0;
    displayProjects(termSelect.value, projectContainer);
}