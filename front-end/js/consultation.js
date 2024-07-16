document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("table-body");
    const rows = 10; // Change this number to generate more rows

    for (let i = 1; i <= rows; i++) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${i}</td>
            <td>V</td>
            <td>V</td>
            <td>V</td>
            <td>V</td>
            <td>V</td>
            <td>V</td>
            <td><button class="annuler-button">annuler</button></td>
        `;

        tableBody.appendChild(tr);
    }
});