class clsTable {
	static toggleTarifBtnContent = ["Show All  Tarifs", "Hide All Tarifs"];
	static productsList = "";

	constructor() {
		this.userTable = document.querySelector(".table-responsive .table");
		this.tableContainerContentDom = document.getElementById("tarifTableBody");
		this.toggleTarifShowBtnDom = document.getElementById("toggleshowTarifsBtn");
		this.tarifFilterInputsDom = {
			minWeightInput: document.getElementById("minWeight"),
			maxWeightInput: document.getElementById("maxWeight"),
			tarifTypeInput: document.getElementById("tarifType"),
		};

		this.tarifColumnsPrevValues = {
			product: "",
			min_weight: "",
			max_weight: "",
			status: "",
			price: "",
		};
		this.tarifChangeInputsInfo = {
			product: false,
			min_weight: false,
			max_weight: false,
			status: false,
			price: false,
		};

		this.toggleTarifShowBtnDom.addEventListener("click", () => {
			this.#toggleOfficeShow();
		});

		this.handelTableResponsive();
		return this.#init();
	}
	async #init() {
		await this.manageGetTarifs();
		return this;
	}
	handelTableResponsive() {
		if (window.innerHeight >= 1600) {
			this.userTable.removeAttribute("style");
			return;
		}

		if (window.innerWidth >= 1000) {
			this.userTable.removeAttribute("style");
			/*
			  with 6 columns : 
			  the  convenient  font-size of the table content at 1400px (window width ) : 
			   1550 (window width) -> 16px (font-size)
			    y  (window width )-> ? (font-size) 
			   
			   ?= (y* 16 )/1400
			 
			 */

			const WidthRole = {
				basicWindowWidth: 1550,
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
				basicScaleValue: 0.81,
			};
			if (window.innerWidth <= 768) scaleRole.basicScaleValue = 0.82;

			const newScaleValue = (scaleRole.basicScaleValue * window.innerWidth) / scaleRole.basicWindowWidth;
			this.userTable.style.transform = `scale(${newScaleValue})`;
		}
	}

	#toggleOfficeShow() {
		const isHidden = Number(this.tableContainerContentDom.classList.contains("hidden"));
		this.toggleTarifShowBtnDom.textContent = clsTable.toggleTarifBtnContent[isHidden];
		this.tableContainerContentDom.classList.toggle("hidden");
	}
	static async getProductsApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}products/`, {
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
	static getOptionsHtmlFromProduct(currentProductName) {
		let content = "";

		clsTable.productsList.forEach((product) => {
			content += `<option value="${product.name}" id="${product.id}"   ${currentProductName == product.name ? "selected" : ""} >${product.name}</option>`;
		});
		return content;
	}
	static getProductNameFromId(id) {
		return clsTable.productsList[id - 1].name;
	}
	async manageGetProductList() {
		try {
			clsTable.productsList = await clsTable.getProductsApi();
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
	async #getTarifsApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}weight-ranges/`, {
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
	static getTarifHtmlStructure(tarif) {
		return `
   	<tr tarifId=${tarif.id} productId=${tarif.product}   class="tarifCard">
									<td class="product">${clsTable.getProductNameFromId(tarif.product)}</td>
									<td class="min">${tarif.min_weight}</td>
									<td class="max">${tarif.max_weight}</td>
									<td class="status">${tarif.status}</td>
									<td class="price">${tarif.price}</td>
									<td class="btnColumn editColumn">
										<div class="btnContainer">
											<button onclick="tableObject.editTarifCard(event)" class="edit">edit</button>
										</div>
									</td>
									<td class="btnColumn saveColumn">
										<div class="btnContainer">
											<button disabled onclick="tableObject.saveTarifCard(event)">Save</button>
										</div>
									</td>
								</tr>
     `;
	}

	async manageGetTarifs() {
		try {
			await this.manageGetProductList();
			const tarifs = await this.#getTarifsApi();
			this.tableContainerContentDom.innerHTML = "";

			tarifs.forEach((tarif) => {
				const tarifHtmlStructure = clsTable.getTarifHtmlStructure(tarif);
				this.tableContainerContentDom.insertAdjacentHTML("beforeend", tarifHtmlStructure);
			});
		} catch (error) {
			await clsUtile.alertHint(error.message, error.type);
		}
	}
	#convertEditedCardColumnsToEditMode(tarifColumns) {
		tarifColumns.productDom.innerHTML = `
        <select class="targetTarifType" class="form-control">
							${clsTable.getOptionsHtmlFromProduct(this.tarifColumnsPrevValues.product)}
						</select>
        `;
		tarifColumns.min_weightDom.innerHTML = `<input type="number" class="targetMinWeight" value='${this.tarifColumnsPrevValues.min_weight}' />`;
		tarifColumns.max_weightDom.innerHTML = `<input type="number" class="targetMaxWeight" value='${this.tarifColumnsPrevValues.max_weight}' />`;

		tarifColumns.statusDom.innerHTML = `
		<select class="targetStatus">
    <option value="activated" ${this.tarifColumnsPrevValues.status == "activated" ? "selected" : ""} >activated</option>
    <option value="disabled"  ${this.tarifColumnsPrevValues.status == "disabled" ? "selected" : ""}>disabled</option>
n>
   >
</select>
		`;

		tarifColumns.priceDom.innerHTML = `<input type="number" class="targetPrice" value='${this.tarifColumnsPrevValues.price}' />`;

		tarifColumns.productDom.querySelector("select").focus();
	}
	#setTarifPreviousValues(tarifColumns) {
		this.tarifColumnsPrevValues.product = tarifColumns.productDom.textContent;
		this.tarifColumnsPrevValues.min_weight = tarifColumns.min_weightDom.textContent;
		this.tarifColumnsPrevValues.max_weight = tarifColumns.max_weightDom.textContent;
		this.tarifColumnsPrevValues.status = tarifColumns.statusDom.textContent;
		this.tarifColumnsPrevValues.price = tarifColumns.priceDom.textContent;
	}
	#checkIsAllowToActivateSaveBtn(saveBtn) {
		if (this.tarifChangeInputsInfo.product || this.tarifChangeInputsInfo.min_weight || this.tarifChangeInputsInfo.max_weight || this.tarifChangeInputsInfo.status || this.tarifChangeInputsInfo.price) {
			saveBtn.disabled = false;
			return true;
		} else {
			saveBtn.disabled = true;
			return false;
		}
	}

	#editTarifInputTrack(input, tarifOptionName) {
		const value = input.value.trim();
		if (value && value != this.tarifColumnsPrevValues[tarifOptionName]) this.tarifChangeInputsInfo[tarifOptionName] = true;
		else this.tarifChangeInputsInfo[tarifOptionName] = false;
	}
	#addEventChangeValueTrackerToTarifInputs(tarifColumns, saveBtn) {
		tarifColumns.productDom.addEventListener("change", (event) => {
			this.#editTarifInputTrack(event.target, "product");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		tarifColumns.min_weightDom.addEventListener("input", (event) => {
			this.#editTarifInputTrack(event.target, "min_weight");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		tarifColumns.max_weightDom.addEventListener("input", (event) => {
			this.#editTarifInputTrack(event.target, "max_weight");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		tarifColumns.statusDom.addEventListener("change", (event) => {
			this.#editTarifInputTrack(event.target, "status");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		tarifColumns.priceDom.addEventListener("input", (event) => {
			this.#editTarifInputTrack(event.target, "price");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
	}

	#cancelEditPrevTarifCards() {
		const editStatCards = this.tableContainerContentDom.querySelectorAll(".editStat");
		editStatCards.forEach((tarifCard) => {
			const cancelBtn = tarifCard.querySelector("button.cancel");
			cancelBtn.click();
		});
	}

	editTarifCard(event) {
		this.#cancelEditPrevTarifCards();

		const editBtn = event.target;

		clsUtile.switchBtnHandler(editBtn, "cancel", "cancel", "tableObject.cancelEditTarifCard(event)");
		const targetTarifCard = editBtn.closest(".tarifCard");
		targetTarifCard.classList.add("editStat");
		const saveBtn = targetTarifCard.querySelector(".saveColumn button");
		let tarifColumns = {
			productDom: targetTarifCard.querySelector(".product"),
			min_weightDom: targetTarifCard.querySelector(".min"),
			max_weightDom: targetTarifCard.querySelector(".max"),
			statusDom: targetTarifCard.querySelector(".status"),
			priceDom: targetTarifCard.querySelector(".price"),
		};

		this.#addEventChangeValueTrackerToTarifInputs(tarifColumns, saveBtn);
		this.#setTarifPreviousValues(tarifColumns);
		this.#convertEditedCardColumnsToEditMode(tarifColumns);
	}
	#convertEditedCardColumnsToNormalMode(tarifColumns) {
		tarifColumns.productDom.innerHTML = this.tarifColumnsPrevValues.product;
		tarifColumns.min_weightDom.innerHTML = this.tarifColumnsPrevValues.min_weight;
		tarifColumns.max_weightDom.innerHTML = this.tarifColumnsPrevValues.max_weight;
		tarifColumns.statusDom.innerHTML = this.tarifColumnsPrevValues.status;
		tarifColumns.priceDom.innerHTML = this.tarifColumnsPrevValues.price;
	}
	#convertSaveCardColumnsToNormalMode(tarifColumns, data) {
		tarifColumns.productDom.innerHTML = data.product;
		tarifColumns.min_weightDom.innerHTML = data.min_weight;
		tarifColumns.max_weightDom.innerHTML = data.max_weight;
		tarifColumns.statusDom.innerHTML = data.status;
		tarifColumns.priceDom.innerHTML = data.price;
	}
	#clearTarifPreviousAndChangeValues() {
		this.tarifColumnsPrevValues.product = "";
		this.tarifColumnsPrevValues.min_weight = "";
		this.tarifColumnsPrevValues.max_weight = "";
		this.tarifColumnsPrevValues.status = "";
		this.tarifColumnsPrevValues.price = "";

		this.tarifChangeInputsInfo.product = false;
		this.tarifChangeInputsInfo.min_weight = false;
		this.tarifChangeInputsInfo.max_weight = false;
		this.tarifChangeInputsInfo.status = false;
		this.tarifChangeInputsInfo.price = false;
	}
	cancelEditTarifCard(event) {
		const cancelBtn = event.target;
		clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editTarifCard(event)");
		const targetTarifCard = cancelBtn.closest(".tarifCard");
		targetTarifCard.classList.remove("editStat");
		const saveBtn = targetTarifCard.querySelector(".saveColumn button");
		saveBtn.disabled = true;

		let tarifColumns = {
			productDom: targetTarifCard.querySelector(".product"),
			min_weightDom: targetTarifCard.querySelector(".min"),
			max_weightDom: targetTarifCard.querySelector(".max"),
			statusDom: targetTarifCard.querySelector(".status"),
			priceDom: targetTarifCard.querySelector(".price"),
		};

		this.#convertEditedCardColumnsToNormalMode(tarifColumns);
		this.#clearTarifPreviousAndChangeValues();
	}
	async #updateTarifCardApi(tarifId, updatedData) {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.patch(`${baseUrl}weight-ranges/${tarifId}/`, updatedData, {
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

	#getUpdatedData(tarifColumns) {
		let updatedData = {};
		// the product is required
		let selectProductDom = tarifColumns.productDom.querySelector("select");
		updatedData.product = selectProductDom.options[selectProductDom.selectedIndex].id;

		// convert min max weight to number to prevent backend internal server error  :
		if (this.tarifChangeInputsInfo.min_weight) updatedData.min_weight = Number(tarifColumns.min_weightDom.querySelector("input").value);
		if (this.tarifChangeInputsInfo.max_weight) updatedData.max_weightDom = Number(tarifColumns.max_weightDom.querySelector("input").value);
		if (this.tarifChangeInputsInfo.status) updatedData.status = tarifColumns.statusDom.querySelector("select").value;
		if (this.tarifChangeInputsInfo.price) updatedData.price = tarifColumns.priceDom.querySelector("input").value;

		return updatedData;
	}
	async saveTarifCard(event) {
		const saveBtn = event.target;

		if (!this.#checkIsAllowToActivateSaveBtn(saveBtn)) return;
		saveBtn.disabled = true;
		const targetTarifCard = saveBtn.closest(".tarifCard");
		const tarifId = targetTarifCard.getAttribute("tarifId");

		let tarifColumns = {
			productDom: targetTarifCard.querySelector(".product"),
			min_weightDom: targetTarifCard.querySelector(".min"),
			max_weightDom: targetTarifCard.querySelector(".max"),
			statusDom: targetTarifCard.querySelector(".status"),
			priceDom: targetTarifCard.querySelector(".price"),
		};

		let updatedData = this.#getUpdatedData(tarifColumns);

		try {
			let tarifData = await this.#updateTarifCardApi(tarifId, updatedData);

			const cancelBtn = targetTarifCard.querySelector("button.cancel");
			clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editTarifCard(event)");
			targetTarifCard.classList.remove("editStat");

			this.#convertSaveCardColumnsToNormalMode(tarifColumns, tarifData);
			this.#clearTarifPreviousAndChangeValues();
			clsUtile.alertHint("user updated with success", "success");
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
}

class filter {
	constructor(tarifsContainer) {
		this.filterInputsDom = {
			minWeight: document.getElementById("minWeight"),
			maxWeight: document.getElementById("maxWeight"),
			tarifType: document.getElementById("tarifType"),
		};

		this.filterInputsDom.minWeight.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.filterInputsDom.maxWeight.focus();
		});
		this.filterInputsDom.maxWeight.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.filterInputsDom.tarifType.focus();
		});

		this.searchBtnDom = document.getElementById("searchTarifBtn");
		this.tarifsContainerDom = tarifsContainer;
		this.searchBtnDom.addEventListener("click", () => {
			this.searchBtnDom.disabled = true;
			this.#filterTarifsContainer();
			this.searchBtnDom.disabled = false;
		});
		this.#fillTarifTypes();
	}
	#fillTarifTypes() {
		this.filterInputsDom.tarifType.innerHTML = `
      <select>
<option value="all">All</option>
      ${clsTable.getOptionsHtmlFromProduct()}
						</select>
      
							
        `;
	}

	#chequeFilterInputsValue(filterInputsValue) {
		if (!filterInputsValue.minWeightValue) filterInputsValue.minWeightValue = 0;
		if (!filterInputsValue.maxWeightValue) filterInputsValue.maxWeightValue = Number.MAX_SAFE_INTEGER;
		if (filterInputsValue.tarifTypeValue == "all") filterInputsValue.tarifTypeValue = "";
		filterInputsValue.minWeightValue = Number(filterInputsValue.minWeightValue);
		filterInputsValue.maxWeightValue = Number(filterInputsValue.maxWeightValue);
	}
	#filterTarifsContainer() {
		let filterInputsValue = {
			minWeightValue: this.filterInputsDom.minWeight.value,
			maxWeightValue: this.filterInputsDom.maxWeight.value,
			tarifTypeValue: this.filterInputsDom.tarifType.value,
		};
		this.#chequeFilterInputsValue(filterInputsValue);

		this.tarifsContainerDom.querySelectorAll(".tarifCard").forEach((tarifBox) => {
			const tarifBoxInfo = {
				minWeight: tarifBox.querySelector(".min").textContent,
				maxWeight: tarifBox.querySelector(".max").textContent,
				type: tarifBox.querySelector(".product").textContent,
			};

			if (tarifBoxInfo.minWeight >= filterInputsValue.minWeightValue && tarifBoxInfo.maxWeight <= filterInputsValue.maxWeightValue && (!filterInputsValue.tarifTypeValue || tarifBoxInfo.type == filterInputsValue.tarifTypeValue)) {
				tarifBox.style.display = "table-row";
			} else tarifBox.style.display = "none";
		});
	}
}

class clsAddTarifForm {
	#tarifValues = {
		product: "",
		min_weight: "",
		max_weight: "",
		status: "",
		price: "",
	};
	constructor(usersContainer) {
		this.addTarifFormDom = document.getElementById("addTarifForm");
		this.productInputDom = document.getElementById("tarifTypeInput");
		this.minWeightInputDom = document.getElementById("addTarifMinWeight");
		this.maxWeightInputDom = document.getElementById("addTarifMaxWeight");
		this.statusInputDom = document.getElementById("tarifStatusInput");
		this.priceInputDom = document.getElementById("addTarifPrice");
		this.submitBtnDom = document.getElementById("submitAddTarifBtn");

		this.tarifsContainerDom = usersContainer;

		this.#fillTarifTypes();

		this.addTarifFormDom.addEventListener("submit", async (event) => {
			event.preventDefault();
			this.submitBtnDom.disabled = true;

			await this.manageAddNewTarif();
			this.submitBtnDom.disabled = false;
		});
	}
	async #fillTarifTypes() {
		this.productInputDom.innerHTML = `${clsTable.getOptionsHtmlFromProduct()}`;
	}

	#fillAddTarifFormValues() {
		this.#tarifValues.product = this.productInputDom.options[this.productInputDom.selectedIndex].id;
		// convert min max weight to number to prevent backend internal server error [extra :  price  ]  :
		this.#tarifValues.min_weight = Number(this.minWeightInputDom.value);
		this.#tarifValues.max_weight = Number(this.maxWeightInputDom.value);
		this.#tarifValues.status = this.statusInputDom.value;
		this.#tarifValues.price = Number(this.priceInputDom.value);
	}
	#clearAddTarifInputs() {
		this.productInputDom = "";
		this.minWeightInputDom = "";
		this.maxWeightInputDom = "";
		this.statusInputDom = "";
		this.priceInputDom = "";
	}

	async #addNewTarifApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.post(
				`${baseUrl}weight-ranges/`,

				this.#tarifValues,

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

	async manageAddNewTarif() {
		this.#fillAddTarifFormValues();

		try {
			let tarif = await this.#addNewTarifApi();

			const tarifHtmlStructure = clsTable.getTarifHtmlStructure(tarif);
			this.tarifsContainerDom.insertAdjacentHTML("beforeend", tarifHtmlStructure);

			this.#clearAddTarifInputs();
			clsUtile.alertHint("the Tarif added with success ", "success");
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
}

// main : --------------------------------------
let tableObject = "";
window.addEventListener("load", async () => {
	tableObject = await new clsTable();

	const filterObject = new filter(tableObject.tableContainerContentDom);

	const addUserObject = new clsAddTarifForm(tableObject.tableContainerContentDom);
});

window.addEventListener("resize", () => {
	tableObject.handelTableResponsive();
});
