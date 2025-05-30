import * as URLS from "../../js/utils/fetchURLStr.js";

export function projectElementTemplate(project) {
    const imageUrl = URLS.API.FileDownloadImg(project.thumbnail);
    return `
        <div class="aspect-w-16 aspect-h-9">
            <img src="${imageUrl}" alt="Project thumbnail" class="object-cover w-full h-full"/>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-black p-6 border-t border-gray-600">
            <p class="text-white text-sm font-medium">${project.term}</p>
            <h4 class="text-white text-lg font-semibold mt-1">${project.team}</h4>
            <h3 class="text-white text-xl font-bold mt-1">${project.title}</h3>
            <div class="hidden">
                <span class="project-id">${project.id}</span>
                <span class="project-content">${project.content}</span>
                <span class="project-attachments">${project.attachmentFilePaths.join(',')}</span>
            </div>
        </div>
    `;
}

export function projectPopupTemplate(project) {
    return `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full overflow-y-auto max-h-full relative">
            <button class="absolute top-2 right-2 text-black hover:text-gray-700" onclick="closePopup()">
                <i class="fas fa-times fa-2x"></i>
            </button>
            <img src="${URLS.API.FileDownloadImg(project.thumbnail)}" alt="Thumbnail" class="w-full h-auto mb-4"/>
            <div class="border-t border-gray-300 mt-4 pt-4"></div>
            <p class="text-lg font-semibold mb-2">팀명: ${project.team}</p>
            <h3 class="text-2xl font-bold mb-4">프로젝트명: ${project.title}</h3>
            <div class="border-t border-gray-300 mt-4 pt-4"></div>
            <p class="mb-4">${project.content}</p>
            <div class="border-t border-gray-300 mt-4 pt-4">
                <h4 class="text-lg font-semibold mb-2">첨부 파일 목록:</h4>
                <ul>
                    ${project.attachmentFilePaths.map(filePath => {
                        const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
                        return `<li><a href="${URLS.API.FileDownloadFile(filePath)}" class="text-blue-500 hover:underline">${fileName}</a></li>`;
                    }).join('')}
                </ul>
            </div>
        </div>
    `;
}