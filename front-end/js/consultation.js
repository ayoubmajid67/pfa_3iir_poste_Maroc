class clsTable {
	static toggleDepotsBtnContent = ["Show All  Depots", "Hide All Depots"];
	static boxModeClass = "activeBox";
	static blackDrop = document.querySelector(".blackDrop");
	static cancelPopUpBox = document.querySelector(".cancelPopup");
	static cancelPopUpDepotIdBox = clsTable.cancelPopUpBox.querySelector(".popUpDepotId");
	static cancelCancelDepotBtn = clsTable.cancelPopUpBox.querySelector(".popupButtonCancel");
	static submitCancelDepotBtn = clsTable.cancelPopUpBox.querySelector(".popupButtonSubmit");

	constructor() {
		this.depotsTable = document.querySelector(".table-responsive .table");
		this.tableContainerContentDom = document.getElementById("consultationTableBody");
		this.toggleDepotsShowBtnDom = document.getElementById("toggleShowDepotsBtn");
		this.depotsFilterInputsDom = {
			startDateInput: document.getElementById("startDate"),
			endDateInput: document.getElementById("endDate"),
			targetAgentInput: document.getElementById("agentsList"),
		};

		this.toggleDepotsShowBtnDom.addEventListener("click", () => {
			this.#toggleOfficeShow();
		});

		this.handelTableResponsive();
		this.managePushAgentList();
		this.manageGetDepots();
	}
	#getAgentOptionHtmlStructure(agentInfo) {
		return `<option    value=${agentInfo.id}>${agentInfo.cin}</option>`;
	}
	async getStaffsListApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}office-staff/`, {
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
	async managePushAgentList() {
		const staffList = await this.getStaffsListApi();

		this.depotsFilterInputsDom.targetAgentInput.innerHTML = '<option value="ALL">All</option>';
		staffList.forEach((staff) => {
			if (staff.role == "agent") {
				const agentOptionHtmlStructure = this.#getAgentOptionHtmlStructure(staff);

				this.depotsFilterInputsDom.targetAgentInput.insertAdjacentHTML("afterbegin", agentOptionHtmlStructure);
			}
		});
	}

	handelTableResponsive() {
		if (window.innerHeight >= 1600) {
			this.depotsTable.removeAttribute("style");
			return;
		}

		if (window.innerWidth >= 800) {
			this.depotsTable.removeAttribute("style");
			/*
			  with 10 columns : 
			  the  convenient  font-size of the table content at 1400px (window width ) : 
			   1550 (window width) -> 16px (font-size)
			    y  (window width )-> ? (font-size) 
			   
			   ?= (y* 16 )/1400
			 
			 */

			const WidthRole = {
				basicWindowWidth: 1400,
				basicFontSize: 16,
			};
			const newFontSize = Math.floor((WidthRole.basicFontSize * window.innerWidth) / WidthRole.basicWindowWidth);
			this.depotsTable.style.fontSize = `${newFontSize}px`;
		} else {
			/*
			  with 10 columns : 
			  the  convenient  scale of the table content at 1500px (window width ) : 
			   800 (window width) -> 0.90 (scale)
			    y  (window width )-> ? (scale) 
			   
			   ?= (y* 0.90 )/800
			 
			 */

			this.depotsTable.style.fontSize = `10px`;
			const scaleRole = {
				basicWindowWidth: 800,
				basicScaleValue: 0.9,
			};

			const newScaleValue = (scaleRole.basicScaleValue * window.innerWidth) / scaleRole.basicWindowWidth;
			this.depotsTable.style.transform = `scale(${newScaleValue})`;
		}
	}

	#toggleOfficeShow() {
		const isHidden = Number(this.tableContainerContentDom.classList.contains("hidden"));
		this.toggleDepotsShowBtnDom.textContent = clsTable.toggleDepotsBtnContent[isHidden];
		this.tableContainerContentDom.classList.toggle("hidden");
	}

	async #getDepotsApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}requests_list/`, {
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
	static formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${month}/${day}/${year}  ${hours}:${minutes}:${seconds}`;
	}
	static getDepotHtmlStructure(depot) {
		const createdDate = new Date(depot.created_at);
		const currentDate = new Date();

		const isSameDay = createdDate.toDateString() === currentDate.toDateString();

		let cancelBtnContent = "";

		if (isSameDay && currentDate.getHours() > 6 && depot.status != "canceled") {
			cancelBtnContent = `
	
					<div class="btnContainer">
						<button onclick="tableObject.cancelDepotCard(event)" class="cancel">cancel</button>
					</div>
			
			`;
		}
		return `
   <tr  depotId=${depot.id} class="depotCard">
									<td class="product">${depot.product}</td>
									<td class="clientId">${depot.client}</td>
									<td class="agentId">${depot.agent}</td>
									<td class="weight">${depot.weight}</td>
									<td class="destination">${depot.destination}</td>
									<td class="amount">${depot.amount}</td>
									<td class="status">${depot.status}</td>
									<td class="createdTime">${clsTable.formatDate(createdDate)}</td>
									<td class="reference">${depot.reference}</td>
									<td class="btnColumn cancelColumn">
									${cancelBtnContent}
										</td>
								</tr>
     `;
	}

	async manageGetDepots() {
		try {
			const depots = await this.#getDepotsApi();
			this.tableContainerContentDom.innerHTML = "";

			depots.forEach((depot) => {
				const depotHtmlStructure = clsTable.getDepotHtmlStructure(depot);
				this.tableContainerContentDom.insertAdjacentHTML("beforeend", depotHtmlStructure);
			});
		} catch (error) {
			await clsUtile.alertHint(error.message, error.type);
		}
	}
	static setDisableCancelBoxMode(targetDepotCard) {
		clsTable.cancelPopUpBox.classList.remove(clsTable.boxModeClass);

		clsTable.blackDrop.classList.remove(clsTable.boxModeClass);
		clsTable.submitCancelDepotBtn.onclick = () => {};
		clsTable.cancelCancelDepotBtn.onclick = () => {};
		clsTable.cancelPopUpDepotIdBox.textContent = "";

		targetDepotCard.classList.remove("cancelStat");
		targetDepotCard.querySelector("button.cancel").disabled = false;
		window.onscroll = function () {};
	}

	static setEnableCancelPopUpBox(targetDepotCard) {
		clsTable.blackDrop.classList.add(clsTable.boxModeClass);
		clsTable.cancelPopUpBox.classList.add(clsTable.boxModeClass);
		targetDepotCard.classList.add("cancelStat");
		const depotId = targetDepotCard.getAttribute("depotId");

		clsTable.cancelPopUpDepotIdBox.textContent = depotId;
		clsTable.submitCancelDepotBtn.onclick = () => {
			clsTable.SubmitCancelDepot(targetDepotCard);
		};
		clsTable.cancelCancelDepotBtn.onclick = () => {
			clsTable.cancelCancelDepot(targetDepotCard);
		};

		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		window.onscroll = function () {
			clsUtile.scrollToPositionHard(scrollTop);
		};
	}
	static async cancelRequestCardApi(requestId) {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.patch(
				`${baseUrl}cancel_request/${requestId}/`,
				{},
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
	static async SubmitCancelDepot(targetDepotCard) {
		const depotId = targetDepotCard.getAttribute("depotId");

		try {
			const data = await clsTable.cancelRequestCardApi(depotId);

			this.setDisableCancelBoxMode(targetDepotCard);
			await clsUtile.wait("50");
			targetDepotCard.querySelector("td.status").textContent = data.request.status;
			targetDepotCard.querySelector("button.cancel").remove();

			clsUtile.alertHint(data.message, "success");
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
	static cancelCancelDepot(targetDepotCard) {
		clsTable.setDisableCancelBoxMode(targetDepotCard);
	}
	async cancelDepotCard(event) {
		const cancelBtn = event.target;
		cancelBtn.disabled = true;
		const targetDepotCard = cancelBtn.closest(".depotCard");
		clsTable.setEnableCancelPopUpBox(targetDepotCard);
	}
}

class filter {
	constructor(depotsContainer) {
		this.filterInputsDom = {
			startDate: document.getElementById("startDate"),
			endDate: document.getElementById("endDate"),
			selectedAgent: document.getElementById("agentsList"),
		};

		this.filterInputsDom.startDate.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.filterInputsDom.endDate.focus();
		});
		this.filterInputsDom.endDate.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.filterInputsDom.selectedAgent.focus();
		});

		this.searchBtnDom = document.getElementById("searchDepotBtn");
		this.depotsContainerDom = depotsContainer;

		this.searchBtnDom.addEventListener("click", () => {
			this.searchBtnDom.disabled = true;
			this.#filterDepotsContainer();
			this.searchBtnDom.disabled = false;
		});
	}

	#filterDepotsContainer() {
		let filterInputsValue = {
			startDateValue: new Date(this.filterInputsDom.startDate.value ? this.filterInputsDom.startDate.value : "1900/01/01"),
			endDateValue: new Date(this.filterInputsDom.endDate.value ? this.filterInputsDom.endDate.value : new Date()),
			selectedAgentIdValue: this.filterInputsDom.selectedAgent.value,
		};
		filterInputsValue.startDateValue.setHours("00");
		filterInputsValue.startDateValue.setMinutes("00");
		filterInputsValue.startDateValue.setSeconds("00");

		filterInputsValue.endDateValue.setHours("23");
		filterInputsValue.endDateValue.setMinutes("59");
		filterInputsValue.endDateValue.setSeconds("59");

		this.depotsContainerDom.querySelectorAll(".depotCard").forEach((depotBox) => {
			const depotBoxInfo = {
				createdDate: new Date(depotBox.querySelector("td.createdTime").textContent),
				agentId: depotBox.querySelector(".agentId").textContent,
			};

			if (depotBoxInfo.createdDate >= filterInputsValue.startDateValue && depotBoxInfo.createdDate <= filterInputsValue.endDateValue && (filterInputsValue.selectedAgentIdValue == "ALL" || filterInputsValue.selectedAgentIdValue == depotBoxInfo.agentId)) {
				depotBox.style.display = "table-row";
			} else depotBox.style.display = "none";
		});
	}
}

// main : --------------------------------------
let tableObject = "";
window.addEventListener("load", async () => {
	tableObject = new clsTable();
	const filterObject = new filter(tableObject.tableContainerContentDom);
});

window.addEventListener("resize", () => {
	tableObject.handelTableResponsive();
});
