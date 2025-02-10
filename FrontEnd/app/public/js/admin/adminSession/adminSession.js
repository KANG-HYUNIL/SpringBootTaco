import { fetchSessionData, setOptions, displaySessions, addSelectEventListener } from "../../utils/sessionUtils.js";
import { sessionElementTemplate, sessionPopupTemplate } from "../../../htmlTemplates/admin/adminSessionHTMLTemplates.js";
import { fetchWithAccessToken } from "../../utils/tokenHandle.js";
import * as URLS from "../../utils/fetchURLStr.js"


const termSelect = document.getElementById('termSelect');
const sessionContainer = document.getElementById('sessionContainer');

// html 요소를 생성하는 메서드
function setSessionElements(sessionData) {
    Object.keys(sessionData).forEach(term => {
        sessionData[term].forEach(session => {
            const sessionElement = document.createElement('div');
            sessionElement.className = 'relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hidden';
            sessionElement.dataset.term = term;
            sessionElement.innerHTML = sessionElementTemplate(session);
            sessionContainer.appendChild(sessionElement);

            // Add event listener to the session element for popup
            sessionElement.addEventListener('click', function() {
                showPopup(session);
            });

            // Add event listener to the delete button
            const deleteButton = sessionElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async function(event) {
                event.stopPropagation();
                if (confirm('Session 삭제?')) {
                    const sessionId = sessionElement.querySelector('.session-id').textContent;
                    await deleteSession(sessionId);
                }
            });

            // Add event listener to the modify button
            const modifyButton = sessionElement.querySelector('.modify-button');
            modifyButton.addEventListener('click', function(event) {
                event.stopPropagation();
                if (confirm('Session 수정?')) {
                    const sessionId = sessionElement.querySelector('.session-id').textContent;
                    localStorage.setItem('sessionId', sessionId);
                    location.href = URLS.AdminPage.FixSession;
                }
            });

            sessionElement.querySelector('.dropdown button').addEventListener('click', function(event) {
                event.stopPropagation();
                const dropdownContent = this.nextElementSibling;
                dropdownContent.classList.toggle('hidden');
            });
        });
    });
}

// Session 삭제 요청 메서드
async function deleteSession(sessionId) {
    const url = URLS.API.DeleteSession;
    const sessionDTO = { id: sessionId };

    try {
        const response = await fetchWithAccessToken(url, sessionDTO);

        if (response.ok) {
            alert('삭제 완료');
            window.location.href = URLS.AdminPage.Session;
        } else {
            const errorData = await response.json();
            throw new Error(`Failed to delete session: ${response.status} ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting session:', error);
        alert(`Error: ${error.message}`);
    }
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
        if (popup) {
            popup.remove();
        }
    };
});