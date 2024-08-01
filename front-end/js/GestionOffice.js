class clsTable {
	static toggleOfficeBtnContent = ["Show All offices", "Hide All offices"];
	constructor() {
		this.tableContainerContentDom = document.getElementById("officeTableBody");
		this.toggleOfficesShowBtnDom = document.getElementById("toggleShowOfficesBtn");
		this.officeFilter = document.getElementById("officeNumber");
		this.officeColumnsPrevValues = {
			name: "",
			address: "",
			city: "",
		};
		this.OfficeChangeInputsInfo = {
			name: false,
			address: false,
			city: false,
		};

		this.toggleOfficesShowBtnDom.addEventListener("click", () => {
			this.#toggleOfficeShow();
		});

		this.manageGetOffices();
	}

	#toggleOfficeShow() {
		const isHidden = Number(this.tableContainerContentDom.classList.contains("hidden"));
		this.toggleOfficesShowBtnDom.textContent = clsTable.toggleOfficeBtnContent[isHidden];
		this.tableContainerContentDom.classList.toggle("hidden");
	}

	async #getOfficesApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}offices/`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const data = response.data;

			return data;
		} catch (error) {
			// Handle error and display message
			if (error.response && error.response.data && (error.response.data.message || error.response.data.detail)) {
				let message = error.response.data.detail ? error.response.data.detail : error.response.data.message;
				throw { message, type: "warning" };
			} else {
				// console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}
	#getOfficeHtmlStructure(office) {
		return `
     <tr class='officeCard' officeId=${office.id}>
                                    <td class="officeId">${office.id}</td>
									<td class="nom">${office.name}</td>
									<td class="adresse">${office.address}</td>
									<td class="ville">${office.city}</td>
									<td class="btnColumn editColumn">
                                      <div class="btnContainer">
                                    <button onclick='tableObject.editOfficeCard(event)' class="edit">edit</button>
                                    </div>
                                    </td>
									<td class="btnColumn saveColumn">
                                    <div class="btnContainer">
                                       <button disabled onclick='tableObject.saveOfficeCard(event)'>Save</button>
                                    </div>
                                 
                                    </td>
								</tr>
     `;
	}

	async manageGetOffices() {
		try {
			const offices = await this.#getOfficesApi();
			this.tableContainerContentDom.innerHTML = "";

			offices.forEach((office) => {
				const officeHtmlStructure = this.#getOfficeHtmlStructure(office);
				this.tableContainerContentDom.insertAdjacentHTML("beforeend", officeHtmlStructure);
			});
		} catch (error) {
			await clsUtile.alertHint(error.message, error.type);
		}
	}
	#convertEditedCardColumnsToEditMode(officeColumns) {
		officeColumns.nameDom.innerHTML = `<input type="text" class="targetName" value='${this.officeColumnsPrevValues.name}' />`;
		officeColumns.addressDom.innerHTML = `<input type="text" class="targetAddress" value='${this.officeColumnsPrevValues.address}' />`;
		officeColumns.cityDom.innerHTML = `<input type="text" class="targetCity" value='${this.officeColumnsPrevValues.city}' />`;
		officeColumns.nameDom.querySelector("input").focus();
	}
	#setOfficePreviousValues(officeColumns) {
		this.officeColumnsPrevValues.name = officeColumns.nameDom.textContent;
		this.officeColumnsPrevValues.address = officeColumns.addressDom.textContent;
		this.officeColumnsPrevValues.city = officeColumns.cityDom.textContent;
	}
	#checkIsAllowToActivateSaveBtn(saveBtn) {
		if (this.OfficeChangeInputsInfo.name || this.OfficeChangeInputsInfo.city || this.OfficeChangeInputsInfo.address) {
			saveBtn.disabled = false;
			return true;
		} else {
			saveBtn.disabled = true;
			return false;
		}
	}

	#editOfficeInputTrack(input, officeOptionName) {
		if (input.value.trim() != this.officeColumnsPrevValues[officeOptionName]) this.OfficeChangeInputsInfo[officeOptionName] = true;
		else this.OfficeChangeInputsInfo[officeOptionName] = false;
	}
	#addEventChangeValueTrackerToOfficeInputs(officeColumns, saveBtn) {
		officeColumns.nameDom.addEventListener("input", (event) => {
			this.#editOfficeInputTrack(event.target, "name");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		officeColumns.addressDom.addEventListener("input", (event) => {
			this.#editOfficeInputTrack(event.target, "address");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		officeColumns.cityDom.addEventListener("input", (event) => {
			this.#editOfficeInputTrack(event.target, "city");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
	}

	#cancelEditPrevOfficeCards() {
		const editStatCards = this.tableContainerContentDom.querySelectorAll(".editStat");
		editStatCards.forEach((officeCard) => {
			const cancelBtn = officeCard.querySelector("button.cancel");
			cancelBtn.click();
		});
	}

	editOfficeCard(event) {
		this.#cancelEditPrevOfficeCards();

		const editBtn = event.target;

		clsUtile.switchBtnHandler(editBtn, "cancel", "cancel", "tableObject.cancelEditOfficeCard(event)");
		const targetOfficeCard = editBtn.closest(".officeCard");
		targetOfficeCard.classList.add("editStat");
		const saveBtn = targetOfficeCard.querySelector(".saveColumn button");
		let officeColumns = {
			nameDom: targetOfficeCard.querySelector(".nom"),
			addressDom: targetOfficeCard.querySelector(".adresse"),
			cityDom: targetOfficeCard.querySelector(".ville"),
		};
		this.#addEventChangeValueTrackerToOfficeInputs(officeColumns, saveBtn);
		this.#setOfficePreviousValues(officeColumns);
		this.#convertEditedCardColumnsToEditMode(officeColumns);
	}
	#convertEditedCardColumnsToNormalMode(officeColumns) {
		officeColumns.nameDom.innerHTML = this.officeColumnsPrevValues.name;
		officeColumns.addressDom.innerHTML = this.officeColumnsPrevValues.address;
		officeColumns.cityDom.innerHTML = this.officeColumnsPrevValues.city;
	}
	#convertSaveCardColumnsToNormalMode(officeColumns, data) {
		officeColumns.nameDom.innerHTML = data.name;
		officeColumns.addressDom.innerHTML = data.address;
		officeColumns.cityDom.innerHTML = data.city;
	}
	#clearOfficePreviousAndChangeValues() {
		this.officeColumnsPrevValues.name = "";
		this.officeColumnsPrevValues.address = "";
		this.officeColumnsPrevValues.city = "";
		this.OfficeChangeInputsInfo.name = false;
		this.OfficeChangeInputsInfo.address = false;
		this.OfficeChangeInputsInfo.city = false;
	}
	cancelEditOfficeCard(event) {
		const cancelBtn = event.target;
		clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editOfficeCard(event)");
		const targetOfficeCard = cancelBtn.closest(".officeCard");
		targetOfficeCard.classList.remove("editStat");
		const saveBtn = targetOfficeCard.querySelector(".saveColumn button");
		saveBtn.disabled = true;

		let officeColumns = {
			nameDom: targetOfficeCard.querySelector(".nom"),
			addressDom: targetOfficeCard.querySelector(".adresse"),
			cityDom: targetOfficeCard.querySelector(".ville"),
		};
		this.#convertEditedCardColumnsToNormalMode(officeColumns);
		this.#clearOfficePreviousAndChangeValues();
	}
	async #updateOfficesCardApi(officeId, updatedData) {
		let accessToken = clsLocalStorage.getToken();

		try {
			console.log(`${baseUrl}office/${officeId}/`);
			const response = await axios.patch(`${baseUrl}office/${officeId}/`, updatedData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const data = response.data;

			return data;
		} catch (error) {
			// Handle error and display message
			if (error.response && error.response.data && (error.response.data.message || error.response.data.detail)) {
				let message = error.response.data.detail ? error.response.data.detail : error.response.data.message;
				throw { message, type: "warning" };
			} else {
				// console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}

	#getUpdatedData(officeColumns) {
		let updatedData = {};
		console.log(this.OfficeChangeInputsInfo);
		if (this.OfficeChangeInputsInfo.name) updatedData.name = officeColumns.nameDom.querySelector("input").value;

		if (this.OfficeChangeInputsInfo.city) updatedData.city = officeColumns.cityDom.querySelector("input").value;
		if (this.OfficeChangeInputsInfo.address) updatedData.address = officeColumns.addressDom.querySelector("input").value;

		return updatedData;
	}
	async saveOfficeCard(event) {
		const saveBtn = event.target;

		if (!this.#checkIsAllowToActivateSaveBtn(saveBtn)) return;

		const targetOfficeCard = saveBtn.closest(".officeCard");
		const officeId = targetOfficeCard.getAttribute("officeId");

		let officeColumns = {
			nameDom: targetOfficeCard.querySelector(".nom"),
			addressDom: targetOfficeCard.querySelector(".adresse"),
			cityDom: targetOfficeCard.querySelector(".ville"),
		};

		let updatedData = this.#getUpdatedData(officeColumns);

		let data = await this.#updateOfficesCardApi(officeId, updatedData);
		let officeData = data.office;

		const cancelBtn = targetOfficeCard.querySelector("button.cancel");
		clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editOfficeCard(event)");
		targetOfficeCard.classList.remove("editStat");

		this.#convertSaveCardColumnsToNormalMode(officeColumns, officeData);
		this.#clearOfficePreviousAndChangeValues();
	}
}

class filter {
	constructor(officesContainer) {
		this.filterInputDom = document.getElementById("officeNumber");
		this.filterInputDom.addEventListener("input", () => {
			if (this.filterInputDom.value == "") {
				this.#showAllOfficesBox();
			}
		});
		this.searchBtnDom = document.getElementById("searchBtn");
		this.officesContainerDom = officesContainer;
		this.searchBtnDom.addEventListener("click", () => {
			this.searchBtnDom.disabled = true;
			this.#filterOfficesContainer();
			this.searchBtnDom.disabled = false;
		});
	}

	#showAllOfficesBox() {
		this.officesContainerDom.querySelectorAll(".officeCard").forEach((officeBox) => {
			officeBox.style.display = "table-row";
		});
	}
	#filterOfficesContainer() {
		let numOffice = this.filterInputDom.value;
		if (numOffice) {
			this.officesContainerDom.querySelectorAll(".officeCard").forEach((officeBox) => {
				if (officeBox.getAttribute("officeId") == numOffice) officeBox.style.display = "table-row";
				else officeBox.style.display = "none";
			});
		}
	}
}

class clsAddOfficeForm {
	constructor(officesContainer) {
		this.addOfficeFormDom = document.getElementById("addOfficeForm");
		this.numberInputDom = document.getElementById("officeNumberAdd");
		this.nameInputDom = document.getElementById("officeNameAdd");
		this.addressInputDom = document.getElementById("officeAddressAdd");
		this.cityInputDom = document.getElementById("officeCityAdd");
		this.submitBtnDom = document.getElementById("submitAddOfficeBtn");
		this.officesContainerDom = officesContainer;
	}
    
}

// main : --------------------------------------
const tableObject = new clsTable();
const filterObject = new filter(tableObject.tableContainerContentDom);
const addOfficeObject = new clsAddOfficeForm(tableObject.tableContainerContentDom);
