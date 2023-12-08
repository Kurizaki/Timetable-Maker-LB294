console.log("Login.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  // Server URLs
  const authServerUrl = "http://localhost:2941/auth";
  const resourceServerUrl = "http://localhost:2940/api/v1/entities";

  // State variable for login status
  let isLoggedIn = false;

  // Helper functions to manipulate DOM elements
  const getElement = (id) => document.getElementById(id);
  const hideElement = (element) => (element.style.display = "none");
  const showElement = (element) => (element.style.display = "block");

  // DOM elements
  const loginDiv = getElement("login");
  const createtimetableDiv = getElement("createtimetable");
  const showtimetableDiv = getElement("showtimetable");
  const navBar = getElement("navigation");

  // Helper functions to create form elements
  const createInput = (type, name, placeholder) => {
    const input = Object.assign(document.createElement("input"), { type, name, id: name, placeholder });
    return input;
  };

  const createButton = (text, onClick) => {
    const button = Object.assign(document.createElement("button"), { type: "submit", innerText: text, onclick: onClick });
    return button;
  };

  // Function to generate login form
  const generateLoginForm = () => {
    const loginForm = Object.assign(document.createElement("form"), {
      id: "login-form",
      action: "/login",
      method: "POST",
      onsubmit: (event) => {
        event.preventDefault();
        login();
      },
    });

    const elements = [
      createInput("text", "username", "Username"),
      createInput("password", "password", "Password"),
      createButton("Login", login),
    ];

    elements.forEach((element) => loginForm.appendChild(element));
    return loginForm;
  };

  // Function to update UI when user is logged in
  const printIsLoggedIn = () => {
    hideElement(loginDiv);
    showElement(navBar);
  };

  // Function to handle the login process
  const login = () => {
    const username = getElement("username").value;
    const password = getElement("password").value;

    if (!username || !password) {
      console.error("Username and password are required");
      return;
    }

    fetch(`${authServerUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(handleResponse)
      .then(() => {
        isLoggedIn = true;
        printIsLoggedIn();
      })
      .catch((error) => console.error("Login failed:", error.message));
  };

  // Function to handle fetch response
  const handleResponse = (response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  // Append the login form to the loginDiv
  loginDiv.appendChild(generateLoginForm());

  // Periodically check login status and update UI accordingly
  setInterval(() => {
    if (!isLoggedIn) {
      showElement(loginDiv);
      hideElement(navBar);
      hideElement(createtimetableDiv);
      hideElement(showtimetableDiv);
    }
  }, 1000);
});
