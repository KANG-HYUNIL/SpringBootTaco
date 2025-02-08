document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch application data
    async function fetchApplicationData() {
        try {
            const url = '/getApplicationData';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
            {
                throw new Error(`Failed to fetch application data: ${response.statusText}`);
            }

            const applicationData = await response.json();
            displayApplications(applicationData);
        }
        catch (error)
        {
            console.error('Error fetching application data:', error);
        }
    }

    // Function to display applications
   function displayApplications(applications) {
       // Sort applications by start date in ascending order
       applications.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

       const tbody = document.querySelector('tbody');
       tbody.innerHTML = ''; // Clear existing rows

       applications.forEach((application, index) => {
           const row = document.createElement('tr');

           // Hidden field for application id
           const idCell = document.createElement('td');
           idCell.className = 'hidden';
           idCell.textContent = application.id;
           row.appendChild(idCell);

           const numberCell = document.createElement('td');
           numberCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
           numberCell.textContent = index + 1;
           row.appendChild(numberCell);

           const titleCell = document.createElement('td');
           titleCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
           titleCell.textContent = application.title;
           titleCell.style.cursor = 'pointer';
           titleCell.addEventListener('click', () => {
               const url = `/application/content?id=${application.id}`;
               sendTokenGetURL(url);
           });
           row.appendChild(titleCell);

           const startCell = document.createElement('td');
           startCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
           startCell.textContent = application.startTime.split('T')[0];
           row.appendChild(startCell);

           const endCell = document.createElement('td');
           endCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';
           endCell.textContent = application.endTime.split('T')[0];
           row.appendChild(endCell);

           tbody.appendChild(row);
       });
   }

   //Admin 페이지 사용 위한 Token 전송 로직
   function sendTokenGetURL(url) {
       // Access Token 가져오기
       const accessToken = localStorage.getItem('access');

       console.log("Fetching URL with access token:", url);

       //GET fetch
       fetch(url, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
               'access': accessToken, // Access Token 추가
           },
           credentials: 'include' // 쿠키 포함 요청
       })
       .then(response => {
           if (response.ok) {
               // 인증 성공 시 HTML 내용 반환
               return response.text();
           }
           else if (response.status === 406)
           {
               // Access Token 만료 -> Refresh Token으로 재발급 시도
               console.warn("Access token expired. Attempting to refresh...");
               return handleTokenRefresh(url);
           }
           else
           {
               // 기타 오류 처리
               return handleRequestError(response, "Access token error");
           }
       })
       .then(html => {
           if (html)
           {
               // URL에서 applicationId 추출
               const urlParams = new URLSearchParams(url.split('?')[1]);
               const applicationId = urlParams.get('id');
               localStorage.setItem('applicationId', applicationId);

               // HTML 응답을 받아 화면에 표시
               document.open(); // 기존 DOM 초기화
               document.write(html); // 새로운 HTML 렌더링
               document.close(); // DOM 렌더링 완료
           }
       })
       .catch(error => {
           // 최종적으로 처리되지 않은 에러
           console.error("Error during fetch:", error);
           redirectToLogin();
       });
   }

   //refresh token 통한 access token 재발급
   function handleTokenRefresh(originalURL)
   {

       const url = '/reissue';

       return fetch(url, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           credentials: 'include' // 쿠키 포함 요청
       })
       .then(response => {
           if (response.ok) {
               // 새 Access Token 저장
               const newAccessToken = response.headers.get('access');
               localStorage.setItem('access', newAccessToken);
               console.log("Access token refreshed. Retrying original request...");
               // 원래 요청 재시도
               return sendTokenGetURL(originalURL);
           }
           else
           {
               // Refresh Token 재발급 실패
               return handleRequestError(response, "Refresh token error");
           }
       });
   }

   //요청 오류 처리
   function handleRequestError(response, message)
   {
       return response.json().then(data => {
           alert(`${response.status}: ${data.message || message}`);
           throw new Error(data.message || message);
       });
   }

   //로그인 페이지로 리다이렉트
   function redirectToLogin() {
       // 로그인 페이지로 리다이렉트
       localStorage.setItem('redirectToAdmin', 'true');
       window.location.href = '/account/login';
   }

    // Fetch and display application data on DOMContentLoaded
    fetchApplicationData();
});