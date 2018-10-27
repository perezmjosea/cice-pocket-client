// Inicializamos componentes Materialize
M.AutoInit();

// Self Invoked Function (contexto privado)
(function() {
  let isSendingData = false;
  const SERVER_URL = "http://localhost:3003";
  const $showFormBtn = document.querySelector("#show-form-btn");
  const $hideFormBtn = document.querySelector("#hide-form-btn");
  const $creationArea = document.querySelector("#add-area");
  const $formAdd = document.querySelector("#form-add");
  const $cardsGrid = document.querySelector("#cards-grid");
  const $inputURL = document.querySelector("#input-url");
  const $sendFormBtn = document.querySelector("#send-form-btn");
  const regexpURL = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  );

  // Función para pintar las cards
  const getCard = ({ title, url, description }) => `
  <div class="col s12 m6 l4">
    <div class="card">
      <div class="card-content">
        <span class="card-title">${title}</span>
        <p>${description}</p>
      </div>
      <div class="card-action">
        <a href="${url}" target="blank" class="link-info">Visit website</a>
      </div>
    </div>
  </div>
  `;

  // Obtenemos los documentos de mongoDB
  async function getCards() {
    const req = await fetch(`${SERVER_URL}/website/list`).catch(err => {
      console.log(err);
      onSendFail();
      return;
    });

    // Pintamos los resultados
    const data = await req.json();
    data.list &&
      data.list.forEach(item => ($cardsGrid.innerHTML += getCard(item)));
  }

  // Limpiamos y ocultamos el formulario
  function clearForm() {
    $inputURL.value = "";
    isSendingData = false;
    $hideFormBtn.classList.remove("disabled");
    $sendFormBtn.classList.remove("disabled");
    $inputURL.classList.add("validate");
    $inputURL.removeAttribute("disabled");
    $creationArea.classList.remove("open");
  }

  // Función caso de éxito
  function onSendSuccess(data) {
    clearForm();
    $cardsGrid.innerHTML += getCard(data);
  }

  // Funcion caso de fallo
  function onSendFail() {
    clearForm();
    M.toast({
      html: "Something went wrong",
      classes: "primary-bg light-color"
    });
  }

  // Evento para mostrar el formulario
  $showFormBtn.addEventListener("click", e => {
    e.preventDefault();
    $creationArea.classList.add("open");
  });

  // Evento para mostrar el formulario
  $hideFormBtn.addEventListener("click", e => {
    e.preventDefault();
    if (!isSendingData) {
      clearForm();
      $creationArea.classList.remove("open");
    }
  });

  // Evento de submit del formulario
  $formAdd.addEventListener("submit", async e => {
    e.preventDefault();

    if (!regexpURL.test($inputURL.value)) {
      onSendFail();
      return;
    }
    isSendingData = true;
    $sendFormBtn.classList.add("disabled");
    $hideFormBtn.classList.add("disabled");
    $inputURL.classList.remove("validate");
    $inputURL.setAttribute("disabled", "disabled");

    // Configuracion del request
    const reqConfig = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        url: $inputURL.value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Lanzamos petición
    const req = await fetch(`${SERVER_URL}/website/create`, reqConfig).catch(
      err => {
        console.log(err);
        onSendFail();
        return;
      }
    );

    if (!req.status.toString == "201") {
      onSendFail();
    }

    // Obtenemos la respuesta de la petición
    const resp = await req.json();
    onSendSuccess(resp);
  });

  getCards();
})();

// ^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$
