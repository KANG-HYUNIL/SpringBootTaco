import { fetchProjectData, setOptions, displayProjects, addSelectEventListener } from "../../utils/projectUtils.js";
import { projectElementTemplate, projectPopupTemplate } from "../../../htmlTemplates/admin/adminProjectHTMLTemplates.js"
import {fetchWithAccessToken} from "../../utils/tokenHandle.js";

const termSelect = document.getElementById('termSelect');
const projectContainer = document.getElementById('projectContainer');


// html 요소를 생성하는 메서드
function setProjectElements(projectData) {
    Object.keys(projectData).forEach(term => {
        projectData[term].forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hidden';
            projectElement.dataset.term = term;
            projectElement.innerHTML = projectElementTemplate(project);
            projectContainer.appendChild(projectElement);

            // Add event listener to the project element for popup
            projectElement.addEventListener('click', function() {
                showPopup(project);
            });

            // Add event listener to the delete button
            const deleteButton = projectElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async function(event) {
                event.stopPropagation();
                if (confirm('Project 삭제?')) {
                    const projectId = projectElement.querySelector('.project-id').textContent;
                    await deleteProject(projectId);
                }
            });

            // Add event listener to the modify button
            const modifyButton = projectElement.querySelector('.modify-button');
            modifyButton.addEventListener('click', function(event) {
                event.stopPropagation();
                if (confirm('Project 수정?')) {
                    const projectId = projectElement.querySelector('.project-id').textContent;
                    localStorage.setItem('projectId', projectId);
                    location.href = '/admin/project/fix';
                }
            });

            projectElement.querySelector('.dropdown button').addEventListener('click', function(event) {
                event.stopPropagation();
                const dropdownContent = this.nextElementSibling;
                dropdownContent.classList.toggle('hidden');
            });
        });
    });
}

// Project 삭제 요청 메서드
async function deleteProject(projectId) {
    const url = '/api/admin/deleteProject';
    const projectDTO = { id: projectId };

    try {
        const response = await fetchWithAccessToken(url, projectDTO);

        if (response.ok) 
        {
            alert('삭제 완료');
            window.location.href = '/admin';
        } 
        else 
        {
            const errorData = await response.json();
            throw new Error(`Failed to delete project: ${response.status} ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert(`Error: ${error.message}`);
    }
}



// Function to show popup with project details
function showPopup(project) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    popup.innerHTML = projectPopupTemplate(project);
    document.body.appendChild(popup);
}

//DOMContentLoaded 시 처리
document.addEventListener('DOMContentLoaded', async function () {

    // Fetch data and initialize the page
    const projectData = await fetchProjectData();
    setOptions(projectData, termSelect);
    setProjectElements(projectData);
    addSelectEventListener(termSelect, projectContainer);

    // Function to close popup
    window.closePopup = function() {
        const popup = document.querySelector('.fixed.inset-0');
        if (popup)
        {
            popup.remove();
        }
    };

});