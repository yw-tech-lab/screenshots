const carousels = document.querySelectorAll(".carousel-container");
carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector(".next-btn");
    const prevButton = carousel.querySelector(".prev-btn");

    let currentIndex = 0;

    const moveToSlide = (index) => {
        console.log("moveToSlide");
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        track.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
    };

    nextButton.addEventListener("click", () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener("click", () => {
        moveToSlide(currentIndex - 1);
    });
});
