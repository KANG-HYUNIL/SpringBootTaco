import FetchRequestBuilder from "../utils/fetchRequest.js";
import { fetchWithAccessToken } from "../utils/tokenHandle.js";
import * as URLS from "../utils/fetchURLStr.js";


//사용자 id로 검색
// 사용자 id로 검색
async function searchById() {
    const id = document.getElementById('searchById').value;
    const url = URLS.API.GetUserById;
    const userDTO = { id: id };

    try {
        const response = await fetchWithAccessToken(url, userDTO);

        if (response.status === 404) {
            alert('User not found');
            return;
        } 
        if (response.ok) 
        {
            const user = await response.json();
            displayUserInfo(user);
            return;
        }
        else 
        {
            const data = await response.json();
            throw new Error(data.message || 'Unknown error occurred');
        }
    } 
    catch (error) 
    {
        console.error('Error:', error);
        alert('User not found');
    }
}

//사용자 name으로 정보 찾기
async function searchByName() {
    const name = document.getElementById('searchByName').value;
    const url = URLS.API.GetUserByName;
    const userDTO = { name: name };

    try {
        const response = await fetchWithAccessToken(url, userDTO);

        if (response.status === 404) 
        {
            alert('User not found');
            return;
        } 
        if (response.ok) 
        {
            const user = await response.json();
            displayUserInfo(user);
            return; 
        }
        else
        {
            const data = await response.json();
            throw new Error(data.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('User not found');
    }
}

// 사용자 정보를 웹 페이지에 표시하기
function displayUserInfo(users) {
    const userInfoContainer = document.getElementById('userInfoContainer');
    userInfoContainer.innerHTML = ''; // Clear existing content

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'p-4 border border-gray-300 rounded-md shadow-sm mb-4';
        userDiv.innerHTML = `
            <p>ID: ${user.id}</p>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Role: ${user.role}</p>
            <button onclick="setRole('${user.id}', 'ROLE_ADMIN')" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">SET TO ADMIN</button>
            <button onclick="setRole('${user.id}', 'ROLE_USER')" class="!rounded-button bg-custom text-white px-4 py-2 text-sm font-medium hover:bg-custom/90">SET TO USER</button>
        `;
        userInfoContainer.appendChild(userDiv);
    });
}

// 사용자 role 변경
async function setRole(userId, role) {
    const url = role === 'ROLE_ADMIN' ? URLS.API.SetRoleAdmin : URLS.API.SetRoleUser;
    const userDTO = { id: userId };

    try {
        const response = await fetchWithAccessToken(url, userDTO);

        if (response.status === 409) 
        {
            alert('User already has the role');
            return;
        } 
        if (response.status === 404) 
        {
            alert('User not found');
            return;
        } 
        if (response.ok) 
        {
            alert('Role change successful');
            searchById();
            return;
        }
        else
        {
            const data = await response.json();
            throw new Error(data.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    window.searchById = searchById;
    window.searchByName = searchByName;
    window.setRole = setRole;
})