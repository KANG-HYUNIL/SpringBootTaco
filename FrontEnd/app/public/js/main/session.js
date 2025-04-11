import { fetchSessionData, setOptions, displaySessions, addSelectEventListener } from "../utils/sessionUtils.js";
import { sessionElementTemplate, sessionPopupTemplate } from "../../htmlTemplates/main/sessionHTMLTemplates.js";

const termSelect = document.getElementById('termSelect');
const sessionContainer = document.getElementById('sessionContainer');



// Create session elements and hide them initially
// Create session elements and hide them initially
function setSessionElements(sessionData) {
    Object.keys(sessionData).forEach(term => {
        sessionData[term].forEach(session => {
            const sessionElement = document.createElement('div');
            sessionElement.className = 'relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hidden';
            sessionElement.dataset.term = term;
            sessionElement.innerHTML = sessionElementTemplate(session);
            sessionContainer.appendChild(sessionElement);

            // Add event listener to the project element for popup
            sessionElement.addEventListener('click', function() {
                showPopup(session);
            });
        });
    });
}

// Function to show popup with session details
function showPopup(session) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
    popup.innerHTML = sessionPopupTemplate(session);
    document.body.appendChild(popup);
}

document.addEventListener('DOMContentLoaded', async function () {
    // Fetch data and initialize the page
    const sessionData = await fetchSessionData();
    setOptions(sessionData, termSelect);
    setSessionElements(sessionData);
    addSelectEventListener(termSelect, sessionContainer);

    // Function to close popup
    window.closePopup = function() {
        const popup = document.querySelector('.fixed.inset-0');
        if (popup)
        {
            popup.remove();
        }
    };
})