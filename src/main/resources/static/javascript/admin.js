//웹 페이지 다운로드 시
document.addEventListener('DOMContentLoaded', async function() {


    //admin 페이지 첫 진입 시 작업
    async function adminInit()
    {

        //사용자의 access token 가져오기
        let accessToken = localStorage.getItem('access');

        //access Token이 존재하지 않다면, login 페이지로 바로 이동
        if (!accessToken)
        {
            //admin 페이지로 이동하기 위한 플래그 설정
            localStorage.setItem('redirectToAdmin', 'true');
            window.location.href = '/account/login';
            return;
        }

        //서버로 access token을 통해 유효성 검사 요청, admin 페이지만 이렇게 구동. 다른 페이지는 header에 token 넣어서 filter로 처리
        const url = "/validate-admin-token";

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'access': accessToken
                }
            });

            if (response.status === 406)
            {
                await handleTokenRefresh();
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'access': localStorage.getItem('access')
                    }
                });
            }

            if (!response.ok)
            {
                const data = await response.json();
                alert(response.status + data.message + " access err");
                throw new Error('access token error');
            }
        }
        catch (error)
        {
            localStorage.setItem('redirectToAdmin', 'true');
            localStorage.removeItem('access');
            localStorage.removeItem('userName');
            alert('error' + error);
            console.error('Error:', error);
            window.location.href = '/account/login';
        }
    }

    //사용자 id로 검색
    async function searchById() {
        const id = document.getElementById('searchById').value;
        const url = '/account/getUserById';
        const userDTO = { id: id };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDTO)
            });

            if (response.status === 404) {
                alert('User not found');
            }
            else if (response.ok)
            {
                const user = await response.json();
                displayUserInfo(user);
            }
        }
        catch (error)
        {
            console.error('Error:', error);
        }
    }

    //사용자 name으로 정보 찾기
    async function searchByName() {
        const name = document.getElementById('searchByName').value;
        const url = '/account/getUserByName';
        const userDTO = { name: name };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDTO)
            });

            if (response.status === 404) {
                alert('User not found');
            }
            else if (response.ok)
            {
                const user = await response.json();
                displayUserInfo(user);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //사용자 정보를 웹 페이지에 표시하기
    function displayUserInfo(user) {
        const userInfoContainer = document.getElementById('userInfoContainer');
        userInfoContainer.innerHTML = `
            <div class="p-4 border border-gray-300 rounded-md shadow-sm">
                <p>ID: ${user.id}</p>
                <p>Name: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <p>Role: ${user.role}</p>
                <button onclick="setRole('${user.id}', 'ROLE_ADMIN')" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">SET TO ADMIN</button>
                <button onclick="setRole('${user.id}', 'ROLE_USER')" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">SET TO USER</button>
            </div>
        `;
    }

    //사용자 role 변경
    async function setRole(userId, role) {

        //사용자의 access token 가져오기
        let accessToken = localStorage.getItem('access');

        //url 설정
         const url = role === 'ROLE_ADMIN' ? '/admin/setRoleAdmin' : '/admin/setRoleUser';
         const userDTO = { id: userId }; //userDTO 생성

         try {
             let response = await fetch(url, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'access': accessToken
                 },
                 body: JSON.stringify(userDTO)
             });

             if (response.status === 406)
             {
                 await handleTokenRefresh();
                 response = await fetch(url, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                         'access': localStorage.getItem('access')
                     },
                     body: JSON.stringify(userDTO)
                 });
             }

             //Role 중복
             if (response.status === 409)
             {
                 alert('User already has the role');
             }
             //id 정보 에러
             else if (response.status === 404)
             {
                 alert('User not found');
             }
             //변경 성공
             else if (response.ok)
             {
                 alert('Role change successful');
                 searchById();
             }
         }
         catch (error)
         {
             console.error('Error:', error);
         }
    }

    //refresh 통한 access token 재발급
    async function handleTokenRefresh() {
        const url = '/reissue'; //경로

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok)
            {
                const newAccessToken = response.headers.get('access');
                localStorage.setItem('access', newAccessToken);
            }
            else
            {
                const errorData = await response.json();
                throw new Error(`Failed to refresh token: ${response.status} ${errorData.message}`);
            }
        }
        catch (error)
        {
            console.error('Error refreshing token:', error);
        }
    }

    adminInit();
    window.searchById = searchById;
    window.searchByName = searchByName;
    window.setRole = setRole;


});

