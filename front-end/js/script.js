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

	static async  alertHint(msg, mode="success") {
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
}

class clsLocalStorage {
	static setUser(token, userInfo) {
		localStorage.setItem("token", token);
		localStorage.setItem("userInfo", JSON.stringify(userInfo));
	}
	static getToken() {
		return localStorage.getItem("token");
	}

	static getUserInfo() {
		const userInfo = localStorage.getItem("userInfo");
		return userInfo ? JSON.parse(userInfo) : null;
	}
	static dropUserFromLocalStorage() {
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
	}
}

// user class :
class clsUser {
	// Checks if the user is logged in based on the presence of a token and username in localStorage
	static isLogin() {
		return Boolean(localStorage.getItem("token") && localStorage.getItem("userInfo"));
	}

	static async #loginApi(email, password) {
		try {
			console.log("the  url : ",`${baseUrl}/login/`)
			const response = await axios.post(`${baseUrl}/login`, {
				email: email,
				password: password,
			});

			const data = response.data;
			return data;
		} catch (error) {
			// Handle error and display message
			if (error.response && error.response.data && error.response.data.error) {
				throw { message: error.response.data.error, type: "warning" };
			} else {
				console.log(error);
				throw { message: "An unexpected error occurred.", type: "danger" };
			}
		}
	}

	static async manageUserLogin(email, password) {
		try{
			const data = await this.#loginApi(email, password);
			clsLocalStorage.setUser(data.token, data.user);
			clsPage.goToDashboardPage();

		}catch(error){
			clsUtile.alertHint(error.message, error.type);
		}

	}
	static manageUserSignOut() {}
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
	static #isAuthPage() {
		//  all pages except login page  are consider auth pages  :
		return !this.isPage("index.html");
	}
	static managePreventAccessAuthPage() {
		if (this.#isAuthPage() && !clsUser.isLogin()) this.goToDashboardPage();
	}
	static managePreventAccessToLoginPage() {
		// if the user is already login we should go to dashboard page :
		if (clsUser.isLogin() && this.isLoginPage()) this.goToPage("dashboard.html");
	}
}

// Bind the method to ensure 'this' refers to clsPage when called
window.addEventListener("load", () => {
	clsPage.managePreventAccessAuthPage();
	clsPage.managePreventAccessToLoginPage();
});

async function test() {

	clsUser.manageUserLogin("Nice@gmail.com","nice12")
}

test();

