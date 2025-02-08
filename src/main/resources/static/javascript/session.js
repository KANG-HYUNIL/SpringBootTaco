document.addEventListener('DOMContentLoaded', async function () {
    const termSelect = document.getElementById('termSelect');
    const sessionContainer = document.getElementById('sessionContainer');

    // Fetch session data
    async function fetchSessionData() {
        try {
            const response = await fetch('/getSessionData');
            if (!response.ok) {
                throw new Error('Failed to fetch session data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching session data:', error);
            return {};
        }
    }

    // Populate the select options based on the terms
    function setOptions(sessionData) {
        const terms = Object.keys(sessionData);
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

    // Create session elements and hide them initially
    function setSessionElements(sessionData) {
        Object.keys(sessionData).forEach(term => {
            sessionData[term].forEach(session => {
                const sessionElement = document.createElement('div');
                sessionElement.className = 'relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hidden';
                sessionElement.dataset.term = term;
                const imageUrl = `/file/downloadImg?filePath=${encodeURIComponent(session.thumbnail)}`;
                sessionElement.innerHTML = `
                    <div class="aspect-w-16 aspect-h-9">
                        <img src="${imageUrl}" alt="Session thumbnail" class="object-cover w-full h-full"/>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 bg-black p-6 border-t border-gray-600">
                        <p class="text-white text-sm font-medium">${session.term}</p>
                        <h3 class="text-white text-xl font-bold mt-1">${session.title}</h3>
                        <div class="hidden">
                            <span class="session-id">${session.id}</span>
                            <span class="session-content">${session.content}</span>
                            <span class="session-attachments">${session.attachmentFilePaths.join(',')}</span>
                        </div>
                    </div>
                `;
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
        popup.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full overflow-y-auto max-h-full relative">
                <button class="absolute top-2 right-2 text-black hover:text-gray-700" onclick="closePopup()">
                    <i class="fas fa-times fa-2x"></i>
                </button>
                <img src="/file/downloadImg?filePath=${encodeURIComponent(session.thumbnail)}" alt="Thumbnail" class="w-full h-auto mb-4"/>
                <div class="border-t border-gray-300 mt-4 pt-4"></div>
                <h3 class="text-2xl font-bold mb-4">세션명: ${session.title}</h3>
                <div class="border-t border-gray-300 mt-4 pt-4"></div>
                <p class="mb-4">${session.content}</p>
                <div class="border-t border-gray-300 mt-4 pt-4">
                    <h4 class="text-lg font-semibold mb-2">첨부 파일 목록:</h4>
                    <ul>
                        ${session.attachmentFilePaths.map(filePath => {
                            const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
                            return `<li><a href="/file/downloadFile?filePath=${encodeURIComponent(filePath)}" class="text-blue-500 hover:underline">${fileName}</a></li>`;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    }

    // Function to display sessions based on the selected term
    function displaySessions(term) {
        const sessionElements = sessionContainer.children;
        for (let sessionElement of sessionElements) {
            if (sessionElement.dataset.term === term || term === "") {
                sessionElement.classList.remove('hidden');
            } else {
                sessionElement.classList.add('hidden');
            }
        }
    }

    // Event listener for term selection
    termSelect.addEventListener('change', function () {
        const selectedTerm = termSelect.value;
        displaySessions(selectedTerm);
    });

    // Fetch data and initialize the page
    const sessionData = await fetchSessionData();
    setOptions(sessionData);
    setSessionElements(sessionData);
});