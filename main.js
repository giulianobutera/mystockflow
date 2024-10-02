/**
 * Por cuestiones de tiempo no llegué a hacer la carga de stock de categorías,
 * pero para cumplir con la pre entrega, queda lista la carga de stock de ítems simples.
 * de todas maneras dejo un array a modo de prueba para revisar cómo se vería
 * un stock de categorías (en la prox pre entrega agrego esa funcionalidad)
 */

/**
 * Clase para inicializar stock
 */
class Stock {
    constructor(id, nombreStock, itemSimple, descripcion, items, cantidad) {
        this.id = id;
        this.nombreStock = nombreStock;
        this.itemSimple = itemSimple;
        this.descripcion = descripcion;
        this.items = items ?? null;
        this.cantidad = cantidad ?? null;
    }
}

/**
 * Array que permite manejar y almacenar el stock.
 */
let manejadorStock = [];
// Pruebas de categorías
// let manejadorStock = [
//     {
//         id: 1,
//         nombreStock: "Frutas",
//         itemSimple: false,
//         descripcion: "Stock de frutas en mi depto",
//         items: [{idItem: 1, nombre: "Banana", cantidad: 4}, {idItem: 2, nombre: "Manzana", cantidad: 2}, {idItem: 3, nombre: "Mandarina", cantidad: 2}],
//         cantidad: null
//     },
//     {
//         id: 2,
//         nombreStock: "Verduras",
//         itemSimple: false,
//         descripcion: "Stock de verduras en mi depto",
//         items: [{idItem: 1, nombre: "Cebolla", cantidad: 2}, {idItem: 2, nombre: "Tomate", cantidad: 4}],
//         cantidad: null
//     }
// ];

const renderizarFormularioNuevoStock = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('formularioNuevoStock');
        form.addEventListener('submit', (event) => {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                const nuevoStock = new Stock(
                    Math.floor(Math.random() * 1001),
                    document.getElementById('nombreStock').value,
                    true,
                    document.getElementById('descripcion').value ?? '',
                    null,
                    parseInt(document.getElementById('cantidad').value)
                );
                manejadorStock.push(nuevoStock);
                guardarStockLocal();
                renderizarStock();
                $('#modalNuevoStock').modal('hide');
            }
            form.classList.add('was-validated');
        }, false);
        
        // Reiniciar el formulario cuando se abre el modal
        $('#modalNuevoStock').on('show.bs.modal', function () {
            form.reset();
            form.classList.remove('was-validated');
        });
    });
}

/**
 * Función para obtener de localStorage el stock guardado
 */
const obtenerStockLocal = () => {
    manejadorStock = JSON.parse(localStorage.getItem("manejadorStock")) || [];
};

/**
 * Función para guardar en localStorage el stock editado
 */
const guardarStockLocal = () => {
    localStorage.setItem('manejadorStock', JSON.stringify(manejadorStock));
};

/**
 * Función para renderizar en html el manejador de stock
 */
const renderizarStock = () => {
    if (manejadorStock.length > 0) {
        // Obtener y ocultar empty state
        const emptyStateStock = document.getElementById("emptyStateStock");
        emptyStateStock.classList.add("d-none");
        // Obtener contenedor de cards y agregar stock
        const cardsStock = document.getElementById("cardsStock");
        cardsStock.innerHTML="";
        manejadorStock.forEach(({id, nombreStock, itemSimple, descripcion, items, cantidad}) => {
            let nuevaCard = document.createElement("div");
            nuevaCard.classList.add("col-sm-6", "col-md-4", "col-lg-3", "mb-4");
            nuevaCard.id = `cardStock${id}`;
            nuevaCard.innerHTML = `
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <div class="d-flex align-items-center">
                                <h5 class="card-title mb-0">
                                    ${nombreStock}
                                    ${itemSimple ? '' : '<i class="bi bi-folder-fill icon-margin-left" title="Categoría"></i>'}
                                </h5>
                            </div>
                            <button class="btn btn-outline-light ml-2 btn-sm" type="button" id="eliminarStock${id}">
                                <i class="bi bi-trash3-fill"></i>
                            </button>
                        </div>
                        <p class="card-text">${descripcion}</p>
                        ${itemSimple 
                        ? `
                            <div class="d-flex align-items-center justify-content-end">
                                <p class="card-text mb-0 custom-card-text">Cantidad:</p>
                                <button class="btn btn-outline-light mr-2 btn-sm" type="button" id="restarStockItemSimple${id}">
                                    <i class="bi bi-dash-lg"></i>
                                </button>
                                <span class="mx-2">${cantidad}</span>
                                <button class="btn btn-outline-light ml-2 btn-sm" type="button" id="sumarStockItemSimple${id}">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        ` 
                        : `
                            <p class="card-text mb-0">Ítems:</p>
                            <ul class="list-group list-group-flush" id="listaItemsCategoria${id}">
                            </ul>
                        `}
                    </div>
                </div>
            `;
            cardsStock.appendChild(nuevaCard);
            // TODO: Agregar validación para preguntar si desea eliminar
            const botonEliminar = document.getElementById(`eliminarStock${id}`);
            botonEliminar.addEventListener("click", () => {
                manejadorStock = manejadorStock.filter(stock => {
                    if (stock.id !== id) {
                        return stock
                    }
                });
                guardarStockLocal();
                renderizarStock();
            });
            if (itemSimple) {
                // Evento de suma y resta de stock
                const botonRestar = document.getElementById(`restarStockItemSimple${id}`);
                if (manejadorStock.find(stock => stock.id == id).cantidad == 0) {
                    botonRestar.classList.add("disabled");
                }
                botonRestar.addEventListener("click", () => {
                    if (manejadorStock.find(stock => stock.id == id).cantidad > 0) {
                        manejadorStock.find(stock => stock.id == id).cantidad -= 1;
                        guardarStockLocal();
                        renderizarStock();
                    }
                });
                const botonSumar = document.getElementById(`sumarStockItemSimple${id}`);
                botonSumar.addEventListener("click", () => {
                    botonRestar.classList.remove("disabled");
                    manejadorStock.find(stock => stock.id == id).cantidad += 1;
                    guardarStockLocal();
                    renderizarStock();
                });
            } else {
                // Obtener contenedor de ítems de la categoría y añadir ítems
                const listaItemsCategoria = document.getElementById(`listaItemsCategoria${id}`);
                listaItemsCategoria.innerHTML = "";
                items.forEach(({idItem, nombre, cantidad}) => {
                    let nuevoItem = document.createElement("li");
                    nuevoItem.classList.add("list-group-item", "custom-list-group-item", "d-flex", "align-items-center", "justify-content-between");
                    nuevoItem.id = `item${idItem}`;
                    nuevoItem.innerHTML = `
                        ${nombre}
                        <div class="d-flex align-items-center justify-content-end">
                            <button class="btn btn-outline-light mr-2 btn-sm" type="button" id="restarStockCategoria${id}Item${idItem}">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <span class="mx-2">${cantidad}</span>
                            <button class="btn btn-outline-light ml-2 btn-sm" type="button" id="sumarStockCategoria${id}Item${idItem}">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    `;
                    listaItemsCategoria.appendChild(nuevoItem);
                    const botonRestar = document.getElementById(`restarStockCategoria${id}Item${idItem}`);
                    if (manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad == 0) {
                        botonRestar.classList.add("disabled");
                    }
                    botonRestar.addEventListener("click", () => {
                        if (manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad > 0) {
                            manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad -= 1;
                            guardarStockLocal();
                            renderizarStock();
                        }
                    });
                    const botonSumar = document.getElementById(`sumarStockCategoria${id}Item${idItem}`);
                    botonSumar.addEventListener("click", () => {
                        botonRestar.classList.remove("disabled");
                        manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad += 1;
                        guardarStockLocal();
                        renderizarStock();
                    });
                });
            }
        });
    } else {
        emptyStateStock.classList.remove("d-none");
    }
}

const app = () => {
    renderizarFormularioNuevoStock();
    obtenerStockLocal();
    renderizarStock();
}

app();