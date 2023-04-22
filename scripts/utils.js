function normalizarTextoTarea(texto) {
  return texto.toLowerCase();
}

function validarEmail(email) {
  normalizarEmail(email);
  return email.includes("@");
}
function normalizarEmail(email) {
  email.toLowerCase();
}
function validarNombreApellido(nombre) {
  return nombre.length >= 3;
}

function validarContrasenia(contrasenia) {
  let regex = new RegExp("^[a-z0-9]{6,14}[^s][^$%&|<>#]$");
  normalizarContrasenia(contrasenia);

  return regex.test(contrasenia);
}
function normalizarContrasenia(contrasenia) {
  contrasenia.toLowerCase();
}
function compararContrasenias(contrasenia_1, contrasenia_2) {
  normalizarContrasenia(contrasenia_1);
  normalizarContrasenia(contrasenia_2);
  return contrasenia_1 === contrasenia_2;
}

function normalizarNombreApellido(nombre) {
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}
