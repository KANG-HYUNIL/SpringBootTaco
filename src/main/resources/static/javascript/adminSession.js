document.addEventListener('DOMContentLoaded', async function () {


    // 전체 SessionData를 가져오는 메서드
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

    // option을 설정하는 메서드
    function setOptions(sessionData) {
        const termSelect = document.getElementById('termSelect');
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

    // html 요소를 생성하는 메서드
    function setSessionElements(sessionData) {
        const sessionContainer = document.getElementById('sessionContainer');

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
                        <div class="absolute top-2 right-2 dropdown inline-block">
                            <button class="text-gray-400 hover:text-white"><i class="fas fa-cog fa-3x"></i></button>
                            <div class="dropdown-content hidden absolute right-0 bottom-full mb-2 w-36 bg-white rounded-md shadow-lg z-10 border border-black">
                                <button class="modify-button w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100 border-b border-black">수정</button>
                                <button class="delete-button w-full text-left px-4 py-2 text-2xl text-gray-700 hover:bg-gray-100">삭제</button>
                            </div>
                        </div>
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

                // Add event listener to the delete button
                const deleteButton = sessionElement.querySelector('.delete-button');
                deleteButton.addEventListener('click', async function() {
                    if (confirm('Session 삭제?')) {
                        const sessionId = sessionElement.querySelector('.session-id').textContent;
                        await deleteSession(sessionId);
                    }
                });

                // Add event listener to the modify button
                const modifyButton = projectElement.querySelector('.modify-button');
                modifyButton.addEventListener('click', function() {
                    if (confirm('Session 수정?')) {
                        const sessionId = projectElement.querySelector('.session-id').textContent;
                        localStorage.setItem('sessionId', sessionId);
                        location.href = '/admin/session/fix';
                    }
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


    // select의 선택 항목이 변경될 때 화면에 나��나는 요소를 변경하는 메서드
    function addSelectEventListener() {
        const termSelect = document.getElementById('termSelect');
        const sessionContainer = document.getElementById('sessionContainer');

        // Function to display sessions based on the selected term
        function displaySessions(term) {
            const sessionElements = sessionContainer.children;
            for (let sessionElement of sessionElements) {

                if (sessionElement.dataset.term === term || term === "")
                {
                    sessionElement.classList.remove('hidden');
                }
                else
                {
                    sessionElement.classList.add('hidden');
                }
            }
        }

        // Event listener for term selection
        termSelect.addEventListener('change', function () {
            const selectedTerm = termSelect.value;
            displaySessions(selectedTerm);
        });
    }

    // Session 삭제 요청 메서드
    // Session 삭제 요청 메서드
    async function deleteSession(sessionId) {
        //url, access token, id 설정
        const url = '/admin/deleteSession';
        const accessToken = localStorage.getItem('access');
        const sessionDTO = { id: sessionId };

        // Session 삭제 요청
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': accessToken
                },
                body: JSON.stringify(sessionDTO),
                credentials: 'include'
            });

            //406 응답은 access token 만료 시 발생
            if (response.status === 406) {
                await handleTokenRefresh();
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': localStorage.getItem('access')
                    },
                    body: JSON.stringify(sessionDTO),
                    credentials: 'include'
                });
            }

            // 응답이 정상적으로 왔을 시
            if (response.ok) {
                alert('삭제 완료');
                window.location.href = '/admin/';
            } else {
                const errorData = await response.json();
                throw new Error(`Failed to delete session: ${response.status} ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    }

    // refresh token 통한 access token 재발급
    async function handleTokenRefresh() {
        const url = '/reissue'; // refresh token 요청 url

        // refresh token 요청
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok)
            {
                const newAccessToken = response.headers.get('access');
                localStorage.setItem('access', newAccessToken);
            }
            else
            {
                const errorData = await response.json();
                throw new Error(`Failed to refresh token: ${response.status} ${errorData.message}`);
            }
        }
        catch (error)
        {
            console.error('Error refreshing token:', error);
        }
    }

    // 전체 SessionData 가져오기 -> 데이터를 토대로 option 설정 -> html 요소 생성 -> select에 이벤트 추가
    const sessionData = await fetchSessionData();
    setOptions(sessionData);
    setSessionElements(sessionData);
    addSelectEventListener(sessionData);

});