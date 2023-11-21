async function fetchData() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}

async function genererProjets(projets) {
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
  let projets = await fetchData();
  genererProjets(projets);
}

function resetGallery() {
  document.querySelector(".gallery").innerHTML = "";
}

async function filtrerProjets(evt) {
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
