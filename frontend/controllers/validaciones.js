export function valida(input) {
    const tipoDeInput = input.dataset.tipo;
    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input);
    }

    const mensajeErrorElemento = input.parentElement.querySelector(".input-message-error");

    if (input.validity.valid) {
        input.parentElement.classList.remove("input-container--invalid");
        if (mensajeErrorElemento) {
            mensajeErrorElemento.innerHTML = "";
        }
    } else {
        input.parentElement.classList.add("input-container--invalid");
        if (mensajeErrorElemento) {
            mensajeErrorElemento.innerHTML = mostrarMensajeDeError(tipoDeInput, input);
        }
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
        valueMissing: "Este campo no puede estar vacio"
        
    },
    email: {
        valueMissing: "Este campo no puede estar vacio",
        typeMismatch: "El correo no es valido"
    },
    numero: {
        valueMissing: "Este campo no puede estar vacio",
        patternMismatch: "El formato requerido es de 10 numeros"
    },
}

const validadores = {
    nacimiento: (input) => validarNacimiento(input),
}

function mostrarMensajeDeError(tipoDeInput, input) {
    let mensaje = ""
    tipoDeErrores.forEach((error) => {
        if(input.validity[error]) {
            console.log(tipoDeInput,error);
             console.log(input.validity[error]);
             console.log(mensajeDeError[tipoDeInput][error]);
             mensaje = mensajeDeError[tipoDeInput][error];
             

        }
    })
    return mensaje
}

