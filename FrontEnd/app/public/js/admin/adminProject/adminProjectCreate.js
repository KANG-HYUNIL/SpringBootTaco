import {initializeToastEditor} from "../../utils/ToastTUI.js";
import { fetchWithAccessToken } from "../../utils/tokenHandle.js";
import {navigateToAdminProject} from "../adminPublic.js";
import * as URLS from "../../utils/fetchURLStr.js";
import { populateAttachmentFileList } from "../../utils/fileUtils.js";

document.addEventListener("DOMContentLoaded", async function() {

    // 외부 스크립트가 로드된 후 toastui 에디터 초기화
    const editor = await initializeToastEditor('#editor');

    let projectId = null;

    // Function to send project data
    async function submitProject() {
        // 게시물의 데이터 수집 및 DTO 생성
        const title = document.getElementById('projectTitle').value;
        const term = document.getElementById('projectTerm').value;
        const team = document.getElementById('projectTeam').value;
        const content = editor.getHTML();
        const thumbnail = document.getElementById('uploadedFilePath').value;
        const attachmentFilePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item')).map(item => item.dataset.filePath);

        if (!title || !term || !team || !content.trim() || !thumbnail) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const isConfirmed = confirm('Are you sure you want to submit this project?');
        if (!isConfirmed) {
            return; // Exit the function if the user cancels
        }

        // projectDTO 생성
        const projectDTO = {
            id: projectId,
            title,
            term,
            team,
            content,
            thumbnail,
            attachmentFilePaths
        };

        // URL 설정
        const url = projectId ? URLS.API.FixProject : URLS.API.WriteProject;

        try {
            const response = await fetchWithAccessToken(url, projectDTO);

            if (!response.ok) 
                {
                const errorData = await response.json();
                throw new Error(`Request failed with status ${response.status}: ${errorData.message}`);
            }

            alert('Project 제출 성공');
            navigateToAdminProject();
        } 
        catch (error) 
        {
            alert(`Error: ${error.message}`);
            console.error('Error submitting project:', error);
        }
    }

    // Function to fetch project data by ID
    async function getProjectById(projectId) {
        const url = URLS.API.GetProjectById;
        try {
            const response = await fetchWithAccessToken(url, { id: projectId });

            if (!response.ok) {
                throw new Error('Failed to fetch project data');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching project data:', error);
            throw error;
        }
    }


    // Function to check and populate project data
    async function checkAndPopulateProjectData() {
        const storedProjectId = localStorage.getItem('projectId');
        if (storedProjectId) {
            projectId = storedProjectId;
            localStorage.removeItem('projectId');

            try {
                const projectData = await getProjectById(projectId);

                // Populate HTML elements with project data
                document.getElementById('projectTitle').value = projectData.title;
                document.getElementById('projectTerm').value = projectData.term;
                document.getElementById('projectTeam').value = projectData.team;
                document.getElementById('uploadedFilePath').value = projectData.thumbnail;
                const fileName = projectData.thumbnail.split('/').pop().split('_').slice(1).join('_');
                document.getElementById('uploadedFileName').value = fileName;
                document.getElementById('fileNameLabel').textContent = `파일 이름: ${fileName.split('_').slice(1).join('_')}`;
                editor.insertText(projectData.content);

                // Populate attachment files
                const attachmentFileList = document.getElementById('attachmentFileList');
                populateAttachmentFileList(attachmentFileList, projectData.attachmentFilePaths);

                // Change page title
                document.getElementById('pageTitle').textContent = 'Project 게시글 수정';
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        }
    }

    await checkAndPopulateProjectData();

    // Attach event listeners to the submit buttons
    document.querySelector('.submit-project-button').addEventListener('click', submitProject);

})

