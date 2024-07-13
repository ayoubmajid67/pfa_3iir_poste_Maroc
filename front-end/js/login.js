// if (isLogin()) {
// 	window.location = "/chatbot.html";
// }





const loginForm = document.querySelector("form");
const email = document.querySelector('input[type="email"]');
const password = document.querySelector('input[type="password"]');

loginForm.addEventListener("submit", async function (event) {
	event.preventDefault();

	const emailValue = email.value;
	const passwordValue = password.value;

	const data = {
		email: emailValue,
		password: passwordValue,
	};

	try {
		const response = await fetch(`${baseUrl}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();

			// pushError(errorData.message);
			return;
		}

		const responseData = await response.json();
		localStorage.setItem("token", responseData.token);
		localStorage.setItem("username", responseData.username);

		window.location.href = "/chatbot.html";
	} catch (error) {
		// pushError(error);
	}
});

const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", function () {
	handelVisibilityPassword(password, this);
});
