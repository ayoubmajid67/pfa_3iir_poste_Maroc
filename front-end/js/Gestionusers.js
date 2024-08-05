class clsTable {
	static toggleUserBtnContent = ["Show All  users", "Hide All users"];
	constructor() {
		this.userTable = document.querySelector(".table-responsive .table");
		this.tableContainerContentDom = document.getElementById("userTableBody");
		this.toggleUsersShowBtnDom = document.getElementById("toggleshowUsersBtn");
		this.usersFilterInput = document.getElementById("userNumber");

		this.userColumnsPrevValues = {
			cin: "",
			firstName: "",
			lastName: "",
			email: "",
			role: "",
			office: "",

			status: "",
		};
		this.userChangeInputsInfo = {
			cin: false,
			firstName: false,
			lastName: false,
			email: false,
			role: false,
			office: false,

			status: false,
		};

		this.toggleUsersShowBtnDom.addEventListener("click", () => {
			this.#toggleUserShow();
		});

		this.manageGetUsers();
		this.handelTableResponsive();
	}
	handelTableResponsive() {
		let newFontSize;
		if (window.innerWidth >= 1200) {
			this.userTable.removeAttribute("style");
			/*
			  with 9 columns : 
			  the  convenient  font-size of the table content at 1500px (window width ) : 
			   1500 (window width) -> 11px (font-size)
			    y  (window width )-> ? (font-size) 
			   
			   ?= (y* 11 )/1500
			 
			 */

			const WidthRole = {
				basicWindowWidth: 1500,
				basicFontSize: 11,
			};
			const newFontSize = Math.floor((WidthRole.basicFontSize * window.innerWidth) / WidthRole.basicWindowWidth);
			this.userTable.style.fontSize = `${newFontSize}px`;
		} else {
			/*
			  with 7 columns : 
			  the  convenient  scale of the table content at 1500px (window width ) : 
			   1000 (window width) -> 0.80 (scale)
			    y  (window width )-> ? (scale) 
			   
			   ?= (y* 0.80 )/1000
			 
			 */

			this.userTable.style.fontSize = `9px`;
			const scaleRole = {
				basicWindowWidth: 1000,
				basicScaleValue: 0.8,
			};
			if (window.innerWidth <= 768) scaleRole.basicScaleValue = 0.798;
			const newScaleValue = (scaleRole.basicScaleValue * window.innerWidth) / scaleRole.basicWindowWidth;
			this.userTable.style.transform = `scale(${newScaleValue})`;
		}
	}

	#toggleUserShow() {
		const isHidden = Number(this.tableContainerContentDom.classList.contains("hidden"));
		this.toggleUsersShowBtnDom.textContent = clsTable.toggleUserBtnContent[isHidden];
		this.tableContainerContentDom.classList.toggle("hidden");
	}

	async #getUsersApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}staff/`, {
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
	static getUserHtmlStructure(user) {
		return `
   	<tr userId=${user.id}  userCin=${user.cin} class="userCard">
									<td class="cin">${user.cin}</td>
									<td class="nom">${user.first_name}</td>
									<td class="pernom">${user.last_name}</td>
									<td class="email">${user.email}</td>
									<td class="role">${user.role}</td>
									<td class="office">${user.office.id}</td>
								
									<td class="status">${user.status}</td>
									<td class="btnColumn editColumn">
										<div class="btnContainer">
											<button onclick="tableObject.editUserCard(event)" class="edit">edit</button>
										</div>
									</td>
									<td class="btnColumn saveColumn">
										<div class="btnContainer">
											<button disabled onclick="tableObject.saveUserCard(event)">Save</button>
										</div>
									</td>
								</tr>
     `;
	}

	async manageGetUsers() {
		try {
			const users = await this.#getUsersApi();
			this.tableContainerContentDom.innerHTML = "";

			users.forEach((user) => {
				const userHtmlStructure = clsTable.getUserHtmlStructure(user);
				this.tableContainerContentDom.insertAdjacentHTML("beforeend", userHtmlStructure);
			});
		} catch (error) {
			await clsUtile.alertHint(error.message, error.type);
		}
	}
	#convertEditedCardColumnsToEditMode(userColumns) {
		userColumns.cinDom.innerHTML = `<input type="text" class="targetCin" value='${this.userColumnsPrevValues.cin}' />`;
		userColumns.firstNameDom.innerHTML = `<input type="text" class="targetFirstName" value='${this.userColumnsPrevValues.firstName}' />`;
		userColumns.lastNameDom.innerHTML = `<input type="text" class="targetLastName" value='${this.userColumnsPrevValues.lastName}' />`;
		userColumns.emailDom.innerHTML = `<input type="text" class="targetEmail" value='${this.userColumnsPrevValues.email}' />`;
		userColumns.roleDom.innerHTML = `
		<select class="targetRole">
    <option value="admin" ${this.userColumnsPrevValues.role == "admin" ? "selected" : ""} >admin</option>
    <option value="manager"  ${this.userColumnsPrevValues.role == "manager" ? "selected" : ""}>manager</option>
    <option value="agent"  ${this.userColumnsPrevValues.role == "agent" ? "selected" : ""}>agent</option>
   >
</select>
		`;
		userColumns.officeDom.innerHTML = `<input type="text" class="targetOffice" value='${this.userColumnsPrevValues.office}' />`;
		userColumns.statusDom.innerHTML = `
		<select class="targetStatus">
    <option value="actif" ${this.userColumnsPrevValues.status == "actif" ? "selected" : ""} >actif</option>
    <option value="démissionné"  ${this.userColumnsPrevValues.status == "démissionné" ? "selected" : ""}>démissionné</option>
    <option value="décédé"  ${this.userColumnsPrevValues.status == "décédé" ? "selected" : ""}>décédé</option>
	<option value="retraite"  ${this.userColumnsPrevValues.status == "retraite" ? "selected" : ""}>retraite</option>
   >
</select>
		`;

		userColumns.cinDom.querySelector("input").focus();
	}
	#setUserPreviousValues(userColumns) {
		this.userColumnsPrevValues.cin = userColumns.cinDom.textContent;
		this.userColumnsPrevValues.firstName = userColumns.firstNameDom.textContent;
		this.userColumnsPrevValues.lastName = userColumns.lastNameDom.textContent;
		this.userColumnsPrevValues.email = userColumns.emailDom.textContent;
		this.userColumnsPrevValues.role = userColumns.roleDom.textContent;
		this.userColumnsPrevValues.office = userColumns.officeDom.textContent;
		this.userColumnsPrevValues.status = userColumns.statusDom.textContent;
	}
	#checkIsAllowToActivateSaveBtn(saveBtn) {
		if (this.userChangeInputsInfo.cin || this.userChangeInputsInfo.firstName || this.userChangeInputsInfo.lastName || this.userChangeInputsInfo.email || this.userChangeInputsInfo.role || this.userChangeInputsInfo.office || this.userChangeInputsInfo.status) {
			saveBtn.disabled = false;
			return true;
		} else {
			saveBtn.disabled = true;
			return false;
		}
	}

	#editUserInputTrack(input, userOptionName) {
		const value = input.value.trim();
		if (value && value != this.userColumnsPrevValues[userOptionName]) this.userChangeInputsInfo[userOptionName] = true;
		else this.userChangeInputsInfo[userOptionName] = false;
	}
	#addEventChangeValueTrackerToUserInputs(userColumns, saveBtn) {
		userColumns.cinDom.addEventListener("input", (event) => {
			this.#editUserInputTrack(event.target, "cin");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		userColumns.firstNameDom.addEventListener("input", (event) => {
			this.#editUserInputTrack(event.target, "firstName");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		userColumns.lastNameDom.addEventListener("input", (event) => {
			this.#editUserInputTrack(event.target, "lastName");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		userColumns.emailDom.addEventListener("input", (event) => {
			this.#editUserInputTrack(event.target, "email");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		userColumns.roleDom.addEventListener("change", (event) => {
			this.#editUserInputTrack(event.target, "role");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		userColumns.officeDom.addEventListener("input", (event) => {
			this.#editUserInputTrack(event.target, "office");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
		userColumns.statusDom.addEventListener("change", (event) => {
			this.#editUserInputTrack(event.target, "status");
			this.#checkIsAllowToActivateSaveBtn(saveBtn);
		});
	}

	#cancelEditPrevUserCards() {
		const editStatCards = this.tableContainerContentDom.querySelectorAll(".editStat");
		editStatCards.forEach((userCard) => {
			const cancelBtn = userCard.querySelector("button.cancel");
			cancelBtn.click();
		});
	}

	editUserCard(event) {
		this.#cancelEditPrevUserCards();

		const editBtn = event.target;

		clsUtile.switchBtnHandler(editBtn, "cancel", "cancel", "tableObject.cancelEditUserCard(event)");
		const targetUserCard = editBtn.closest(".userCard");
		targetUserCard.classList.add("editStat");
		const saveBtn = targetUserCard.querySelector(".saveColumn button");
		let userColumns = {
			cinDom: targetUserCard.querySelector(".cin"),
			firstNameDom: targetUserCard.querySelector(".nom"),
			lastNameDom: targetUserCard.querySelector(".pernom"),
			emailDom: targetUserCard.querySelector(".email"),
			roleDom: targetUserCard.querySelector(".role"),
			officeDom: targetUserCard.querySelector(".office"),
			statusDom: targetUserCard.querySelector(".status"),
		};

		this.#addEventChangeValueTrackerToUserInputs(userColumns, saveBtn);
		this.#setUserPreviousValues(userColumns);
		this.#convertEditedCardColumnsToEditMode(userColumns);
	}
	#convertEditedCardColumnsToNormalMode(userColumns) {
		userColumns.cinDom.innerHTML = this.userColumnsPrevValues.cin;
		userColumns.firstNameDom.innerHTML = this.userColumnsPrevValues.firstName;
		userColumns.lastNameDom.innerHTML = this.userColumnsPrevValues.lastName;
		userColumns.emailDom.innerHTML = this.userColumnsPrevValues.email;
		userColumns.roleDom.innerHTML = this.userColumnsPrevValues.role;
		userColumns.officeDom.innerHTML = this.userColumnsPrevValues.office;
		userColumns.statusDom.innerHTML = this.userColumnsPrevValues.status;
	}
	#convertSaveCardColumnsToNormalMode(userColumns, data) {
		userColumns.cinDom.innerHTML = data.cin;
		userColumns.firstNameDom.innerHTML = data.firstName;
		userColumns.lastNameDom.innerHTML = data.lastName;
		userColumns.emailDom.innerHTML = data.email;
		userColumns.roleDom.innerHTML = data.role;
		userColumns.officeDom.innerHTML = data.office;
		userColumns.statusDom.innerHTML = data.status;
	}
	#clearUserPreviousAndChangeValues() {
		this.userColumnsPrevValues.cin = "";
		this.userColumnsPrevValues.lastName = "";
		this.userColumnsPrevValues.email = "";
		this.userColumnsPrevValues.role = "";
		this.userColumnsPrevValues.office = "";
		this.userColumnsPrevValues.status = "";

		this.userChangeInputsInfo.cin = false;
		this.userChangeInputsInfo.lastName = false;
		this.userChangeInputsInfo.email = false;
		this.userChangeInputsInfo.role = false;
		this.userChangeInputsInfo.office = false;
		this.userChangeInputsInfo.status = false;
	}
	cancelEditUserCard(event) {
		const cancelBtn = event.target;
		clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editUserCard(event)");
		const targetUserCard = cancelBtn.closest(".userCard");
		targetUserCard.classList.remove("editStat");
		const saveBtn = targetUserCard.querySelector(".saveColumn button");
		saveBtn.disabled = true;

		let userColumns = {
			cinDom: targetUserCard.querySelector(".cin"),
			firstNameDom: targetUserCard.querySelector(".nom"),
			lastNameDom: targetUserCard.querySelector(".pernom"),
			emailDom: targetUserCard.querySelector(".email"),
			roleDom: targetUserCard.querySelector(".role"),
			officeDom: targetUserCard.querySelector(".office"),
			statusDom: targetUserCard.querySelector(".status"),
		};
		this.#convertEditedCardColumnsToNormalMode(userColumns);
		this.#clearUserPreviousAndChangeValues();
	}
	async #updateUserCardApi(userId, updatedData) {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.patch(`${baseUrl}staff/update/${userId}/`, updatedData, {
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

	#getUpdatedData(userColumns) {
		let updatedData = {};
		if (this.userChangeInputsInfo.cin) updatedData.cin = userColumns.cinDom.querySelector("input").value;
		if (this.userChangeInputsInfo.firstName) updatedData.firstName = userColumns.firstNameDom.querySelector("input").value;
		if (this.userChangeInputsInfo.lastName) updatedData.lastNameDom = userColumns.lastNameDom.querySelector("input").value;
		if (this.userChangeInputsInfo.email) updatedData.email = userColumns.emailDom.querySelector("input").value;
		if (this.userChangeInputsInfo.role) updatedData.role = userColumns.roleDom.querySelector("select").value;
		if (this.userChangeInputsInfo.office) updatedData.office = userColumns.officeDom.querySelector("input").value;
		if (this.userChangeInputsInfo.status) updatedData.status = userColumns.statusDom.querySelector("select").value;

		return updatedData;
	}
	async saveUserCard(event) {
		const saveBtn = event.target;

		if (!this.#checkIsAllowToActivateSaveBtn(saveBtn)) return;

		const targetUserCard = saveBtn.closest(".userCard");
		const userId = targetUserCard.getAttribute("userId");

		let userColumns = {
			cinDom: targetUserCard.querySelector(".cin"),
			firstNameDom: targetUserCard.querySelector(".nom"),
			lastNameDom: targetUserCard.querySelector(".pernom"),
			emailDom: targetUserCard.querySelector(".email"),
			roleDom: targetUserCard.querySelector(".role"),
			officeDom: targetUserCard.querySelector(".office"),
			statusDom: targetUserCard.querySelector(".status"),
		};
		let updatedData = this.#getUpdatedData(userColumns);

		try {
			let userData = await this.#updateUserCardApi(userId, updatedData);

			const cancelBtn = targetUserCard.querySelector("button.cancel");
			clsUtile.switchBtnHandler(cancelBtn, "edit", "Edit", "tableObject.editUserCard(event)");
			targetUserCard.classList.remove("editStat");

			this.#convertSaveCardColumnsToNormalMode(userColumns, userData);
			this.#clearUserPreviousAndChangeValues();
			clsUtile.alertHint("user updated with success", "success");
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
}

class filter {
	constructor(usersContainer) {
		this.filterInputDom = document.getElementById("userNumber");
		this.filterInputDom.addEventListener("input", () => {
			if (this.filterInputDom.value == "") {
				this.#showAllUsersBox();
			}
		});
		this.filterInputDom.addEventListener("keypress", (event) => {
			if (event.key == "Enter") this.searchBtnDom.click();
		});
		this.searchBtnDom = document.getElementById("searchBtn");
		this.usersContainerDom = usersContainer;
		this.searchBtnDom.addEventListener("click", () => {
			this.searchBtnDom.disabled = true;
			this.#filterUsersContainer();
			this.searchBtnDom.disabled = false;
		});
	}

	#showAllUsersBox() {
		this.usersContainerDom.querySelectorAll(".userCard").forEach((userBox) => {
			userBox.style.display = "table-row";
		});
	}
	#filterUsersContainer() {
		let numCinUser = this.filterInputDom.value.trim();
		if (numCinUser) {
			this.usersContainerDom.querySelectorAll(".userCard").forEach((userBox) => {
				if (userBox.getAttribute("userCin") == numCinUser) userBox.style.display = "table-row";
				else userBox.style.display = "none";
			});
		}
	}
}

class clsAddUserForm {
	#userValues = {
		cin: "",
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		role: "",
		office: "",
	};
	constructor(usersContainer) {
		this.addUserFormDom = document.getElementById("addUserForm");
		this.cinInputDom = document.getElementById("addUserCin");
		this.firstNameInputDom = document.getElementById("addUserFirstName");
		this.lastNameInputDom = document.getElementById("addUserLastName");
		this.emailInputDom = document.getElementById("addUserEmail");
		this.passwordInputDom = document.getElementById("addUserPassword");
		this.roleInputDom = document.getElementById("addUserRole");
		this.officeInputDom = document.getElementById("addUserOffice");
		this.statusInputDom = document.getElementById("addUserStatus");
		this.submitBtnDom = document.getElementById("submitAddUserBtn");
		this.togglePasswordIcon = this.addUserFormDom.querySelector(`#togglePassword`);

		this.usersContainerDom = usersContainer;

		this.togglePasswordIcon.addEventListener("click", () => {
			this.#handelPasswordVisibilityIconToggle();
		});

		this.addUserFormDom.addEventListener("submit", async (event) => {
			event.preventDefault();
			this.submitBtnDom.disabled = true;

			await this.manageAddNewUser();
			this.submitBtnDom.disabled = false;
		});
	}
	#handelPasswordVisibilityIconToggle() {
		clsUtile.handleVisibilityPassword(this.passwordInputDom, this.togglePasswordIcon);
	}
	#fillAddUserFormValues() {
		this.#userValues.cin = this.cinInputDom.value;
		this.#userValues.first_name = this.firstNameInputDom.value;
		this.#userValues.last_name = this.lastNameInputDom.value;
		this.#userValues.email = this.emailInputDom.value;
		this.#userValues.password = this.passwordInputDom.value;
		this.#userValues.role = this.roleInputDom.value;
		this.#userValues.office = this.officeInputDom.value;
		this.#userValues.status = this.statusInputDom.value;
	}
	#clearAddUserInputs() {
		this.addUserFormDom.value = "";
		this.cinInputDom.value = "";
		this.firstNameInputDom.value = "";
		this.lastNameInputDom.value = "";
		this.emailInputDom.value = "";
		this.passwordInputDom.value = "";
		this.roleInputDom.value = "";
		this.officeInputDom.value = "";
		this.statusInputDom.value = "";
	}

	async #addNewUserApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.post(
				`${baseUrl}register/`,

				this.#userValues,

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

	async manageAddNewUser() {
		this.#fillAddUserFormValues();

		try {
			let data = await this.#addNewUserApi();
			let user = data.user;
			const userHtmlStructure = clsTable.getUserHtmlStructure(user);
			this.usersContainerDom.insertAdjacentHTML("beforeend", userHtmlStructure);

			this.#clearAddUserInputs();
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
	const addUserObject = new clsAddUserForm(tableObject.tableContainerContentDom);
});

window.addEventListener("resize", () => {
	tableObject.handelTableResponsive();
});
