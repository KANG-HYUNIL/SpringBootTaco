import { initializeToastEditor } from "../../utils/ToastTUI.js";
import { fetchWithAccessToken } from "../../utils/tokenHandle.js";
import { navigateToAdminApplication } from "../adminPublic.js";
import * as URLS from "../../utils/fetchURLStr.js";
import {populateAttachmentFileList} from "../../utils/fileUtils.js";

document.addEventListener("DOMContentLoaded", async function() {
    // 외부 스크립트가 로드된 후 toastui 에디터 초기화
    const editor = await initializeToastEditor('#editor');

    let applicationId = null;

    // Function to send application data, 게시물 생성
    async function submitApplication() {
        // 게시물의 데이터 수집 및 DTO 생성
        const title = document.getElementById('applicationTitle').value;
        const startTime = getSelectedDateTime('start');
        const endTime = getSelectedDateTime('end');
        const content = editor.getHTML();
        const attachmentFilePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item')).map(item => item.dataset.filePath);

        if (!title || !startTime || !endTime || !content.trim()) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const isConfirmed = confirm('Are you sure you want to submit this application?');
        if (!isConfirmed) 
            {
            return; // Exit the function if the user cancels
        }

        // applicationDTO 생성
        const applicationDTO = {
            id: applicationId,
            title,
            startTime,
            endTime,
            content,
            attachmentFilePaths
        };

        // URL 설정
        const url = applicationId ? URLS.API.FixApplication : URLS.API.WriteApplication;

        console.log(applicationDTO);

        try 
        {
            const response = await fetchWithAccessToken(url, applicationDTO);

            if (!response.ok) 
            {
                const errorData = await response.json();
                throw new Error(`Request failed with status ${response.status}: ${errorData.message}`);
            }

            alert('Application 제출 성공');
            navigateToAdminApplication();

        } 
        catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Error submitting application:', error);
        }
    }

    // Function to fetch application data by ID
    async function getApplicationById(applicationId) {
        const url = URLS.API.GetApplicationById(applicationId);
        try {
            const response = await fetchWithAccessToken(url);

            if (!response.ok) 
            {
                throw new Error('Failed to fetch application data');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching application data:', error);
            throw error;
        }
    }

    // Function to check and populate application data
    async function checkAndPopulateApplicationData() {
        const storedApplicationId = localStorage.getItem('applicationId');
        if (storedApplicationId) {
            applicationId = storedApplicationId;
            localStorage.removeItem('applicationId');

            try {
                const applicationData = await getApplicationById(applicationId);

                // Populate HTML elements with application data
                document.getElementById('applicationTitle').value = applicationData.title;
                setDateTimeSelects('start', applicationData.startTime);
                setDateTimeSelects('end', applicationData.endTime);
                editor.setHTML(applicationData.content);

                // Populate attachment files
                const attachmentFileList = document.getElementById('attachmentFileList');
                populateAttachmentFileList(attachmentFileList, applicationData.attachmentFilePaths);

                // Change page title
                document.getElementById('pageTitle').textContent = 'Application 게시글 수정';
            } catch (error) {
                console.error('Error fetching application data:', error);
            }
        }
    }

    // Populate select options for year, month, day, hour, and minute 년/월/일/시/분 select option 생성
    function populateSelectOptions() {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const days = Array.from({ length: 31 }, (_, i) => i + 1);
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 60 }, (_, i) => i);

        populateOptions(document.getElementById('startYear'), years);
        populateOptions(document.getElementById('startMonth'), months);
        populateOptions(document.getElementById('startDay'), days);
        populateOptions(document.getElementById('startHour'), hours);
        populateOptions(document.getElementById('startMinute'), minutes);

        populateOptions(document.getElementById('endYear'), years);
        populateOptions(document.getElementById('endMonth'), months);
        populateOptions(document.getElementById('endDay'), days);
        populateOptions(document.getElementById('endHour'), hours);
        populateOptions(document.getElementById('endMinute'), minutes);
    }

    //option들을 select에 추가
    function populateOptions(selectElement, options) {
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    // Function to gather selected values and convert to LocalDateTime
    // Function to gather selected values and convert to LocalDateTime with timezone
    function getSelectedDateTime(prefix) {
        const year = document.getElementById(`${prefix}Year`).value;
        const month = document.getElementById(`${prefix}Month`).value.padStart(2, '0');
        const day = document.getElementById(`${prefix}Day`).value.padStart(2, '0');
        const hour = document.getElementById(`${prefix}Hour`).value.padStart(2, '0');
        const minute = document.getElementById(`${prefix}Minute`).value.padStart(2, '0');
    
        // 사용자의 로컬 시간대 오프셋을 포함한 ISO 8601 형식의 문자열 반환
        const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
        const timezoneOffset = -date.getTimezoneOffset();
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
        const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    
        return `${year}-${month}-${day}T${hour}:${minute}:00${offsetSign}${offsetHours}:${offsetMinutes}`;
    }


    function setSelectValue(selectId, value) {
        const selectElement = document.getElementById(selectId);
        selectElement.value = value;
    }

    //특정 일자로 option들 설정
    function setDateTimeSelects(prefix, dateTime) {
        const date = new Date(dateTime);
        setSelectValue(`${prefix}Year`, date.getFullYear());
        setSelectValue(`${prefix}Month`, date.getMonth() + 1);
        setSelectValue(`${prefix}Day`, date.getDate());
        setSelectValue(`${prefix}Hour`, date.getHours());
        setSelectValue(`${prefix}Minute`, date.getMinutes());
    }


    populateSelectOptions();
    await checkAndPopulateApplicationData();

    // Attach event listeners to the submit buttons
    document.querySelector('.submit-application-button').addEventListener('click', submitApplication);
     


});