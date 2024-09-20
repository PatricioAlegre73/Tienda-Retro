// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let nombreUsuario = localStorage.getItem('nombreUsuario') || "";

// Array de camisetas
const camisetas = [
    { nombre: "Milan 98", precio: 40000, talles: ["S", "M", "L", "XL"], },
    { nombre: "Real Madrid 02", precio: 50000, talles: ["S", "M", "L", "XL"] },
    { nombre: "Barcelona 11", precio: 45000, talles: ["S", "M", "L", "XL"] },
    { nombre: "Lazio 22", precio: 30000, talles: ["S", "M", "L", "XL"] },
    { nombre: "Boca 98", precio: 45000, talles: ["S", "M", "L", "XL"] }
];

// Elementos del DOM
const camisetasContainer = document.getElementById('camisetasContainer');
const carritoContainer = document.getElementById('carritoContainer');
const btnSaludar = document.getElementById('btnSaludar');
const nombreInput = document.getElementById('nombreInput');
const finalizarCompraBtn = document.getElementById('finalizarCompra');

// Función para mostrar mensajes
function mostrarMensaje(mensaje, color = "green") {
    const mensajeUsuario = document.getElementById('mensajeUsuario');
    mensajeUsuario.textContent = mensaje;
    mensajeUsuario.style.color = color;
    
    setTimeout(() => {
        mensajeUsuario.textContent = "";
    }, 3000);
}

// Guardar el nombre del usuario
btnSaludar.addEventListener('click', () => {
    const nombre = nombreInput.value;
    if (nombre.trim() !== "") {
        localStorage.setItem('nombreUsuario', nombre);
        mostrarMensaje(`Bienvenido ${nombre} a Tienda Retro`, "green");
    } else {
        mostrarMensaje("Por favor, ingresa un nombre válido.", "red");
    }
});

// Mostrar camisetas disponibles
function mostrarCamisetas() {
    camisetasContainer.innerHTML = "";  // Limpiar el contenedor

    camisetas.forEach((camiseta, index) => {
        let camisetaDiv = document.createElement('div');
        camisetaDiv.innerHTML = `
            <h3>${camiseta.nombre}</h3>
            <p>Precio: $${camiseta.precio}</p>
            <label for="talle-${index}">Elige tu talle:</label>
            <select id="talle-${index}">
                ${camiseta.talles.map(talle => `<option value="${talle}">${talle}</option>`).join('')}
            </select>
            <button id="comprar-${index}">Comprar</button>
        `;
        camisetasContainer.appendChild(camisetaDiv);

        document.getElementById(`comprar-${index}`).addEventListener('click', () => {
            let talleSeleccionado = document.getElementById(`talle-${index}`).value;
            agregarAlCarrito(camiseta, talleSeleccionado);
        });
    });
}

// Agregar camiseta al carrito
function agregarAlCarrito(camiseta, talle) {
    const precioConIVA = calcularIVA(camiseta.precio, 0.21);
    carrito.push({ nombre: camiseta.nombre, precio: precioConIVA, talle });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarMensaje(`Camiseta ${camiseta.nombre} (Talle: ${talle}) agregada al carrito`, "green");
    mostrarCarrito();
}

// Mostrar el carrito en la página
function mostrarCarrito() {
    carritoContainer.innerHTML = "";  // Limpiar el contenedor
    if (carrito.length === 0) {
        carritoContainer.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        let total = 0;
        carrito.forEach((item, index) => {
            total += item.precio;
            let itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${item.nombre} (Talle: ${item.talle}) - $${item.precio.toFixed(2)}</p>
                <button id="eliminar-${index}">Eliminar</button>
            `;
            carritoContainer.appendChild(itemDiv);

            document.getElementById(`eliminar-${index}`).addEventListener('click', () => {
                eliminarDelCarrito(index);
            });
        });
        carritoContainer.innerHTML += `<p>Total a pagar: $${total.toFixed(2)}</p>`;
    }
}

// Eliminar un artículo del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Calcular IVA
function calcularIVA(precio, porcentajeIVA) {
    return precio * (1 + porcentajeIVA);
}

// Finalizar compra
finalizarCompraBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío.", "red");
    } else {
        mostrarMensaje("Gracias por tu compra.", "green");
        carrito = [];
        localStorage.removeItem('carrito');
        mostrarCarrito();
    }
});

// Inicializar la página
mostrarCamisetas();
mostrarCarrito();


