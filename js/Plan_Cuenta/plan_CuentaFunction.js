var BD_Empresa;
var switchText = true;
var cuentaNow = 0;


let clickTimer = null;
const delay = 210; // Tiempo límite en milisegundos para el doble clic

var userNow;
var empresaNow;

window.onload = () => {
    document.getElementById("List-Menu").children[1].click();

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

    GetBuscarEmpresa(data => {
        BD_Empresa = data.result.empresa[0];
    }, empresaNow);

    cargarListaCuenta(empresaNow);
}


//AQUI
function cargarListaCuenta(id_empresa) {
    GetBDCuenta_X_Empresa(data => {
        if (data.result.cuenta.length > 0) {
            const IPrind = document.createElement("i");
            IPrind.className = "print-PC fa-solid fa-print";
            IPrind.setAttribute("onclick", "imprimirCuenta()");
            document.getElementById("cabezaCuenta").appendChild(IPrind);

            $('#Listado-Cuentas').jstree({
                'core': {
                    'editable': true,
                    'check_callback': true,
                    'data': listaArbol(data.result.cuenta)
                }
            }).on('loaded.jstree', function () {
                $(this).jstree('open_all');
            }).on('rename_node.jstree', function (e, data) {
                setTimeout(() => {
                    editarMode = false;
                    $('#Listado-Cuentas').jstree('refresh');
                }, 170);
            });

        } else {
            $('#Listado-Cuentas').jstree({
                'core': {
                    'editable': true,
                    'check_callback': true,
                    'data': null
                }
            });
        }

    }, id_empresa);
}

var nodoEdit;
var editarMode = false;

document.getElementById("Listado-Cuentas").addEventListener("click", function (params) {
    if (clickTimer === null) {
        clickTimer = setTimeout(function () {
            clickTimer = null;
            if (params.target.role == "treeitem") {
                GetBDCuentaPlan(data => {
                    const cuentaSearch = data.result.cuenta[0].nivel.split(" ")[1];

                    if (BD_Empresa.niveles > cuentaSearch) {
                        switchText = false;
                        const newNode = {
                            id: "nodo-Doom", text: ""
                        };

                        GenerarNivel(params.target.textContent.split(" ")[0], params.target.id.split("_")[0]);
                        document.getElementById("PadreID").value = params.target.id.split("_")[0];


                        $('#Listado-Cuentas').jstree().create_node(params.target.id.split("_")[0], newNode);

                        $('#Listado-Cuentas').jstree('open_node', params.target.id);

                        $('#Listado-Cuentas').jstree(true).edit("nodo-Doom");
                    }
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
    codigo: "",
    nombre: ""
};

document.getElementById("Listado-Cuentas").addEventListener("dblclick", function (params) {
    if (params.target.role == "treeitem") {

        if (document.getElementById("nodo-Doom")) {
            $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
        }

        var node = $('#Listado-Cuentas').jstree('get_node', params.target.id);


        nodoContenido.id = params.target.id.split("_")[0];
        nodoContenido.idLI = params.target.id;
        nodoContenido.codigo = node.text.split(" ")[0];
        nodoContenido.nombre = params.target.textContent.replace(node.text.split(" ")[0], "").trim();

        node.text = nodoContenido.nombre;


        $('#Listado-Cuentas').jstree(true).edit(params.target.id);
        $('#Listado-Cuentas').jstree(true).select_node(params.target.id);
        
        editarMode = true;
    }
});


document.addEventListener("keyup", function (event, params) {
    if (document.getElementById("nodo-Doom") && event.key == "Enter") {
        if (document.getElementById("nodo-Doom").textContent.trim().length > 1 && document.getElementById("nodo-Doom").textContent.trim().length <= 50) {
            var Codigo = document.getElementById("codigoGenerado").value;
            var Nombre = document.getElementById("nodo-Doom").textContent;
            var Nivel = document.getElementById("nivelHidden").value;
            var TipoCuenta = document.getElementById("tipoCuenta_Hidden").value;
            var ID_CuentaPadre = document.getElementById("PadreID").value;

            GetBDCuenta_X_Empresa(data => {
                var BD_C = data.result.cuenta;
                const found = BD_C.find(nombres => {
                    return nombres.nombre.toLowerCase().trim() == Nombre.toLowerCase().trim();
                });

                if (found) {
                    showToast(28);
                    $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
                } else {
                    SaveDataPlanCuenta(Codigo, Nombre, Nivel, TipoCuenta, userNow, empresaNow, ID_CuentaPadre);
                }
            }, empresaNow);
        } else {
            document.getElementById("nodo-Doom").textContent.trim().length < 1 ? showToast(29) : showToast(8);
        }
    }
    if (editarMode == true && event.key == "Enter") {

        var Nombre = document.getElementById(nodoContenido.idLI).textContent;

        if (Nombre.trim().length > 1 && Nombre.trim().length <= 50) {
            GetBDCuenta_X_Empresa(data => {
                var BD_C = data.result.cuenta;
                const found = BD_C.find(nombres => {
                    if (nombres.id_Cuenta != nodoContenido.id) {
                        return nombres.nombre.toLowerCase().trim() == Nombre.toLowerCase().trim();
                    }
                });
                if (found) {
                    showToast(28);
                } else {
                    UpdateDataCuenta(nodoContenido.id, Nombre);
                }
            }, empresaNow);
        } else {
            Nombre.trim().length < 1 ? showToast(29) : showToast(8);
        }
        editarMode = false;
    }
});


document.getElementById("sinpadreFunction").addEventListener("click", function (params) {
    if(editarMode==false){
        $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");
        switchText = false;
    
        const newNode = {
            id: "nodo-Doom", text: ""
        };
    
        GenerarNivel("Ninguno", 0);
    
        document.getElementById("nivelHidden").value = "Nivel 1";
        document.getElementById("tipoCuenta_Hidden").value = "Global";
        document.getElementById("PadreID").value="0";
    
        $('#Listado-Cuentas').jstree().create_node("#", newNode);
    
        $('#Listado-Cuentas').jstree('open_node', "nodo-Doom");
    
        $('#Listado-Cuentas').jstree(true).edit("nodo-Doom");
    }
});


function SalirArbol() {
    if (document.getElementById("nodo-Doom")) {
        document.getElementById("nodo-Doom").remove();
    }
    $('#Listado-Cuentas').jstree('refresh');
    switchText = true;
}


function listaArbol(lista) {
    let treeList = [];
    let mappedList = {};
    let item;
    for (let i = 0; i < lista.length; i += 1) {
        item = {
            id: lista[i].id_Cuenta,
            text: lista[i].codigo + " " + lista[i].nombre,
            iD_CuentaPadre: lista[i].iD_CuentaPadre,
        };
        mappedList[item.id] = item;
        item.children = [];
        if (lista[i].iD_CuentaPadre === null) {
            treeList.push(item);
        } else {
            mappedList[lista[i].iD_CuentaPadre].children.push(item);
        }
    }
    return treeList;
}

function imprimirCuenta() {
    window.open('http://localhost:80/ReportsERP/report/Empresas_ERP/ReporteCuentaPlan?Cuenta_X_Gestion=' + empresaNow, '_blank');
};


const GenerarNivel = (ultimoNivel, cuentaVal) => { //CODIGO EJEM: 1.1.1 O NINGUNO , ID_PADRE
    GetBDCuenta_X_Empresa(data => {
        if (ultimoNivel == "Ninguno") {//AUMENTA UN PADRE
            if (data.result.cuenta.length > 0) {
                data.result.cuenta.forEach(element => {
                    if (element.iD_CuentaPadre == null) {
                        let nivel = parseInt(element.codigo.split('0')[0]) + 1;
                        ultimoNivel = element.codigo.split('0')[0];
                        ultimoNivel = element.codigo.replace(ultimoNivel.split('.')[0], nivel);
                        document.getElementById("codigoGenerado").value = ultimoNivel;
                    }
                });
            } else {
                let nivel1 = "1";
                for (let i = 0; i < BD_Empresa.niveles - 1; i++) {
                    nivel1 = nivel1 + ".0";
                }
                document.getElementById("codigoGenerado").value = nivel1;
            }
        } else {
            var ultimoHijo = "";
            var decision = false;

            if (cuentaVal != null) {
                data.result.cuenta.forEach(element => {
                    if (element.id_Cuenta == cuentaVal) {
                        if (BD_Empresa.niveles > (parseInt(element.nivel.split(" ")[1]) + 1)) {
                            document.getElementById("nivelHidden").value = "Nivel " + (parseInt(element.nivel.split(" ")[1]) + 1);
                            document.getElementById("tipoCuenta_Hidden").value = "Global";
                        } else {
                            document.getElementById("nivelHidden").value = "Nivel " + (parseInt(element.nivel.split(" ")[1]) + 1);
                            document.getElementById("tipoCuenta_Hidden").value = "Detalle";
                        }
                    }

                    if (element.iD_CuentaPadre == cuentaVal) {
                        ultimoHijo = element.codigo;
                        decision = true;
                    }
                });
            }

            if (decision == true) {
                document.getElementById("codigoGenerado").value = incrementarSerieHijos(ultimoHijo);
            } else {
                document.getElementById("codigoGenerado").value = incrementarPrimerCero(ultimoNivel);
            }

        }
    }, empresaNow);
}

function incrementarSerieHijos(serie) {
    const numeros = serie.split('.').map(Number);

    let i = numeros.length - 1;
    while (i >= 0 && numeros[i] === 0) {
        i--;
    }
    if (i >= 0) {
        numeros[i]++;
        i++;
    }
    while (i < numeros.length) {
        if (numeros[i] !== 0) {
            numeros[i]++;
            break;
        }
        i++;
    }
    const nuevaSerie = numeros.join('.');

    return nuevaSerie;
}

function incrementarPrimerCero(serie) {
    const numeros = serie.split('.').map(Number);

    let i = 0;
    while (i < numeros.length && numeros[i] !== 0) {
        i++;
    }
    if (i < numeros.length) {
        numeros[i] = 1;
        i++;
    }

    while (i < numeros.length) {
        if (numeros[i] !== 0) {
            numeros[i]++;
            break;
        }
        i++;
    }

    const nuevaSerie = numeros.join('.');

    return nuevaSerie;
}

document.getElementById("btnDeleteCuenta").addEventListener("click", function (params) {
    GetBDCuenta_X_Empresa(data => {
        let decision = true;
        let padreIDnow = 0;
        data.result.cuenta.forEach(element => {
            if (element.iD_CuentaPadre == cuentaNow & decision == true) {
                decision = false;
                showToast(23);
            }
            if (element.id_Cuenta == cuentaNow) {
                padreIDnow = element.iD_CuentaPadre;
            }
        });
        let contador = 0;
        let ubicacion = 1;
        let decisionMayor = true;

        if (decision == true) {
            data.result.cuenta.forEach(element => {
                if (element.iD_CuentaPadre == padreIDnow) {
                    contador++;
                    if (element.id_Cuenta != cuentaNow && decisionMayor == true) {
                        ubicacion++;
                    } else {
                        decisionMayor = false;
                    }
                }
            });
        }

        if (contador == ubicacion) {
            if (decision == true) {
                DeleteFisicP_Cuenta(cuentaNow);
            }
        } else {
            showToast(27);
            document.getElementById("pantallasoDelete").style = "none";
        }
    }, empresaNow);
});



document.getElementById("cerrarDeleteCuenta").addEventListener("click", function (params) {
    document.getElementById("pantallasoDelete").style.display = "none";
});

var deleteNodeID;
var deleteNodeText;

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
    document.getElementById("h2-delete-cuenta").textContent = 'Eliminar el Plan de Cuenta "' + deleteNodeText + '"?';

    document.getElementById("eliminarDrag").style.display = "flex";
}






















































































/*
function informacionCuenta(id_Cuenta) {
    document.getElementById("divEditar").style.display = "none";

    GetBDCuentaPlan(data => {
        var datos = data.result.cuenta[0]
        const padreInfo = document.getElementById("acciones-Cuenta");

        padreInfo.innerHTML = '<h2>Informacion de la cuenta "' + datos.codigo + '"</h2>' +
            '<div style="text-align:start; display:flex; flex-flow:column nowrap; gap:10px;">' +
            '<p>Level: ' + datos.nivel + '</p>' +
            '<p>Nombre: ' + datos.nombre + '</p>' +
            '<p>Tipo de Cuenta: ' + datos.tipoCuenta + '</p>' +
            '</div>' +
            '<div style="display:flex">' +
            '<input class="btn" style="display:none;" id="btnSaveEdit_' + id_Cuenta + '" type="button" value="Guardar" onclick="saveEdiatar(' + id_Cuenta + ')">' +
            '<input class="btn" type="button" id="btnEdit_1" value="Editar" onclick="EditarPC(' + id_Cuenta + ')">' +
            '<input class="btn" type="button" value="Eliminar" onclick="EliminarPC(' + id_Cuenta + ')">' +
            '</div>';

    }, id_Cuenta);
}

document.getElementById("CuentaNombre").addEventListener("keyup", function (params) {
    GetBDCuenta_X_Empresa(data => {
        data.result.cuenta.forEach(element => {
            if (element.nombre.toLowerCase() == params.srcElement.value.trim().toLowerCase()) {
                document.getElementById("CuentaNombre").style.boxShadow = " 0 0 0 .25rem rgba(229, 0, 0, 0.6)";
                document.getElementById("CuentaNombre").style.color = "rgba(229, 0, 0, 1)";
                showToast(11);
            }
        });
    }, empresaNow);
    document.getElementById("CuentaNombre").style = "none";

})

function AgregarModel() {

    document.getElementById("pantallaso").style.display = "flex";

    cargarListaCuenta(empresaNow, "board-lista-agregar");

    GetBDCuenta_X_Empresa(data => {
        if (data.result.cuenta.length > 0) {
            GenerarNivel("Ninguno");
        } else {
            let nivel1 = "1";
            for (let i = 0; i < BD_Empresa.niveles - 1; i++) {
                nivel1 = nivel1 + ".0";
            }
            document.getElementById("CuentaCodigo").value = nivel1;
        }

    }, empresaNow);
}





document.getElementById("cerrarScreen").addEventListener("click", function (params) {
    document.getElementById("pantallaso").style = "none";
    cargarListaCuenta(empresaNow, "Listado-Cuentas");
    LimpiarFormCuenta();
});



function EditarPC(id_Cuenta) {
    document.getElementById("divEditar").style.display = "flex";
    document.getElementById("btnEdit_1").setAttribute("disabled", "disabled");
    GetBDCuentaPlan(data => {
        document.getElementById("text_Nombre_Cuenta").value = data.result.cuenta[0].nombre;
    }, id_Cuenta)
    planNow = id_Cuenta;
}



function LimpiarFormCuenta() {
    document.getElementById("CuentaNombre").style = "none";
    document.getElementById("form_Cuenta").reset();
    padreSeleccionado = "Nivel 1";
    document.getElementById("padreID").value = "0";
    TipoCuenta = "Global";
}

document.getElementById("equisEditar").addEventListener("click", function (params) {
    document.getElementById("divEditar").style = "none";
    document.getElementById("btnEdit_1").removeAttribute("disabled");
});

document.getElementById("btn_save-cuenta").addEventListener("click", function (params) {
    const nombreC = document.getElementById("text_Nombre_Cuenta");
    GetBDCuenta_X_Empresa(data => {
        var decision = true;
        data.result.cuenta.forEach(element => {
            if (element.id_Cuenta != planNow) {
                if (element.nombre == nombreC.value) {
                    showToast(11);
                    decision = false;
                }
            }
        });
        if (decision == true) {
            UpdateDataCuenta(planNow, nombreC.value);
            setTimeout(() => {
                nombreC.value = "";
                document.getElementById("divEditar").style = "none";
                cargarListaCuenta(empresaNow, "Listado-Cuentas");
            }, 1500);
        }
    }, empresaNow);
});



function seleccionarpadre(id, boton) {
    if (BD_Empresa.niveles != boton.name.split(" ")[1]) {
        const suma = parseInt(boton.name.split(" ")[1]) + 1;

        document.getElementById("padreID").value = id;
        padreSeleccionado = boton.name;
        padreSeleccionado = padreSeleccionado.split(" ")[0] + " " + suma;

        GenerarNivel(boton.value, id);
        if (padreSeleccionado.split(" ")[1] == BD_Empresa.niveles) {
            TipoCuenta = "Detalle";

        } else {
            TipoCuenta = "Global";
        }
    } else {
        showToast(24);
    }
}

function GenerarNivelBTN() {
    GenerarNivel("Ninguno");
    padreSeleccionado = "Nivel 1";
    document.getElementById("padreID").value = "0";
    TipoCuenta = "Global";
}

function abrirNodos(padre) {
    GetBDCuenta_X_Empresa(data => {
        var BD = data.result.cuenta;
        let apagado = true;
        var listaPadres = [];

        listaPadres.unshift(padre);

        while (apagado) {
            BD.forEach(element => {
                if (padre == element.id_Cuenta) {
                    if (element.iD_CuentaPadre != null) {
                        listaPadres.unshift(element.iD_CuentaPadre);
                        padre = element.iD_CuentaPadre;
                    } else {
                        apagado = false;
                    }
                }
            });
        }
        listaPadres.forEach(element => {
            $('#Listado-Cuentas').jstree('open_node', element + "_anchor");
        });
    }, empresaNow);
}

function ordenLoco(DB_Datos) {
    let data = [];

    let cuentasRaiz = DB_Datos.filter(cuenta => cuenta.iD_CuentaPadre === null);

    cuentasRaiz.forEach(cuentaRaiz => {
        let nodoPadre = {
            "id": cuentaRaiz.id_Cuenta,
            "text": cuentaRaiz.codigo + " " + cuentaRaiz.nombre,
            "children": []
        };

        let hijos = DB_Datos.filter(cuenta => cuenta.iD_CuentaPadre === cuentaRaiz.id_Cuenta);

        hijos.forEach(hijo => {
            let nodoHijo = {
                "id": hijo.id_Cuenta,
                "text": hijo.codigo + " " + hijo.nombre,
            };
            nodoPadre.children.push(nodoHijo);
        });

        data.push(nodoPadre);
    });
    console.log(data);
    return data;
}

function convertToTree(list) {
    var map = {};
    var tree = [];

    for (var i = 0; i < list.length; i++) {
        map[list[i].id_Cuenta] = i;
        list[i].children = [];
    }

    for (var i = 0; i < list.length; i++) {
        var node = list[i];
        if (node.iD_CuentaPadre !== null) {
            list[map[node.iD_CuentaPadre]].children.push(node);
        } else {
            tree.push(node);
        }
    }

    function addText(node) {
        node.text = node.codigo + " " + node.nombre;
        for (var i = 0; i < node.children.length; i++) {
            addText(node.children[i]);
        }
    }

    for (var i = 0; i < tree.length; i++) {
        addText(tree[i]);
    }

    return tree;
}

*/
