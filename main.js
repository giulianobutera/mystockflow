/**
 * Clase para inicializar stock
 */
class Stock {
    /**
     * @param {number} id - valor único de la categoría o ítem simple.
     * @param {string} nombreStock - nombre de la categoría o ítem simple.
     * @param {boolean} itemSimple - indica si es una ítem simple (true) o si es una categoría (false).
     * @param {string} descripcion - breve descripción de la categoría o ítem simple.
     * @param {Array<{idItem: number, nombre: string, cantidad: number}>|null} items - contiene los datos de los ítems la categoría, si es un ítem simple el valor es null.
     * @param {number|null} cantidad - indica la cantidad de stock del ítem simple, si es una categoría es null.
     */
    constructor(id, nombreStock, itemSimple, descripcion, items, cantidad) {
        this.id = id;
        this.nombreStock = nombreStock;
        this.itemSimple = itemSimple;
        this.descripcion = descripcion;
        this.items = items || null;
        this.cantidad = cantidad || null;
    }
}

/**
 * Objeto que contiene una enumeración de los tipos de stock.
 */
const enumTipoStock = {
    categoria: 'categoria',
    itemSimple: 'itemSimple',
}

/**
 * Array que permite manejar y almacenar el stock.
 */
let manejadorStock = [];

/**
 * Array que permite manejar las plantillas de stock guardadas
 */
let plantillasStock = [];

/**
 * Array que permite llevar un listado de los ítems agregados en una categoría que se está agregando,
 * de esta manera poder controlar el botón de borrado en el modal y el guardado de la categoría.
 */
let itemsCategoriaEnModal = [];

/**
 * String que indica el tipo de stock que se está agregando
 */
let tipoDeStockEnModal = '';

/**
 * Función para obtener de localStorage el stock guardado
 */
const obtenerStockLocal = () => {
    manejadorStock = JSON.parse(localStorage.getItem('manejadorStock')) || [];
};

/**
 * Función para guardar en localStorage el stock editado
 */
const guardarStockLocal = () => {
    localStorage.setItem('manejadorStock', JSON.stringify(manejadorStock));
};

/**
 * Función para renderizar un nuevo ítem dentro de la categoría a agregar
 * @param {number|string} idNuevoItem indica el id del nuevo item
 * @returns html correspondiente al nuevo item
 */
const generarItemCategoria = (idNuevoItem) => {
    let nuevoItemCategoria = document.createElement('div');
    nuevoItemCategoria.classList.add('row', 'mt-1',);
    nuevoItemCategoria.id = `item${idNuevoItem}`;
    nuevoItemCategoria.innerHTML = `
        <div class="col-7">
            <input type="text" class="form-control" id="nombreItem${idNuevoItem}" placeholder="Ingrese el nombre del ítem" required>
        </div>
        <div class="col-4">
            <input type="number" class="form-control" id="cantidadItem${idNuevoItem}" placeholder="Ingrese la cantidad de stock" required>
        </div>
        <div class="col-1 d-flex flex-column align-items-center justify-content-end">
            <button class="btn btn-outline mb-1 btn-sm" type="button" id="eliminarItem${idNuevoItem}">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
    `;
    itemsCategoriaEnModal.push(idNuevoItem);
    return nuevoItemCategoria;
};

/**
 * Función para verificar el boton de borrado de cada ítem dentro de la categoría a agregar
 */
const verificarBotonEliminarItem = () => {
    if (itemsCategoriaEnModal.length == 1) {
        document.getElementById(`eliminarItem${itemsCategoriaEnModal[0]}`).classList.add('disabled');
    } else {
        itemsCategoriaEnModal.forEach(item => {
            document.getElementById(`eliminarItem${item}`).classList.remove('disabled');
        });
    }
}

/**
 * Función para determinar qué campos mostrar en el modal de agregar nuevo stock
 * @param {string} tipoStock indica los campos del tipo de stock que se debe mostrar en el modal
 */
const cambiarTipoStockEnModal = (tipoStock) => {
    tipoDeStockEnModal = tipoStock;
    switch (tipoStock) {
        case enumTipoStock.categoria:
            // Mostrar sección categoría y ocultar la de ítem simple
            document.getElementById('seccionCategoria').classList.remove('d-none');
            document.getElementById('seccionItemSimple').classList.add('d-none');
            document.getElementById('radioCategoria').setAttribute('checked', true);
            document.getElementById('radioItemSimple').removeAttribute('checked');
            // Reiniciar valor y quitar required en los input de ítem simple
            document.getElementById('nombreItemSimple').value = '';
            document.getElementById('descripcionItemSimple').value = '';
            document.getElementById('cantidadItemSimple').value = '';
            document.getElementById('nombreItemSimple').removeAttribute('required');
            document.getElementById('cantidadItemSimple').removeAttribute('required');
            // Agregar required en los input de categoría
            document.getElementById('nombreCategoria').setAttribute('required', true);
            // Agregar el primer item de la categoría
            itemsCategoria.innerHTML = `
                <div class="row mt-1" id="itemBase">
                    <div class="col-7">
                        <label for="nombreItemBase" class="form-label">Nombre del ítem</label>
                        <input type="text" class="form-control" id="nombreItemBase" placeholder="Ingrese el nombre del ítem" required>
                    </div>
                    <div class="col-4">
                        <label for="cantidadItemBase" class="form-label">Stock</label>
                        <input type="number" class="form-control" id="cantidadItemBase" placeholder="Ingrese la cantidad de stock" required>
                    </div>
                    <div class="col-1 d-flex flex-column align-items-center justify-content-end">
                        <button class="btn btn-outline mb-1 btn-sm disabled" type="button" id="eliminarItemBase">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </div>
            `;
            // Agregar el evento eliminar para el boton
            document.getElementById('eliminarItemBase').addEventListener('click', () => {
                itemsCategoriaEnModal = itemsCategoriaEnModal.filter(item => item != 'Base');
                document.getElementById('itemBase').remove();
                verificarBotonEliminarItem();
            });
            itemsCategoriaEnModal = ['Base'];
            break;
    
        case enumTipoStock.itemSimple:
            // Mostrar sección ítem simple y ocultar la de categoría
            document.getElementById('seccionItemSimple').classList.remove('d-none');
            document.getElementById('seccionCategoria').classList.add('d-none');
            document.getElementById('radioItemSimple').setAttribute('checked', true);
            document.getElementById('radioCategoria').removeAttribute('checked');
            // Reiniciar valor y quitar required en los input de categoría
            document.getElementById('nombreCategoria').value = '';
            document.getElementById('descripcionCategoria').value = '';
            document.getElementById('itemsCategoria').innerHTML = '';
            document.getElementById('nombreCategoria').removeAttribute('required');
            // Agregar required en los input de ítem simple
            document.getElementById('nombreItemSimple').setAttribute('required', true);
            document.getElementById('cantidadItemSimple').setAttribute('required', true);
            break;
        
        default:
            break;
    }
}

/**
 * Función para crear array de ítems de la categoría a agregar
 * @returns array de ítems en categoría a agregar
 */
const crearArrayItemsCategoria = () => {
    let arrayItemsCategoria = [];
    itemsCategoriaEnModal.forEach(item => {
        arrayItemsCategoria.push({
            idItem: item, 
            nombre: document.getElementById(`nombreItem${item}`).value, 
            cantidad: parseInt(document.getElementById(`cantidadItem${item}`).value)
        });
    });
    return arrayItemsCategoria;
};

/**
 * Función para renderizar en html el manejador de stock
 */
const renderizarStock = () => {
    if (manejadorStock.length > 0) {
        // Obtener y ocultar empty state
        const emptyStateStock = document.getElementById('emptyStateStock');
        emptyStateStock.classList.add('d-none');
        // Obtener contenedor de cards y agregar stock
        const cardsStock = document.getElementById('cardsStock');
        cardsStock.innerHTML = '';
        manejadorStock.forEach(({id, nombreStock, itemSimple, descripcion, items, cantidad}) => {
            let nuevaCard = document.createElement('div');
            nuevaCard.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');
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
                            <div>
                                <button class="btn btn-outline-light ml-2 btn-sm" type="button" id="eliminarStock${id}">
                                    <i class="bi bi-trash3-fill"></i>
                                </button>
                            </div>
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
            const botonEliminar = document.getElementById(`eliminarStock${id}`);
            botonEliminar.addEventListener('click', () => {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success m-1',
                        cancelButton: 'btn btn-danger m-1'
                    },
                    buttonsStyling: false
                });
                swalWithBootstrapButtons.fire({
                    title: `¿Estás seguro que deseas eliminar ${itemSimple ? "el ítem simple " : "la categoría "} ${nombreStock}?`,
                    text: 'Esta acción no se podrá deshacer',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        manejadorStock = manejadorStock.filter(stock => stock.id !== id);
                        guardarStockLocal();
                        renderizarStock();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `Se ha eliminado ${itemSimple ? "el ítem simple " : "la categoría "} ${nombreStock}`,
                            showConfirmButton: false,
                            timer: 1800
                        });
                    }
                });
            });
            if (itemSimple) {
                // Evento de suma y resta de stock
                const botonRestar = document.getElementById(`restarStockItemSimple${id}`);
                if (manejadorStock.find(stock => stock.id == id).cantidad == 0) {
                    botonRestar.classList.add('disabled');
                }
                botonRestar.addEventListener('click', () => {
                    if (manejadorStock.find(stock => stock.id == id).cantidad > 0) {
                        manejadorStock.find(stock => stock.id == id).cantidad -= 1;
                        guardarStockLocal();
                        renderizarStock();
                    }
                });
                const botonSumar = document.getElementById(`sumarStockItemSimple${id}`);
                botonSumar.addEventListener('click', () => {
                    botonRestar.classList.remove('disabled');
                    manejadorStock.find(stock => stock.id == id).cantidad += 1;
                    guardarStockLocal();
                    renderizarStock();
                });
            } else {
                // Obtener contenedor de ítems de la categoría y añadir ítems
                const listaItemsCategoria = document.getElementById(`listaItemsCategoria${id}`);
                listaItemsCategoria.innerHTML = '';
                items.forEach(({idItem, nombre, cantidad}) => {
                    let nuevoItem = document.createElement('li');
                    nuevoItem.classList.add('list-group-item', 'custom-list-group-item', 'd-flex', 'align-items-center', 'justify-content-between');
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
                        botonRestar.classList.add('disabled');
                    }
                    botonRestar.addEventListener('click', () => {
                        if (manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad > 0) {
                            manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad -= 1;
                            guardarStockLocal();
                            renderizarStock();
                        }
                    });
                    const botonSumar = document.getElementById(`sumarStockCategoria${id}Item${idItem}`);
                    botonSumar.addEventListener('click', () => {
                        botonRestar.classList.remove('disabled');
                        manejadorStock.find(stock => stock.id == id).items.find(item => item.idItem == idItem).cantidad += 1;
                        guardarStockLocal();
                        renderizarStock();
                    });
                });
            }
        });
    } else {
        const cardsStock = document.getElementById('cardsStock');
        cardsStock.innerHTML='';
        emptyStateStock.classList.remove('d-none');
    }
}

/**
 * Función para renderizar el modal para agregar stock
 */
const renderizarFormularioNuevoStock = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const modalBootstrap = new bootstrap.Modal(document.getElementById('modalNuevoStock'));
        const form = document.getElementById('formularioNuevoStock');
        form.addEventListener('submit', (event) => {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                let nuevoStock = {};
                switch (tipoDeStockEnModal) {
                    case enumTipoStock.categoria:
                        nuevoStock = new Stock(
                            Math.floor(Math.random() * 1001),
                            document.getElementById('nombreCategoria').value,
                            false,
                            document.getElementById('descripcionCategoria').value || '',
                            crearArrayItemsCategoria(),
                            null
                        );
                        break;
                    case enumTipoStock.itemSimple:
                        nuevoStock = new Stock(
                            Math.floor(Math.random() * 1001),
                            document.getElementById('nombreItemSimple').value,
                            true,
                            document.getElementById('descripcionItemSimple').value || '',
                            null,
                            parseInt(document.getElementById('cantidadItemSimple').value)
                        );
                        break;
                }
                manejadorStock.push(nuevoStock);
                guardarStockLocal();
                renderizarStock();
                modalBootstrap.hide();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Se ha agregado ${tipoDeStockEnModal == enumTipoStock.categoria 
                        ? 'la categoría ' + document.getElementById('nombreCategoria').value 
                        : 'el ítem simple ' + document.getElementById('nombreItemSimple').value}`,
                    showConfirmButton: false,
                    timer: 1800
                });
            }
            form.classList.add('was-validated');
        }, false);
        
        // Reiniciar el formulario cuando se abre el modal
        document.getElementById('modalNuevoStock').addEventListener('show.bs.modal', () => {
            cambiarTipoStockEnModal(enumTipoStock.categoria);
            form.reset();
            form.classList.remove('was-validated');
        });

        // Manejar cambios en los radios de categoría/item
        let radios = document.querySelectorAll('input[name="tipoStock"]');
        radios.forEach((radio) => {
            radio.addEventListener('change', () => {
                cambiarTipoStockEnModal(radio.value);
            });
        });

        // Manejar evento en botón para agregar otro ítem
        document.getElementById('agregarOtroItem').addEventListener('click', () => {
            let idNuevoItem = Math.floor(Math.random() * 1001);
            document.getElementById('itemsCategoria').appendChild(generarItemCategoria(idNuevoItem));
            // Agregar el evento eliminar para el boton
            document.getElementById(`eliminarItem${idNuevoItem}`).addEventListener('click', () => {
                itemsCategoriaEnModal = itemsCategoriaEnModal.filter(item => item != idNuevoItem);
                document.getElementById(`item${idNuevoItem}`).remove();
                verificarBotonEliminarItem();
            });
            verificarBotonEliminarItem();
        });
    });
}

/**
 * Función para obtener mediante fetch y renderizar las opciones de plantillas de stock guardadas
 */
const obtenerPlantillasStock = async () => {
    try {
        const responsePlantillas = await fetch("plantillasStock.json");
        const plantillas = await responsePlantillas.json();
        plantillasStock = plantillas;
    } catch(err) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ha ocurrido un error al obtener las plantillas de stock.",
            showConfirmButton: false,
            timer: 1800
        });
    } finally {
        if (plantillasStock && plantillasStock.length > 0) {
            const dropdownPlantillas = document.getElementById(`dropdownPlantillas`);
            dropdownPlantillas.innerHTML = '';
            plantillasStock.forEach(({id, nombreStock, itemSimple, descripcion, items, cantidad}) => {
                let nuevaOpcion = document.createElement('li');
                nuevaOpcion.innerHTML = `
                    <a class="dropdown-item btn btn-link" data-bs-toggle="modal" data-bs-target="#modalNuevoStock" id="plantilla${id}">
                        ${nombreStock} ${!itemSimple ? '<i class="bi bi-folder-fill" title="Categoría"></i>' : ''}
                    </a>
                `;
                dropdownPlantillas.appendChild(nuevaOpcion);
                const cargarDatosModal = document.getElementById(`plantilla${id}`);
                cargarDatosModal.addEventListener('click', () => {
                    if (itemSimple) {
                        cambiarTipoStockEnModal(enumTipoStock.itemSimple);
                        document.getElementById('nombreItemSimple').value = nombreStock;
                        document.getElementById('descripcionItemSimple').value = descripcion || '';
                        document.getElementById('cantidadItemSimple').value = cantidad;
                    } else {
                        cambiarTipoStockEnModal(enumTipoStock.categoria);
                        document.getElementById('nombreCategoria').value = nombreStock;
                        document.getElementById('descripcionCategoria').value = descripcion || '';
                        document.getElementById('itemsCategoria').innerHTML = '';
                        itemsCategoriaEnModal = [];
                        items.forEach(({idItem, nombre, cantidad}) => {
                            document.getElementById('itemsCategoria').appendChild(generarItemCategoria(idItem));
                            document.getElementById(`eliminarItem${idItem}`).addEventListener('click', () => {
                                itemsCategoriaEnModal = itemsCategoriaEnModal.filter(item => item != idItem);
                                document.getElementById(`item${idItem}`).remove();
                                verificarBotonEliminarItem();
                            });
                            verificarBotonEliminarItem();
                            document.getElementById(`nombreItem${idItem}`).value = nombre;
                            document.getElementById(`cantidadItem${idItem}`).value = cantidad;
                        })

                    }
                });
            });
        } else {
            document.getElementById('botonNuevoStockPlantilla').classList.add('disabled');
        }
    }
};

/**
 * Función para inicializar la app.
 */
const app = () => {
    renderizarFormularioNuevoStock();
    obtenerStockLocal();
    renderizarStock();
    obtenerPlantillasStock();
}

app();