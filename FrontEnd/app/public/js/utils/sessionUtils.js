import FetchRequestBuilder from "./fetchRequest.js";

export async function fetchSessionData() {
    try {
        const url = "/api/getSessionData";
        const fetchRequest = new FetchRequestBuilder()
            .setUrl(url)
            .setMethod("GET")
            .setCredentials(false)
            .setPollingCount(3)
            .build();

        const response = await fetchRequest;
        if (!response.ok) {
            throw new Error('Failed to fetch session data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching session data:', error);
        return {};
    }
}

export function setOptions(sessionData, termSelect) {
    const terms = Object.keys(sessionData);
    terms.forEach(term => {
        const option = document.createElement('option');
        option.value = term;
        option.textContent = term;
        termSelect.appendChild(option);
    });

    // Automatically select the last option
    if (terms.length > 0) {
        termSelect.selectedIndex = 0;
    }
}

export function displaySessions(term, sessionContainer) {
    const sessionElements = sessionContainer.children;
    for (let sessionElement of sessionElements) {
        if (sessionElement.dataset.term === term || term === "") {
            sessionElement.classList.remove('hidden');
        } else {
            sessionElement.classList.add('hidden');
        }
    }
}

export function addSelectEventListener(termSelect, sessionContainer) {
    termSelect.addEventListener('change', function () {
        const selectedTerm = termSelect.value;
        displaySessions(selectedTerm, sessionContainer);
    });

    // Automatically select the last option
    termSelect.selectedIndex = 0;
    displaySessions(termSelect.value, sessionContainer);
}