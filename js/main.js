const productsContainer = document.getElementById("products-container");
const CART_KEY = "cartProducts";

function cartKey(producto) {
  if (producto.tipo === "torta") {
    return "T-" + producto.id;
  } else {
    return "U-" + producto.id;
  }
}

function renderProductos(productsArray) {
  productsContainer.innerHTML = "";

  productsArray.forEach(producto => {
    const card = document.createElement("div");
    card.className = "card shadow-sm p-3";
    card.style.width = "18rem";

    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.className = "card-img-top rounded";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = producto.nombre;

    const desc = document.createElement("p");
    desc.className = "card-text";
    desc.textContent = producto.descripcion || "";

    const price = document.createElement("p");
    price.innerHTML = `<strong>Precio:</strong> $${producto.precio}`;

    let contador = 0;
    const buttonRestar = document.createElement("button");
    buttonRestar.className = "btn btn-outline-secondary btn-sm";
    buttonRestar.textContent = "–";
    buttonRestar.disabled = true;

    const contadorSpan = document.createElement("span");
    contadorSpan.textContent = contador;
    contadorSpan.className = "mx-2 fw-bold";

    const buttonSumar = document.createElement("button");
    buttonSumar.className = "btn btn-outline-secondary btn-sm";
    buttonSumar.textContent = "+";

    const buttonAgregar = document.createElement("button");
    buttonAgregar.className = "btn btn-success btn-sm ms-2";
    buttonAgregar.textContent = "Agregar al carrito";

    buttonSumar.onclick = () => {
      if (contador < (producto.stock || 0)) {
        contador++;
        contadorSpan.textContent = contador;
        buttonRestar.disabled = false;
      } else {
        Swal.fire({
          icon: "warning",
          title: "Stock máximo alcanzado",
          text: `Solo hay ${producto.stock} unidades disponibles.`,
        });
      }
    };

    buttonRestar.onclick = () => {
      if (contador > 1) {
        contador--;
        contadorSpan.textContent = contador;
      }
      buttonRestar.disabled = contador === 0;
    };

    buttonAgregar.onclick = () => {
      let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      const key = cartKey(producto);
      const idx = cart.findIndex(x => x.key === key);
      const qtyActual = idx >= 0 ? cart[idx].qty : 0;

      if (qtyActual + contador > (producto.stock || 0)) {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: `No puedes agregar más de ${producto.stock} unidades.`,
        });
        return;
      }

      if (idx >= 0) {
        cart[idx].qty += contador;
      } else {
        cart.push({
          key,
          nombre: producto.nombre,
          precio: producto.precio,
          qty: contador
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    };

    const controles = document.createElement("div");
    controles.className = "mt-2";
    controles.append(buttonRestar, contadorSpan, buttonSumar, buttonAgregar);

    body.append(title, img, desc, price, controles);
    card.appendChild(body);
    productsContainer.appendChild(card);
  });
}

(async function init() {
  try {
    const res = await fetch("./db/product.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const productos = await res.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      productsContainer.innerHTML = `<p class="text-danger">No se pudieron cargar los productos.</p>`;
      return;
    }

    renderProductos(productos);
  } catch (err) {
    console.error("❌ Error:", err);
    productsContainer.innerHTML = `<p class="text-danger">No se pudieron cargar los productos.</p>`;
  } finally {
    console.log("✅ Listo (éxito o error)");
  }
})();






