// if (isLogin()) {
// 	window.location = "/chatbot.html";
// }

const loginForm = document.querySelector("form");
const email = document.querySelector('input[type="email"]');
const password = document.querySelector('input[type="password"]');

class clsLoginForm {
	constructor() {
		this.loginFormDom = document.querySelector("form");
		this.emailInputDom = this.loginFormDom.querySelector(`input[type="email"]`);
		this.passwordInputDom = this.loginFormDom.querySelector(`input[type="password"]`);
		this.togglePasswordIcon = this.loginFormDom.querySelector(`#togglePassword`);
		this.loginBtnDom = this.loginFormDom.querySelector(`input[type="submit"]`);

		this.togglePasswordIcon.addEventListener("click", () => {
			this.#handelPasswordVisibilityIconToggle();
		});
		this.loginFormDom.addEventListener("submit", async (event) => {
			event.preventDefault();
			this.loginBtnDom.disabled = true;
			let [emailValue, passwordValue] = this.#getLoginInputsValue();
			await clsUser.manageUserLogin(emailValue, passwordValue);
			this.loginBtnDom.disabled = false;
		});
	}
	#getLoginInputsValue() {
		return [this.emailInputDom.value, this.passwordInputDom.value];
	}
	#handelPasswordVisibilityIconToggle() {
		clsUtile.handleVisibilityPassword(this.passwordInputDom, this.togglePasswordIcon);
	}
}
const loginFormObject = new clsLoginForm();
