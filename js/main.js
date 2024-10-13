// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let nombreUsuario = localStorage.getItem('nombreUsuario') || "";

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

// Guardar el nombre del usuario con validación
btnSaludar.addEventListener('click', () => {
    const nombre = nombreInput.value.trim();
    nombre
        ? (localStorage.setItem('nombreUsuario', nombre),
           mostrarMensaje(`Bienvenido ${nombre} a Tienda Retro`, "green"))
        : mostrarMensaje("Por favor, ingresa un nombre válido.", "red");
});

// Función para cargar las camisetas desde el archivo JSON
async function cargarCamisetas() {
    try {
        const respuesta = await fetch('camisetas.json');  // Ruta al archivo JSON
        if (!respuesta.ok) {
            throw new Error("Error al cargar los datos de las camisetas");
        }
        const camisetas = await respuesta.json();  // Obtener datos JSON
        mostrarCamisetas(camisetas);
    } catch (error) {
        mostrarMensaje(`Error: ${error.message}`, "red");
    }
}

// Mostrar camisetas disponibles
function mostrarCamisetas(camisetas) {
    camisetasContainer.innerHTML = "";  // Limpiar el contenedor

    camisetas.forEach(({ nombre, precio, talles, imagen }, index) => { // Agrega la propiedad 'imagen'
        let camisetaDiv = document.createElement('div');
        camisetaDiv.innerHTML = `
            <h3>${nombre}</h3>
            <img src="${imagen}" alt="${nombre}" style="width:100px; height:auto;"> <!-- Muestra la imagen -->
            <p>Precio: $${precio}</p>
            <label for="talle-${index}">Elige tu talle:</label>
            <select id="talle-${index}">
                ${talles.map(talle => `<option value="${talle}">${talle}</option>`).join('')}
            </select>
            <button id="comprar-${index}">Comprar</button>
        `;
        camisetasContainer.appendChild(camisetaDiv);

        document.getElementById(`comprar-${index}`).addEventListener('click', () => {
            let talleSeleccionado = document.getElementById(`talle-${index}`).value;
            agregarAlCarrito({ nombre, precio, imagen }, talleSeleccionado); // Agrega 'imagen' al carrito
        });
    });
}

// Agregar camiseta al carrito
function agregarAlCarrito(camiseta, talle) {
    const precioConIVA = calcularIVA(camiseta.precio, 0.21);
    carrito.push({ nombre: camiseta.nombre, precio: precioConIVA, talle, imagen: camiseta.imagen }); // Agrega 'imagen'
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
                <img src="${item.imagen}" alt="${item.nombre}" style="width:50px; height:auto;"> <!-- Muestra la imagen -->
                <p>${item.nombre} (Talle: ${item.talle}) - $${item.precio.toFixed(2)}</p>
                <button class="eliminar-btn" data-index="${index}">Eliminar</button>
            `;
            carritoContainer.appendChild(itemDiv);
        });

        carritoContainer.innerHTML += `<p>Total a pagar: $${total.toFixed(2)}</p>`;

        // Reasignar los eventos a los botones de eliminar
        const eliminarBotones = document.querySelectorAll('.eliminar-btn');
        eliminarBotones.forEach((boton) => {
            boton.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                eliminarDelCarrito(index);
            });
        });
    }
}

// Eliminar un artículo del carrito
function eliminarDelCarrito(index) {
    // Convertir el índice a número
    const itemIndex = parseInt(index, 10);

    // Verificar si el índice es válido (programación defensiva)
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= carrito.length) {
        mostrarMensaje("Error al eliminar el artículo del carrito.", "red");
        return;
    }

    // Eliminar el producto seleccionado del carrito
    carrito.splice(itemIndex, 1);

    // Actualizar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar el carrito actualizado
    mostrarCarrito();
}

// Calcular IVA
function calcularIVA(precio, porcentajeIVA) {
    return precio * (1 + porcentajeIVA);
}

// Simular finalizar compra
async function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío.", "red");
    } else {
        // Mostrar alerta de SweetAlert2
        await Swal.fire({
            title: "¡Gracias por tu compra!",
            text: "Tu pedido ha sido procesado con éxito.",
            icon: "success",
            confirmButtonText: "OK"
        });

        // Limpiar el carrito
        carrito = [];
        localStorage.removeItem('carrito');
        mostrarCarrito();
    }
}

finalizarCompraBtn.addEventListener('click', finalizarCompra);

// Inicializar la página
cargarCamisetas();  // Cargar camisetas desde JSON
mostrarCarrito();   // Mostrar el carrito al iniciar

