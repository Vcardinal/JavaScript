(function () {
  const KEY = "cartProducts";


  const cartList = document.getElementById("cartList");
  const cartTotalPage = document.getElementById("cartTotalPage");
  const buttonVaciarPage = document.getElementById("vaciarPage");
  const buttonConfirmarPage = document.getElementById("confirmarPage");

  if (!cartList || !cartTotalPage || !buttonVaciarPage) return;


  function render() {
    const items = JSON.parse(localStorage.getItem(KEY)) || [];
    cartList.innerHTML = "";
    let total = 0;

    if (!items.length) {
      const li = document.createElement("li");
      li.className = "list-group-item text-muted";
      li.textContent = "Tu carrito está vacío.";
      cartList.appendChild(li);
      cartTotalPage.textContent = "0";
      return;
    }

    items.forEach(it => {
      const precio = Number(it.precio || it.precioUnit || 0);
      const qty = Number(it.qty || 1);
      const subtotal = precio * qty;

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      const info = document.createElement("div");
      info.innerHTML = `
        <div class="fw-semibold">${it.nombre || it.name || "Producto"}</div>
        <div class="text-muted small">${qty} × $${precio}</div>
        <div class="small"><strong>Subtotal:</strong> $${subtotal}</div>
      `;

      const btnEliminar = document.createElement("button");
      btnEliminar.className = "btn btn-outline-danger btn-sm";
      btnEliminar.textContent = "✕";
      btnEliminar.title = "Quitar";
      btnEliminar.addEventListener("click", () => {
        Swal.fire({
          title: "¿Eliminar producto?",
          text: `Se eliminará "${it.nombre || it.name}" del carrito.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
        }).then((r) => {
          if (r.isConfirmed) {
            const next = (JSON.parse(localStorage.getItem(KEY)) || []).filter(x => x.key !== it.key);
            localStorage.setItem(KEY, JSON.stringify(next));
            render();
            Swal.fire({ title: "Eliminado", icon: "success", timer: 1200, showConfirmButton: false });
          }
        });
      });

      li.append(info, btnEliminar);
      cartList.appendChild(li);

      total += subtotal;
    });

    cartTotalPage.textContent = String(total);
  }

  buttonVaciarPage.addEventListener("click", () => {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar"
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.setItem(KEY, JSON.stringify([]));
        render();
        Swal.fire({ title: "Carrito vacío", icon: "success", timer: 1200, showConfirmButton: false });
      }
    });
  });


  if (buttonConfirmarPage) {
    buttonConfirmarPage.addEventListener("click", async () => {
      const items = JSON.parse(localStorage.getItem(KEY)) || [];
      if (!items.length) {
        Swal.fire({ icon: "info", title: "Tu carrito está vacío", timer: 1200, showConfirmButton: false });
        return;
      }

  
      const { value: datos } = await Swal.fire({
        title: "Datos para el pedido",
        html: `
          <div class="text-start">
            <label class="form-label">Nombre y apellido</label>
            <input id="swal-nombre" class="form-control" placeholder="Ej: Vero Gómez">

            <label class="form-label mt-2">Teléfono</label>
            <input id="swal-telefono" class="form-control" placeholder="Ej: 09x xxx xxx">

            <label class="form-label mt-2">Modalidad</label>
            <select id="swal-modalidad" class="form-select">
              <option value="Entrega">Entrega a domicilio</option>
              <option value="Retiro">Retiro en local</option>
            </select>

            <label class="form-label mt-2">Dirección (si es entrega)</label>
            <input id="swal-direccion" class="form-control" placeholder="Calle y número">

            <label class="form-label mt-2">Fecha de entrega/retiro</label>
            <input id="swal-fecha" type="date" class="form-control">
          </div>
        `,
        focusConfirm: false,
        confirmButtonText: "Continuar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const nombre = document.getElementById("swal-nombre").value.trim();
          const telefono = document.getElementById("swal-telefono").value.trim();
          const modalidad = document.getElementById("swal-modalidad").value;
          const direccion = document.getElementById("swal-direccion").value.trim();
          const fecha = document.getElementById("swal-fecha").value;

          if (!nombre) { Swal.showValidationMessage("Ingresá tu nombre."); return false; }
          if (!telefono) { Swal.showValidationMessage("Ingresá un teléfono de contacto."); return false; }
          if (modalidad === "Entrega" && !direccion) { Swal.showValidationMessage("Ingresá la dirección para la entrega."); return false; }
          if (!fecha) { Swal.showValidationMessage("Seleccioná una fecha."); return false; }

          return { nombre, telefono, modalidad, direccion, fecha };
        }
      });

      if (!datos) return;

    
      const detalle = (JSON.parse(localStorage.getItem(KEY)) || []).map(it => {
        const nombre = it.nombre || it.name || "Producto";
        const precio = Number(it.precio || it.precioUnit || 0);
        const qty = Number(it.qty || 1);
        const subtotal = precio * qty;
        return `<li>${nombre} — ${qty} × $${precio} = $${subtotal}</li>`;
      }).join("");

      const total = (JSON.parse(localStorage.getItem(KEY)) || []).reduce((acc, it) => {
        const precio = Number(it.precio || it.precioUnit || 0);
        const qty = Number(it.qty || 1);
        return acc + (precio * qty);
      }, 0);

  
      let datosClienteHTML = '<ul style="text-align:left;padding-left:18px">';
      datosClienteHTML += `<li><strong>Nombre:</strong> ${datos.nombre}</li>`;
      datosClienteHTML += `<li><strong>Teléfono:</strong> ${datos.telefono}</li>`;
      datosClienteHTML += `<li><strong>Modalidad:</strong> ${datos.modalidad}</li>`;
      if (datos.modalidad === "Entrega") datosClienteHTML += `<li><strong>Dirección:</strong> ${datos.direccion}</li>`;
      datosClienteHTML += `<li><strong>Fecha:</strong> ${datos.fecha}</li>`;
      datosClienteHTML += `</ul>`;

      await Swal.fire({
        title: "Confirmación de pedido 🎉",
        html: `
          <div class="text-start">
            <p class="mb-2">Este es tu resumen:</p>
            <ul style="text-align:left;padding-left:18px">${detalle}</ul>
            <p><strong>Total:</strong> $${total}</p>
            <hr>
            <p class="mb-2">Datos de contacto:</p>
            ${datosClienteHTML}
          </div>
        `,
        icon: "success",
        confirmButtonText: "Confirmar y enviar"
      });

      localStorage.setItem(KEY, JSON.stringify([]));
      render();
      Swal.fire({ title: "¡Gracias!", text: "Recibimos tu pedido. Te contactaremos.", icon: "success", timer: 1500, showConfirmButton: false });
    });
  }

  render();
})();

