// compruebo interacciones con el DOM, su apertura y cierre, variantes (empate o victoria) y eventos que lo activan y viceversa
import test from "node:test";
import assert from "node:assert/strict";

import { Modal } from "../src/interfaz/modal.js";

class ElementoFalso {
  constructor() {
    this.hidden = false;
    this.textContent = "";
    this.listeners = {};
    this.classList = {
      clases: new Set(),

      toggle: (clase, activo) => {
        if (activo) {
          this.classList.clases.add(clase);
        } else {
          this.classList.clases.delete(clase);
        }
      },
    };
  }

  addEventListener(evento, callback) {
    this.listeners[evento] = callback;
  }

  dispatchEvent(evento, datos = {}) {
    if (this.listeners[evento]) {
      this.listeners[evento](datos);
    }
  }

  focus() {
    this.enfocado = true;
  }
}

function crearModalFalso() {
  const elemento = new ElementoFalso();
  const dialogo = new ElementoFalso();
  const titulo = new ElementoFalso();
  const mensaje = new ElementoFalso();
  const botonCerrar = new ElementoFalso();

  elemento.querySelector = (selector) => {
    const elementos = {
      ".modal-victoria": dialogo,
      "#modal-titulo": titulo,
      "#modal-mensaje": mensaje,
      "#boton-cerrar-modal": botonCerrar,
    };

    return elementos[selector];
  };

  return {
    elemento,
    dialogo,
    titulo,
    mensaje,
    botonCerrar,
  };
}

function configurarDocumentFalso() {
  global.document = {
    addEventListener() {},
  };
}

test("el modal debe abrir mostrando el título y mensaje", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria", "Ganó X");

  assert.equal(elementos.elemento.hidden, false);
  assert.equal(elementos.titulo.textContent, "Victoria");
  assert.equal(elementos.mensaje.textContent, "Ganó X");
  assert.equal(elementos.mensaje.hidden, false);
});

test("el modal debe ocultar el mensaje cuando no recibe contenido", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Ganó X");

  assert.equal(elementos.titulo.textContent, "Ganó X");
  assert.equal(elementos.mensaje.textContent, "");
  assert.equal(elementos.mensaje.hidden, true);
});

test("debe aplicar la variante de victoria", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria", "", "victoria");

  assert.equal(
    elementos.dialogo.classList.clases.has("modal-victoria--exito"),
    true,
  );

  assert.equal(
    elementos.dialogo.classList.clases.has("modal-victoria--empate"),
    false,
  );
});

test("debe aplicar la variante de empate", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Empate", "No quedan movimientos.", "empate");

  assert.equal(
    elementos.dialogo.classList.clases.has("modal-victoria--empate"),
    true,
  );

  assert.equal(
    elementos.dialogo.classList.clases.has("modal-victoria--exito"),
    false,
  );
});

test("debe enfocar el botón de cerrar al abrir el modal", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria");

  assert.equal(elementos.botonCerrar.enfocado, true);
});

test("cerrar debe ocultar el modal", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria");
  modal.cerrar();

  assert.equal(elementos.elemento.hidden, true);
});

test("el botón de cerrar debe cerrar el modal", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria");

  elementos.botonCerrar.dispatchEvent("click");

  assert.equal(elementos.elemento.hidden, true);
});

test("hacer click sobre el overlay debe cerrar el modal", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria");

  elementos.elemento.dispatchEvent("click", {
    target: elementos.elemento,
  });

  assert.equal(elementos.elemento.hidden, true);
});

test("hacer click dentro del diálogo no debe cerrar el modal", () => {
  configurarDocumentFalso();

  const elementos = crearModalFalso();
  const modal = new Modal(elementos.elemento);

  modal.abrir("Victoria");

  elementos.elemento.dispatchEvent("click", {
    target: elementos.dialogo,
  });

  assert.equal(elementos.elemento.hidden, false);
});
