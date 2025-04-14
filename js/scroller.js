const screenshots = document.querySelectorAll(".screenshot");
screenshots.forEach((screenshot) => {
    let isDragging = false;
    let startY = 0;
    let scrollPosition = 0;
    let isHandleDragging = false;

    const container = screenshot.parentElement;
    const scrollHandle = container.querySelector(".scroll-handle");
    const scrollIndicator = container.querySelector(".scroll-indicator");

    // Calculate max scroll when image loads
    const getMaxScroll = () => screenshot.height - container.clientHeight;

    function updateScrollHandlePosition() {
        const maxScroll = getMaxScroll();
        if (maxScroll <= 0) return;

        const scrollPercent = -scrollPosition / maxScroll;
        const handleTrackHeight = scrollIndicator.clientHeight;
        const handleHeight = scrollHandle.clientHeight;
        const maxHandleTravel = handleTrackHeight - handleHeight;

        scrollHandle.style.top = `${scrollPercent * maxHandleTravel}px`;
    }

    function updateImageFromHandle(clientY) {
        const handleTrackHeight = scrollIndicator.clientHeight;
        const handleHeight = scrollHandle.clientHeight;
        const maxHandleTravel = handleTrackHeight - handleHeight;
        const maxScroll = getMaxScroll();

        // Get handle position relative to scroll indicator
        const scrollIndicatorRect = scrollIndicator.getBoundingClientRect();
        const relativeY = clientY - scrollIndicatorRect.top - handleHeight / 2;

        // Constrain handle position
        const handlePosition = Math.max(
            0,
            Math.min(relativeY, maxHandleTravel)
        );

        // Convert handle position to image scroll position
        const scrollPercent = handlePosition / maxHandleTravel;
        scrollPosition = -scrollPercent * maxScroll;

        // Update UI
        scrollHandle.style.top = `${handlePosition}px`;
        screenshot.style.transform = `translateY(${scrollPosition}px)`;
    }

    function startImageDragging(e) {
        isDragging = true;
        isHandleDragging = false;
        startY = e.clientY - scrollPosition;
        screenshot.style.cursor = "grabbing";
        scrollHandle.style.cursor = "grabbing";
    }

    function startHandleDragging(e) {
        isDragging = true;
        isHandleDragging = true;
        scrollHandle.style.cursor = "grabbing";
        e.stopPropagation();
        updateImageFromHandle(e.clientY);
    }

    function drag(e) {
        if (!isDragging) return;

        const maxScroll = getMaxScroll();
        if (maxScroll <= 0) return;

        if (isHandleDragging) {
            updateImageFromHandle(e.clientY);
        } else {
            scrollPosition = e.clientY - startY;
            scrollPosition = Math.max(Math.min(scrollPosition, 0), -maxScroll);
            screenshot.style.transform = `translateY(${scrollPosition}px)`;
            updateScrollHandlePosition();
        }
    }

    function stopDragging() {
        isDragging = false;
        isHandleDragging = false;
        screenshot.style.cursor = "grab";
        scrollHandle.style.cursor = "grab";
    }

    // Mouse events for screenshot
    screenshot.addEventListener("mousedown", startImageDragging);

    // Mouse events for scroll handle
    scrollHandle.addEventListener("mousedown", startHandleDragging);

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDragging);

    // Touch events
    screenshot.addEventListener("touchstart", (e) => {
        startImageDragging(e.touches[0]);
    });
    scrollHandle.addEventListener("touchstart", (e) => {
        startHandleDragging(e.touches[0]);
        e.preventDefault();
    });
    document.addEventListener(
        "touchmove",
        (e) => {
            drag(e.touches[0]);
            e.preventDefault();
        },
        { passive: false }
    );
    document.addEventListener("touchend", stopDragging);

    // Set initial cursor styles
    screenshot.style.cursor = "grab";
    scrollHandle.style.cursor = "grab";

    // Initialize handle position when image loads
    if (screenshot.complete) {
        updateScrollHandlePosition();
    } else {
        screenshot.addEventListener("load", updateScrollHandlePosition);
    }
});
