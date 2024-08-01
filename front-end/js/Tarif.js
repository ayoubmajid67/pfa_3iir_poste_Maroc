//  [nice] but  we'll use oop rather than functional programming
//------------------------------------------------------------
/*
document.addEventListener('DOMContentLoaded', function() {
    const submitTarifBtn = document.getElementById('submitTarifBtn');
    const tarifAnalyticsSection = document.getElementById('tarifAnalytics');
    const tarifTableBody = document.getElementById('tarifTableBody');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const tarifTypeSelect = document.getElementById('tarifType');
    let tarifChart = null;  // Declare a variable to hold the chart instance
    let tarifData = [];  // Store the data globally

    submitTarifBtn.addEventListener('click', function() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const tarifType = tarifTypeSelect.value;

        if (startDate && endDate && tarifType) {
            // Mock data, replace this with actual data fetching logic
            tarifData = [
                { poidsMin: '0kg', poidsMax: '5kg', status: 'Active', prix: 500 },
                { poidsMin: '5kg', poidsMax: '10kg', status: 'Inactive', prix: 1000 },
                // Add more mock data as needed
            ];

            // Clear previous data
            tarifTableBody.innerHTML = '';

            // Populate table with data
            tarifData.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.poidsMin}</td>
                    <td>${item.poidsMax}</td>
                    <td>${item.status}</td>
                    <td><span class="prix">${item.prix} MAD</span></td>
                    <td><button class="btn btn-warning" onclick="modifyTarifRow(${index})">Modifier</button></td>
                    <td><button class="btn btn-danger" onclick="deleteTarifRow(${index})">Supprimer</button></td>
                `;
                tarifTableBody.appendChild(row);
            });

            // Show analytics section
            tarifAnalyticsSection.classList.remove('hidden');

            // Display chart
            const ctx = document.getElementById('tarifChart').getContext('2d');
            if (tarifChart) {
                tarifChart.destroy();  // Destroy the previous chart instance if it exists
            }
            tarifChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: tarifData.map(item => `${item.poidsMin} - ${item.poidsMax}`),
                    datasets: [{
                        label: 'Prix (MAD)',
                        data: tarifData.map(item => item.prix),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            alert('Please select both date range and type.');
        }
    });

    window.modifyTarifRow = function(index) {
        const row = tarifTableBody.children[index];
        const prixSpan = row.querySelector('.prix');
        const modifyBtn = row.querySelector('.btn-warning');

        if (modifyBtn.textContent === 'Modifier') {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = parseFloat(prixSpan.textContent.replace(' MAD', ''));
            input.className = 'form-control';
            prixSpan.parentElement.replaceChild(input, prixSpan);
            modifyBtn.textContent = 'Save';
        } else {
            const input = row.querySelector('input');
            const newPrix = input.value;
            tarifData[index].prix = parseFloat(newPrix);
            const span = document.createElement('span');
            span.className = 'prix';
            span.textContent = `${newPrix} MAD`;
            input.parentElement.replaceChild(span, input);
            modifyBtn.textContent = 'Modifier';

            // Update the chart
            tarifChart.data.datasets[0].data = tarifData.map(item => item.prix);
            tarifChart.update();
        }
    };

    window.deleteTarifRow = function(index) {
        // Remove the specific row from the table and refresh the table data
        tarifData.splice(index, 1);  // Remove the data from the array

        if (tarifData.length === 0) {
            // Reset form and hide analytics section if no data left
            startDateInput.value = '';
            endDateInput.value = '';
            tarifTypeSelect.value = 'all';
            tarifAnalyticsSection.classList.add('hidden');

            // Destroy the chart
            if (tarifChart) {
                tarifChart.destroy();
                tarifChart = null;
            }
        }

        // Refresh the table
        tarifTableBody.innerHTML = '';
        tarifData.forEach((item, newIndex) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.poidsMin}</td>
                <td>${item.poidsMax}</td>
                <td>${item.status}</td>
                <td><span class="prix">${item.prix} MAD</span></td>
                <td><button class="btn btn-warning" onclick="modifyTarifRow(${newIndex})">Modifier</button></td>
                <td><button class="btn btn-danger" onclick="deleteTarifRow(${newIndex})">Supprimer</button></td>
            `;
            tarifTableBody.appendChild(row);
        });

        // Update the chart
        if (tarifChart) {
            tarifChart.data.labels = tarifData.map(item => `${item.poidsMin} - ${item.poidsMax}`);
            tarifChart.data.datasets[0].data = tarifData.map(item => item.prix);
            tarifChart.update();
        }
    };
});
*/
