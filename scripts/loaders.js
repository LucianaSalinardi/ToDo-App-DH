function mostrarSpinner() {
  const body = document.querySelector("body");
  const containerForm = document.querySelector("div.container");

  const spinnerContainer = document.createElement("div");
  const spinner = document.createElement("div");

  spinnerContainer.setAttribute("id", "contenedor-carga");
  spinner.setAttribute("id", "carga");

  containerForm.classList.add("hidden");

  spinnerContainer.appendChild(spinner);
  body.appendChild(spinnerContainer);

  return;
}

function ocultarSpinner() {
  const body = document.querySelector("body");
  const containerForm = document.querySelector("div.container");

  const spinnerContainer = document.getElementById("contenedor-carga");
  body.removeChild(spinnerContainer);

  containerForm.classList.remove("hidden");

  return;
}

function renderizarSkeletons(cantidad, contenedor) {
  const contenedorTareas = document.querySelector(contenedor);

  const skeletons = Array.from({ length: cantidad });

  skeletons.forEach(() => {
    const template = `
        <li class="skeleton-container ${contenedor.replace(".", "")}-child">
            <div class="skeleton-card">
            <p class="skeleton-text"></p>
            <p class="skeleton-text"></p>
            </div>
        </li>
        `;

    contenedorTareas.innerHTML += template;
  });
}
