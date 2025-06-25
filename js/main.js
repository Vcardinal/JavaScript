let diametro;
let porciones;
let recomendacion;

alert("🍰 Bienvenid@ a  Delicakes");

let continuar = true;

while (continuar) {
  // Inicio
  const opcion = prompt(
    "Seleccioná una opción:\n" +
    "1. Elegir diámetro de torta\n" +
    "2. Salir"
  );

  if (opcion === "1") {
    // Entrada de datos
    diametro = parseInt(prompt("📏 Ingresá el diámetro de la torta en cm (10, 15 o 20):"));

    // Opciones para poder avanzar
    if (diametro === 10) {
      porciones = 6;
      recomendacion = "Un regalo o merienda pequeña";
    } else if (diametro === 15) {
      porciones = 12;
      recomendacion = "Cumpleaños íntimo o reunión familiar";
    } else if (diametro === 20) {
      porciones = 20;
      recomendacion = "Fiesta mediana o celebración de oficina";
    } else {
      alert("⚠️ Solo trabajamos con 10, 15 o 20 cm por ahora.");
      continue;
    }

    // Mensajito con resultado
    alert(
      `Diámetro: ${diametro} cm\n` +
      `Porciones estimadas: ${porciones}\n` +
      `Ideal para: ${recomendacion}`
    );
  } else if (opcion === "2") {
    continuar = false;
    alert("¡Gracias por visitar Delicakes!");
  } else {
    alert("Opción inválida. Intentá de nuevo.");
  }
}
