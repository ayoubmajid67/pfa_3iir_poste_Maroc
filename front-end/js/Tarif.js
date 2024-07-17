document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("table-body");
    const rows = 10; // Change this number to generate more rows

    for (let i = 1; i <= rows; i++) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>V</td>
            <td>V</td>
            <td>V</td>
            <td>V</td>
            <td><button class="annuler-button">modifier</button></td>
            <td><button class="annuler-button">supprimer</button></td>
            
        `;

        tableBody.appendChild(tr);
    }
});