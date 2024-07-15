document.addEventListener("DOMContentLoaded", function() {
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
