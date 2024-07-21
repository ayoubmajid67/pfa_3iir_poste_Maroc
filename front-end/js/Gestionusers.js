document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const showAllBtn = document.getElementById('showAllBtn');
    const userTableSection = document.getElementById('userTableSection');
    const userTableBody = document.getElementById('userTableBody');
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    let userData = [
        { cin: '1234', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'Chef Agence', office: '1' },
        { cin: '5678', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: 'Agent', office: '1' }
    ];  // Initial example users
    let deletedUsers = []; // Track deleted users

    function renderTable(data) {
        userTableBody.innerHTML = '';

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border">${item.cin}</td>
                <td class="py-2 px-4 border">${item.firstName}</td>
                <td class="py-2 px-4 border">${item.lastName}</td>
                <td class="py-2 px-4 border">${item.email}</td>
                <td class="py-2 px-4 border">${item.role}</td>
                <td class="py-2 px-4 border">${item.office}</td>
                <td class="py-2 px-4 border text-center">
                    <button class="btn btn-warning" onclick="showEditUserModal(${index})">Modifier</button>
                    <button class="btn btn-danger" onclick="deleteUser(${index}, this)">Supprimer</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        userTableSection.classList.remove('hidden');
    }

    searchBtn.addEventListener('click', function() {
        const officeNumber = document.getElementById('officeNumber').value;

        if (officeNumber) {
            // Filter and render table
            const filteredData = userData.filter(user => user.office === officeNumber && !deletedUsers.includes(user.cin));
            renderTable(filteredData);
        } else {
            alert('Please enter an office number.');
        }
    });

    showAllBtn.addEventListener('click', function() {
        // Filter and render table with all users
        const allData = userData.filter(user => !deletedUsers.includes(user.cin));
        renderTable(allData);
    });

    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newUser = {
            cin: document.getElementById('cin').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
            office: document.getElementById('office').value
        };

        userData.push(newUser);

        // Reset the form
        addUserForm.reset();

        // Show success message
        $('#successModal').modal('show');

        // Re-render the table to show the newly added user
        renderTable(userData);
    });

    window.showEditUserModal = function(index) {
        const user = userData[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editCin').value = user.cin;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editOffice').value = user.office;

        $('#editUserModal').modal('show');
    };

    editUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const index = document.getElementById('editIndex').value;
        userData[index].firstName = document.getElementById('editFirstName').value;
        userData[index].lastName = document.getElementById('editLastName').value;
        userData[index].email = document.getElementById('editEmail').value;
        userData[index].role = document.getElementById('editRole').value;
        userData[index].office = document.getElementById('editOffice').value;

        $('#editUserModal').modal('hide');

        // Show success message
        $('#successModal').modal('show');

        // Re-render the table to show the updated user
        renderTable(userData);
    });

    window.deleteUser = function(index, button) {
        // Track the deleted user by CIN
        deletedUsers.push(userData[index].cin);

        // Remove the specific user from the data array
        userData.splice(index, 1);

        // Remove the row from the table
        const row = button.parentElement.parentElement;
        row.parentNode.removeChild(row);

        // Show success message
        $('#successModal').modal('show');

        // Re-render the table
        renderTable(userData);
    };
});
