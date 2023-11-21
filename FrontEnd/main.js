const fetchData = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  
  genererProjets(data)

};

const genererProjets = (projets) => {
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
};

fetchData()