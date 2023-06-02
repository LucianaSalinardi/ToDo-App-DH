window.addEventListener("load", function () {
  const form = document.querySelector("form");
  const urlSignUp = "https://todo-api.ctd.academy/v1/users";
  const errorNombre = document.getElementById("errorNombre");
  const errorApellido = document.getElementById("errorApellido");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorContrasenia");
  const errorRepetirPassword = document.getElementById("repetirContrasenia");

  const divErrores = document.querySelectorAll(".errores div");

  divErrores.forEach((elemento) => {
    elemento.classList.add("borrarError");
  });

  form.addEventListener("submit", function (event) {
    const inputNombre = document.getElementById("inputNombre");
    const inputApellido = document.getElementById("inputApellido");
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");
    const contraseniaRepetida = document.getElementById(
      "inputPasswordRepetida"
    );

    event.preventDefault();

    const errores = document.querySelectorAll(".borrarError");

    errores.forEach((error) => {
      if (error.lastChild.nodeName == "P") {
        error.removeChild(error.lastChild);
      }
    });

    mostrarSpinner();

    setTimeout(() => {
      const datos = {
        firstName: normalizarPrimerLetraEnMayuscula(inputNombre.value.trim()),
        lastName: normalizarPrimerLetraEnMayuscula(inputApellido.value.trim()),
        email: inputEmail.value.trim(),
        password: inputPassword.value.trim(),
      };

      const settings = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(datos),
      };

      if (!validarNombreApellido(datos.firstName)) {
        errorNombre.innerHTML += `<p><small>El nombre debe contener un minimo de 3 caracteres</small></p>`;
      }
      if (!validarNombreApellido(datos.lastName)) {
        errorApellido.innerHTML += `<p><small>El apellido debe contener un minimo de 3 caracteres</small></p>`;
      }

      if (!validarEmail(datos.email)) {
        errorEmail.innerHTML += `<p><small>El email es incorrecto o el usuario ya se encuentra registrado</small></p>`;
      }
      if (!validarContrasenia(datos.password)) {
        errorPassword.innerHTML += `<p><small>La contraseña no cumple con los caracteres válidos</small></p>`;
      }

      if (!compararContrasenias(datos.password, contraseniaRepetida.value)) {
        errorRepetirPassword.innerHTML += `<p><small>Las contraseñas no coinciden</small></p>`;
      }

      if (
        validarNombreApellido(datos.firstName) &&
        validarNombreApellido(datos.lastName) &&
        validarEmail(datos.email) &&
        validarContrasenia(datos.password) &&
        compararContrasenias(datos.password, contraseniaRepetida.value)
      ) {
        realizarRegister(settings);
      } else {
        ocultarSpinner();
      }

      form.reset();
    }, 3000);
  });

  //Signup

  function realizarRegister(settings) {
    fetch(urlSignUp, settings)
      .then((response) => {
        if (response.status == 500) {
          console.log("Error del servidor");
          location.href = "./server-error.html";
        }
        return response.json();
      })
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("token", JSON.stringify(data.jwt));
          ocultarSpinner();
          location.replace("./mis-tareas.html");
        }
      })
      .catch((error) => {
        console.log(error);
        ocultarSpinner();
      });
  }
});
