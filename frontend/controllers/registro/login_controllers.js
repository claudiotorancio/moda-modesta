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
      "username",
      "password",
      "Sign In",
      "Don't have an account?",
      this.signinSubmitHandler
    );
    const btn = document.querySelector("[data-btn]");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.renderSignup();
      const signupBtn = document.querySelector("[data-btn]");
      signupBtn.style.display = "none";
    });
  }

  //evento signin

  async signinSubmitHandler(e) {
    e.preventDefault();
    const username = document.getElementsByName("username")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const signinData = { username, password };
    try {
      const response = await this.loginInstance.signin(signinData);
      if (response) {
        window.location.href = "/index.html";
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // form base par ambos estados
  renderForm(
    title,
    action,
    usernamePlaceholder,
    passwordPlaceholder,
    buttonLabel,
    helpText,
    submitHandler
  ) {
    modalControllers.baseModal();
    const loginInicio = this.modal.querySelector("[data-table]");
    loginInicio.innerHTML = `
            <div class="text-center">
                <div class="card-header">
                    <h3>${title}</h3>
                </div>
                <div class="card-form">
                    <form action="${action}" method="post" data-signin>
                        <div class="form-group mt-3">
                            <input type="text" id="username" name="username" placeholder="${usernamePlaceholder}" class="form-control" required autocomplete="current-password">
                        </div>
                        <div class="form-group mt-3">
                            <input type="password" id="password" name="password" placeholder="${passwordPlaceholder}" class="form-control" required>
                        </div>
                        <div class="form-group mt-3">
                            <button class="btn btn-primary btn-block" >${buttonLabel}</button>
                            <p class="help">${helpText} <a href="" data-btn>Sign Up</a></p>
                        </div>
                    </form>
                </div>
            </div>
        `;
    loginInicio.classList.add("modalVisor");
    const form = document.querySelector("[data-signin]");
    form.addEventListener("submit", submitHandler.bind(this));
  }

  //evento signup
  async signupSubmitHandler(e) {
    e.preventDefault();
    const username = document.getElementsByName("username")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const signupData = { username, password };
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
      "username",
      "password",
      "Sign Up",
      "",
      this.signupSubmitHandler
    );
    const signupBtn = document.querySelector("[data-btn]");
    signupBtn.style.display = "none";
  }
}
