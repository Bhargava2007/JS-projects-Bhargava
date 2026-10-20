
const amount = document.querySelector("#amount");
const from = document.querySelector("#from");
const to = document.querySelector("#to");
const result = document.querySelector("#result");
const error = document.querySelector("#error");

// Load currencies
async function loadCurrencies() {
  try {
    const response = await fetch("https://api.frankfurter.dev/v1/currencies");
    if (!response.ok) throw new Error("API failed");

    const data = await response.json();

    from.innerHTML = "";
    to.innerHTML = "";

    for (const code in data) {
      from.innerHTML += `<option value="${code}">${code} - ${data[code]}</option>`;
      to.innerHTML += `<option value="${code}">${code} - ${data[code]}</option>`;
    }

    from.value = "USD";
    to.value = "INR";
  } catch (err) {
    error.textContent = "Could not load currencies";
  }
}

// Convert currency
async function convert(event) {
  event.preventDefault();

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from.value}&symbols=${to.value}`
    );

    if (!response.ok) throw new Error("API failed");

    const data = await response.json();
    const rate = from.value === to.value ? 1 : data.rates[to.value];

    result.textContent =
      `${amount.value} ${from.value} = ${(Number(amount.value) * rate).toFixed(2)} ${to.value}`;

    error.textContent = "";
  } catch (err) {
    result.textContent = "";
    error.textContent = "Conversion failed";
  }
}

document.querySelector("#form").addEventListener("submit", convert);

loadCurrencies();
