document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const showAllBtn = document.getElementById('showAllBtn');
    const officeTableSection = document.getElementById('officeTableSection');
    const officeTableBody = document.getElementById('officeTableBody');
    const addOfficeForm = document.getElementById('addOfficeForm');
    const editOfficeForm = document.getElementById('editOfficeForm');
    let officeData = [
        { officeNumber: '001', officeName: 'Office One', address: '123 Street', city: 'City A' },
        { officeNumber: '002', officeName: 'Office Two', address: '456 Avenue', city: 'City B' }
    ];  // Initial example offices
    let deletedOffices = []; // Track deleted offices

    function renderTable(data) {
        officeTableBody.innerHTML = '';

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border">${item.officeNumber}</td>
                <td class="py-2 px-4 border">${item.officeName}</td>
                <td class="py-2 px-4 border">${item.address}</td>
                <td class="py-2 px-4 border">${item.city}</td>
                <td class="py-2 px-4 border text-center">
                    <button class="btn btn-warning" onclick="showEditOfficeModal(${index})">Modifier</button>
                    <button class="btn btn-danger" onclick="deleteOffice(${index}, this)">Supprimer</button>
                </td>
            `;
            officeTableBody.appendChild(row);
        });

        officeTableSection.classList.remove('hidden');
    }

    searchBtn.addEventListener('click', function() {
        const officeNumber = document.getElementById('officeNumber').value;

        if (officeNumber) {
            // Filter and render table
            const filteredData = officeData.filter(office => office.officeNumber === officeNumber && !deletedOffices.includes(office.officeNumber));
            renderTable(filteredData);
        } else {
            alert('Please enter an office number.');
        }
    });

    showAllBtn.addEventListener('click', function() {
        // Filter and render table with all offices
        const allData = officeData.filter(office => !deletedOffices.includes(office.officeNumber));
        renderTable(allData);
    });

    addOfficeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newOffice = {
            officeNumber: document.getElementById('officeNumberAdd').value,
            officeName: document.getElementById('officeNameAdd').value,
            address: document.getElementById('officeAddressAdd').value,
            city: document.getElementById('officeCityAdd').value
        };

        officeData.push(newOffice);

        // Reset the form
        addOfficeForm.reset();

        // Show success message
        $('#successModal').modal('show');
    });

    window.showEditOfficeModal = function(index) {
        const office = officeData[index];
        document.getElementById('editIndex').value = index;
        document.getElementById('editOfficeNumber').value = office.officeNumber;
        document.getElementById('editOfficeName').value = office.officeName;
        document.getElementById('editOfficeAddress').value = office.address;
        document.getElementById('editOfficeCity').value = office.city;

        $('#editOfficeModal').modal('show');
    };

    editOfficeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const index = document.getElementById('editIndex').value;
        officeData[index].officeName = document.getElementById('editOfficeName').value;
        officeData[index].address = document.getElementById('editOfficeAddress').value;
        officeData[index].city = document.getElementById('editOfficeCity').value;

        $('#editOfficeModal').modal('hide');

        // Show success message
        $('#successModal').modal('show');
    });

    window.deleteOffice = function(index, button) {
        // Track the deleted office by office number
        deletedOffices.push(officeData[index].officeNumber);

        // Remove the specific office from the data array
        officeData.splice(index, 1);

        // Remove the row from the table
        const row = button.parentElement.parentElement;
        row.parentNode.removeChild(row);

        // Show success message
        $('#successModal').modal('show');
    };
});
