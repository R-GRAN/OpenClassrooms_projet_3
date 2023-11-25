/* Fonction gerant l'appel à l'API */
async function fetchData() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
}

/* Fonction generant la gallery */
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

    /*     const modal_wrapper_Gallery = document.querySelector(
      ".modal-wrapper-gallery"
    );
    modal_wrapper_Gallery.appendChild(imageElement); */
  }
}

/* Fonction generant la gallery de la modale */
function genererProjetsModal(projets) {
  const modal_wrapper_Gallery = document.querySelector(
    ".modal-wrapper-gallery"
  );
  modal_wrapper_Gallery.innerHTML = "";

  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];

    const figureModal = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = projet.imageUrl;
    imageElement.dataset.id = projet.id;

    modal_wrapper_Gallery.appendChild(figureModal);
    figureModal.appendChild(imageElement);

    const poubelle = document.createElement("i");

    figureModal.addEventListener("click", (evt) => supprimerProjet(evt));

    poubelle.classList.add("fa-solid", "fa-trash-can");
    figureModal.appendChild(poubelle);
  }
}

/* Fonction permettant de supprimer un projet */
function supprimerProjet(evt) {
  const id = evt.target.dataset.id;
  const ParsedToken = JSON.parse(token);
  try {
    fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${ParsedToken.token}` },
    }).then((res) => {
      if (!res.ok) {
        (error) => console.log("error", error);
      } else {
        fetchData().then((res) => genererProjetsModal(res));
      }
    });
  } catch (error) {
    console.log("error", error);
  }
}

/* Fonction generant la gallery au début du chargement de la page */
async function initialiserPage() {
  try {
    let projets = await fetchData();
    genererProjets(projets);
  } catch (error) {
    console.log("error", error);
  }
}

/* Fonction effacant la gallery */
function resetGallery() {
  document.querySelector(".gallery").innerHTML = "";
}

/* Fonction filtrant et affichant les projets selon le clic sur les filtres  */
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

/* Fonction enregistrant le token dans le localStorage */
function storeToken(data) {
  localStorage.setItem("token", JSON.stringify(data));
}

/* Fonction permettant de se connecter */
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
        if (!res.ok) {
          res.json().then((error) => console.log("error", error));

          let formError = document.getElementById("form-error");
          formError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
          setTimeout(() => {
            formError.innerHTML = "";
          }, 3550);
        } else {
          res
            .json()
            .then((data) => storeToken(data))
            .then((location.href = "index.html"));
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  });
}

/* Modale */

let modal = null;

async function openModal(evt) {
  evt.preventDefault();
  let projets = await fetchData();
  genererProjetsModal(projets);
  let target = document.querySelector(evt.target.getAttribute("href"));
  target.style.display = null;
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
}

function closeModal(evt) {
  if (modal === null) return;
  evt.preventDefault();
  modal.style.display = "none";
  modal = null;
}

function stopPropagation(evt) {
  evt.stopPropagation();
}

/* Filtre*/
const btns = document.querySelectorAll(".btn-filters");

btns.forEach((element) =>
  element.addEventListener("click", (evt) => {
    filtrerProjets(evt);
    document.querySelector(".active").classList.remove("active");
    element.classList.add("active");
  })
);

initialiserPage();

let token = localStorage.getItem("token");

if (token !== null) {
  const log = document.getElementById("inAndOut");
  log.innerText = "logout";

  const banner = document.getElementById("editor-banner");
  banner.style.display = "flex";

  const filters = document.getElementById("filters");
  filters.style.display = "none";

  const modal_link = document.querySelector(".modal-link");
  modal_link.style.display = "";
  modal_link.addEventListener("click", openModal);
}

login();
