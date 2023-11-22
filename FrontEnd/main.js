async function fetchData() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

function genererProjets(projets) {
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];

    const imageElement = document.createElement("img");
    imageElement.src = projet.imageUrl;

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = projet.title;

    const figure = document.createElement("figure");

    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.appendChild(figure);
    figure.appendChild(imageElement);
    figure.appendChild(figcaptionElement);
  }
}

async function initialiserPage() {
  try {
    let projets = await fetchData();
    genererProjets(projets);
  } catch (error) {
    console.log("error", error);
  }
}

function resetGallery() {
  document.querySelector(".gallery").innerHTML = "";
}

async function filtrerProjets(evt) {
  try {
    let projets = await fetchData();

    if (evt.target.value === "Tous") {
      resetGallery();
      genererProjets(projets);
    } else {
      resetGallery();
      const projetsFiltres = projets.filter(
        (projet) => projet.category.name === evt.target.value
      );
      genererProjets(projetsFiltres);
    }
  } catch (error) {
    console.log("error", error);
  }
}

function login() {
  const formulaireLogin = document.querySelector(".formulaire-login");
  formulaireLogin.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const authentifiant = {
      email: evt.target.querySelector("[name=email]").value,
      password: evt.target.querySelector("[name=password]").value,
    };

    const chargeUtile = JSON.stringify(authentifiant);

    try {
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile,
      }).then((res) => {
        if (res.status == 404) {
          let formError = document.getElementById("form-error");
          formError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
          setTimeout(() => {
            formError.innerHTML = "";
          }, 3550);
        } else {
          res
            .json()
            .then((data) => window.localStorage.getItem(data))
            .then((location.href = "index.html#home"));
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  });
}

const btns = document.querySelectorAll(".btn-filters");

btns.forEach((element) =>
  element.addEventListener("click", (evt) => {
    filtrerProjets(evt);
    document.querySelector(".active").classList.remove("active");
    element.classList.add("active");
  })
);

initialiserPage();

login();