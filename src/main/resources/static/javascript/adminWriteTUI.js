
//Toast 텍스트 에디터에 사용되는 코드들
//이미지 업로드, 유튜브 링크 통한 동영상 업로드 등의 기능이 포함됨.
//사용을 위해서는 <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
//html head 에 추가하고, div로 id=editor 을 만들어놔야 함.
//원인은 모르겠으나, 하단의 모든 코드를 html에 직접 넣어놔야지만 에디터 사용 가능. 아래 코드 복사해가
document.addEventListener("DOMContentLoaded", function() {
  //toastui 생성 및 기본 설정
  const editor = new toastui.Editor({
    el: document.querySelector('#editor'),
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
  //유튜브 링크를 통한 동영상 삽입 기능 추가
  editor.addCommand('markdown', 'addYoutube', () => {
    //툴바 아이템 클릭 시 나올 문구
    let url = prompt('추가할 youtube 영상의 주소창 url을 담아주세요!');
    if (!url) return false;
    url = url.split('=').pop() ?? ''; //유튜브 링크 url 파싱
    //div 생성
    const str = `
      <div class="video-container">
        <iframe src="https://www.youtube.com/embed/${url}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
    editor.insertText(str);
    return true;
  });

  // Add YouTube toolbar item
  //커스텀 툴바 아이템 생성
  const youtubeLogo = '/icons/youtubeIcon.jpg'; // 아이콘 이미지
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
  //이미지 추가 기능 조정
  editor.removeHook('addImageBlobHook');
  editor.addHook('addImageBlobHook', async (file, callback) => {
    const formData = new FormData();
    formData.append('multipartFile', file);

    //이미지 서버 예비 저장 API
    const imageURL = '/file/preUpload';

    //요청 전달
    try {
      const response = await fetch(imageURL,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      //결과 체크
      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }

      //데이터 가져오고 에디터에 반영
      const data = await response.json();
      const fileUrl = data.filePath; // 서버 컴퓨터의 이미지 예비 저장 경로
      editor.insertText(`<img src="${fileUrl}" alt=""/>`);
      editor.eventEmitter.emit('closePopup'); //팝업창 닫기
    }
    catch (error)
    {
      console.error('업로드 실패:', error);
    }
  });

    // Function to send request with token handling
      async function sendRequest(url, data) {
        const accessToken = localStorage.getItem('access');
        try {
          let response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access': accessToken
            },
            body: JSON.stringify(data),
            credentials: 'include'
          });

          if (response.status === 406) {
            await reissueToken();
            response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'access': localStorage.getItem('access')
              },
              body: JSON.stringify(data),
              credentials: 'include'
            });
          }

          if (!response.ok)
          {
            throw new Error('Request failed');
          }
        }
        catch (error) {
          console.error('Error:', error);
        }
      }

    // Function to reissue token

  // Function to reissue token
  async function reissueToken() {
    const reissueURL = '/reissue';
    try {
      const response = await fetch(reissueURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const accessToken = response.headers.get('access');
        localStorage.setItem('access', accessToken);
      } else {
        throw new Error('Token reissue failed');
      }
    }
    catch (error) {
      console.error('Error:', error);
    }
  }


  // Function to send project data
    async function submitProject() {
        //게시물의 데이터 수집 및 DTO 생성
      const title = document.getElementById('projectTitle').value;
      const term = document.getElementById('projectTerm').value;
      const team = document.getElementById('projectTeam').value;
      const content = editor.getHTML();
      const thumbnail = document.getElementById('uploadedFilePath').value;
      const attachmentFilePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item')).map(item => item.dataset.filePath);

      if (!title || !term || !team || !content.trim() || thumbnail)
      {
        alert('모든 필드를 채워주세요.');
        return;
      }

        //projectDTO 생성
      const projectDTO = {
        title,
        term,
        team,
        content,
        thumbnail,
        attachmentFilePaths
      };

      const url = '/admin/writeProject'; //Project 작성 API

      await sendRequest(url, projectDTO);
    }

    // Function to send session data
    async function submitSession() {
        //게시물의 데이터 수집
      const title = document.getElementById('sessionTitle').value;
      const term = document.getElementById('sessionTerm').value;
      const content = editor.getMarkdown();
      const thumbnail = document.getElementById('uploadedFilePath').value;
      const attachmentFilePaths = Array.from(document.querySelectorAll('#attachmentFileList .file-item')).map(item => item.dataset.filePath);

      if (!title || !term || !content.trim() || thumbnail)
      {
        alert('모든 필드를 채워주세요.');
        return;
      }

        //SessionDTO 생성
      const sessionDTO = {
        title,
        term,
        content,
        thumbnail,
        attachmentFilePaths
      };

        const url = '/admin/writeSession'

      await sendRequest(url, sessionDTO);
    }

    // Attach event listeners to the submit buttons
      document.querySelector('.submit-project-button').addEventListener('click', submitProject);
      document.querySelector('.submit-session-button').addEventListener('click', submitSession);

});