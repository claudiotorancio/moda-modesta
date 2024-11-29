import { modalControllers } from "../../modal/modal.js";
import { LoginServices } from "../../services/login_services.js";

export class LoginControllers {
  constructor() {
    this.modal = document.getElementById("modal");
    this.loginInstance = new LoginServices();
  }

  //render modal signin
  renderSignin() {
    modalControllers.baseModal();
    this.renderForm(
      "SignIn",
      "/api/signin",
      "",
      "email",
      "password",
      "",
      "Sign In",
      "No tienes una cuenta?",
      this.signinSubmitHandler
    );

    const btn = document.querySelector("[data-btn]");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderSignup();
    });

    // Añadimos evento para restablecer contraseña
    const resetPasswordLink = document.querySelector("[data-reset-password]");
    resetPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderResetPassword(); // Renderiza el formulario de restablecimiento de contraseña
    });
  }

  // form base para ambos estados
  renderForm(
    title,
    action,
    namePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    titleHolder,
    buttonLabel,
    helpText,
    submitHandler
  ) {
    const loginInicio = this.modal.querySelector("[data-table]");

    // Si namePlaceholder está presente, renderiza el input de nombre
    const nombreInput = namePlaceholder
      ? `<div class="form-group mt-3">
        <input type="text" id="nombre" name="nombre" placeholder="${namePlaceholder}" class="input" required>
     </div>`
      : ""; // Si no, deja el campo vacío

    // Si submitHandler está presente, renderiza el boton
    const btnSignup = submitHandler
      ? `  <p class="help">${helpText} <a href="" data-btn>Sign Up <i class="fa-solid fa-arrow-up-right-from-square"></i></a></p>`
      : ""; // Si no, deja el campo vacío

    loginInicio.innerHTML = `
     <div class="main-container text-center mb-4">
            <div class="text-center">
                <div class="card-header">
                    <h3>${title}</h3>
                </div>
                <div class="card-form">
                    <form action="${action}" method="post" data-signin>
                     ${nombreInput} <!-- Input de nombre solo si es SignUp -->
                        <div class="form-group mt-3">
                            <input type="email" id="email" name="email" placeholder="${emailPlaceholder}" class="input" required >
                        </div>
                        <div class="form-group mt-3">
                            <input type="password" id="password" name="password" placeholder="${passwordPlaceholder}" class="input" required  minlength="8"
                              pattern="(?=.*[0-9])(?=.*[a-zA-Z]).{8,}"  title="${titleHolder}"
                            autocomplete="current-password">
                        </div>
                        <div class="form-group mt-3">
                            <button class="btn btn-primary btn-block" >${buttonLabel}</button>
                            ${btnSignup} <!-- Input de nombre solo si es SignUp -->
                         <p class="help mt-2">
    <a href="#" data-reset-password>Olvidaste tu contraseña? <span class="underline">Restablecer contraseña <i class="fa-solid fa-arrow-up-right-from-square"></i></span></a>
</p>

                        </div>
                    </form>
                    </div>
                            <div id="messageContainer" style="display: none;" class="mt-3">
                            <p id="message" class="alert alert-warning text-center"></p>
                     </div>
                </div>
            </div>
            </div>
        `;
    loginInicio.classList.add("modalVisor");
    const form = document.querySelector("[data-signin]");
    form.addEventListener("submit", submitHandler.bind(this));
  }

  // evento signin
  async signinSubmitHandler(e) {
    e.preventDefault();

    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const signinData = { email, password };
    try {
      const response = await this.loginInstance.signin(signinData);
      if (response) {
        window.location.href = "/index.html";
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // render modal para restablecer contraseña
  renderResetPassword() {
    const resetModal = this.modal.querySelector("[data-table]");
    resetModal.innerHTML = `
    <div class="main-container text-center mb-4">
      <div class="text-center">
        <div class="card-header">
          <h3>Restablecer contraseña</h3>
        </div>
        <div class="card-form">
          <form action="/api/send-reset-password" method="post" data-reset-password-form>
            <div class="form-group mt-3">
              <input type="email" id="email" name="email" placeholder="Ingrese su email" class="input" required>
            </div>
            <div class="form-group mt-3">
              <button class="btn btn-primary btn-block">Enviar enlace</button>
            </div>
          </form>
        </div>
      </div>
      </div>
    `;

    resetModal.classList.add("modalVisor");
    const form = document.querySelector("[data-reset-password-form]");
    form.addEventListener("submit", this.resetPasswordSubmitHandler.bind(this));
  }

  // handler para restablecer contraseña
  async resetPasswordSubmitHandler(e) {
    e.preventDefault();
    const email = document.getElementsByName("email")[0].value;
    try {
      const response = await this.loginInstance.resetPassword({ email });
      if (response) {
        alert("A reset link has been sent to your email.");
        this.modal.style.display = "none"; // Cerrar modal después de enviar el enlace
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // evento signup
  async signupSubmitHandler(e) {
    e.preventDefault();
    const nombre = document.getElementsByName("nombre")[0].value;
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const signupData = { nombre, email, password };
    try {
      await this.loginInstance.signup(signupData);
    } catch (err) {
      console.error(err.message);
    }
  }

  //render modal signup
  renderSignup() {
    this.renderForm(
      "SignUp",
      "/api/signup",
      "nombre de usuario",
      "email",
      "password",
      "La contraseña debe tener al menos 8 caracteres, incluir al menos un número y una letra.",
      "Sign Up",
      "",
      this.signupSubmitHandler
    );
    const signupBtn = document.querySelector("[data-btn]");
    signupBtn.style.display = "none";

    // Añadimos evento para restablecer contraseña
    const resetPasswordLink = document.querySelector("[data-reset-password]");
    resetPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderResetPassword(); // Renderiza el formulario de restablecimiento de contraseña
    });
  }
}
