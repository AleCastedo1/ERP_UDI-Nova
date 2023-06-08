var gestionNow = 0;

var periodoNow = 0;

var saveGestion = {
    nombre: false,
    fechaI: true,
    fechaF: true,
    estado: true
}

window.onload = () => {
    document.getElementById("List-Menu").children[2].click();

    const paramUrl = window.location.search;
    const paramUrlPEG = new URLSearchParams(paramUrl);

    userNow = paramUrlPEG.get("currentUser");
    empresaNow = paramUrlPEG.get("id_empresa");
    gestionNow = paramUrlPEG.get("keyManagement");

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

    GetBuscarGestion(data => {
        document.getElementById("h1-tabla-perido").textContent = 'Periodos de la gestion "' + data.result.gestion[0].nombre + '"';

        document.getElementById("add_DateStart").setAttribute("min", data.result.gestion[0].fechaInicio.split('T')[0]);
        document.getElementById("add_DateStart").setAttribute("max", data.result.gestion[0].fechaFin.split('T')[0]);

        document.getElementById("add_DateEnd").setAttribute("min", data.result.gestion[0].fechaInicio.split('T')[0]);
        document.getElementById("add_DateEnd").setAttribute("max", data.result.gestion[0].fechaFin.split('T')[0]);

        document.getElementById("add_DateStart").value = data.result.gestion[0].fechaInicio.split('T')[0];
        document.getElementById("add_DateEnd").value = data.result.gestion[0].fechaFin.split('T')[0];

    }, gestionNow);

    cargarListaPeriodos(gestionNow);
}

function cargarListaPeriodos(idGestion) {
    let padre = document.getElementById("table_Periodo").getElementsByTagName("tbody")[0];
    padre.innerHTML = "";


    GetBDPeriodoxGestion(data => {
        if (data.result.periodo.length > 0) {
            document.getElementById("Accion-Print").innerHTML = '<i class="btn-acciones-gestion fa-regular fa-circle-left" onclick="Atras_Gestion()" style="margin-right: 20px;"></i> <i class="btn-acciones-gestion fa-solid fa-print" onclick="imprimir_Periodo(' + gestionNow + ')" title="Imprimir Periodo"></i>';
        }

        data.result.periodo.forEach(element => {
            const trNew = document.createElement("tr");

            const tdNombr = document.createElement("td");
            const tdFechaI = document.createElement("td");
            const tdFechaF = document.createElement("td");
            const tdEstado = document.createElement("td");
            const tdAcciones = document.createElement("td");

            tdNombr.textContent = element.nombre;

            element.fechaInicio = element.fechaInicio.replace('-', '/');
            element.fechaInicio = element.fechaInicio.replace('-', '/');
            element.fechaFin = element.fechaFin.replace('-', '/');
            element.fechaFin = element.fechaFin.replace('-', '/');

            tdFechaI.textContent = invertirFecha(element.fechaInicio.split('T')[0]);
            tdFechaF.textContent = invertirFecha(element.fechaFin.split('T')[0]);


            tdEstado.innerHTML = element.estado == 1 ? "Abierto" : "Cerrado";

            trNew.id = "tr_" + element.iD_Periodo;

            if (element.estado == 1) {
                tdAcciones.innerHTML = '<div class="accionesTblPeriodo">' +
                    '<i class="iconG fa-solid fa-pen-to-square" onclick="Editar(' + element.iD_Periodo + ')"></i>' +
                    '<i class="iconG fa-sharp fa-solid fa-trash" onclick="Eliminar(' + element.iD_Periodo + ')"></i>' +
                    '</div>';
            } else {
                /*tdAcciones.innerHTML="Gestion no autorizada.";*/
                tdAcciones.innerHTML = '<div class="accionesTblPeriodo" style="justify-content:center;">' +
                    'No Permitido...' +
                    '</div>';
            }

            trNew.appendChild(tdNombr);
            trNew.appendChild(tdFechaI);
            trNew.appendChild(tdFechaF);
            trNew.appendChild(tdEstado);
            trNew.appendChild(tdAcciones);
            padre.appendChild(trNew);
        });
    }, idGestion);
}

document.getElementById("btn-add-Periodo").addEventListener("click", function (params) {
    document.getElementById("pantallasoGU").style.display = "flex";
});

document.getElementById("add_NombreP").addEventListener("keyup", function (params) {
    document.getElementById("img-done").style.display = "block";
    document.getElementById("img-fail").style = "none";
    document.getElementById("msj-alert_N").textContent = "";
    document.getElementById("add_NombreP").style = "none";
    saveGestion.nombre = true;

    if (params.srcElement.value.trim().length == 0 || params.srcElement.value.trim().length > 30) {
        document.getElementById("img-done").style = "none";
        document.getElementById("img-fail").style.display = "block";
        document.getElementById("msj-alert_N").textContent = params.srcElement.value.length == 0 ? "Campo nombre no permite valores vacios." : "Campo nombre exedio el limite de caracteres.";
        document.getElementById("add_NombreP").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        saveGestion.nombre = false;
    }
})

document.getElementById("add_DateStart").addEventListener("change", function (params) {
    const fechaInicio = params.srcElement.value;
    const FechaFin = document.getElementById("add_DateEnd").value;

    if (fechaInicio >= FechaFin) {
        document.getElementById("add_DateStart").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        document.getElementById("msj-alert_DS").textContent = "Fecha inicial no puede ser mayor/igual a Fecha Final.";
        saveGestion.fechaI = false;
    } else {
        document.getElementById("add_DateStart").style = "none";
        document.getElementById("msj-alert_DS").textContent = "";
        saveGestion.fechaI = true;
    }

    if (FechaFin <= fechaInicio) {
        document.getElementById("add_DateEnd").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        document.getElementById("msj-alert_DE").textContent = "Fecha Final no puede ser menor/igual a Fecha Inicial.";
        saveGestion.fechaF = false;
    } else {
        document.getElementById("add_DateEnd").style = "none";
        document.getElementById("msj-alert_DE").textContent = "";
        saveGestion.fechaF = true;
    }
})

document.getElementById("add_DateEnd").addEventListener("change", function (params) {
    const fechaInicio = document.getElementById("add_DateStart").value;
    const fechaFin = params.srcElement.value;

    if (fechaFin <= fechaInicio) {
        document.getElementById("add_DateEnd").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        document.getElementById("msj-alert_DE").textContent = "Fecha Final no puede ser menor/igual a Fecha Inicial.";
        saveGestion.fechaF = false;
    } else {
        document.getElementById("add_DateEnd").style = "none";
        document.getElementById("msj-alert_DE").textContent = "";
        saveGestion.fechaF = true;
    }

    if (fechaInicio >= fechaFin) {
        document.getElementById("add_DateStart").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        document.getElementById("msj-alert_DS").textContent = "Fecha inicial no puede ser mayor/igual a Fecha Final.";
        saveGestion.fechaI = false;
    } else {
        document.getElementById("add_DateStart").style = "none";
        document.getElementById("msj-alert_DS").textContent = "";
        saveGestion.fechaI = true;
    }
})

var updateState = 0;

document.getElementById("form_Periodo").addEventListener("submit", function (params) {
    params.preventDefault();
    const datos = Object.fromEntries(new FormData(params.target));
    const valFechaI = document.getElementById("add_DateStart").value;
    const valFechaF = document.getElementById("add_DateEnd").value;

    if (userNow > 0) {
        if (saveGestion.nombre == true && saveGestion.fechaF == true && saveGestion.fechaI == true) {
            const decision = {
                nombreA: true,
                fechIn: true,
                fechaFn: true
            }

            GetBDPeriodoxGestion(data => {
                data.result.periodo.forEach(element => {
                    if (periodoNow != element.iD_Periodo) {
                        if (datos.add_NombreP.toLowerCase().trim() == element.nombre.toLowerCase().trim() && decision.nombreA == true) {
                            showToast(11);
                            decision.nombreA = false;
                        }
                        if (valFechaI >= element.fechaInicio.split('T')[0] && valFechaI <= element.fechaFin.split('T')[0] && decision.fechIn == true) {
                            showToast(14);
                            decision.fechIn = false;
                        }
                        if (valFechaF >= element.fechaInicio.split('T')[0] && valFechaF <= element.fechaFin.split('T')[0] && decision.fechaFn == true) {
                            showToast(15);
                            decision.fechaFn = false;
                        }
                    }
                });;

                if (decision.fechIn == true && decision.fechaFn == true && decision.nombreA == true) {
                    if (updateState == 0) {
                        SaveDataPeriodo(datos.add_NombreP.trim(), datos.add_DateStart, datos.add_DateEnd, userNow, gestionNow);
                    } else {
                        UpdateDataPeriodo(datos.add_NombreP.trim(), datos.add_DateStart, datos.add_DateEnd, userNow, gestionNow, periodoNow);
                    }
                }
            }, gestionNow);
        } else {
            validarDatos(datos.add_NombreP, datos.add_DateStart, datos.add_DateEnd);
        }
    } else {

    }




});

document.getElementById("CerrarAddPeriodo").addEventListener("click", function (params) {
    document.getElementById("form_Periodo").reset();
    LimpiarForm();
    document.getElementById("pantallasoGU").style.display = "none";
});

const validarDatos = (nombre, dateI, dateF) => {
    if (dateF <= dateI) {
        document.getElementById("add_DateEnd").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        document.getElementById("msj-alert_DE").textContent = "Fecha Final no puede ser menor/igual a Fecha Inicial.";
        saveGestion.fechaF = false;
    } else {
        document.getElementById("add_DateEnd").style = "none";
        document.getElementById("msj-alert_DE").textContent = "";
        saveGestion.fechaF = true;
    }

    if (dateI >= dateF) {
        document.getElementById("add_DateStart").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        document.getElementById("msj-alert_DS").textContent = "Fecha inicial no puede ser mayor/igual a Fecha Final.";
        saveGestion.fechaI = false;
    } else {
        document.getElementById("add_DateStart").style = "none";
        document.getElementById("msj-alert_DS").textContent = "";
        saveGestion.fechaI = true;
    }

    if (nombre.trim().length == 0 || nombre.trim().length > 30) {
        document.getElementById("img-done").style = "none";
        document.getElementById("img-fail").style.display = "block";
        document.getElementById("msj-alert_N").textContent = nombre.trim().length == 0 ? "Campo nombre no permite valores vacios." : "Campo nombre exedio el limite de caracteres.";
        document.getElementById("add_NombreP").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
        saveGestion.nombre = false;
    }
}

function LimpiarForm() {
    document.getElementById("form_Periodo").reset();

    saveGestion.nombre = false;
    saveGestion.fechaI = false;
    saveGestion.fechaF = false;

    periodoNow = 0;

    document.getElementById("h2-tl-Periodo").textContent = 'AGREGAR PERIODO';


    GetBuscarGestion(data => {
        document.getElementById("add_DateStart").value = data.result.gestion[0].fechaInicio.split('T')[0];
        document.getElementById("add_DateEnd").value = data.result.gestion[0].fechaFin.split('T')[0];

    }, gestionNow);

    document.getElementById("img-fail").style = "none";
    document.getElementById("img-done").style = "none";

    document.getElementById("add_NombreP").style = "none";
    document.getElementById("add_DateStart").style = "none";
    document.getElementById("add_DateEnd").style = "none";

    document.getElementById("msj-alert_N").textContent = "";
    document.getElementById("msj-alert_DS").textContent = "";
    document.getElementById("msj-alert_DE").textContent = "";
    updateState = 0;
}

function Editar(idPeriod) {
    document.getElementById("pantallasoGU").style.display = "flex";

    SearchPeriodo_One(data => {
        document.getElementById("h2-tl-Periodo").textContent = 'Editar Periodo "' + data.result.periodo[0].nombre + '"';
        document.getElementById("add_NombreP").value = data.result.periodo[0].nombre;
        document.getElementById("add_DateStart").value = data.result.periodo[0].fechaInicio.split('T')[0];
        document.getElementById("add_DateEnd").value = data.result.periodo[0].fechaFin.split('T')[0];

    }, idPeriod);

    updateState = 1;
    saveGestion.nombre = true;
    saveGestion.fechaI = true;
    saveGestion.fechaF = true;
    periodoNow = idPeriod;
}

function Eliminar(idPeriodo) {
    document.getElementById("pantallasoDE").style.display = "flex";
    SearchPeriodo_One(data => {
        document.getElementById("h2-deletePeriodo").textContent = 'Eliminar el Periodo "' + data.result.periodo[0].nombre + '"';
    }, idPeriodo);
    periodoNow = idPeriodo;
}

document.getElementById("cerrarDeletePeriodo").addEventListener("click", function (params) {
    document.getElementById("pantallasoDE").style.display = "none";
    limpiarForm();
});

document.getElementById("btnDeletePeriodo").addEventListener("click", function (params) {
    DeleteFisicPeriodo(periodoNow);
});

function Atras_Gestion(params) {
    newDirigirXnombre("Gestion", userNow, empresaNow, 0, 0);
}

function imprimir_Periodo(id_gestion) {
    window.open('http://localhost:80/ReportsERP/report/Empresas_ERP/ReportePeriodos?Periodo_X_Gestion=' + id_gestion, '_blank');
}

function invertirFecha(fecha) {
    const partes = fecha.split('/');

    const dia = partes[2];
    const mes = partes[1];
    const anio = partes[0];

    return `${dia}/${mes}/${anio}`;
}

