async function fetchData(page = 1, limit = 10) {
    console.log("fetch data");
    const response = await fetch(`/users?page=${page}&limit=${limit}`);
    const data = await response.json();
    console.log("Data from serever", data);

    const users = data.users;
    const tableBody = document.getElementById("userTable").querySelector("tbody");

    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        const profilePicture = document.createElement('td');
        const picture = document.createElement('img');
        picture.src = user.picture.thumbnail;
        profilePicture.appendChild(picture);

        const name = document.createElement('td');
        name.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;

        const email = document.createElement('td');
        email.textContent = user.email;

        const location = document.createElement('td');
        location.textContent = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`;

        const phone = document.createElement('td');
        phone.textContent = user.phone;

        const cell = document.createElement('td');
        cell.textContent = user.cell;

        const dateofBirth = document.createElement('td');
        dateofBirth.textContent = new Date(user.dob.date).toLocaleDateString();

        const nationality = document.createElement('td');
        nationality.textContent = user.nat;

        row.appendChild(profilePicture);
        row.appendChild(name);
        row.appendChild(email);
        row.appendChild(location);
        row.appendChild(phone);
        row.appendChild(cell);
        row.appendChild(dateofBirth);
        row.appendChild(nationality);

        tableBody.appendChild(row);
    });

    renderPaginationControls(data.total, limit, page);
}
//update my page with new values
function renderPaginationControls(total, limit, currentPage) {
    const paginationControls = document.getElementById("paginationControls");
    const pageInfo = document.getElementById('pageInfo')
    const totalPages = Math.ceil(total / limit); //count total pages

    paginationControls.innerHTML = '';

    const showPages = 5; // Number of page buttons to show 
    const startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (totalPages > 1) {
        // Previous button login 
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => fetchData(currentPage - 1, limit));
            paginationControls.appendChild(prevButton);
        }

        // First page button logic
        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.textContent = '1';
            firstPageButton.addEventListener('click', () => fetchData(1, limit));
            paginationControls.appendChild(firstPageButton);

            if (startPage > 2) {
                const dots = document.createElement('button');
                dots.textContent = '...';
                dots.className = 'dots';
                paginationControls.appendChild(dots);
            }
        }

        // Page buttons 1,2,3,4 to lastpage
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? 'active' : ''; // Highlight current page
            pageButton.addEventListener('click', () => fetchData(i, limit));
            paginationControls.appendChild(pageButton);
        }

        // Last page button
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('button');
                dots.textContent = '...';
                dots.className = 'dots';
                paginationControls.appendChild(dots);
            }

            const lastPageButton = document.createElement('button');
            lastPageButton.textContent = totalPages;
            lastPageButton.addEventListener('click', () => fetchData(totalPages, limit));
            paginationControls.appendChild(lastPageButton);
        }

        // Next button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => fetchData(currentPage + 1, limit));
            paginationControls.appendChild(nextButton);
        }
    }
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} `;
}

document.getElementById('fetchButton').addEventListener('click', () => {
    const rowCount = document.getElementById('rowCount').value;
    if (rowCount && rowCount > 0) {
        fetchData(1, rowCount);
    } else {
        alert("Please enter a valid number of rows.");
    }
});

window.onload = () => fetchData();
