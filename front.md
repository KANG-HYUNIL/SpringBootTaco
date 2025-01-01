
프론트 코드 양식 미리 작성해놓아보기

session 게시물 요청에 딸려 오는 데이터 처리 방법?
```javascript
document.addEventListener("DOMContentLoaded", function() {
    const sessionData = /* 서버에서 받은 sessionData */;
    const downloadedFiles = new Set();

    //preview 해당하는 html query 만드는 코드, preview-container에 해당하는 div가 있다고
    //전제하고, innerHTMl의 각종 태그 및 style들은 이후에 변경 처리해야 함.
    function createPreviewItems(data) {
        const container = document.querySelector('#preview-container');
        data.forEach(item => {
            const previewElement = document.createElement('div');
            previewElement.id = `preview-${item.id}`;
            previewElement.classList.add('preview-item');
            previewElement.innerHTML = `
                <img id="thumbnail-${item.id}" alt="Thumbnail">
                <h3>${item.title}</h3>
                <p>${item.term}</p>
            `;
            container.appendChild(previewElement);
        });
    }



    function downloadFile(filePath, type) {
        if (downloadedFiles.has(filePath)) {
            return Promise.resolve(filePath);
        }
        const apiEndpoint = type === 'img' ? '/file/downloadImg' : '/file/downloadVideo';
        return fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filePath: filePath })
        })
        .then(response => response.blob())
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            downloadedFiles.add(filePath);
            return objectURL;
        });
    }

    function loadThumbnails(data) {
        const promises = [];
        data.forEach(item => {
            const thumbnailUrl = item.thumbnail;
            promises.push(
                downloadFile(thumbnailUrl, 'img').then(objectURL => {
                    const imgElement = document.querySelector(`#thumbnail-${item.id}`);
                    imgElement.src = objectURL;
                })
            );
        });
        return Promise.all(promises);
    }

    function loadContentMedia(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const mediaElements = doc.querySelectorAll('img, video');
        const promises = [];

        mediaElements.forEach(media => {
            const src = media.getAttribute('src');
            const type = media.tagName.toLowerCase();
            promises.push(
                downloadFile(src, type).then(objectURL => {
                    media.src = objectURL;
                })
            );
        });

        return Promise.all(promises).then(() => doc.body.innerHTML);
    }

    function initializeView(data) {
        loadThumbnails(data).then(() => {
            data.forEach(item => {
                const previewElement = document.querySelector(`#preview-${item.id}`);
                previewElement.addEventListener('click', () => {
                    fetch(`/session/${item.id}/content`)
                        .then(response => response.text())
                        .then(content => loadContentMedia(content))
                        .then(updatedContent => {
                            const modalContent = document.querySelector('#modal-content');
                            modalContent.innerHTML = updatedContent;
                            document.querySelector('#modal').style.display = 'block';
                        });
                });
            });
        });
    }

    initializeView(sessionData);
});

```


project 게시물 데이터 처리 방법?
```javascript
document.addEventListener("DOMContentLoaded", function() {
    const projectData = /* 서버에서 받은 projectData */;
    const downloadedFiles = new Set();

    //preview 해당하는 html query 만드는 코드, preview-container에 해당하는 div가 있다고
    //전제하고, innerHTMl의 각종 태그 및 style들은 이후에 변경 처리해야 함.
    function createPreviewItems(data) {
        const container = document.querySelector('#preview-container');
        data.forEach(item => {
            const previewElement = document.createElement('div');
            previewElement.id = `preview-${item.id}`;
            previewElement.classList.add('preview-item');
            previewElement.innerHTML = `
                <img id="thumbnail-${item.id}" alt="Thumbnail">
                <h3>${item.title}</h3>
                <p>${item.term}</p>
                <p>${item.team}</p>
            `;
            container.appendChild(previewElement);
        });
    }





    function downloadFile(filePath, type) {
        if (downloadedFiles.has(filePath)) {
            return Promise.resolve(filePath);
        }
        const apiEndpoint = type === 'img' ? '/file/downloadImg' : '/file/downloadVideo';
        return fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filePath: filePath })
        })
        .then(response => response.blob())
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            downloadedFiles.add(filePath);
            return objectURL;
        });
    }

    function loadThumbnails(data) {
        const promises = [];
        data.forEach(item => {
            const thumbnailUrl = item.thumbnail;
            promises.push(
                downloadFile(thumbnailUrl, 'img').then(objectURL => {
                    const imgElement = document.querySelector(`#thumbnail-${item.id}`);
                    imgElement.src = objectURL;
                })
            );
        });
        return Promise.all(promises);
    }

    function loadContentMedia(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const mediaElements = doc.querySelectorAll('img, video');
        const promises = [];

        mediaElements.forEach(media => {
            const src = media.getAttribute('src');
            const type = media.tagName.toLowerCase();
            promises.push(
                downloadFile(src, type).then(objectURL => {
                    media.src = objectURL;
                })
            );
        });

        return Promise.all(promises).then(() => doc.body.innerHTML);
    }

    function initializeView(data) {
        loadThumbnails(data).then(() => {
            data.forEach(item => {
                const previewElement = document.querySelector(`#preview-${item.id}`);
                previewElement.addEventListener('click', () => {
                    fetch(`/project/${item.id}/content`)
                        .then(response => response.text())
                        .then(content => loadContentMedia(content))
                        .then(updatedContent => {
                            const modalContent = document.querySelector('#modal-content');
                            modalContent.innerHTML = updatedContent;
                            document.querySelector('#modal').style.display = 'block';
                        });
                });
            });
        });
    }

    initializeView(projectData);
});

```
