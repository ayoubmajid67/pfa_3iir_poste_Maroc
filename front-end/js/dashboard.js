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

		this.sidebarButtonsDom = this.sidebarDom.querySelectorAll(".sidebar button");
		this.#AddClickButtonsEvent();
	}

	#AddClickButtonsEvent() {
		this.sidebarButtonsDom.forEach((button) => {
            if (this.#isSignOutBtn(button)) this.#AddSignOutBtnClickEvent(button);

            else{
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
		SignOutBtnDom.addEventListener("click",()=>{
            clsUser.manageUserSignOut(); 
        })
	}
    
}

const sidebarObject = new SideBarClass();
