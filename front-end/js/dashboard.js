document.addEventListener("DOMContentLoaded", function () {
	const movingMessage = document.getElementById("movingMessage");
	const containerWidth = movingMessage.parentElement.offsetWidth;
	const messageWidth = movingMessage.offsetWidth;
	let startPosition = containerWidth;

	function animateMessage() {
		startPosition -= 2; // Speed of the animation
		if (startPosition < -messageWidth) {
			startPosition = containerWidth;
		}
		movingMessage.style.transform = `translateX(${startPosition}px)`;
		requestAnimationFrame(animateMessage);
	}

	animateMessage();
});

//  start dashboardLogic :
class SideBarClass {
	constructor() {
		this.sidebarDom = document.querySelector(".sidebar");
		
		
	 if(clsUser.isActiveUser()){
		this.#addSidebarButtons(); 
		this.#AddClickButtonsEvent();
	 }
	 else{
		this.sidebarDom.innerHTML='<h2>Contact your admin to enable your Account</h2>'
		const signOutOutButtonHtmlStructure=this.#getSignOutBtnHtmlStructure(); 
         this.sidebarDom.insertAdjacentHTML("beforeend",signOutOutButtonHtmlStructure);
		 const signOutBtn=  this.sidebarDom.querySelector("#signOut"); 
		 this.#AddSignOutBtnClickEvent(signOutBtn);
	 }
		
	}

	#getButtonHtmlStructure(pageName) {
		return `
		<button class="sidebar-button"><a href='./${clsUser.pagesName[pageName]}'>${pageName}</a></button>
		`;
	}
	#getSignOutBtnHtmlStructure(){
		return `
		<button class="sidebar-button deconnexion-button" id="signOut">Déconnexion</button>
		`
	}
	
	async #addSidebarButtons(){
        const userRole=clsLocalStorage.getRole();
		clsUser.usersPagesName[userRole].forEach(pageName=>{
                  const htmlStructure=this.#getButtonHtmlStructure(pageName); 
				  this.sidebarDom.insertAdjacentHTML("beforeend",htmlStructure)

		})
		const signOutOutButtonHtmlStructure=this.#getSignOutBtnHtmlStructure(); 
         this.sidebarDom.insertAdjacentHTML("beforeend",signOutOutButtonHtmlStructure);

		 this.sidebarButtonsDom = this.sidebarDom.querySelectorAll(".sidebar button");
	}

	#AddClickButtonsEvent() {
	   
		this.sidebarButtonsDom.forEach((button) => {
			if (this.#isSignOutBtn(button)) this.#AddSignOutBtnClickEvent(button);
			else {
				button.addEventListener("click", () => {
					const BtnAnchorDom = button.querySelector("a");
					if (BtnAnchorDom) BtnAnchorDom.click();
				});
			}
		});
	}

	#isSignOutBtn(button) {
		return button.id == "signOut";
	}
	#AddSignOutBtnClickEvent(SignOutBtnDom) {
		SignOutBtnDom.addEventListener("click", () => {
			clsUser.manageUserSignOut();
		});
	}
}

// main : --------------------------------------
window.addEventListener("load", ()=>{

	const sidebarObject = new SideBarClass();
})


