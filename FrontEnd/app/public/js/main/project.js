import { fetchProjectData, setOptions, displayProjects, addSelectEventListener } from "../utils/projectUtils.js";
import {projectElementTemplate, projectPopupTemplate} from "../../htmlTemplates/main/projectHTMLTemplates.js";


//project 페이지 js 

const termSelect = document.getElementById('termSelect');
const projectContainer = document.getElementById('projectContainer');


// Create project elements and hide them initially
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

        });
    });
}


// Function to show popup with project details
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