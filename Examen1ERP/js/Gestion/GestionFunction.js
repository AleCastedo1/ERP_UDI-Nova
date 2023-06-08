var saveGestion = {
    nombre: false,
    fechaI: false,
    fechaF: false,
    estado: true
}

window.onload = () => {
    document.getElementById("List-Menu").children[2].click();

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

    cargarListaGestion(empresaNow);

    GetBuscarEmpresa(dato => {
        document.getElementById("h1-header").innerText = 'Empresa "' + dato.result.empresa[0].nombre + '"';
    }, empresaNow);

    GetDataUsuarioID(data => {
        document.getElementById("name-User").innerText = data.result.usuario[0].nombre;
    }, userNow);

    var mes = (new Date().getMonth() + 1).toString().length == 1 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    var dia = new Date().getDate().toString().length == 1 ? "0" + (new Date().getDate()) : (new Date().getDate());
    var newfecha = new Date().getFullYear() + "-" + mes + "-" + dia;

    document.getElementById("add_DateStart").value = newfecha;
    document.getElementById("add_DateEnd").value = newfecha;
}


function cargarListaGestion(idEmpresa) {
    let padre = document.getElementById("table_Gestion").getElementsByTagName("tbody")[0];
    padre.innerHTML = "";

    GetBDGestion(data => {
        data.result.gestion.forEach(element => {
            const trNew = document.createElement("tr");
            const tdNombr = document.createElement("td");
            const tdFechaI = document.createElement("td");
            const tdFechaF = document.createElement("td");
            const tdEstado = document.createElement("td");
            const tdAcciones = document.createElement("td");
            element.fechaInicio = element.fechaInicio.replace('-', '/');
            element.fechaInicio = element.fechaInicio.replace('-', '/');
            element.fechaFin = element.fechaFin.replace('-', '/');
            element.fechaFin = element.fechaFin.replace('-', '/');

            tdNombr.textContent = element.nombre;


            tdFechaI.textContent = invertirFecha(element.fechaInicio.split('T')[0]);
            tdFechaF.textContent = invertirFecha(element.fechaFin.split('T')[0]);


            tdEstado.innerHTML = element.estado == 1 ? "Abierto" : "Cerrado";

            trNew.id = "tr_" + element.iD_Gestion;
            GetBDPeriodoxGestion(data => {
                if (data.result.periodo.length > 0) {
                    if (element.estado == 1) {
                        tdAcciones.innerHTML = '<div class="accionesTblGestion">' +
                            '<i class="iconDisabled  fa-solid fa-pen-to-square" ></i>' +
                            '<i class="iconDisabled fa-sharp fa-solid fa-trash" ></i>' +
                            '<i class="iconG fa-regular fa-calendar-plus" onclick="newDirigirXnombre(4,' + userNow + ',' + empresaNow + ',' + element.iD_Gestion + ',0)" title="Agregar Periodos"></i>' +
                            '</div>';
                    } else {
                        tdAcciones.innerHTML = '<div class="accionesTblGestion">' +
                            '<i class="iconDisabled  fa-solid fa-pen-to-square" ></i>' +
                            '<i class="iconDisabled fa-sharp fa-solid fa-trash" ></i>' +
                            '<i class="iconG fa-solid fa-calendar-day" onclick="newDirigirXnombre(4,' + userNow + ',' + empresaNow + ',' + element.iD_Gestion + ',0)" title="Ver Periodos Realizados"></i>' +
                            '</div>';
                    }
                }
                else {
                    if(element.estado==1){
                        tdAcciones.innerHTML = '<div class="accionesTblGestion">' +
                            '<i class="iconG fa-solid fa-pen-to-square" onclick="Editar(' + element.iD_Gestion + ')"></i>' +
                            '<i class="iconG fa-sharp fa-solid fa-trash" onclick="Eliminar(' + element.iD_Gestion + ')"></i>' +
                            '<i class="iconG fa-regular fa-calendar-plus" onclick="newDirigirXnombre(4,' + userNow + ',' + empresaNow + ',' + element.iD_Gestion + ',0)" title="Agregar Periodos"></i>' +
                            '</div>';
                    }else{
                        tdAcciones.innerHTML = '<div class="accionesTblGestion">' +
                            '<i class="iconDisabled  fa-solid fa-pen-to-square" ></i>' +
                            '<i class="iconDisabled fa-sharp fa-solid fa-trash" ></i>' +
                            '<i class="iconG fa-regular fa-calendar-plus" onclick="newDirigirXnombre(4,' + userNow + ',' + empresaNow + ',' + element.iD_Gestion + ',0)" title="Ver Periodos Realizados"></i>' +
                            '</div>';
                    }
                }

            }, element.iD_Gestion);
            //window.location.href = http://127.0.0.1:5500/Paginas/Periodo/periodo.html?empresaNow=28&currentUser=1&keyManagement=7
            trNew.appendChild(tdNombr);
            trNew.appendChild(tdFechaI);
            trNew.appendChild(tdFechaF);
            trNew.appendChild(tdEstado);
            trNew.appendChild(tdAcciones);
            padre.appendChild(trNew);
        });
    }, idEmpresa);
}


document.getElementById("add_NombreG").addEventListener("keyup", function (params) {
    document.getElementById("img-done").style.display = "block";
    document.getElementById("img-fail").style = "none";
    document.getElementById("msj-alert_N").textContent = "";
    document.getElementById("add_NombreG").style = "none";
    saveGestion.nombre = true;

    if (params.srcElement.value.length == 0 || params.srcElement.value.length > 30) {
        document.getElementById("img-done").style = "none";
        document.getElementById("img-fail").style.display = "block";
        document.getElementById("msj-alert_N").textContent = params.srcElement.value.length == 0 ? "Campo nombre no permite valores vacios." : "Campo nombre exedio el limite de caracteres.";
        document.getElementById("add_NombreG").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
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

var updatebtnGestion = 0;
var Gestion_ID = 0;

document.getElementById("form_Gestion").addEventListener("submit", function (params) {
    const datos = Object.fromEntries(new FormData(params.target));

    const fechaI = params.srcElement.add_DateStart.value.split('-')[1] + "-" + params.srcElement.add_DateStart.value.split('-')[2] + "-" + params.srcElement.add_DateStart.value.split('-')[0];
    const fechaF = params.srcElement.add_DateEnd.value.split('-')[1] + "-" + params.srcElement.add_DateEnd.value.split('-')[2] + "-" + params.srcElement.add_DateEnd.value.split('-')[0];
    params.preventDefault();

    if (userNow > 0) {
        if (saveGestion.nombre == true && saveGestion.fechaI == true && saveGestion.fechaF == true && saveGestion.estado == true) {
            GetBDGestion(data => {
                const decision = {
                    nombreA: true,
                    fechIn: true,
                    fechaFn: true
                }
                data.result.gestion.forEach(element => {
                    if (Gestion_ID != element.iD_Gestion) {
                        if (datos.add_NombreG.toLowerCase().trim() == element.nombre.toLowerCase().trim() && decision.nombreA == true) {
                            showToast(11);
                            decision.nombreA = false;
                        }

                        if (datos.add_DateStart >= element.fechaInicio.split('T')[0] && datos.add_DateStart <= element.fechaFin.split('T')[0] && decision.fechIn == true) {
                            showToast(14);
                            decision.fechIn = false;
                        }
                        if (datos.add_DateEnd >= element.fechaInicio.split('T')[0] && datos.add_DateEnd <= element.fechaFin.split('T')[0] && decision.fechaFn == true) {
                            showToast(15);
                            decision.fechaFn = false;
                        }
                    }
                });
                if (decision.fechIn == true && decision.fechaFn == true && decision.nombreA == true) {
                    if (updatebtnGestion == 0) {
                        SaveDataGestion(params.srcElement.add_NombreG.value, fechaI, fechaF, userNow, empresaNow);
                    }
                    else {
                        UpdateManagement(params.srcElement.add_NombreG.value, fechaI, fechaF, userNow, empresaNow, Gestion_ID);
                    }
                }
            }, empresaNow);
        } else {
            if (params.srcElement.add_NombreG.value.length == 0) {
                document.getElementById("img-done").style = "none";
                document.getElementById("img-fail").style.display = "block";
                document.getElementById("msj-alert_N").textContent = "Campo nombre no permite valores vacios.";
                document.getElementById("add_NombreG").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
                saveGestion.nombre = false;
            }
            if (datos.add_DateStart == datos.add_DateEnd) {
                document.getElementById("add_DateEnd").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
                document.getElementById("msj-alert_DE").textContent = "Fecha Final no puede ser menor/igual a Fecha Inicial.";

                document.getElementById("add_DateStart").style.boxShadow = '0 0 0 .25rem rgba(229, 0, 0, 0.6)';
                document.getElementById("msj-alert_DS").textContent = "Fecha inicial no puede ser mayor/igual a Fecha Final.";
            }
        }
    } else {
        window.location.replace("http://127.0.0.1:" + window.location.port + "/");
    }
});


document.getElementById("btn-add-Gestion").addEventListener("click", function (params) {
    GetBDGestion(data => {
        let contador = 0;
        data.result.gestion.forEach(element => {
            if (element.estado == 1) {
                contador++;
            }
        });
        if (contador > 1) {
            showToast(16);
        } else {
            document.getElementById("pantallasoG").style.display = "flex";
        }
    }, empresaNow);

});

document.getElementById("CerrarAddGestion").addEventListener("click", function (params) {
    document.getElementById("pantallasoG").style.display = "none";
    limpiarForm();
});
function limpiarForm() {
    document.getElementById("form_Gestion").reset();

    saveGestion.nombre = false;
    saveGestion.fechaI = false;
    saveGestion.fechaF = false;
    Gestion_ID = 0;
    var newfecha = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + new Date().getDate();

    document.getElementById("h2-tl-gestion").textContent = 'AGREGAR GESTION';

    document.getElementById("add_DateStart").value = newfecha;
    document.getElementById("add_DateEnd").value = newfecha;

    document.getElementById("img-fail").style = "none";
    document.getElementById("img-done").style = "none";

    document.getElementById("add_NombreG").style = "none";
    document.getElementById("add_DateStart").style = "none";
    document.getElementById("add_DateEnd").style = "none";

    document.getElementById("msj-alert_N").textContent = "";
    document.getElementById("msj-alert_DS").textContent = "";
    document.getElementById("msj-alert_DE").textContent = "";
    updatebtnGestion = 0;
}

function Editar(idGestion) {
    document.getElementById("pantallasoG").style.display = "flex";
    GetBuscarGestion(data => {
        document.getElementById("h2-tl-gestion").textContent = 'Editar Gestion "' + data.result.gestion[0].nombre + '"';
        document.getElementById("add_NombreG").value = data.result.gestion[0].nombre;
        document.getElementById("add_DateStart").value = data.result.gestion[0].fechaInicio.split('T')[0];
        document.getElementById("add_DateEnd").value = data.result.gestion[0].fechaFin.split('T')[0];
    }, idGestion);
    updatebtnGestion = 1;
    saveGestion.nombre = true;
    saveGestion.fechaI = true;
    saveGestion.fechaF = true;
    Gestion_ID = idGestion;
}

function Eliminar(idGestion) {
    document.getElementById("pantallasoGD").style.display = "flex";
    GetBuscarGestion(data => {
        document.getElementById("h2-deleteManagement").textContent = 'Eliminar la Gestion "' + data.result.gestion[0].nombre + '"';
    }, idGestion);
    Gestion_ID = idGestion;
}

document.getElementById("cerrarDeleteManagement").addEventListener("click", function (params) {
    document.getElementById("pantallasoGD").style.display = "none";
    limpiarForm();
});

document.getElementById("btnDeleteManagement").addEventListener("click", function (params) {
    DeleteFisicManagement(Gestion_ID);
});

function imprimirGestiones() {
    window.open('http://localhost:80/ReportsERP/report/Empresas_ERP/ReporteGestiones?Gestion_X_Empresa=' + empresaNow, '_blank');
}

function imprimirPeriodo(id_gestion) {
    window.open('http://localhost:80/ReportsERP/report/Empresas_ERP/ReportePeriodos?Periodo_X_Gestion=' + id_gestion, '_blank');
}

function invertirFecha(fecha) {
    const partes = fecha.split('/');

    const dia = partes[2];
    const mes = partes[1];
    const anio = partes[0];

    return `${dia}/${mes}/${anio}`;
}


