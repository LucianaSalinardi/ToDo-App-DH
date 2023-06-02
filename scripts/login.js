window.addEventListener("load", function () {
  const form = document.querySelector("form");
  const urlLogin = "https://todo-api.ctd.academy/v1/users/login";
  const passwordError = document.getElementById("errorPassword");

  form.addEventListener("submit", function (event) {

    event.preventDefault();
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");

    const inputEmailValue = inputEmail.value.trim();
    const inputPasswordValue = inputPassword.value.trim();

    if (passwordError.lastChild.nodeName == "P") {
      passwordError.removeChild(passwordError.lastChild);
    }

    mostrarSpinner();
    setTimeout(() => {

      if((inputEmailValue != null && inputEmailValue != "") && inputPasswordValue != null && inputPasswordValue != ""){
        const datos = {
          email: inputEmailValue,
          password: inputPasswordValue,
        };
  
        const settings = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(datos),
        };
  
        realizarLogin(settings);
  
        form.reset();
      }else{
        ocultarSpinner();
      }
      
    }, 3000);
  });

  //Login

  function realizarLogin(settings) {
    fetch(urlLogin, settings)
      .then((response) => {
        if (response.status == 400 || response.status == 404) {
          ocultarSpinner();
          passwordError.innerHTML += `<p><small>Algunos de los datos son incorrectos o el usuario no existe</small></p>`;
        }

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
