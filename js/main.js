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
            <img src="${imagen}" alt="${nombre}" id="imagen-${index}" style="cursor:pointer; width:100px; height:auto;"> <!-- Muestra la imagen con cursor de puntero -->
            <p>Precio: $${precio}</p>
            <label for="talle-${index}">Elige tu talle:</label>
            <select id="talle-${index}">
                ${talles.map(talle => `<option value="${talle}">${talle}</option>`).join('')}
            </select>
            <button id="comprar-${index}">Comprar</button>
        `;
        camisetasContainer.appendChild(camisetaDiv);

        // Evento para comprar la camiseta
        document.getElementById(`comprar-${index}`).addEventListener('click', () => {
            let talleSeleccionado = document.getElementById(`talle-${index}`).value;
            agregarAlCarrito({ nombre, precio, imagen }, talleSeleccionado); // Agrega 'imagen' al carrito
        });

        // Evento para mostrar la imagen en grande usando Swal.fire
        document.getElementById(`imagen-${index}`).addEventListener('click', () => {
            Swal.fire({
                imageUrl: imagen,
                imageHeight: 500,  // Cambia el tamaño según lo necesites
                imageAlt: `Imagen de la camiseta ${nombre}`,
                title: `${nombre}`,
            });
        });
    });
}

// Agregar camiseta al carrito
function agregarAlCarrito(camiseta, talle) {
    const precioConIVA = calcularIVA(camiseta.precio, 0.21);
    carrito.push({ nombre: camiseta.nombre, precio: precioConIVA, talle, imagen: camiseta.imagen }); // Agrega 'imagen'
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar notificación con SweetAlert2
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Camiseta ${camiseta.nombre} agregada al carrito`,
        showConfirmButton: false,
        timer: 1500
    });

    mostrarCarrito();  // Actualizar la visualización del carrito
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

// Eliminar un artículo del carrito con confirmación
function eliminarDelCarrito(index) {
    // Convertir el índice a número
    const itemIndex = parseInt(index, 10);

    // Verificar si el índice es válido (programación defensiva)
    if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= carrito.length) {
        mostrarMensaje("Error al eliminar el artículo del carrito.", "red");
        return;
    }

    // Mostrar alerta de confirmación con SweetAlert2
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, eliminar el producto del carrito
            carrito.splice(itemIndex, 1);

            // Actualizar el carrito en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Mostrar el carrito actualizado
            mostrarCarrito();

            // Mostrar notificación de éxito
            Swal.fire({
                title: "¡Eliminado!",
                text: "La camiseta ha sido eliminada del carrito.",
                icon: "success"
            });
        }
    });
}

// Calcular IVA
function calcularIVA(precio, porcentajeIVA) {
    return precio * (1 + porcentajeIVA);
}

// Simular finalizar compra
async function finalizarCompra() {
    if (carrito.length === 0) {
        // Mostrar alerta de SweetAlert2 cuando el carrito está vacío
        await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El carrito está vacío. No puedes finalizar la compra.",
            
        });
    } else {
        // Mostrar alerta de éxito cuando hay artículos en el carrito
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


