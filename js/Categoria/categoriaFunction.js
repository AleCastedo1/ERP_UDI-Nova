var BD_Empresa;
var switchText = true;
var cuentaNow = 0;

let clickTimer = null;
const delay = 210; // Tiempo límite en milisegundos para el doble clic

var userNow;
var empresaNow;

var scrollPosition;

window.onload = () => {
    document.getElementById("List-Menu").children[4].click();

    const paramUrl = window.location.search;
    const paramUrlPEG = new URLSearchParams(paramUrl);
    userNow = paramUrlPEG.get("currentUser");
    empresaNow = paramUrlPEG.get("id_empresa");

    if (userNow == 0 || !userNow) {
        window.location.href = "http://127.0.0.1:" + window.location.port + "/index.html";
    } else {
        if (empresaNow == 0 || !empresaNow) {
            window.location.href = "http://127.0.0.1:" + window.location.port + "/Paginas/Empresa/Company.html?currentUser=" + userNow;
        }
    }

    GetBuscarEmpresa(dato => {
        document.getElementById("h1-header").innerText = 'Empresa "' + dato.result.empresa[0].nombre + '"';
    }, empresaNow);

    GetDataUsuarioID(data => {
        document.getElementById("name-User").innerText = data.result.usuario[0].nombre;
    }, userNow);

    cargarListaCategoria(empresaNow);
}

function cargarListaCategoria(empresaID) {
    console.log("Lista Cargada");
    GetBDCategoria_X_Empresa(data => {
        document.getElementById("cabezaCuenta").innerHTML=''+
        '<i class="print-PC fa-solid fa-print" onclick="imprimirCuenta()"></i>'+
        '<h2>Categorias</h2>'+
        '<i class="fa-sharp fa-solid fa-folder-open" id="sinpadreFunction" onclick="agregarPadres()" style="display: block;"></i>';
        if (data.result.categoria.length > 0) {
            
            $('#Listado-Cuentas').jstree({
                'core': {
                    'editable': true,
                    'check_callback': true,
                    'data': listaArbol(data.result.categoria)
                }
            }).on('loaded.jstree', function () {
                $(this).jstree('open_all');
            }).on('rename_node.jstree', function (e, data) {
                setTimeout(() => {
                    editarMode = false;
                    $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
                }, 170);
            });

        } else {
            $('#Listado-Cuentas').jstree({
                'core': {
                    'editable': true,
                    'check_callback': true,
                    'data': null
                }
            }).on('rename_node.jstree', function (e, data) {
                setTimeout(() => {
                    editarMode = false;
                    $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
                }, 170);
            })
        }

    }, empresaID);
}

var nodoEdit;
var editarMode = false;

document.getElementById("Listado-Cuentas").addEventListener("click", function (params) {
    if (clickTimer === null) {
        clickTimer = setTimeout(function () {
            clickTimer = null;
            if (params.target.role == "treeitem") {
                GetBDCategoria_X_ID(data => {
                    $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");

                    switchText = false;
                    const newNode = {
                        id: "nodo-Doom", text: ""
                    };

                    let newNivel = data.result.categoria[0].descripcion;
                    let numero = parseInt(newNivel.split(" ")[1]) + 1;
                    newNivel = newNivel.split(" ")[0]+" "+ numero;
                    
                    document.getElementById("PadreID").value = params.target.id.split("_")[0];
                    document.getElementById("nivelHidden").value = newNivel.trim();

                    $('#Listado-Cuentas').jstree().create_node(params.target.id.split("_")[0], newNode);

                    $('#Listado-Cuentas').jstree('open_node', params.target.id);

                    $('#Listado-Cuentas').jstree(true).edit("nodo-Doom");
                }, params.target.id.split("_")[0]);
            }
        }, delay);
    } else {
        clearTimeout(clickTimer);
        clickTimer = null;
    }

});

var nodoContenido = {
    id: 0,
    idLI: "",
    nombre: ""
};

document.getElementById("Listado-Cuentas").addEventListener("dblclick", function (params) {
    if (params.target.role == "treeitem") {

        $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");

        var node = $('#Listado-Cuentas').jstree('get_node', params.target.id);


        nodoContenido.id = params.target.id.split("_")[0];
        nodoContenido.idLI = params.target.id;
        nodoContenido.nombre = params.target.textContent.trim();

        node.text = nodoContenido.nombre;


        $('#Listado-Cuentas').jstree(true).edit(params.target.id);
        $('#Listado-Cuentas').jstree(true).select_node(params.target.id);
        
        editarMode = true;
    }
});


document.addEventListener("keyup", function (event, params) {
    if (document.getElementById("nodo-Doom") && event.key == "Enter") {
        if (document.getElementById("nodo-Doom").textContent.trim().length > 1 && document.getElementById("nodo-Doom").textContent.trim().length <= 50) {
            const categoria={
                nombre:document.getElementById("nodo-Doom").textContent,
                Descripcion: document.getElementById("nivelHidden").value,
                IdEmpresa: empresaNow,
                IdUsuario:userNow,
                IdCategoriaPadre: document.getElementById("PadreID").value
            };

            GetBDCategoria_X_Empresa(data => {
                var BD_C = data.result.categoria;
                const found = BD_C.find(nombres => {
                    return nombres.nombre.toLowerCase().trim() == categoria.nombre.toLowerCase().trim();
                });

                if (found) {
                    showToast(28);
                    $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
                } else {
                    SaveDataCategoria(categoria,scrollPosition);
                }
            }, empresaNow);
        } else {
            document.getElementById("nodo-Doom").textContent.trim().length < 1 ? showToast(29) : showToast(8);
        }
    }
    if (editarMode == true && event.key == "Enter") {

        var Nombre = document.getElementById(nodoContenido.idLI).textContent;

        if (Nombre.trim().length > 1 && Nombre.trim().length <= 50) {
            GetBDCategoria_X_Empresa(data => {
                var BD_C = data.result.categoria;
                
                const found = BD_C.find(nombres => {
                    if (nombres.id_Cuenta != nodoContenido.id) {
                        return nombres.nombre.toLowerCase().trim() == Nombre.toLowerCase().trim();
                    }
                });
                if (found) {
                    showToast(28);
                    $.jstree.reference('#Listado-Cuentas').set_text(nodoContenido.idLI, nodoContenido.nombre)
                } else {
                    UpdateDataCategoria(nodoContenido.id, Nombre);
                }
            }, empresaNow);
        } else {
            Nombre.trim().length < 1 ? showToast(29) : showToast(8);
        }
        editarMode = false;
    }
});



function agregarPadres() {
    if(editarMode==false){
        $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
        switchText = false;
    
        const newNode = {
            id: "nodo-Doom", text: ""
        };
    
        document.getElementById("nivelHidden").value = "Nivel 1";
        document.getElementById("PadreID").value="0";
    
        $('#Listado-Cuentas').jstree().create_node("#", newNode);
    
        $('#Listado-Cuentas').jstree('open_node', "nodo-Doom");
    
        $('#Listado-Cuentas').jstree(true).edit("nodo-Doom");

        scrollPosition= $('#Listado-Cuentas').scrollTop();
    }
};

function listaArbol(lista) {
    let treeList = [];
    let mappedList = {};
    let item;
    for (let i = 0; i < lista.length; i += 1) {
        item = {
            id: lista[i].idCategoria,
            text: lista[i].nombre,
            idCategoriaPadre: lista[i].idCategoriaPadre,
        };
        mappedList[item.id] = item;
        item.children = [];
        if (lista[i].idCategoriaPadre === null) {
            treeList.push(item);
        } else {
            mappedList[lista[i].idCategoriaPadre].children.push(item);
        }
    }
    return treeList;
}

document.getElementById("cerrarDeleteCuenta").addEventListener("click", function (params) {
    document.getElementById("pantallasoDelete").style.display = "none";
});

var deleteNodeID;
var deleteNodeText;

document.getElementById("btnDeleteCuenta").addEventListener("click", function (params) {
    GetBDCategoria_X_Empresa(data => {
        DeleteFisic_Categoria(cuentaNow);
    }, empresaNow);
});

document.getElementById('Listado-Cuentas').addEventListener("dragstart", function (event) {
    if (event.target.role == "treeitem") {
        document.getElementById("eliminarDrag").style.display = "flex";

        setTimeout(() => {
            document.getElementById("eliminarDrag").style.height = "100px";
            document.getElementById("eliminarI").style.fontSize = "100px";
        }, 20);


        deleteNodeID = event.target.id;
        deleteNodeText = event.target.textContent;
    }
});

document.getElementById('Listado-Cuentas').addEventListener("dragend", function (event) {
    setTimeout(() => {
        document.getElementById("eliminarDrag").style = "none";

        document.getElementById("eliminarI").style = "none";
    }, 50);
});


function SoltarNodo_ID() {
    cuentaNow = deleteNodeID.split("_")[0];
    document.getElementById("pantallasoDelete").style.display = "flex";
    document.getElementById("h2-delete-cuenta").textContent = 'Eliminar la Cuenta "' + deleteNodeText;

    document.getElementById("eliminarDrag").style.display = "flex";
}

const GenerarNivel = ( ) => {
    
}