class clsTable {
	static toggleOfficeBtnContent = ["Show All offices", "Hide All offices"];
	constructor() {
		this.userTable = document.querySelector(".table-responsive .table");
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
		this.handelTableResponsive();
	}

	handelTableResponsive() {
		if (window.innerHeight >= 1600) {
			this.userTable.removeAttribute("style");
			return;
		}

		if (window.innerWidth >= 1000) {
			this.userTable.removeAttribute("style");
			/*
			  with 7 columns : 
			  the  convenient  font-size of the table content at 1400px (window width ) : 
			   1450 (window width) -> 16px (font-size)
			    y  (window width )-> ? (font-size) 
			   
			   ?= (y* 16 )/1400
			 
			 */

			const WidthRole = {
				basicWindowWidth: 1400,
				basicFontSize: 16,
			};
			const newFontSize = Math.floor((WidthRole.basicFontSize * window.innerWidth) / WidthRole.basicWindowWidth);
			this.userTable.style.fontSize = `${newFontSize}px`;
		} else {
			/*
			  with 7 columns : 
			  the  convenient  scale of the table content at 1500px (window width ) : 
			   800 (window width) -> 0.80 (scale)
			    y  (window width )-> ? (scale) 
			   
			   ?= (y* 0.80 )/800
			 
			 */

			this.userTable.style.fontSize = `9px`;
			const scaleRole = {
				basicWindowWidth: 800,
				basicScaleValue: 0.8,
			};
			if (window.innerWidth <= 768) scaleRole.basicScaleValue = 0.82;

			const newScaleValue = (scaleRole.basicScaleValue * window.innerWidth) / scaleRole.basicWindowWidth;
			this.userTable.style.transform = `scale(${newScaleValue})`;
		}
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
	static getOfficeHtmlStructure(office) {
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
				const officeHtmlStructure = clsTable.getOfficeHtmlStructure(office);
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
		const value = input.value.trim();
		if (value && value != this.officeColumnsPrevValues[officeOptionName]) this.OfficeChangeInputsInfo[officeOptionName] = true;
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
			const response = await axios.patch(`${baseUrl}office/${officeId}/`, updatedData, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const data = response.data;

			return data;
		} catch (error) {
			// Handle error and display message
			if (error.response && error.response.data && (error.response.data.message || error.response.data.detail || error.response.data.error)) {
				let message = error.response.data.detail ? error.response.data.detail : error.response.data.message ? error.response.data.message : error.response.data.error;
				throw { message, type: "warning" };
			} else {
				// console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}

	#getUpdatedData(officeColumns) {
		let updatedData = {};
		if (this.OfficeChangeInputsInfo.name) updatedData.name = officeColumns.nameDom.querySelector("input").value;

		if (this.OfficeChangeInputsInfo.city) updatedData.city = officeColumns.cityDom.querySelector("input").value;
		if (this.OfficeChangeInputsInfo.address) updatedData.address = officeColumns.addressDom.querySelector("input").value;

		return updatedData;
	}
	async saveOfficeCard(event) {
		const saveBtn = event.target;

		if (!this.#checkIsAllowToActivateSaveBtn(saveBtn)) return;
		saveBtn.disabled = true;

		const targetOfficeCard = saveBtn.closest(".officeCard");
		const officeId = targetOfficeCard.getAttribute("officeId");

		let officeColumns = {
			nameDom: targetOfficeCard.querySelector(".nom"),
			addressDom: targetOfficeCard.querySelector(".adresse"),
			cityDom: targetOfficeCard.querySelector(".ville"),
		};

		let updatedData = this.#getUpdatedData(officeColumns);

		try {
			let data = await this.#updateOfficesCardApi(officeId, updatedData);
			let officeData = data.office;

			const cancelBtn = targetOfficeCard.querySelector("button.cancel");
			clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editOfficeCard(event)");
			targetOfficeCard.classList.remove("editStat");

			this.#convertSaveCardColumnsToNormalMode(officeColumns, officeData);
			this.#clearOfficePreviousAndChangeValues();
			clsUtile.alertHint(data.message, "success");
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
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
		this.filterInputDom.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.searchBtnDom.click();
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
	#officeValues = {
		name: "",
		address: "",
		city: "",
	};
	constructor(officesContainer) {
		this.addOfficeFormDom = document.getElementById("addOfficeForm");
		this.nameInputDom = document.getElementById("officeNameAdd");
		this.addressInputDom = document.getElementById("officeAddressAdd");
		this.cityInputDom = document.getElementById("officeCityAdd");
		this.submitBtnDom = document.getElementById("submitAddOfficeBtn");
		this.officesContainerDom = officesContainer;

		this.addOfficeFormDom.addEventListener("submit", async (event) => {
			event.preventDefault();
			this.submitBtnDom.disabled = true;

			await this.manageAddNewOffice();
			this.submitBtnDom.disabled = false;
		});
	}
	#fillAddOfficeFromValues() {
		this.#officeValues.name = this.nameInputDom.value;
		this.#officeValues.address = this.addressInputDom.value;
		this.#officeValues.city = this.cityInputDom.value;
	}
	#clearAffOfficeInputs() {
		this.nameInputDom.value = "";
		this.addressInputDom.value = "";
		this.cityInputDom.value = "";
	}

	async #addNewOfficeApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.post(
				`${baseUrl}office/`,

				this.#officeValues,

				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			const data = response.data;
			return data;
		} catch (error) {
			// Handle error and display message
			if (error.response && error.response.data && (error.response.data.message || error.response.data.detail || error.response.data.error)) {
				let message = error.response.data.detail ? error.response.data.detail : error.response.data.message ? error.response.data.message : error.response.data.error;
				throw { message, type: "warning" };
			} else {
				// console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}

	async manageAddNewOffice() {
		this.#fillAddOfficeFromValues();
		try {
			let data = await this.#addNewOfficeApi();
			let office = data.office;
			const officeHtmlStructure = clsTable.getOfficeHtmlStructure(office);
			this.officesContainerDom.insertAdjacentHTML("beforeend", officeHtmlStructure);

			this.#clearAffOfficeInputs();
			clsUtile.alertHint(data.message, "success");
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
}

// main : --------------------------------------
let tableObject = "";
window.addEventListener("load", () => {
	tableObject = new clsTable();
	const filterObject = new filter(tableObject.tableContainerContentDom);
	const addOfficeObject = new clsAddOfficeForm(tableObject.tableContainerContentDom);
});
window.addEventListener("resize", () => {
	tableObject.handelTableResponsive();
});
