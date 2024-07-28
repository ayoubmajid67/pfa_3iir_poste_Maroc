document.getElementById("searchButton").addEventListener("click", function () {
    const weight = parseFloat(document.getElementById("weightInput").value);
    if (isNaN(weight) || weight <= 0) {
      alert("Veuillez entrer un poids valide.");
      return;
    }
  
    const resultsTableBody = document.querySelector("#resultsTable tbody");
    resultsTableBody.innerHTML = "";
  
    // Sample data for demonstration with different prices for Colis and Courrier
    const data = [
      { minWeight: 0, maxWeight: 1, colisPrice: 5, courrierPrice: 6 },
      { minWeight: 1.01, maxWeight: 2, colisPrice: 8, courrierPrice: 9 },
      { minWeight: 2.01, maxWeight: 5, colisPrice: 12, courrierPrice: 14 },
      { minWeight: 5.01, maxWeight: 10, colisPrice: 20, courrierPrice: 22 },
    ];
  
    data.forEach((entry) => {
      if (weight >= entry.minWeight && weight <= entry.maxWeight) {
        const rowColis = document.createElement("tr");
        rowColis.innerHTML = `
                  <td>Colis</td>
                  <td>${entry.minWeight}</td>
                  <td>${entry.maxWeight}</td>
                  <td>${entry.colisPrice}</td>
                  <td><button class="choose-button" data-type="Colis">Choisir</button></td>
              `;
        resultsTableBody.appendChild(rowColis);
  
        const rowCourrier = document.createElement("tr");
        rowCourrier.innerHTML = `
                  <td>Courrier</td>
                  <td>${entry.minWeight}</td>
                  <td>${entry.maxWeight}</td>
                  <td>${entry.courrierPrice}</td>
                  <td><button class="choose-button" data-type="Courrier">Choisir</button></td>
              `;
        resultsTableBody.appendChild(rowCourrier);
      }
    });
  
    calculateTotalPrice();
  });
  
  document
    .getElementById("cinSearchButton")
    .addEventListener("click", function () {
      const cin = document.getElementById("cinSender").value.trim();
      if (!cin) {
        alert("Veuillez entrer un CIN valide.");
        return;
      }
  
      // Simulated database lookup
      const database = {
        123456789: {
          cin: "987654321",
          firstName: "mehdi",
          lastName: "chh",
          phoneNumber: "0623456789",
        },
      };
  
      if (database[cin]) {
        document.getElementById("senderCIN").value = database[cin].cin;
        document.getElementById("senderFirstName").value =
          database[cin].firstName;
        document.getElementById("senderLastName").value =
          database[cin].lastName;
        document.getElementById("senderPhoneNumber").value =
          database[cin].phoneNumber;
      } else {
        document.getElementById("senderCIN").value = "";
        document.getElementById("senderFirstName").value = "";
        document.getElementById("senderLastName").value = "";
        document.getElementById("senderPhoneNumber").value = "";
      }
    });
  
  document.getElementById("submitButton").addEventListener("click", function () {
    const senderCIN = document.getElementById("senderCIN").value;
    const senderFirstName = document.getElementById("senderFirstName").value;
    const senderLastName = document.getElementById("senderLastName").value;
    const senderPhoneNumber = document.getElementById("senderPhoneNumber").value;
    const productDestination =
      document.getElementById("productDestination").value;
    const productType = document.getElementById("productType").value;
    const receiverCIN = document.getElementById("receiverCIN").value;
    const receiverFirstName = document.getElementById("receiverFirstName").value;
    const receiverLastName = document.getElementById("receiverLastName").value;
    const receiverPhoneNumber = document.getElementById(
      "receiverPhoneNumber"
    ).value;
    const totalPrice = document.getElementById("totalPrice").innerText;
  
    if (
      !senderCIN ||
      !senderFirstName ||
      !senderLastName ||
      !senderPhoneNumber ||
      !productDestination ||
      !productType ||
      !receiverCIN ||
      !receiverFirstName ||
      !receiverLastName ||
      !receiverPhoneNumber
    ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    // Add current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
  
    document.getElementById("receiptDate").innerText = formattedDate;
    document.getElementById("receiptTime").innerText = formattedTime;
  
    // Add logo URL (assuming the logo URL is 'imgs/logo.png')
    const logoUrl = "imgs/logo.png";
    document.getElementById("receiptLogo").src = logoUrl;
  
    document.getElementById("receiptSenderCIN").innerText = senderCIN;
    document.getElementById(
      "receiptSenderName"
    ).innerText = `${senderFirstName} ${senderLastName}`;
    document.getElementById("receiptSenderPhone").innerText = senderPhoneNumber;
    document.getElementById("receiptDestination").innerText = productDestination;
    document.getElementById("receiptProductType").innerText = productType;
    document.getElementById("receiptReceiverCIN").innerText = receiverCIN;
    document.getElementById(
      "receiptReceiverName"
    ).innerText = `${receiverFirstName} ${receiverLastName}`;
    document.getElementById("receiptReceiverPhone").innerText =
      receiverPhoneNumber;
    document.getElementById("receiptTotalPrice").innerText = totalPrice + " DH";
  
    document.getElementById("receiptContainer").style.display = "block";
  });
  
  document.addEventListener("change", function (event) {
    if (event.target.id === "smsCheckbox") {
      calculateTotalPrice();
    }
  });
  
  function calculateTotalPrice() {
    const smsCheckbox = document.getElementById("smsCheckbox");
    let totalPrice = 0;
  
    if (smsCheckbox.checked) {
      totalPrice += parseFloat(smsCheckbox.dataset.price);
    }
  
    const selectedPrice = document.querySelector("td button.selected");
    if (selectedPrice) {
      totalPrice += parseFloat(selectedPrice.closest("tr").children[3].innerText);
    }
  
    document.getElementById("totalPrice").innerText = totalPrice.toFixed(2);
  }
  
  document.addEventListener("click", function (event) {
    if (
      event.target.tagName === "BUTTON" &&
      event.target.classList.contains("choose-button")
    ) {
      document
        .querySelectorAll("td button")
        .forEach((btn) => btn.classList.remove("selected"));
      event.target.classList.add("selected");
  
      const productType = event.target.dataset.type;
      document.getElementById("productType").value = productType;
  
      calculateTotalPrice();
    }
  });
  