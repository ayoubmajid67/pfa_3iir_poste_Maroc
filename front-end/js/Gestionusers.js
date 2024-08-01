

//  [nice] but  we'll use oop rather than functional programming 
//------------------------------------------------------------
/*
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const userTableSection = document.getElementById('userTableSection');
    const userTableBody = document.getElementById('userTableBody');
    const addUserForm = document.getElementById('addUserForm');
    const editUserForm = document.getElementById('editUserForm');
    let userData = [
        { cin: '1234', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'password123', role: 'Chef Agence', office: '1' },
        { cin: '5678', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'password456', role: 'Agent', office: '1' }
    ];  // Initial example users
    let deletedUsers = []; // Track deleted users

    searchBtn.addEventListener('click', function() {
        const officeNumber = document.getElementById('officeNumber').value;

        if (officeNumber) {
            // Clear previous data
            userTableBody.innerHTML = '';

            // Populate table with data
            userData.filter(user => user.office === officeNumber && !deletedUsers.includes(user.cin))
                .forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.cin}</td>
                        <td>${item.firstName}</td>
                        <td>${item.lastName}</td>
                        <td>${item.email}</td>
                        <td>${item.password}</td>
                        <td>${item.role}</td>
                        <td>${item.office}</td>
                        <td>
                            <button class="btn btn-warning" onclick="showEditUserModal(${index})">Modifier</button>
                            <button class="btn btn-danger" onclick="deleteUser(${index}, this)">Supprimer</button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });

            // Show user table section
            userTableSection.classList.remove('hidden');
        } else {
            alert('Please enter an office number.');
        }
    });

    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newUser = {
            cin: document.getElementById('cin').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value,
            office: document.getElementById('office').value
        };

        userData.push(newUser);

        // Reset the form
        addUserForm.reset();

        // Show success message
        $('#successModal').modal('show');
    });

    window.showEditUserModal = function(index) {
        const user = userData[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editCin').value = user.cin;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPassword').value = user.password;
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
        userData[index].password = document.getElementById('editPassword').value;
        userData[index].role = document.getElementById('editRole').value;
        userData[index].office = document.getElementById('editOffice').value;

        $('#editUserModal').modal('hide');

        // Show success message
        $('#successModal').modal('show');
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
    };
});
*/