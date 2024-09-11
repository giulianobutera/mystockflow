/**
 * La funcionalidad de la app es poder almacenar stock de cualquier cosa, ya sea una categoría que tenga distintos ítems (ej: frutas),
 * o bien ítems simples que no se pueda (o no se quiera) almacenar en una categoría (ej: figuritas repetidas de un álbum).
 * 
 * Hay ciertas partes del código que pueden ser avanzadas, como los comentarios (no descarto tener errores por supuesto), es porque trabajo como dev web front hace 5 años, 
 * especificamente con angular, estoy haciendo la carrera de full stack por eso estoy en el curso, además que me gusta repasar las bases nuevamente y sobre todo
 * aprender bien js vanilla porque normalmente trabajo con typescript. :)
 */

/**
 * Array que permite manejar y almacenar el stock.
 */
const manejadorStock = [];

/**
 * Objeto que contiene una enumeración de todas las opciones disponibles en el menú.
 */
const enumOpcionesMenu = {
    retornarAMenu: 0,
    mostrarStock: 1,
    agregarStock: 2,
    editarStock: 3,
    salir: 4
}

/**
 * Objeto que contiene una enumeración de todas los tipos de stock.
 */
const enumOpcionesTipoStock = {
    categoria: 1,
    itemSimple: 2,
    volverAMenuPrincipal: 3
}

/**
 * Función para mostrar el stock cargado hasta el momento.
 */
const mostrarStock = () => {
    if (manejadorStock.length == 0) {
        return alert("Aún no ha agregado ninguna categoría o ítem simple al stock. \nPara agregar, seleccione la opción número 2 en el menú principal.");
    }
    let mensajeAlert = "Categorías e ítems simples ingresados hasta el momento: \n\n";
    manejadorStock.forEach(stock => {
        if (stock.itemSimple) {
            mensajeAlert = mensajeAlert +  `Nombre: ${stock.nombre}, Tipo: Ítem simple, Cantidad: ${stock.cantidad}\n\n`;
        } else {
            mensajeAlert = mensajeAlert + `Nombre: ${stock.nombre}, Tipo: Categoría, Ítems:\n`;
            stock.items.forEach(item => {
                mensajeAlert = mensajeAlert + `\tNombre: ${item.nombre}, Cantidad: ${item.cantidad}\n`;
            });
            mensajeAlert = mensajeAlert + "\n"
        }
    });
    return alert(`${mensajeAlert}`);
}

/**
 * Función para agregar nuevas categorías o ítems simples al manejador de stock.
 * @param {string} nombreStock Nombre de la categoría o ítem a agregar.
 * @param {boolean} itemSimple Si el valor es true es un ítem simple, si es false es una categoría.
 * @param {Array<{nombre: string, cantidad: number}>} [items=null] Contiene nombre y cantidad de los ítems, si es un ítem simple no será utilizado.
 * @param {number} [cantidad=null] Se utiliza para representar la cantidad que tendrá un ítem simple, si es una categoría no se utilizará.
 */
const agregarStock = (nombreStock, itemSimple, items, cantidad) => {
    let nuevoStock = {
        nombre: nombreStock,
        itemSimple: itemSimple,
    }
    if (itemSimple) {
        nuevoStock.cantidad = cantidad;
    } else {
        nuevoStock.items = items;
    }
    manejadorStock.push(nuevoStock);
}

/**
 * Función para generar los ítems de una categoría.
 * @param {string} nombreCategoria Indica el nombre que va a contener la categoría que abarque a los ítems a ingresar.
 * @returns {Array<{nombre: string, cantidad: number}>} Ítems que contiene la categoría.
 */
const agregarItemsCategroria = (nombreCategoria) => {
    let itemsCategoria = [];
    let loopAgregarItems = true;
    while (loopAgregarItems) {
        let nombreItem = prompt(`Ingrese el nombre de un nuevo ítem para la categoría ${nombreCategoria}.`);
        while (!nombreItem || nombreItem.trim() == "") {
            nombreItem = prompt(`El nombre ingresado no puede ser vacío. \nIngrese el nombre de un nuevo ítem para la categoría ${nombreCategoria}.`);
        }

        let cantidadItem = parseInt(prompt(`Ingrese la cantidad de stock para el ítem ${nombreItem}`));
        while (!cantidadItem || isNaN(cantidadItem)) {
            cantidadItem = parseInt(prompt(`La cantidad ingresada debe ser un número. \nIngrese la cantidad de stock para el ítem ${nombreItem}`));
        }

        itemsCategoria.push({nombre: nombreItem, cantidad: cantidadItem});
        if (!confirm("¿Desea agregar otro ítem?")) {
            loopAgregarItems = false;
        }
    }
    return itemsCategoria;
}

/**
 * Función para recolectar la información para agregar una nueva categoría o ítem simple al manejador de stock.
 */
const agregarNuevoStock = () => {
    let opSeleccionadaStock = parseInt(prompt("¿Qué tipo de stock desea agregar?: \n\n1 - Categoría \n2 - Ítem simple \n3 - Salir \n\nIngrese el número del tipo de stock a agregar."));

    switch (opSeleccionadaStock) {
        case enumOpcionesTipoStock.categoria:
            let nombreCategoria = prompt("Ingrese el nombre de la nueva categoría.");
            while (!nombreCategoria || nombreCategoria.trim() == '') {
                nombreCategoria = prompt("El nombre ingresado no puede ser vacío. \nIngrese el nombre de la nueva categoría.");
            }
            let items = agregarItemsCategroria(nombreCategoria);
            agregarStock(nombreCategoria, false, items, null);
            break;
        
        case enumOpcionesTipoStock.itemSimple:
            let nombreItemSimple = prompt("Ingrese el nombre del nuevo ítem simple.");
            while (!nombreItemSimple || nombreItemSimple.trim() == '') {
                nombreItemSimple = prompt("El nombre ingresado no puede ser vacío. \nIngrese el nombre del nuevo ítem simple.");
            }
            let cantidadItem = parseInt(prompt(`Ingrese la cantidad de stock para el ítem ${nombreItemSimple}`));
            while (!cantidadItem || isNaN(cantidadItem)) {
                cantidadItem = parseInt(prompt(`La cantidad ingresada debe ser un número. \nIngrese la cantidad de stock para el ítem ${nombreItemSimple}`));
            }
            agregarStock(nombreItemSimple, true, null, cantidadItem);
            break;
        
        case enumOpcionesTipoStock.volverAMenuPrincipal:
            break;
        
        default:
            alert("La opción seleccionada no es válida, intente nuevamente.");
            agregarNuevoStock();
    }
}

/**
 * Función para editar categorías o ítems que ya fueron agregados.
 */
const editarStock = () => {
    return alert("Esta opción estará disponible pronto, estamos trabajando para usted :)");
}

/**
 * Función que hace las veces de menú inicial y al cual se vuelve luego de finalizar cualquier acción.
 * @returns {number} La opción seleccionada por el usuario.
 */
const menuPrincipal = () => {
    let opSeleccionada = prompt("¿Qué desea realizar?: \n\n1 - Mostrar stock existente \n2 - Agregar nuevo stock \n3 - Editar stock existente \n4 - Salir \n\nIngrese el número de la acción a realizar.");
    return parseInt(opSeleccionada);
}

/**
 * Función para procesar la opción seleccionada en el menú principal.
 * @param {number} opSeleccionada Opción que se ha seleccionado en el menú.
 * @returns {number} Opción que se ha seleccionado en el menú.
 */
const selectorMenu = (opSeleccionada) => {
    switch (opSeleccionada) {
        case enumOpcionesMenu.mostrarStock:
            mostrarStock();
            break;
        
        case enumOpcionesMenu.agregarStock:
            agregarNuevoStock();
            break;
        
        case enumOpcionesMenu.editarStock:
            editarStock();
            break;

        case enumOpcionesMenu.salir:
            break;
        
        default:
            opSeleccionada = enumOpcionesMenu.retornarAMenu;
            alert("La opción seleccionada no es válida, intente nuevamente.");
    }
    return opSeleccionada;
}

/**
 * Función para inicializar la app.
 */
const app = () => {
    alert("¡Bienvenido a MyStockFlow!");
    let loopMenu = true;
    do {
        let opSeleccionada = selectorMenu(menuPrincipal());
        switch (opSeleccionada) {
            case enumOpcionesMenu.retornarAMenu:
                loopMenu = true;
                break;

            case enumOpcionesMenu.salir:
                loopMenu = !confirm("¿Está seguro que desea salir?");
                break;
        
            default:
                loopMenu = confirm("¿Desea realizar otra acción?");
                break;
        }
    } while (loopMenu);
}

app();