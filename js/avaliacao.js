const starContainer = document.getElementById("star-rating");
    const hiddenInput = document.getElementById("nota");
    const starTemplate = document.getElementById("star-template").content;

    let currentRating = 0;

    for (let i = 1; i <= 5; i++) {
      const star = starTemplate.cloneNode(true).querySelector("svg");
      star.dataset.value = i;
      star.addEventListener("click", () => {
        currentRating = i;
        hiddenInput.value = i;
        updateStars();
      });
      starContainer.appendChild(star);
    }

    function updateStars() {
      const stars = starContainer.querySelectorAll("svg");
      stars.forEach((star, index) => {
        star.classList.toggle("text-yellow-400", index < currentRating);
        star.classList.toggle("text-gray-300", index >= currentRating);
      });
    }