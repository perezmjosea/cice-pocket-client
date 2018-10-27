// Inicializamos componentes Materialize
M.AutoInit();

// Self Invoked Function (contexto privado)
(function() {
  const $actionBtn = document.querySelector("#action-btn");
  const $creationArea = document.querySelector("#creation-area");

  $actionBtn.addEventListener("click", e => {
    $creationArea.classList.add("open");
  });
})();
