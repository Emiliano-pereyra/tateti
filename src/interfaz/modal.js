export class Modal {
  constructor(elemento) {
    this.elemento = elemento;
    this.dialogo = elemento.querySelector(".modal-victoria");
    this.titulo = elemento.querySelector("#modal-titulo");
    this.mensaje = elemento.querySelector("#modal-mensaje");
    this.botonCerrar = elemento.querySelector("#boton-cerrar-modal");
    this.configurarEventos();
  }

  configurarEventos() {
    this.botonCerrar.addEventListener("click", () => this.cerrar());

    this.elemento.addEventListener("click", (evento) => {
      if (evento.target === this.elemento) {
        this.cerrar();
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && !this.elemento.hidden) {
        this.cerrar();
      }
    });
  }

  abrir(titulo, mensaje = "", variante = "victoria") {
    this.titulo.textContent = titulo;
    this.mensaje.textContent = mensaje;
    this.mensaje.hidden = !mensaje;

    this.dialogo.classList.toggle(
      "modal-victoria--exito",
      variante === "victoria",
    );
    this.dialogo.classList.toggle(
      "modal-victoria--empate",
      variante === "empate",
    );

    this.elemento.hidden = false;
    this.botonCerrar.focus();
  }

  cerrar() {
    this.elemento.hidden = true;
  }
}
