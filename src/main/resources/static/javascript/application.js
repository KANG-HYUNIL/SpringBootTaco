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
               window.location.href = `/application/content?id=${application.id}`;
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

    // Fetch and display application data on DOMContentLoaded
    fetchApplicationData();
});