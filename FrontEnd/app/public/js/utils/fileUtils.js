import FetchRequestBuilder from "./fetchRequest.js";
import * as URLS from "./fetchURLStr.js";

function addThumbnailFunction() {
    // 썸네일 이미지 라벨에 들어갈 문자열 상수
    const thumbnailImageStr = '파일 이름:';

    // dropZone, selectImageButton, errorMessage 요소를 찾아서 변수에 저장
    const dropZone = document.getElementById('dropZone');
    const selectImageButton = document.getElementById('selectImageButton');

    // 드래그 앤 드롭 이벤트 리스너 추가(마우스 드래그 올릴 시 색상 변경)
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('border-blue-500');
    });

    // 드래그 앤 드롭 이벤트 리스너 추가(마우스 드래그 내릴 시 색상 변경)
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-blue-500');
    });

    // 드래그 앤 드롭 이벤트 리스너 추가(파일 드롭 시 파일 처리)
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('border-blue-500');
        const files = event.dataTransfer.files;
        handleThumbnailFiles(files);
    });

    // 파일 선택 버튼 클릭 이벤트 리스너 추가
    selectImageButton.addEventListener('click', () => {
        // 파일 입력 요소를 동적으로 생성
        const fileInput = document.createElement('input');
        // 파일 입력 요소의 타입을 'file'로 설정하여 파일 선택 창을 띄울 수 있게 함
        fileInput.type = 'file';
        // 파일 입력 요소의 accept 속성을 'image/*'로 설정하여 이미지 파일만 선택할 수 있게 제한
        fileInput.accept = 'image/*';
        // 파일 선택이 완료되었을 때 실행될 이벤트 핸들러를 설정
        fileInput.onchange = (event) => {
            // 선택된 파일들을 처리하는 함수 호출
            const files = event.target.files;
            handleThumbnailFiles(files);
        };
        // 파일 선택 창을 띄움
        fileInput.click();
    });

    // 이미지 파일 제거 버튼 클릭 이벤트 리스너 추가
    removeImageButton.addEventListener('click', () => {
        document.getElementById('uploadedFilePath').value = '';
        document.getElementById('uploadedFileName').value = '';
        fileNameLabel.textContent = thumbnailImageStr;
    });
}

// 파일 처리 함수
async function handleThumbnailFiles(files) {
    // 파일이 이미지 파일이 아닐 경우 에러 메시지 표시
    const file = files[0];
    if (!file.type.startsWith('image/')) {
        showErrorMessage('이미지 파일만 썸네일로 사용');
        return;
    }

    const formData = new FormData();
    formData.append('multipartFile', file);

    const url = URLS.API.FilePreUpload;

    try {
        const fetchRequest = new FetchRequestBuilder()
            .setUrl(url)
            .setMethod('POST')
            .addBody(formData)
            .build();

        const response = await fetchRequest;

        if (response.ok) {
            const data = await response.json();
            console.log('파일 업로드 성공:', data);
            // 파일 경로와 이름을 숨겨진 입력 요소에 저장
            document.getElementById('uploadedFilePath').value = data.filePath;
            document.getElementById('uploadedFileName').value = data.fileName;
            // 파일 이름과 경로를 라벨에 추가
            const thumbnailImageStr = '파일 경로 및 이름:';
            fileNameLabel.textContent = `${thumbnailImageStr} ${file.webkitRelativePath} / ${file.name}`;
        } 
        else 
        {
            const text = await response.text();
            throw new Error(`파일 업로드 실패: ${response.status} ${response.statusText} - ${text}`);
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// 첨부 파일 처리 위한 이벤트 등록 메서드
function addAttachmentFunction() {
    // 첨부 파일 드롭존, 파일 선택 버튼 요소 찾기
    const attachmentDropZone = document.getElementById('attachmentDropZone');
    const selectAttachmentButton = document.getElementById('selectAttachmentButton');

    // 첨부 파일 드롭존 이벤트 리스너 등록(올렸을 시 색 변경)
    attachmentDropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        attachmentDropZone.classList.add('border-blue-500');
    });

    // 첨부 파일 드롭존 이벤트 리스너 등록(내렸을 시 색 변경)
    attachmentDropZone.addEventListener('dragleave', () => {
        attachmentDropZone.classList.remove('border-blue-500');
    });

    // 드래그 드롭 했을 시 업로드 처리
    attachmentDropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        attachmentDropZone.classList.remove('border-blue-500');
        const files = event.dataTransfer.files;
        handleAttachmentFiles(files);
    });

    // 파일 업로드 버튼 로직 이벤트 처리
    selectAttachmentButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.onchange = (event) => {
            const files = event.target.files;
            handleAttachmentFiles(files);
        };
        fileInput.click();
    });
}

// 첨부 파일 예비 업로드 메서드
async function handleAttachmentFiles(files) {
    // 첨부 파일 목록을 저장할 요소 찾기
    const attachmentFileList = document.getElementById('attachmentFileList');

    // 여러 파일들에 대해 동시 처리 지원
    Array.from(files).forEach(async (file) => {
        // formData 생성
        const formData = new FormData();
        formData.append('multipartFile', file);

        // 파일 업로드 경로
        const url =  URLS.API.FilePreUpload;

        try {
            const fetchRequest = new FetchRequestBuilder()
                .setUrl(url)
                .setMethod('POST')
                .addBody(formData)
                .build();

            const response = await fetchRequest;

            if (response.ok) 
            {
                const data = await response.json();
                // 파일 업로드 성공 시 파일 목록에 추가

                populateAttachmentFileList(attachmentFileList, [data.filePath]);
            } 
            else 
            {
                const text = await response.text();
                throw new Error(`파일 업로드 실패: ${text}`);
            }
        } catch (error) {
            showErrorMessage(error.message);
        }
    });
}

// 첨부 파일 목록을 생성하는 메서드
export function populateAttachmentFileList(attachmentFileList, attachmentFilePaths) {
    attachmentFileList.innerHTML = ''; // Clear existing files

    attachmentFilePaths.forEach(filePath => {
        const fileName = filePath.split('/').pop();
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item', 'flex', 'items-center', 'mt-2');
        fileItem.dataset.filePath = filePath;
        fileItem.dataset.fileName = fileName;

        const fileLabel = document.createElement('span');
        fileLabel.textContent = fileName.split('_').slice(1).join('_');
        fileLabel.classList.add('text-sm', 'font-medium', 'text-gray-700');

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.classList.add('text-red-500', 'ml-2');
        deleteButton.onclick = () => {
            attachmentFileList.removeChild(fileItem);
        };

        fileItem.appendChild(fileLabel);
        fileItem.appendChild(deleteButton);
        attachmentFileList.appendChild(fileItem);
    });
}

// 에러 메시지 표시 함수
function showErrorMessage(message) {
    alert(message);
}

document.addEventListener("DOMContentLoaded", function() {
    addThumbnailFunction(); // 썸네일 이미지 처리 기능 추가 함수 호출
    addAttachmentFunction(); // 첨부 파일 처리 기능 추가 함수 호출
});