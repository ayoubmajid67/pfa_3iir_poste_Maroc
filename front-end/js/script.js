const baseUrl = "http://127.0.0.1:8000/api/";

class clsUtile {
	// Toggles the visibility of a password input field and changes the icon
	static handleVisibilityPassword(passwordInput, togglePassword) {
		// Toggle the type attribute
		const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
		passwordInput.setAttribute("type", type);

		// Toggle the icon
		togglePassword.classList.toggle("fa-eye");
		togglePassword.classList.toggle("fa-eye-slash");
	}

	// Retrieves URL parameters as an object
	static getURLParameters() {
		var searchParams = new URLSearchParams(window.location.search);
		var params = {};

		// Iterate over all the query parameters
		for (let [key, value] of searchParams) {
			params[key] = value;
		}
		return params;
	}

	// Automatically resizes a textarea based on its content
	static autoResize(textarea) {
		textarea.rows = 1;
		let rows = Math.floor((textarea.scrollHeight - 45) / 23) + 1;
		if (rows <= 15) {
			textarea.rows = rows;
		} else {
			textarea.rows = 15;
		}
	}

	// Updates the URL without reloading the page
	static updateURLWithoutReload(url) {
		// Use pushState to update the URL without reloading the page
		history.pushState(null, null, url);
	}

	// Returns a promise that resolves after a specified time
	static wait(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	static scrollToPositionHard(position) {
		document.body.scrollTop = position; // For Safari
		document.documentElement.scrollTop = position; // For Chrome, Firefox, IE, and Opera
	}
	static scrollToTopSmooth() {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	static scrollToTopHard() {
		this.scrollToPositionHard(0);
	}
	static scrollToTopSmooth() {
		scrollToTopSmooth(0);
	}

	static async alertHint(msg, mode = "success") {
		const section = document.querySelector("section.hint ");
		const divAlter = document.querySelector("section.hint > div");
		const alterTitle = document.querySelector("section.hint .alert-title");
		const alterContent = document.querySelector("section.hint .alert-content");

		divAlter.classList.add(`alert-${mode}`);
		alterTitle.innerHTML = mode;
		alterContent.innerText = msg;

		section.classList.add("ActiveAlter");

		await this.wait(100);
		divAlter.id = "ActiveAlter";

		await this.wait(4000);
		divAlter.id = "";
		section.classList.remove("ActiveAlter");
	}
	static switchBtnHandler(btn, newClass, newText, newClickEventFunction,) {
		if (btn) {
			btn.classList = newClass;
			btn.textContent = newText;
			if (newClickEventFunction) btn.setAttribute("onclick", newClickEventFunction);
	
			
		}
	}
	
}

class clsLocalStorage {
	static setUser(token, userInfo) {
		localStorage.setItem("userToken", token);
		localStorage.setItem("userInfo", JSON.stringify(userInfo));
	}
	static setUserInfo(userInfo) {
		localStorage.setItem("userInfo", JSON.stringify(userInfo));
	}
	static getToken() {
		return localStorage.getItem("userToken");
	}

	static getUserInfo() {
		const userInfo = localStorage.getItem("userInfo");
		return userInfo ? JSON.parse(userInfo) : null;
	}
	static dropUserFromLocalStorage() {
		localStorage.removeItem("userToken");
		localStorage.removeItem("userInfo");
	}
	static getRole() {
		const userInfo = this.getUserInfo();
		if (userInfo) return userInfo["role"].trim().toLowerCase();
		else return null;
	}
	static getUsername() {
		const userInfo = this.getUserInfo();
		if (userInfo) return userInfo["first_name"].trim().toLowerCase();
		else return null;
	}
	static getAccountStatus() {
		const userInfo = this.getUserInfo();
		if (userInfo) return userInfo["status"].trim().toLowerCase();
		else return null;
	}
}

// user class :
class clsUser {
	// Checks if the user is logged in based on the presence of a token and username in localStorage
	static usersPages = {
		manager: ["consultation"],
		admin: ["consultation", "tarif", "gestion office", "gestion users"],
		agent: ["envoyé", "consultation"],
	};
	static pagesName = {
		envoyé: "envoi.html",
		consultation: "consultation.html",
		tarif: "Tarif.html",
		"gestion office": "GestionOffice.html",
		"gestion users": "GestionUsers.html",
	};

	static isAdmin() {
		return clsLocalStorage.getRole() == "admin";
	}
	static isLogin() {
		return Boolean(localStorage.getItem("userToken") && localStorage.getItem("userInfo"));
	}

	static async #loginApi(email, password) {
		try {
			const response = await axios.post(`${baseUrl}login/`, {
				email: email,
				password: password,
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

	static async manageUserLogin(email, password) {
		try {
			const data = await this.#loginApi(email, password);
			clsLocalStorage.setUser(data.access, data.user);
			clsPage.goToDashboardPage();
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
	}
	static async #signOutApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.post(
				`${baseUrl}logout/`,
				{}, // empty body
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
			if (error.response && error.response.data && (error.response.data.message || error.response.data.detail)) {
				let message = error.response.data.detail ? error.response.data.detail : error.response.data.message;
				throw { message, type: "warning" };
			} else {
				// console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}
	static async manageUserSignOut() {
		try {
			await this.#signOutApi();
		} catch (error) {
			clsUtile.alertHint(error.message, error.type);
		}
		clsLocalStorage.dropUserFromLocalStorage();
		clsPage.goToLoginPage();
	}
	static async #getUserCriticalInfoApi() {
		let accessToken = clsLocalStorage.getToken();

		try {
			const response = await axios.get(`${baseUrl}user/`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const data = response.data.user;

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
	static async manageGetCriticalUserInfo() {
		try {
			const userInfo = await this.#getUserCriticalInfoApi();

			if (userInfo.role != clsLocalStorage.getRole()) throw { message: "Change User role request rauthentification", type: "warning" };

			clsLocalStorage.setUserInfo(userInfo);
		} catch (error) {
			await clsUtile.alertHint(error.message, error.type);

			await this.manageUserSignOut();
		}
	}
	static isActiveUser() {
		return clsLocalStorage.getAccountStatus() == "actif";
	}
}

class clsPage {
	static goToPage(pageName) {
		if (location.pathname != `/${pageName}`) {
			if (pageName == "index.html") {
				if (location.pathname != "/") location.href = "/";
			} else location.href = pageName;
		}
	}
	static isPage(pageName) {
		return location.pathname == `/${pageName}` || (pageName == "index.html" && location.pathname == `/`);
	}
	static goToLoginPage() {
		this.goToPage("index.html");
	}
	static goToDashboardPage() {
		this.goToPage("dashboard.html");
	}
	static isLoginPage() {
		return this.isPage("index.html");
	}
	static isAuthPage() {
		//  all pages except login page  are consider auth pages  :
		return !this.isPage("index.html");
	}
	static managePreventAccessAuthPage() {
		if (this.isAuthPage() && !clsUser.isLogin()) {
			clsLocalStorage.dropUserFromLocalStorage();
			this.goToLoginPage();
		}
	}
	static managePreventAccessToLoginPage() {
		// if the user is already login we should go to dashboard page :
		if (clsUser.isLogin() && this.isLoginPage()) this.goToPage("dashboard.html");
	}
	static async managePreventAccessToBasicRolePage() {
		if (this.isAuthPage()) await clsUser.manageGetCriticalUserInfo();
	}
}

class clsHeader {
	constructor() {
		this.headerDom = document.querySelector(".navbar");

		this.headerUsernameDom = this.headerDom.querySelector("#username");
		this.headerStatusDom = this.headerDom.querySelector("#status");
		this.siteLogo = this.headerDom.querySelector("#siteLogo");
		this.#fillUserInfoToDom();
		this.siteLogo.addEventListener("click", () => {
			clsPage.goToDashboardPage();
		});
	}

	#fillUserInfoToDom() {
		this.headerUsernameDom.textContent = `username : ${clsLocalStorage.getUsername()}`;
		this.headerStatusDom.textContent = `status : ${clsLocalStorage.getRole()}`;
	}
}
let headerObject = "";
window.addEventListener("load", async () => {
	clsPage.managePreventAccessAuthPage();
	clsPage.managePreventAccessToLoginPage();
	await clsPage.managePreventAccessToBasicRolePage();
	if (clsPage.isAuthPage()) {
		headerObject = new clsHeader();
	}
});
