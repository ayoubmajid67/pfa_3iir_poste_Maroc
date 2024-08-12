class clsPriceOPtions {
	static totalPrice = 0;
	static currentWeight = 0;

	static finalProductTypeChoice = "";
	static products = {
		Colis: 1,
		Courrier: 2,
	};
	static includeSmsOptionInputDom = document.getElementById("smsCheckbox");

	constructor() {
		this.weightInputDom = document.getElementById("weightInput");
		this.searchPricesOptionsBtn = document.getElementById("searchPricesOptionsBtn");
		this.pricesOptionsTableBodyDom = document.querySelector("#resultsPricesTable tbody");

		this.totalPriceElementDom = document.getElementById("totalPrice");
		this.submitPriceOptionBtnDom = document.getElementById("submitPricesOptionsBtn");
		this.submitPriceOptionBtnDom.disabled = true;
		this.submitPriceOptionBtnDom.addEventListener("click", () => {
			this.handelSubmitOptionBtn();
		});
		this.weightInputDom.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.searchPricesOptionsBtn.click();
		});

		this.searchPricesOptionsBtn.addEventListener("click", () => {
			this.searchPricesOptionsBtn.disabled = true;
			clsEndContent.blockEndContent();
			this.#managePricesOptions();
			this.searchPricesOptionsBtn.disabled = false;
		});

		clsPriceOPtions.includeSmsOptionInputDom.addEventListener("input", (event) => {
			this.submitPriceOptionBtnDom.disabled = false;
			const priceToHandel = +clsPriceOPtions.includeSmsOptionInputDom.dataset.price;
			if (clsPriceOPtions.includeSmsOptionInputDom.checked) clsPriceOPtions.totalPrice += priceToHandel;
			else clsPriceOPtions.totalPrice -= priceToHandel;
		});
	}
	async #getProductCourrierPriceApi(weight) {
		let accessToken = clsLocalStorage.getToken();

		try {
			let body = {
				product: clsPriceOPtions.products["Courrier"],
				weight: weight,
			};
			const response = await axios.post(`${baseUrl}range-price/`, body, {
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
	async #getProductColisPriceApi(weight) {
		let accessToken = clsLocalStorage.getToken();

		try {
			let body = {
				product: clsPriceOPtions.products["Colis"],
				weight: weight,
			};
			const response = await axios.post(`${baseUrl}range-price/`, body, {
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

	getPriceOptionHtmlStructure(priceOption) {
		return `
      <tr>
							<td class="product">${priceOption.product}</td>
							<td class="price">${priceOption.price}</td>
							<td class="weight">${priceOption.requested_weight}</td>
							<td >
								<input type="checkbox" class="selectPrice select${priceOption.product}" data-product="${priceOption.product}" data-price ="${priceOption.price}" />
							</td>
						</tr>
    `;
	}

	async #managePricesOptions() {
		let weightValue = this.weightInputDom.value.trim();
		clsPriceOPtions.currentWeight = weightValue;

		try {
			const data = [];
			try {
				data.push(await this.#getProductColisPriceApi(weightValue));
			} catch (error) {
				clsUtile.alertHint(error.message, error.type);
			}
			try {
				data.push(await this.#getProductCourrierPriceApi(weightValue));
			} catch (error) {
				clsUtile.alertHint(error.message, error.type);
			}
			this.pricesOptionsTableBodyDom.innerHTML = "";
			data.forEach((priceOption) => {
				const htmlStructure = this.getPriceOptionHtmlStructure(priceOption);
				this.pricesOptionsTableBodyDom.insertAdjacentHTML("afterbegin", htmlStructure);
			});

			this.handelChoiceToggle();
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}

	handelChoiceToggle() {
		const choicesInputsDom = this.pricesOptionsTableBodyDom.querySelectorAll("input.selectPrice");

		choicesInputsDom.forEach((choiceInput) => {
			choiceInput.addEventListener("input", (event) => {
				const status = Array.from(choicesInputsDom).some((choiceInputItem) => {
					return choiceInputItem.checked === true && choiceInputItem != choiceInput;
				});

				if (status)
					choicesInputsDom.forEach((choiceInputItem) => {
						if (choiceInputItem != choiceInput) {
							const price = +choiceInputItem.dataset.price;
							choiceInputItem.checked = false;
							clsPriceOPtions.totalPrice -= price;
						}
					});
				const price = +choiceInput.dataset.price;
				if (choiceInput.checked == true) {
					clsPriceOPtions.totalPrice += price;
					clsPriceOPtions.finalProductTypeChoice = choiceInput.dataset.product;
					this.submitPriceOptionBtnDom.disabled = false;
				} else {
					clsPriceOPtions.totalPrice -= price;
					if (!this.isAllowToSubmitPriceOption()) {
						this.submitPriceOptionBtnDom.disabled = true;
						clsEndContent.blockEndContent();
					}
				}
			});
		});
	}

	isAllowToSubmitPriceOption() {
		const choicesInputsDom = this.pricesOptionsTableBodyDom.querySelectorAll("input.selectPrice");
		return Array.from(choicesInputsDom).some((choiceInputItem) => {
			return choiceInputItem.checked === true;
		});
	}
	handelSubmitOptionBtn() {
		this.submitPriceOptionBtnDom.disabled = true;
		if (!this.isAllowToSubmitPriceOption()) {
			clsEndContent.blockEndContent();
			return;
		}

		this.totalPriceElementDom.textContent = clsPriceOPtions.totalPrice;
		clsEndContent.allowEndContent();
		clsDepotForm.loadProductTypeDom();
	}
}

class clsSearchClient {
	constructor() {
		this.searchSenderBtn = document.getElementById("cinSearchButton");
		this.senderCinSearchInputDom = document.getElementById("cinSender");
		this.senderCinSearchInputDom.addEventListener("keypress", (event) => {
			if (event.key == "Enter") {
				this.searchSenderBtn.click();
			}
		});

		this.searchSenderBtn.addEventListener("click", async () => {
			this.searchSenderBtn.disabled = true;
			await this.manageSearchSender();
			this.searchSenderBtn.disabled = false;
		});
	}

	async #getSenderByCinApi(cin) {
		let accessToken = clsLocalStorage.getToken();

		try {
			let formData = new FormData();
			formData.append("cin", cin);
			const response = await axios.post(`${baseUrl}client/`, formData, {
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
				console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}
	async manageSearchSender() {
		try {
			const cinValue = this.senderCinSearchInputDom.value.trim();
			if (cinValue) {
				let client = await this.#getSenderByCinApi(cinValue);
				clsDepotForm.pushSenderValues(client);
			}
		} catch (error) {
			// console.log(error);
			clsUtile.alertHint(error.message, error.type);
		}
	}
}
class clsEndContent {
	static endContentDom = document.querySelector(".endContent");
	static blockEvent = null;

	constructor() {
		clsEndContent.blockEndContent();
	}

	static handleEndContentClick(event) {
		event.stopPropagation();
		event.preventDefault();

		clsEndContent.endContentDom.style.visibility = "hidden";
	}

	static blockEndContent() {
		clsEndContent.blockEvent = clsEndContent.handleEndContentClick;
		clsEndContent.endContentDom.addEventListener("click", clsEndContent.blockEvent);
	}

	static allowEndContent() {
		clsEndContent.endContentDom.style.visibility = "visible";
		clsEndContent.endContentDom.removeEventListener("click", clsEndContent.blockEvent);
	}
}

class clsDepotForm {
	static depotFormDom = document.querySelector("#depotForm");
	static senderInputs = {
		cinInput: clsDepotForm.depotFormDom.querySelector("#senderCIN"),
		firstNameInput: clsDepotForm.depotFormDom.querySelector("#senderFirstName"),
		lastNameInput: clsDepotForm.depotFormDom.querySelector("#senderLastName"),
		phoneNumberInput: clsDepotForm.depotFormDom.querySelector("#senderPhoneNumber"),
	};

	static receiverInputs = {
		cinInput: clsDepotForm.depotFormDom.querySelector("#receiverCIN"),
		firstNameInput: clsDepotForm.depotFormDom.querySelector("#receiverFirstName"),
		lastNameInput: clsDepotForm.depotFormDom.querySelector("#receiverLastName"),
		phoneNumberInput: clsDepotForm.depotFormDom.querySelector("#receiverPhoneNumber"),
	};
	static submitBtn = clsDepotForm.depotFormDom.querySelector("#submitButton");
	static productInputs = {
		destinationInput: clsDepotForm.depotFormDom.querySelector("#productDestination"),
		productTypeInput: clsDepotForm.depotFormDom.querySelector("#productType"),
	};
	constructor() {
		clsDepotForm.depotFormDom.addEventListener("submit", async (event) => {
			event.preventDefault();
			clsDepotForm.submitBtn.disabled = true;
			await this.manageAddDepot();
			clsDepotForm.submitBtn.disabled = false;
		});
	}

	async #addDepotApi(depotInfo) {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.post(`${baseUrl}send_request/`, depotInfo, {
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
				console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}

  #clearFormInputs(){
    clsDepotForm.senderInputs.cinInput.value="",
    clsDepotForm.senderInputs.firstNameInput.value="",
    clsDepotForm.senderInputs.lastNameInput.value="",
    clsDepotForm.senderInputs.phoneNumberInput.value="",
    clsDepotForm.productInputs.destinationInput.value="",
    clsDepotForm.receiverInputs.cinInput.value="",
    clsDepotForm.receiverInputs.firstNameInput.value="",
    clsDepotForm.receiverInputs.lastNameInput.value="",
    clsDepotForm.receiverInputs.phoneNumberInput.value="",

  }
	#getDepotInfo() {
    // break point : 
		const depotInfo = {
			cin: clsDepotForm.senderInputs.cinInput.value,
			first_name: clsDepotForm.senderInputs.firstNameInput.value,
			last_name: clsDepotForm.senderInputs.lastNameInput.value,
			phone_number: clsDepotForm.senderInputs.phoneNumberInput.value,
			product: clsDepotForm.productInputs.productTypeInput.dataset.productid,
			destination: clsDepotForm.productInputs.destinationInput.value,
			amount: clsPriceOPtions.totalPrice,
			sms: clsPriceOPtions.includeSmsOptionInputDom.checked ? "yes" : "no",
			weight: clsPriceOPtions.currentWeight,
			range: "not yet",
			cin_receiver: clsDepotForm.receiverInputs.cinInput.value,
			first_name_receiver: clsDepotForm.receiverInputs.firstNameInput.value,
			last_name_receiver: clsDepotForm.receiverInputs.lastNameInput.value,
			phone_number_receiver: clsDepotForm.receiverInputs.phoneNumberInput.value,
		};
		return depotInfo;
	}

	async manageAddDepot() {
		const depotInfo = this.#getDepotInfo();
		console.log(depotInfo);
	}

	static loadProductTypeDom() {
		clsDepotForm.productInputs.productTypeInput.value = clsPriceOPtions.finalProductTypeChoice;
		clsDepotForm.productInputs.productTypeInput.setAttribute("data-productId", clsPriceOPtions.products[clsPriceOPtions.finalProductTypeChoice]);
	}
	static pushSenderValues(senderInfo) {
		clsDepotForm.senderInputs.cinInput.value = senderInfo.cin;
		clsDepotForm.senderInputs.firstNameInput.value = senderInfo.first_name;
		clsDepotForm.senderInputs.lastNameInput.value = senderInfo.last_name;
		clsDepotForm.senderInputs.phoneNumberInput.value = senderInfo.phone_number;
	}
}

window.addEventListener("load", () => {
	const endContentObject = new clsEndContent();

	const priceOptionObject = new clsPriceOPtions();
	const searchClientObject = new clsSearchClient();
	const depotFormObject = new clsDepotForm();
	console.log(clsPriceOPtions.finalProductTypeChoice);
});
