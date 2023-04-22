if (!localStorage.token) {
  location.replace("./index.html");
}

window.addEventListener("load", function () {
  const btnCerrarSesion = document.getElementById("closeApp");
  const token = JSON.parse(localStorage.token);
  const urlDatosUsuario = "https://todo-api.ctd.academy/v1/users/getMe";
  const urlTareas = "https://todo-api.ctd.academy/v1/tasks";
  const formCrearTarea = document.querySelector("form");
  const tituloTareaFinalizada = document.querySelector("h2");

  obtenerNombreUsuario();
  renderizarSkeletons(6, ".tareas-pendientes");

  formCrearTarea.style.display = "none";
  tituloTareaFinalizada.style.display = "none";

  setTimeout(function () {
    consultarTareas();
    formCrearTarea.style.display = "flex";
    tituloTareaFinalizada.style.display = "flex";
  }, 3000);

  //Cerrar sesión

  btnCerrarSesion.addEventListener("click", function () {
    Swal.fire({
      title: "¿Esta seguro que desea cerrar sesion?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        Swal.fire({
          title: "¡Hasta luego!",
          text: "¡Esperamos verte pronto!",
          icon: "success",
          showConfirmButton: false,
        });
        setTimeout(function () {
          localStorage.clear();
          location.replace("./index.html");
        }, 3000);
      }
    });
  });

  //Obtener nombre de usuario

  function obtenerNombreUsuario() {
    const configuraciones = {
      method: "GET",
      headers: {
        authorization: token,
      },
    };

    fetch(urlDatosUsuario, configuraciones)
      .then((response) => {
        if (response.status == 404) {
          console.log("El usuario no existe");
        }

        if (response.status == 500) {
          console.log("Error del servidor");
          location.href = "./server-error.html";
        }

        return response.json();
      })
      .then((data) => {
        renderizarNombreUsuario(data);
      })
      .catch((error) => console.log(error));
  }

  function renderizarNombreUsuario(datosUsuario) {
    const username = document.querySelector(".user-info p");
    username.innerHTML = `${datosUsuario.firstName} ${datosUsuario.lastName}`;
  }

  //Obtener listado de tareas

  function consultarTareas() {
    const configuraciones = {
      method: "GET",
      headers: {
        authorization: token,
      },
    };

    fetch(urlTareas, configuraciones)
      .then((response) => {
        if (response.status == 401) {
          console.log("Requiere Autorización");
        }

        if (response.status == 500) {
          console.log("Error del servidor");
          location.href = "./server-error.html";
        }
        return response.json();
      })
      .then((data) => {
        renderizarTareas(data);
        botonesCambioEstado();
        botonBorrarTarea();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Crear nueva tarea

  formCrearTarea.addEventListener("submit", function (event) {
    const inputNuevaTarea = document.getElementById("nuevaTarea");

    const inputTarea = normalizarTextoTarea(inputNuevaTarea.value);
    event.preventDefault();

    const datosTarea = {
      description: inputTarea,
      completed: false,
    };

    const configuraciones = {
      method: "POST",
      headers: {
        authorization: token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(datosTarea),
    };

    fetch(urlTareas, configuraciones)
      .then((response) => {
        if (response.status == 400) {
          console.log("Alguno de los datos requeridos está incompleto");
        }

        if (response.status == 401) {
          console.log("Requiere Autorización");
        }

        if (response.status == 500) {
          console.log("Error del servidor");
          location.href = "./server-error.html";
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        consultarTareas();
      })
      .catch((error) => {
        console.log(error);
      });

    formCrearTarea.reset();
  });

  //Renderizar tareas en pantalla

  function renderizarTareas(listado) {
    const tareasPendientes = document.querySelector(".tareas-pendientes");
    const tareasFinalizadas = document.querySelector(".tareas-terminadas");
    const cantidadFinalizadas = document.getElementById("cantidad-finalizadas");

    tareasPendientes.innerHTML = "";
    tareasFinalizadas.innerHTML = "";

    let contador = 0;
    cantidadFinalizadas.innerHTML = contador;

    listado.forEach((tarea) => {
      let fecha = new Date(tarea.createdAt);

      if (tarea.completed) {
        contador++;
        tareasFinalizadas.innerHTML += `
        <li class="tarea">
          <div class="hecha">
            <button><i class="fa-regular fa-circle-check"></i></button>
          </div>
          <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}"><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
          </div>
        </div>
        </li>`;
      } else {
        tareasPendientes.innerHTML += `
        <li class="tarea">
          <button class="change" id="${
            tarea.id
          }"><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <span class="timestamp">${fecha.toLocaleString()}</span>
          </div>
        </li>`;
      }

      cantidadFinalizadas.innerHTML = contador;
    });
  }

  // Cambiar estado de tarea

  function botonesCambioEstado() {
    const botonCambioEstado = document.querySelectorAll(".change");

    botonCambioEstado.forEach((boton) => {
      boton.addEventListener("click", function (evento) {
        const id = evento.target.id;
        const payload = {};

        if (evento.target.classList.contains("incompleta")) {
          payload.completed = false;
        } else {
          payload.completed = true;
        }

        const configuraciones = {
          method: "PUT",
          headers: {
            authorization: token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(payload),
        };

        fetch(`${urlTareas}/${id}`, configuraciones)
          .then((response) => {
            if (response.status == 400) {
              console.log("ID Invalido");
            }

            if (response.status == 401) {
              console.log("Requiere Autorización");
            }

            if (response.status == 404) {
              console.log("Tarea inexistente");
            }

            if (response.status == 500) {
              console.log("Error del servidor");
              location.href = "./server-error.html";
            }
            return response.json();
          })
          .then((data) => {
            consultarTareas();
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  }

  // Eliminar tarea

  function botonBorrarTarea() {
    const botonesBorrar = document.querySelectorAll(".borrar");

    botonesBorrar.forEach((boton) => {
      boton.addEventListener("click", function (evento) {
        Swal.fire({
          title: "¿Esta seguro que desea borrar la tarea?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#008000",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirmar",
          cancelButtonText: "Cancelar",
        }).then((resultado) => {
          if (resultado.isConfirmed) {
            const id = evento.target.id;

            const configuraciones = {
              method: "DELETE",
              headers: {
                authorization: token,
              },
            };

            fetch(`${urlTareas}/${id}`, configuraciones)
              .then((response) => {
                if (response.status == 400) {
                  console.log("ID Invalido");
                }

                if (response.status == 401) {
                  console.log("Requiere Autorización");
                }

                if (response.status == 404) {
                  console.log("Tarea inexistente");
                }

                if (response.status == 500) {
                  console.log("Error del servidor");
                  location.href = "./server-error.html";
                }

                return response.json();
              })
              .then((data) => {
                consultarTareas();
              })
              .catch((error) => {
                console.log(error);
              });

            Swal.fire({
              title: "Tarea eliminada",
              icon: "success",
            });
          }
        });
      });
    });
  }
});
