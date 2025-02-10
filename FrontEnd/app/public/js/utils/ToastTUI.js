import * as URLS from "./fetchURLStr.js";

export async function initializeToastEditor(editorElementId) {
    // 외부 스크립트가 로드될 때까지 기다리는 함수
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    // toastui 에디터 생성 및 기본 설정
    const editor = new toastui.Editor({
        el: document.querySelector(editorElementId),
        height: '1000px',
        initialEditType: 'markdown',
        initialValue: '내용을 입력해 주세요.',
        previewStyle: 'vertical',
        customHTMLRenderer: {
            htmlBlock: {
                iframe(node) {
                    return [
                        {
                            type: 'openTag',
                            tagName: 'iframe',
                            outerNewLine: true,
                            attributes: node.attrs,
                        },
                        { type: 'html', content: node.childrenHTML ?? '' },
                        { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
                    ];
                },
                div(node) {
                    return [
                        { type: 'openTag', tagName: 'div', outerNewLine: true, attributes: node.attrs },
                        { type: 'html', content: node.childrenHTML ?? '' },
                        { type: 'closeTag', tagName: 'div', outerNewLine: true },
                    ];
                },
            },
            htmlInline: {
                big(node, { entering }) {
                    return entering
                        ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                        : { type: 'closeTag', tagName: 'big' };
                },
            },
        },
    });

    // Add YouTube command
    editor.addCommand('markdown', 'addYoutube', () => {
        let url = prompt('추가할 youtube 영상의 주소창 url을 담아주세요!');
        if (!url) return false;

        const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
        const videoId = match ? match[1] : '';

        if (!videoId) {
            alert('유효한 YouTube URL을 입력해 주세요.');
            return false;
        }

        let str = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        `;

        str = str.replace(/\s+/g, ' ').trim();
        editor.insertText(str);
        return true;
    });

    // Add YouTube toolbar item
    const youtubeLogo = '/images/youtubeIcon.jpg';
    editor.insertToolbarItem(
        { groupIndex: 3, itemIndex: 3 },
        {
            name: 'youtube',
            tooltip: 'youtube',
            className: 'toastui-editor-toolbar-icons',
            style: { backgroundImage: `url(${youtubeLogo})`, backgroundSize: '25px', color: 'red' },
            command: 'addYoutube'
        }
    );

    // Remove existing addImageBlobHook and add a new one
    editor.removeHook('addImageBlobHook');
    editor.addHook('addImageBlobHook', async (file, callback) => {
        const formData = new FormData();
        formData.append('multipartFile', file);

        const imageURL = URLS.API.FilePreUpload;

        try {
            const response = await fetch(imageURL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('파일 업로드 실패');
            }

            const data = await response.json();
            const filePath = data.filePath;
            const imageUrl = URLS.API.FileDownloadImg(filePath);
            callback(imageUrl, 'image alt attribute');
            editor.eventEmitter.emit('closePopup');
        } catch (error) {
            console.error('업로드 실패:', error);
        }
    });

    console.log("editor loaded");

    return editor;
}