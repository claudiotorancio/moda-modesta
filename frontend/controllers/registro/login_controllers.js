import { modalControllers } from "../../modal/modal.js";
import { LoginServices } from "../../services/login_services.js";

export class LoginControllers {
  constructor() {
    this.modal = document.getElementById("modal");
    this.loginInstance = new LoginServices();
  }

  //render modal signin
  renderSignin() {
    this.renderForm(
      "SignIn",
      "/api/signin",
      "",
      "email",
      "password",
      "Sign In",
      "Don't have an account?",
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
    buttonLabel,
    helpText,
    submitHandler
  ) {
    modalControllers.baseModal();
    const loginInicio = this.modal.querySelector("[data-table]");

    // Si namePlaceholder está presente, renderiza el input de nombre
    const nombreInput = namePlaceholder
      ? `<div class="form-group mt-3">
        <input type="text" id="nombre" name="nombre" placeholder="${namePlaceholder}" class="form-control" required>
     </div>`
      : ""; // Si no, deja el campo vacío

    // Si submitHandler está presente, renderiza el boton
    const btnSignup = submitHandler
      ? `  <p class="help">${helpText} <a href="" data-btn>Sign Up</a></p>`
      : ""; // Si no, deja el campo vacío

    loginInicio.innerHTML = `
            <div class="text-center">
                <div class="card-header">
                    <h3>${title}</h3>
                </div>
                <div class="card-form">
                    <form action="${action}" method="post" data-signin>
                     ${nombreInput} <!-- Input de nombre solo si es SignUp -->
                        <div class="form-group mt-3">
                            <input type="email" id="email" name="email" placeholder="${emailPlaceholder}" class="form-control" required >
                        </div>
                        <div class="form-group mt-3">
                            <input type="password" id="password" name="password" placeholder="${passwordPlaceholder}" class="form-control" required autocomplete="current-password">
                        </div>
                        <div class="form-group mt-3">
                            <button class="btn btn-primary btn-block" >${buttonLabel}</button>
                            ${btnSignup} <!-- Input de nombre solo si es SignUp -->
                            <p class="help mt-2"><a href="#" data-reset-password>Forgot your password? Reset password</a></p>
                        </div>
                    </form>
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
    modalControllers.baseModal();
    const resetModal = this.modal.querySelector("[data-table]");
    resetModal.innerHTML = `
      <div class="text-center">
        <div class="card-header">
          <h3>Reset Password</h3>
        </div>
        <div class="card-form">
          <form action="/api/send-reset-password" method="post" data-reset-password-form>
            <div class="form-group mt-3">
              <input type="email" id="email" name="email" placeholder="Enter your email" class="form-control" required>
            </div>
            <div class="form-group mt-3">
              <button class="btn btn-primary btn-block">Send Reset Link</button>
            </div>
          </form>
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
