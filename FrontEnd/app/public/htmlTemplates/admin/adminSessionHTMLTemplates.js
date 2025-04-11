import * as URLS from "../../js/utils/fetchURLStr.js";

export function sessionElementTemplate(session) {
    const imageUrl = URLS.API.FileDownloadImg(session.thumbnail);
    return `
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
}

export function sessionPopupTemplate(session) {
    return `
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full overflow-y-auto max-h-full relative">
            <button class="absolute top-2 right-2 text-black hover:text-gray-700" onclick="closePopup()">
                <i class="fas fa-times fa-2x"></i>
            </button>
            <img src="${URLS.API.FileDownloadImg(session.thumbnail)}" alt="Thumbnail" class="w-full h-auto mb-4"/>
            <div class="border-t border-gray-300 mt-4 pt-4"></div>
            <h3 class="text-2xl font-bold mb-4">세션명: ${session.title}</h3>
            <div class="border-t border-gray-300 mt-4 pt-4"></div>
            <p class="mb-4">${session.content}</p>
            <div class="border-t border-gray-300 mt-4 pt-4">
                <h4 class="text-lg font-semibold mb-2">첨부 파일 목록:</h4>
                <ul>
                    ${session.attachmentFilePaths.map(filePath => {
                        const fileName = filePath.split('/').pop().split('_').slice(1).join('_');
                        return `<li><a href="${URLS.API.FileDownloadFile(filePath)}" class="text-blue-500 hover:underline">${fileName}</a></li>`;
                    }).join('')}
                </ul>
            </div>
        </div>
    `;
}