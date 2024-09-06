function saludo() {
    let nombre = prompt("Ingrese su nombre");
    alert("Bienvenido " + nombre + " a Tienda Retro");
}


const camisetas = [
    {
        nombre: "Milan 98",
        precio: 40000,
        talles: ["S", "M", "L", "XL"]
    },
    {
        nombre: "Real Madrid 02",
        precio: 50000,
        talles: ["S", "M", "L", "XL"]
    },
    {
        nombre: "Barcelona 11",
        precio: 45000,
        talles: ["S", "M", "L", "XL"]
    },
    {
        nombre: "Lazio 22",
        precio: 30000,
        talles: ["S", "M", "L", "XL"]
    },
    {
        nombre: "Boca 98",
        precio: 45000,
        talles: ["S", "M", "L", "XL"]
    },
   
];


let carrito = [];


function elegirCamiseta() {
    let opciones = "Elige tu camiseta:\n";
    camisetas.forEach((camiseta, index) => {
        opciones += `${index + 1}- ${camiseta.nombre}\n`;
    });

    let eleccion = parseInt(prompt(opciones));

    if (eleccion >= 1 && eleccion <= camisetas.length) {
        alert(`Elegiste la camiseta del ${camisetas[eleccion - 1].nombre}`);
        return camisetas[eleccion - 1];
    } else {
        alert("Ingresaste un dato incorrecto");
        return null;
    }
}


function elegirTalle(camiseta) {
    let opcionesTalles = "Elige tu talle:\n";
    camiseta.talles.forEach((talle, index) => {
        opcionesTalles += `${index + 1}- ${talle}\n`;
    });

    let eleccionTalle = parseInt(prompt(opcionesTalles));

    if (eleccionTalle >= 1 && eleccionTalle <= camiseta.talles.length) {
        return camiseta.talles[eleccionTalle - 1];
    } else {
        alert("Talle no válido.");
        return null;
    }
}


function calcularIVA(precio, porcentajeIVA) {
    return precio * (1 + porcentajeIVA);
}


function precioFinal(camiseta) {
    const porcentajeIVA = 0.21; 
    let precioConIVA = calcularIVA(camiseta.precio, porcentajeIVA);
    alert(`El precio de la camiseta ${camiseta.nombre} con IVA es $${precioConIVA.toFixed(2)}`);
}


function verCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "Contenido del carrito:\n";
    let total = 0;
    carrito.forEach(item => {
        mensaje += `- ${item.nombre} (Talle: ${item.talle}): $${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });
    alert(mensaje + `\nTotal a pagar: $${total.toFixed(2)}`);
}


function filtrarCamisetas() {
    let opcionFiltro = prompt("Elige un filtro:\n1- Filtrar por nombre\n2- Filtrar por precio");

    if (opcionFiltro === "1") {
        let filtroNombre = prompt("Ingresa el nombre o parte del nombre de la camiseta:");
        let resultado = camisetas.filter(camiseta => camiseta.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));
        mostrarResultadosFiltro(resultado);
    } else if (opcionFiltro === "2") {
        let precioMin = parseFloat(prompt("Ingresa el precio mínimo:"));
        let precioMax = parseFloat(prompt("Ingresa el precio máximo:"));
        let resultado = camisetas.filter(camiseta => camiseta.precio >= precioMin && camiseta.precio <= precioMax);
        mostrarResultadosFiltro(resultado);
    } else {
        alert("Opción de filtro no válida.");
    }
}


function mostrarResultadosFiltro(resultados) {
    if (resultados.length > 0) {
        let mensaje = "Resultados del filtro:\n";
        resultados.forEach(camiseta => {
            let precioConIVA = calcularIVA(camiseta.precio, 0.21);
            mensaje += `- ${camiseta.nombre}: $${precioConIVA.toFixed(2)}\n`;
        });
        alert(mensaje);
    } else {
        alert("No se encontraron camisetas que coincidan con el filtro.");
    }
}


function iniciarCompra() {
    saludo();

    let opciones;

    while (opciones !== "4") {
        opciones = prompt("Elige una opción:\n1- Comprar Camiseta\n2- Ver Carrito\n3- Filtrar Camisetas\n4- Finalizar");

        if (opciones === "1") {
            let camisetaElegida = elegirCamiseta();
            if (camisetaElegida) {
                let talleElegido = elegirTalle(camisetaElegida);
                if (talleElegido) {
                    alert(`Elegiste el talle ${talleElegido}`);
                    let precioConIVA = calcularIVA(camisetaElegida.precio, 0.21);
                    carrito.push({ nombre: camisetaElegida.nombre, precio: precioConIVA, talle: talleElegido });
                    alert("Camiseta agregada al carrito.");
                }
            }
        } else if (opciones === "2") {
            verCarrito();
        } else if (opciones === "3") {
            filtrarCamisetas();
        } else if (opciones === "4") {
            alert("Gracias por su compra");
        } else {
            alert("Opción inválida, por favor elige una opción válida.");
        }
    }
}

iniciarCompra();