document.addEventListener('DOMContentLoaded', function () {
    const termSelect = document.getElementById('termSelect');
    const sessionContainer = document.getElementById('sessionContainer');

    // Populate the select options based on the terms
    Object.keys(sessionData).forEach(term => {
        const option = document.createElement('option');
        option.value = term;
        option.textContent = term;
        termSelect.appendChild(option);
    });

    // Create session elements and hide them initially
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
        });
    });

    // Function to display sessions based on the selected term
    function displaySessions(term) {
        const sessionElements = sessionContainer.children;
        for (let sessionElement of sessionElements) {
            if (sessionElement.dataset.term === term) {
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
});