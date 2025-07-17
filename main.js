const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const preciosBase = {
  10: 500,
  15: 800,
  20: 1100
};

const extrasDisponibles = {
  "Frutas": 200,
  "Mensaje": 150,
  "Relleno extra": 250
};

// DOM
const formulario = document.getElementById("formularioTorta");
const carritoLista = document.getElementById("carritoLista");
const totalCarrito = document.getElementById("totalCarrito");
const botonVaciar = document.getElementById("vaciarCarrito");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const diametro = parseInt(document.getElementById("diametro").value);
  const sabor = document.getElementById("sabor").value;
  const extrasSeleccionados = obtenerExtras();

  const pedido = crearPedido(diametro, sabor, extrasSeleccionados);
  carrito.push(pedido);
  guardarCarrito();
  renderizarCarrito();
});

botonVaciar.addEventListener("click", () => {
  carrito.length = 0;
  guardarCarrito();
  renderizarCarrito();
});

// Obtener extras
function obtenerExtras() {
  const checkboxes = document.querySelectorAll(".extra:checked");
  return Array.from(checkboxes).map(cb => cb.value);
}

// Caclular precio
function calcularPrecio(diametro, extras) {
  let precioBase;

  switch (diametro) {
    case 10:
      precioBase = preciosBase[10];
      break;
    case 15:
      precioBase = preciosBase[15];
      break;
    case 20:
      precioBase = preciosBase[20];
      break;
    default:
      precioBase = 0;
  }

  let precioExtras = extras.reduce((total, extra) => total + extrasDisponibles[extra], 0);

  return precioBase + precioExtras;
}

// Crear pedido
function crearPedido(diametro, sabor, extras) {
  const precioFinal = calcularPrecio(diametro, extras);

  return {
    diametro,
    sabor,
    extras,
    precio: precioFinal
  };
}

// Carrito
function renderizarCarrito() {
  carritoLista.innerHTML = "";
  let total = 0;

  carrito.forEach((pedido, i) => {
    const li = document.createElement("li");
    li.textContent = `🎂 ${pedido.diametro}cm - ${pedido.sabor} - Extras: ${pedido.extras.join(", ") || "Ninguno"} - $${pedido.precio}`;

    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.addEventListener("click", () => {
      carrito.splice(i, 1);
      guardarCarrito();
      renderizarCarrito();
    });

    li.appendChild(btn);
    carritoLista.appendChild(li);
    total += pedido.precio;
  });

  totalCarrito.innerHTML = `<strong>Total:</strong> $${total}`;
}

// Guardado
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar carrito al cargar
renderizarCarrito();

const botonConfirmar = document.getElementById("confirmarPedido");
const contenedorResumen = document.getElementById("resumenPedido");

botonConfirmar.addEventListener("click", () => {
  if (carrito.length === 0) {
    contenedorResumen.innerHTML = "<p>⚠️ No hay productos en el carrito.</p>";
    return;
  }

  const total = carrito.reduce((acc, pedido) => acc + pedido.precio, 0);

  let resumenHTML = `
    <h3>🎉 Pedido confirmado</h3>
    <p><strong>Items:</strong></p>
    <ul>
  `;

  carrito.forEach((pedido) => {
    resumenHTML += `<li>${pedido.diametro} cm - ${pedido.sabor} - Extras: ${pedido.extras.join(", ") || "Ninguno"} - $${pedido.precio}</li>`;
  });

  resumenHTML += `</ul><p><strong>Total final:</strong> $${total}</p>`;

  contenedorResumen.innerHTML = resumenHTML;

  // vaciar carrito
  carrito.length = 0;
  guardarCarrito();
  renderizarCarrito();
});




