export function valida(input) {
  const tipoDeInput = input.dataset.tipo;

  // Agregar validación para 'select'
  if (tipoDeInput === "provincia") {
    validarSelect(input);
  } else if (validadores[tipoDeInput]) {
    validadores[tipoDeInput](input);
  }

  const mensajeErrorElemento = input.parentElement.querySelector(
    ".input-message-error"
  );

  if (input.validity.valid) {
    input.parentElement.classList.remove("input-container--invalid");
    if (mensajeErrorElemento) {
      mensajeErrorElemento.innerHTML = "";
    }
  } else {
    input.parentElement.classList.add("input-container--invalid");
    if (mensajeErrorElemento) {
      mensajeErrorElemento.innerHTML = mostrarMensajeDeError(
        tipoDeInput,
        input
      );
    }
  }
}

// Función de validación para el select
function validarSelect(select) {
  if (select.value === "") {
    select.setCustomValidity("Este campo no puede estar vacío");
  } else {
    select.setCustomValidity("");
  }
}

const tipoDeErrores = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "customError",
];

const mensajeDeError = {
  nombre: {
    valueMissing: "Este campo no puede estar vacío",
  },
  email: {
    valueMissing: "",
    typeMismatch: "El correo no es válido",
  },
  numero: {
    valueMissing: "",
    patternMismatch: "El formato requerido es de 10 números",
  },
  cpDestino: {
    valueMissing: "",
    customError: `Código Postal inválido - <a Href="https://www.correoargentino.com.ar/formularios/cpa"> Buscar CP <i class="fa-solid fa-arrow-right"></i></a>`,
  },
};

const validadores = {
  dato: (input) => validarDato(input),
  provincia: (input) => validarSelect(input), // Agregar validación específica
  cpDestino: (input) => validarCpDestino(input),
};

function mostrarMensajeDeError(tipoDeInput, input) {
  let mensaje = "";
  tipoDeErrores.forEach((error) => {
    if (input.validity[error]) {
      mensaje = mensajeDeError[tipoDeInput][error];
    }
  });
  return mensaje;
}

// Agregar validación específica para cpDestino
function validarCpDestino(input) {
  // Validación específica para el código postal, si es necesario
}
