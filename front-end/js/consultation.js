document.addEventListener("DOMContentLoaded", function () {
	const submitBtn = document.getElementById("submitBtn");
	const cancelAllBtn = document.getElementById("cancelAllBtn");
	const calculateTotalBtn = document.getElementById("calculateTotalBtn");
	const analyticsSection = document.getElementById("analytics");
	const analyticsTableBody = document.getElementById("analyticsTableBody");
	const totalMontantDiv = document.getElementById("totalMontant");
	let chart = null; // Declare a variable to hold the chart instance
	let data = []; // Store the data globally

	submitBtn.addEventListener("click", function () {
		const startDate = document.getElementById("startDate").value;
		const endDate = document.getElementById("endDate").value;

		if (startDate && endDate) {
			// Mock data, replace this with actual data fetching logic
			data = [
				{ office: "Office 1", dateDepot: "2024-07-01", cinAgent: "1234", cinSender: "5678", cinReceiver: "9101", poids: "5kg", montant: "100 MAD" },
				{ office: "Office 2", dateDepot: "2024-07-02", cinAgent: "2234", cinSender: "6678", cinReceiver: "9201", poids: "10kg", montant: "300 MAD" },
				// Add more mock data as needed
			];

			// Clear previous data
			analyticsTableBody.innerHTML = "";

			// Populate table with data
			data.forEach((item, index) => {
				const row = document.createElement("tr");
				row.innerHTML = `
                    <td>${item.office}</td>
                    <td>${item.dateDepot}</td>
                    <td>${item.cinAgent}</td>
                    <td>${item.cinSender}</td>
                    <td>${item.cinReceiver}</td>
                    <td>${item.poids}</td>
                    <td>${item.montant}</td>
                    <td><button class="btn btn-danger" onclick="cancelRow(${index})">Annuler</button></td>
                `;
				analyticsTableBody.appendChild(row);
			});

			// Show analytics section
			analyticsSection.classList.remove("hidden");

			// Display chart
			const ctx = document.getElementById("overviewChart").getContext("2d");
			if (chart) {
				chart.destroy(); // Destroy the previous chart instance if it exists
			}
			chart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: data.map((item) => item.dateDepot),
					datasets: [
						{
							label: "Montant",
							data: data.map((item) => parseFloat(item.montant.replace(" MAD", ""))),
							backgroundColor: "rgba(54, 162, 235, 0.2)",
							borderColor: "rgba(54, 162, 235, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		} else {
			alert("Please select both start and end dates.");
		}
	});

	window.cancelRow = function (index) {
		// Remove the specific row from the table and refresh the table data
		data.splice(index, 1); // Remove the data from the array

		// Refresh the table
		analyticsTableBody.innerHTML = "";
		data.forEach((item, newIndex) => {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${item.office}</td>
                <td>${item.dateDepot}</td>
                <td>${item.cinAgent}</td>
                <td>${item.cinSender}</td>
                <td>${item.cinReceiver}</td>
                <td>${item.poids}</td>
                <td>${item.montant}</td>
                <td><button class="btn btn-danger" onclick="cancelRow(${newIndex})">Annuler</button></td>
            `;
			analyticsTableBody.appendChild(row);
		});

		// Update the chart
		chart.data.labels = data.map((item) => item.dateDepot);
		chart.data.datasets[0].data = data.map((item) => parseFloat(item.montant.replace(" MAD", "")));
		chart.update();
	};

	cancelAllBtn.addEventListener("click", function () {
		// Clear the data array
		data = [];

		// Clear the table
		analyticsTableBody.innerHTML = "";

		// Reset the chart
		if (chart) {
			chart.destroy(); // Destroy the chart instance
			chart = null; // Reset the chart variable
		}

		// Hide the analytics section
		analyticsSection.classList.add("hidden");

		// Clear the total montant
		totalMontantDiv.innerHTML = "";
	});

	calculateTotalBtn.addEventListener("click", function () {
		// Calculate the total montant
		const totalMontant = data.reduce((total, item) => {
			return total + parseFloat(item.montant.replace(" MAD", ""));
		}, 0);

		// Display the total montant
		totalMontantDiv.innerHTML = `<strong>Total Montant: ${totalMontant} MAD</strong>`;
	});
});
