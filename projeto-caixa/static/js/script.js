const saldoDisplay = document.getElementById("saldo-display");
const extratoSection = document.getElementById("extrato-section");
const extratoLista = document.getElementById("extrato-lista");
const extratoVazio = document.getElementById("extrato-vazio");
const extratoSaldoDisplay = document.getElementById(
  "extrato-saldo-display"
);
const modalContainer = document.getElementById("modal-container");
const btnMostrarSaldo = document.getElementById("btn-mostrar-saldo");
const btnDepositar = document.getElementById("btn-depositar");
const btnSacar = document.getElementById("btn-sacar");
const btnExtrato = document.getElementById("btn-extrato");
const btnVoltarExtrato = document.getElementById("btn-voltar-extrato");

let saldoVisivel = false;
const saldoPlaceholder = "***.**";

async function fetchSaldo() {
  const response = await fetch("/get_saldo");
  const data = await response.json();
  const saldoReal = data.saldo.replace("R$ ", "");

  if (saldoVisivel) {
    saldoDisplay.textContent = saldoReal;
  } else {
    saldoDisplay.textContent = saldoPlaceholder;
  }
}

function toggleSaldo() {
  saldoVisivel = !saldoVisivel;
  const btnText = btnMostrarSaldo.querySelector('span');

  const icon = btnMostrarSaldo.querySelector('svg');
  if (saldoVisivel) {
    fetchSaldo();
    btnText.textContent = "Ocultar saldo";
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.988 5.412a9.7 9.7 0 011.696-2.181m0 0a9.7 9.7 0 014.288-1.574M12 5.25a6 6 0 00-4.786 2.052l-1.396 1.396m4.786-2.052a6 6 0 00-6.711 7.185L3.376 17.5a1.8 1.8 0 00.916 2.651 24.337 24.337 0 001.378.143M12 5.25a6 6 0 00-6 6V12h.75A.75.75 0 017.5 12.75V15m4.5-9.75a6 6 0 00-6 6v.75m6-7.5a6 6 0 00-6 6v.75m6-7.5a6 6 0 00-6 6v.75"/>`; // SVG de olho fechado
  } else {
    saldoDisplay.textContent = saldoPlaceholder;
    btnText.textContent = "Mostrar saldo";
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>`; // SVG de olho aberto
  }
}

async function mostrarExtrato() {
  const response = await fetch("/get_extrato");
  const data = await response.json();
  const extrato = data.extrato;
  const saldoAtual = data.saldo.replace("R$ ", "");

  extratoLista.innerHTML = "";
  if (extrato.length === 0) {
    extratoVazio.classList.remove("hidden");
  } else {
    extratoVazio.classList.add("hidden");
    extrato.forEach((mov) => {
      const li = document.createElement("div");
      li.textContent = mov;
      li.className = "text-gray-600 border-b border-gray-200 py-1";
      extratoLista.appendChild(li);
    });
  }
  extratoSaldoDisplay.textContent = saldoAtual;
  extratoSection.classList.remove("hidden");
}

function showModal(title, message, isInput = false, onConfirm = null) {
  modalContainer.classList.remove("hidden");
  modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <h4 class="font-bold text-lg mb-2">${title}</h4>
                <p class="text-gray-600 mb-4">${message}</p>
                ${isInput ? '<input id="modal-input" type="number" step="0.01" class="w-full border-gray-300 rounded-md p-2" placeholder="R$ 0.00">' : ""}
                <div class="modal-buttons">
                    <button id="modal-close-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium">Fechar</button>
                    ${isInput ? '<button id="modal-confirm-btn" class="px-4 py-2 bg-[#00609b] text-white rounded-lg font-medium">Confirmar</button>' : ""}
                </div>
            </div>
        </div>
    `;

  document.getElementById("modal-close-btn").addEventListener("click", () => {
    modalContainer.classList.add("hidden");
  });

  if (isInput && onConfirm) {
    document.getElementById("modal-confirm-btn").addEventListener("click", () => {
      const inputValue = parseFloat(document.getElementById("modal-input").value);
      onConfirm(inputValue);
      modalContainer.classList.add("hidden");
    });
  }
}

fetchSaldo();

btnMostrarSaldo.addEventListener('click', toggleSaldo);

btnDepositar.addEventListener("click", () => {
  showModal("Depósito", "Informe o valor do depósito:", true, async (valor) => {
    const response = await fetch("/depositar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor }),
    });
    const result = await response.json();
    showModal(result.success ? "Sucesso!" : "Erro", result.message);
    fetchSaldo();
  });
});

btnSacar.addEventListener("click", () => {
  showModal("Saque", "Informe o valor do saque:", true, async (valor) => {
    const response = await fetch("/sacar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor }),
    });
    const result = await response.json();
    showModal(result.success ? "Sucesso!" : "Erro", result.message);
    fetchSaldo();
  });
});

btnExtrato.addEventListener("click", () => {
  mostrarExtrato();
});

btnVoltarExtrato.addEventListener("click", () => {
  extratoSection.classList.add("hidden");
});