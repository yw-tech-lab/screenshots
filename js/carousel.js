const carousels = document.querySelectorAll(".carousel-container");
carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector(".next-btn");
    const prevButton = carousel.querySelector(".prev-btn");

    let currentIndex = 0;

    const moveToSlide = (index) => {
        console.log("moveToSlide");
        
        // Calculate the actual width of a slide including its full width + gap
        const slideWidth = slides[0].offsetWidth;
        const slideGap = parseInt(window.getComputedStyle(track).gap) || 0;
        
        // Calculate how many slides are visible at once
        const containerWidth = carousel.clientWidth - 120; // Subtract padding (60px on each side)
        const slidesPerView = Math.round(containerWidth / (slideWidth + slideGap));
        
        // Adjust the maximum index based on visible slides
        const maxIndex = Math.max(0, slides.length - slidesPerView);

        // Handle wrapping after calculating maxIndex
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;
        
        currentIndex = index;
        const totalSlideWidth = slideWidth + slideGap;
        track.style.transform = `translateX(-${currentIndex * totalSlideWidth}px)`;
    };

    nextButton.addEventListener("click", () => {
        moveToSlide(currentIndex + 1);
    });

    prevButton.addEventListener("click", () => {
        moveToSlide(currentIndex - 1);
    });
});
