const btn = document.querySelector("#input-form-button");
btn.addEventListener("click", (event) => {
  event.preventDefault();

  // hämtar och/eller nollställer resultat, sökfält och eventuella felmeddelanden
  const imgContainer = document.querySelector("#img-container");
  imgContainer.innerText = "";
  const textInput = document.querySelector("#text-input");
  const text = textInput.value;
  textInput.value = "";
  const amountInput = document.querySelector("#number-input").value;
  const sizeInput = document.querySelector("#size-input").value;
  const sortInput = document.querySelector("#sort-input").value;
  const inputErrorMessage = document.querySelector("#input-error-message");
  const generalErrorMessage = document.querySelector("#general-error-message");
  const noResultsErrorMessage = document.querySelector("#no-results-error-message");
  generalErrorMessage.style.display = "none";
  noResultsErrorMessage.style.display = "none";

  const loading = {
    targets: "#animation",
    rotateZ: "360deg",
    keyframes: [{ scale: 1.2 }, { scale: 1 }],
    loop: true,
    easing: "linear",
    duration: 2000,
  };
  const loadingAnimation = anime(loading);
  const animation = document.querySelector("#animation");

  // visar felmeddelande om nödvändiga fält inte är ifyllda, hämtar annars data från API
  if (text == "") {
    inputErrorMessage.style.display = "block";
  } else {
    inputErrorMessage.style.display = "none";
    animation.style.display = "block";
    loadingAnimation.play();

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=358be4901f416ebee58ec9ab473d4b4d&text=${text}&sort=${sortInput}&per_page=${amountInput}&format=json&nojsoncallback=1`;

    fetch(url)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw "Error";
        }
      })
      .then((searchResult) => {
        // felmeddelande om sökningen gav noll resultat
        if (searchResult.photos.photo.length == 0) {
          noResultsErrorMessage.style.display = "block";
          animation.style.display = "none";
          loadingAnimation.restart();
          loadingAnimation.pause();
        } else {
          animation.style.display = "none";
          loadingAnimation.restart();
          loadingAnimation.pause();

          const photoArr = searchResult.photos.photo;
          photoArr.forEach((result) => {
            const imgCard = document.createElement("div");
            const resultImg = document.createElement("img");
            imgContainer.append(imgCard);
            imgCard.append(resultImg);
            resultImg.src = `https://live.staticflickr.com/${result.server}/${result.id}_${result.secret}_${sizeInput}.jpg`;
            resultImg.classList.add("small-img");
            imgCard.classList.add("small-card");
            resultImg.addEventListener("click", enlargeOrShrink);
          });
        }
      })
      .catch((error) => {
        console.log(error);
        animation.style.display = "none";
        loadingAnimation.restart();
        loadingAnimation.pause();
        generalErrorMessage.style.display = "block";
      });
  }
});

// bilden förstoras/förminskas vid klick beroende på om den redan är stor/liten
function enlargeOrShrink(event) {
  const darkBackground = document.querySelector("#dark-background");

  if (event.target.classList[0] == "small-img") {
    darkBackground.classList.add("dark-background");
    event.target.parentNode.classList.add("large-card");
    event.target.parentNode.classList.remove("small-card");
    event.target.classList.remove("small-img");
    event.target.classList.add("large-img");
    event.target.parentNode.style.top = window.scrollY + "px";
  } else if (event.target.classList[0] == "large-img") {
    darkBackground.classList.remove("dark-background");
    event.target.parentNode.classList.add("small-card");
    event.target.parentNode.classList.remove("large-card");
    event.target.classList.add("small-img");
    event.target.classList.remove("large-img");
  }
}