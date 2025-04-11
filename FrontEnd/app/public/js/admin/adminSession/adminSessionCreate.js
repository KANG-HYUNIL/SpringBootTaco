import { initializeToastEditor } from "../../utils/ToastTUI.js";
import { fetchWithAccessToken } from "../../utils/tokenHandle.js";
import { navigateToAdminSession } from "../adminPublic.js";
import * as URLS from "../../utils/fetchURLStr.js";
import { populateAttachmentFileList } from "../../utils/fileUtils.js";

document.addEventListener("DOMContentLoaded", async function() {

    // 외부 스크립트가 로드된 후 toastui 에디터 초기화
    const editor = await initializeToastEditor('#editor');

    let sessionId = null;

    // Function to send session data
    async function submitSession() {
        // 게시물의 데이터 수집 및 DTO 생성
        const title = document.getElementById('sessionTitle').value;
        const term = document.getElementById('sessionTerm').value;
        const content = editor.getHTML();
        const thumbnail = document.getElementById('uploadedFilePath').value;
        const attachmentFilePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item')).map(item => item.dataset.filePath);

        if (!title || !term || !content.trim() || !thumbnail) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const isConfirmed = confirm('Are you sure you want to submit this session?');
        if (!isConfirmed) {
            return; // Exit the function if the user cancels
        }

        // sessionDTO 생성
        const sessionDTO = {
            id: sessionId,
            title,
            term,
            content,
            thumbnail,
            attachmentFilePaths
        };

        // URL 설정
        const url = sessionId ? URLS.API.FixSession : URLS.API.WriteSession;

        try {
            const response = await fetchWithAccessToken(url, sessionDTO);

            if (!response.ok) 
            {
                const errorData = await response.json();
                throw new Error(`Request failed with status ${response.status}: ${errorData.message}`);
            }

            alert('Session 작성 성공');
            navigateToAdminSession();
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Error submitting session:', error);
        }
    }

    // Function to fetch session data by ID
    async function getSessionById(sessionId) {
        const url = URLS.API.GetSessionById;
        try {
            const response = await fetchWithAccessToken(url, { id: sessionId });

            if (!response.ok) 
            {
                throw new Error('Failed to fetch session data');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching session data:', error);
            throw error;
        }
    }


    // Function to check and populate session data
    async function checkAndPopulateSessionData() {
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId) 
        {
            sessionId = storedSessionId;
            localStorage.removeItem('sessionId');

            try 
            {
                const sessionData = await getSessionById(sessionId);

                // Populate HTML elements with session data
                document.getElementById('sessionTitle').value = sessionData.title;
                document.getElementById('sessionTerm').value = sessionData.term;
                document.getElementById('uploadedFilePath').value = sessionData.thumbnail;
                const fileName = sessionData.thumbnail.split('/').pop().split('_').slice(1).join('_');
                document.getElementById('uploadedFileName').value = fileName;
                document.getElementById('fileNameLabel').textContent = `파일 이름: ${fileName}`;
                editor.insertText(sessionData.content);

                // Populate attachment files
                const attachmentFileList = document.getElementById('attachmentFileList');
                populateAttachmentFileList(attachmentFileList, sessionData.attachmentFilePaths);

                // Change page title
                document.getElementById('pageTitle').textContent = 'Session 게시글 수정';
            } 
            catch (error) 
            {
                console.error('Error fetching session data:', error);
            }
        }
    }

    await checkAndPopulateSessionData();

    // Attach event listeners to the submit buttons
    document.querySelector('.submit-session-button').addEventListener('click', submitSession);
})


