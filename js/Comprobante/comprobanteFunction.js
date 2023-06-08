var arregloAgregado = [];
var BD_Comprobante;
var BD_Periodo;
var BD_Monedas;
var BD_EmpresaMoneda;

var NumeroDetalle;

var verificar = {
    fecha: false,
    tipoCambio: true,
    glosa: false,
    total: false
}

GetAllDataMoneda(data => {
    BD_Monedas = data.result.moneda;
});

GetBDMonedaXEmpresa(data => {
    BD_EmpresaMoneda = data.result.moneda[0];
}, new URLSearchParams(window.location.search).get("id_empresa"));

GetBDComprobante_X_Empresa(data => {
    BD_Comprobante = data.result.comprobante;
    if (document.getElementById("serieComp")) {
        if (BD_Comprobante.length > 0) {
            document.getElementById("serieComp").value = parseInt(BD_Comprobante[0].serie) + 1;
        } else {
            document.getElementById("serieComp").value = 1;
        }
    }
}, new URLSearchParams(window.location.search).get("id_empresa"));


GetBD_Detalles_X_Empresa(data => {
    if (data.result.detalle.length > 0) {
        NumeroDetalle = data.result.detalle[0].numero;
    } else {
        NumeroDetalle = 0;
    }
}, new URLSearchParams(window.location.search).get("id_empresa"))


if (document.getElementById("fechaComp")) {
    GetBDPeriodoxEmpresa(data => {
        BD_Periodo = data.result.periodo;
    }, new URLSearchParams(window.location.search).get("id_empresa"));
}

window.onload = () => {
    document.getElementById("List-Menu").children[1].click();

    const paramUrl = window.location.search;
    const paramUrlPEG = new URLSearchParams(paramUrl);
    userNow = paramUrlPEG.get("currentUser");
    empresaNow = paramUrlPEG.get("id_empresa");
   
    vistaComprobante = paramUrlPEG.get("msj");
    if (vistaComprobante) {
        showToast("El comprobante a sido guardado satisfactoriamente.");
        var historial = window.history;
        historial.pushState({}, '', "Comprobante.html?id_empresa="+empresaNow+"&currentUser="+userNow);
        vistaComprobante = null;
        
        GetBDComprobante_X_Empresa(llamada=>{
            setTimeout(() => {
                document.getElementById("List_comprobante#"+llamada.result.comprobante[0].idComprobante).click("true");
            }, 200)
        },empresaNow);
    }

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

    if (document.getElementById("table_Comprobante")) {
        cargarListaComprobante();
    }
    if (document.getElementById("cuentaDetalle")) {
        cargarCuentasDetalle(empresaNow);
    }
    if (document.getElementById("monedasEmp")) {

        GetBDMonedaXEmpresa(monedaEmpresa => {
            const BD_MonEmp = monedaEmpresa.result.moneda[0];

            const selectMoneda = document.getElementById("monedasEmp");

            selectMoneda.innerHTML = selectMoneda.innerHTML + '<option value="' + BD_MonEmp.idMonedaPrincipal + '">' + BD_Monedas.find(moneda => {return moneda.idMoneda == BD_MonEmp.idMonedaPrincipal;}).nombre + ' (Principal)</option>';
            
            selectMoneda.innerHTML = selectMoneda.innerHTML + '<option value="' + BD_MonEmp.idMonedaAlternativa + '">' + BD_Monedas.find(moneda => {return moneda.idMoneda == BD_MonEmp.idMonedaAlternativa;}).nombre + ' (Alterna)</option>';
            
            document.getElementById("tipoCambioComp").value = BD_MonEmp.cambio;
        }, empresaNow)

    }

    if (document.getElementById("fechaComp")) {
        var mes = (new Date().getMonth() + 1).toString().length == 1 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
        var dia = new Date().getDate().toString().length == 1 ? "0" + (new Date().getDate()) : (new Date().getDate());
        var newfecha = new Date().getFullYear() + "-" + mes + "-" + dia;

        document.getElementById("fechaComp").value = newfecha;
    }
}

if (document.getElementById("btn-add-Comprobante")) {
    document.getElementById("btn-add-Comprobante").addEventListener("click", function (params) {
        window.location.href = "http://" + window.location.host + "/Paginas/Comprobante/AddComprobante.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
    });
}

function cargarCuentasDetalle(id) {
    GetBDCuenta_X_Empresa(data => {
        var cuentaDetalle = document.getElementById("cuentaDetalle");

        cuentaDetalle.innerHTML = '',
            data.result.cuenta.forEach(element => {
                if (element.tipoCuenta == "Detalle") {
                    cuentaDetalle.innerHTML = cuentaDetalle.innerHTML + '<option value="' + element.id_Cuenta + '" id="option_' + element.id_Cuenta + '">' + element.codigo + " - " + element.nombre + '</option>';
                }
            });
    }, id)
}

var contador = 1;

function ModalAddDetalle() {
    if (document.getElementById("cuentaDetalle").options.length > 0) {
        ordenarSelectCuenta();

        $('#cuentaDetalle').select2();
        document.getElementById("pantallaso").style.display = "flex";
        document.getElementById("contadorH2").textContent = "Agregar Detalle #" + contador;

        if (document.getElementById("muestra_tr")) {
            var padre = document.getElementById("table_DetalleComprobante").getElementsByTagName("tbody")[0];
            padre.innerHTML = ' ';
        }

        document.getElementById("glosaDetalle").value = document.getElementById("glosaComp").value;
        document.getElementById("debeDetalle").removeAttribute("readonly");
        document.getElementById("haberDetalle").removeAttribute("readonly");
    } else {
        showToast(30);
    }
}

var editarMode = false;
var idOption = 0;

function ModalEditarDetalle(id) {
    editarMode = true;
    idOption = id;

    const tdEdit = document.getElementById("tr_" + id).getElementsByTagName("td");

    document.getElementById("cuentaDetalle").innerHTML = document.getElementById("cuentaDetalle").innerHTML +
        '<option value="' + id + '" id="option_' + id + '">' + tdEdit[0].textContent + '</option>';

    ModalAddDetalle();

    document.getElementById("contadorH2").textContent = "Editar Detalle";

    const debe = document.getElementById("debeDetalle");
    const haber = document.getElementById("haberDetalle");

    ordenarSelectCuenta();
    document.getElementById("cuentaDetalle").value = id;

    document.getElementById("glosaDetalle").value = tdEdit[1].textContent;
    document.getElementById("debeDetalle").value = tdEdit[2].textContent;
    document.getElementById("haberDetalle").value = tdEdit[3].textContent;

    if (debe.value > 0) {
        haber.setAttribute("readonly", "true");
        debe.removeAttribute("readonly");
    }
    if (haber.value > 0) {
        debe.setAttribute("readonly", "true");
        haber.removeAttribute("readonly");
    }
}

function cancelarDetalle() {
    document.getElementById("pantallaso").style = "none";
    var padre = document.getElementById("table_DetalleComprobante").getElementsByTagName("tbody")[0];

    if (padre.innerHTML.length == 1) {
        padre.innerHTML = '<tr id="muestra_tr">' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '</tr>';
    }

    document.getElementById("detalle_Comprobante").reset();
    //console.log(padre.childElementCount);

    if (editarMode == true) {
        document.getElementById("option_" + idOption).remove();
        editarMode = false;
    }
}

if (document.getElementById("detalle_Comprobante")) {
    document.getElementById("detalle_Comprobante").addEventListener("submit", function (params) {
        const datos = Object.fromEntries(new FormData(params.target));
        params.preventDefault();

        if (parseInt(datos.debeDetalle) > 0 || parseInt(datos.haberDetalle) > 0) {
            if (editarMode == false) {
                contador++;
                document.getElementById("contadorH2").textContent = "Agregar Detalle #" + contador

                var padre = document.getElementById("table_DetalleComprobante").getElementsByTagName("tbody")[0];
                padre.innerHTML = padre.innerHTML + '<tr id="tr_' + datos.cuentaDetalle + '">' +
                    '<td style="text-align:left;">' + document.getElementById("cuentaDetalle").options[document.getElementById("cuentaDetalle").selectedIndex].text + '</td>' +
                    '<td>' + datos.glosaDetalle + '</td>' +
                    '<td style="text-align: right;">' + parseInt(datos.debeDetalle) + '</td>' +
                    '<td style="text-align: right;">' + parseInt(datos.haberDetalle) + '</td>' +
                    '<td style="display:flex; flex-flow:row nowrap; justify-content:space-around; padding:0px">' +
                    '<i class="i-td fa-solid fa-pen-to-square" onclick="ModalEditarDetalle(' + datos.cuentaDetalle + ')"></i>' +
                    '<i class="i-tdfa-sharp fa-solid fa-trash" onclick="quitar_TR(' + datos.cuentaDetalle + ')"></i>' +
                    '</td>' +
                    '</tr>';
                const cuentaArreglo = {
                    id: datos.cuentaDetalle,
                    valor: document.getElementById("cuentaDetalle").options[document.getElementById("cuentaDetalle").selectedIndex].text,
                };
                arregloAgregado.push(cuentaArreglo);

                document.getElementById("option_" + datos.cuentaDetalle).remove();

                const glosaDetalle = document.getElementById("glosaDetalle").value;

                totalTD();

                document.getElementById("detalle_Comprobante").reset();
                document.getElementById("haberDetalle").removeAttribute("readonly");
                document.getElementById("debeDetalle").removeAttribute("readonly");

                document.getElementById("glosaDetalle").value = glosaDetalle;

                if (document.getElementById("cuentaDetalle").options.length == 0) {
                    document.getElementById("pantallaso").style = "none";
                }
            } else {
                const tdEdit = document.getElementById("tr_" + idOption).getElementsByTagName("td");

                const posicion = arregloAgregado.findIndex(objeto => objeto.id == idOption);

                arregloAgregado[posicion].id = datos.cuentaDetalle;
                arregloAgregado[posicion].valor = document.getElementById("cuentaDetalle").options[document.getElementById("cuentaDetalle").selectedIndex].text;

                tdEdit[0].textContent = document.getElementById("cuentaDetalle").options[document.getElementById("cuentaDetalle").selectedIndex].text;
                tdEdit[1].textContent = datos.glosaDetalle;
                tdEdit[2].textContent = datos.debeDetalle;
                tdEdit[3].textContent = datos.haberDetalle;

                totalTD();

                tdEdit[4].getElementsByTagName("i")[0].setAttribute("onclick", 'ModalEditarDetalle(' + datos.cuentaDetalle + ')');
                tdEdit[4].getElementsByTagName("i")[1].setAttribute("onclick", 'quitar_TR(' + datos.cuentaDetalle + ')');

                document.getElementById("tr_" + idOption).id = "tr_" + datos.cuentaDetalle;

                document.getElementById("option_" + datos.cuentaDetalle).remove();

                document.getElementById("detalle_Comprobante").reset();
                document.getElementById("haberDetalle").removeAttribute("readonly");
                document.getElementById("debeDetalle").removeAttribute("readonly");

                document.getElementById("pantallaso").style = "none";
                editarMode = false;
            }

            const scroollDetalle=document.getElementById("tbodyDetalles");
            
            if(scroollDetalle.clientHeight>250){
                scroollDetalle.scrollTo({
                    top:scroollDetalle.scrollHeight,
                    behavior:"smooth"
                });
            }
        } else {
            document.getElementById("debeDetalle").style.boxShadow = "rgba(229, 0, 0, 0.6) 0px 0px 0px 0.25rem";
            document.getElementById("debeDetalle").style.color = "rgba(229, 0, 0, 0.6)";

            document.getElementById("haberDetalle").style.boxShadow = "rgba(229, 0, 0, 0.6) 0px 0px 0px 0.25rem";
            document.getElementById("haberDetalle").style.color = "rgba(229, 0, 0, 0.6)";
            showToast(38);
        }
    });
}

if (document.getElementById("detalle_Comprobante")) {
    document.getElementById("detalle_Comprobante").addEventListener("keyup", function (params) {
        if (params.target.id == "debeDetalle") {
            params.target.value = parseInt(params.target.value);
            if (params.target.value > 0) {
                document.getElementById("haberDetalle").setAttribute("readonly", "true");
            } else {
                document.getElementById("haberDetalle").removeAttribute("readonly");
            }
            if (document.getElementById("haberDetalle").value.length == 0) {
                document.getElementById("haberDetalle").value = 0;
            }
        }
        if (params.target.id == "haberDetalle") {
            params.target.value = parseInt(params.target.value);
            if (params.target.value > 0) {
                document.getElementById("debeDetalle").setAttribute("readonly", "true");
            } else {
                document.getElementById("debeDetalle").removeAttribute("readonly");
            }
            if (document.getElementById("debeDetalle").value.length == 0) {
                document.getElementById("debeDetalle").value = 0;
            }
        }
    });
}

if (document.getElementById("haberDetalle")) {
    document.getElementById("haberDetalle").addEventListener("keypress", function (params) {
        if (params.target.value) {
            document.getElementById("debeDetalle").style = "none";
            document.getElementById("haberDetalle").style = "none";
        }
    });

    document.getElementById("debeDetalle").addEventListener("keypress", function (params) {
        if (params.target.value) {
            document.getElementById("haberDetalle").style = "none";
            document.getElementById("debeDetalle").style = "none";
        }
    });
}

// if (document.getElementById("haberDetalle")) {

//     document.getElementById("debeDetalle").addEventListener("click", function (params) {
//         const haberCampo=document.getElementById("debeDetalle").value;

//         if(params.target.value==0){
//             params.target.value="";
//         }
        
//     });

//     document.getElementById("haberDetalle").addEventListener("click", function (params) {
//         const debeCampo=document.getElementById("debeDetalle").value;

//         if(params.target.value==0){
//             params.target.value="";
//         }
        
//     });
// }

function quitar_TR(id_tr) {
    document.getElementById("tr_" + id_tr).remove();

    const padre = document.getElementById("table_DetalleComprobante").getElementsByTagName("tbody")[0];

    var cuentaDetalle = document.getElementById("cuentaDetalle");


    const opntionRestore = arregloAgregado.find(buscar => {
        return buscar.id == id_tr;
    })

    cuentaDetalle.innerHTML = cuentaDetalle.innerHTML + '<option value="' + opntionRestore.id + '" id="option_' + opntionRestore.id + '">' + opntionRestore.valor + '</option>';

    for (let w = 0; w < arregloAgregado.length; w++) {
        if (opntionRestore.id == arregloAgregado[w].id) {
            arregloAgregado.splice(w, 1);
        }
    }

    totalTD();

    if (padre.innerHTML.length <= 1) {
        padre.innerHTML = '<tr id="muestra_tr">' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '<td>Ninguno..</td>' +
            '</tr>';
    }
    contador--;
}

function saveComprobante() {
    const padre = document.getElementById("table_DetalleComprobante").getElementsByTagName("tbody")[0];

    document.getElementById("saveComprobanteNew").removeAttribute("onclick");
    document.getElementById("saveComprobanteNew").className="btn-i-disabled fa-solid fa-floppy-disk";

    setTimeout(() => {
        document.getElementById("saveComprobanteNew").setAttribute("onclick","saveComprobante()");
        document.getElementById("saveComprobanteNew").className="btn-i fa-solid fa-floppy-disk";
        showToast(41);
    }, 3500)

    if (padre.childElementCount > 1) {
        if (document.getElementById("td_debe").textContent > 0 && document.getElementById("td_haber").textContent > 0) {
            if (document.getElementById("td_debe").textContent == document.getElementById("td_haber").textContent) {
                verificar.total = true;
            } else {
                showToast(36);
            }
        } else {
            showToast(35);
        }

        if (verificar.fecha == true && verificar.glosa == true && verificar.tipoCambio == true && verificar.total == true) {
            const comprobanteOBJ = {
                serie: document.getElementById("serieComp").value,
                glosa: document.getElementById("glosaComp").value,
                fecha: document.getElementById("fechaComp").value,
                tc: document.getElementById("tipoCambioComp").value,
                estado: document.getElementById("estadoComp").value == "Abierto" ? 1 : 2,
                tipoComprobante: document.getElementById("tipoComp").value,
                idEmpresa: empresaNow,
                idUsuario: userNow,
                idMoneda: document.getElementById("monedasEmp").value,
            };
            var matrizComprobante = [];
            var matrizDetalle = [];

            matrizComprobante.push(comprobanteOBJ);

            padre.querySelectorAll("tr").forEach(function (element, index) {
                NumeroDetalle = parseInt(NumeroDetalle) + 1;

                const tdLista = {
                    idDetalleComprobante: 0,
                    numero: NumeroDetalle,
                    glosa: element.getElementsByTagName("td")[1].textContent,
                    montoDebe: 0,
                    montoHaber: 0,
                    montoDebeAlt: 0,
                    montoHaberAlt: 0,
                    idUsuario: userNow,
                    idComprobante: 0,
                    idCuenta: parseInt(element.id.split("_")[1]),
                };

                if (comprobanteOBJ.idMoneda == BD_EmpresaMoneda.idMonedaPrincipal) {
                    tdLista.montoDebe = element.getElementsByTagName("td")[2].textContent;
                    tdLista.montoHaber = element.getElementsByTagName("td")[3].textContent;
                    tdLista.montoDebeAlt = Div_DebeHaber(element.getElementsByTagName("td")[2].textContent, document.getElementById("tipoCambioComp").value);
                    tdLista.montoHaberAlt = Div_DebeHaber(element.getElementsByTagName("td")[3].textContent, document.getElementById("tipoCambioComp").value);
                } else {
                    tdLista.montoDebe = Mult_DebeHaber(element.getElementsByTagName("td")[2].textContent, document.getElementById("tipoCambioComp").value);
                    tdLista.montoHaber = Mult_DebeHaber(element.getElementsByTagName("td")[3].textContent, document.getElementById("tipoCambioComp").value);
                    tdLista.montoDebeAlt = element.getElementsByTagName("td")[2].textContent;
                    tdLista.montoHaberAlt = element.getElementsByTagName("td")[3].textContent;
                }

                matrizDetalle.push(tdLista);
            });

            matrizComprobante[0].detalle = matrizDetalle;

            // console.log(matrizComprobante);
            GetBDPeriodoxEmpresa(data => {
                var ExisteFecha = false;

                data.result.periodo.forEach(element => {
                    if (ExisteFecha == false && element.fechaInicio.split("T")[0] <= comprobanteOBJ.fecha && element.fechaFin.split("T")[0] >= comprobanteOBJ.fecha && element.estado == 1) {
                        ExisteFecha = true;
                    }
                });

                if (ExisteFecha == true) {
                    if (comprobanteOBJ.tipoComprobante == "Apertura") {
                        Found_AperturaResult(data => {
                            data.result.found.forEach(aperturasFound => {
                                if (aperturasFound.fechaInicio.split("T")[0] <= comprobanteOBJ.fecha && aperturasFound.fechaFin.split("T")[0] >= comprobanteOBJ.fecha) {
                                    if (aperturasFound.foundResultApertura == 1) {
                                        showToast(39);
                                    } else {
                                        SaveDataComprobanteDetalle(matrizComprobante);
                                    }
                                }
                            });
                        }, empresaNow);
                    } else {
                        SaveDataComprobanteDetalle(matrizComprobante);
                    }
                } else {
                    showToast(32);
                }
            }, empresaNow);
        }
        else {
            if (verificar.fecha == false) {
                showToast(32);
                document.getElementById("fechaComp").style.boxShadow = "rgba(229, 0, 0, 0.6) 0px 0px 0px 0.25rem";
                document.getElementById("fechaComp").style.color = "rgba(229, 0, 0, 0.6)";
            }

            if (verificar.glosa == false) {
                showToast(33);
                document.getElementById("glosaComp").style.boxShadow = "rgba(229, 0, 0, 0.6) 0px 0px 0px 0.25rem";
                document.getElementById("glosaComp").style.color = "rgba(229, 0, 0, 0.6)";
            }

            if (verificar.tipoCambio == false) {
                showToast(34);
                document.getElementById("tipoCambioComp").style.boxShadow = "rgba(229, 0, 0, 0.6) 0px 0px 0px 0.25rem";
                document.getElementById("tipoCambioComp").style.color = "rgba(229, 0, 0, 0.6)";
            }
        }


    } else {
        showToast(31);
    }
}

if (document.getElementById("fechaComp")) {
    document.getElementById("fechaComp").addEventListener("change", function (params) {
        var ExisteFecha = false;
        BD_Periodo.forEach(element => {
            if (ExisteFecha == false && element.fechaInicio.split("T")[0] <= params.target.value && element.fechaFin.split("T")[0] >= params.target.value && element.estado == 1) {
                ExisteFecha = true;
            }
        });

        if (ExisteFecha == false) {
            document.getElementById("fechaComp").style.boxShadow = "rgba(229, 0, 0, 0.6) 0px 0px 0px 0.25rem";
            document.getElementById("fechaComp").style.color = "rgba(229, 0, 0, 0.6)";
            showToast(32);
        } else {
            document.getElementById("fechaComp").style = "none";
        }

        verificar.fecha = ExisteFecha;
    });
}

if (document.getElementById("tipoCambioComp")) {
    document.getElementById("tipoCambioComp").addEventListener("change", function (params) {
        params.srcElement.value = params.srcElement.value.replace(",", ".");

        if (params.srcElement.value.length > 0) {
            if (esNumeroValido(params.srcElement.value)) {
                verificar.tipoCambio = true;
            } else {
                showToast(34);
                verificar.tipoCambio = false;
            }
        } else {
            showToast(34);
            verificar.tipoCambio = false;
        }
    });
}

if (document.getElementById("glosaComp")) {
    document.getElementById("glosaComp").addEventListener("change", function (params) {
        if (params.target.value.trim().length > 0) {
            verificar.glosa = true;
        } else {
            showToast(33);
            verificar.glosa = false;
        }
    });
}

function esNumeroValido(cadena) {
    let numero = cadena.replace(",", ".");
    if (isNaN(numero)) {
        return false;
    } else if (parseFloat(numero) < 0) {
        return false;
    } else {
        return true;
    }
}

function soloNumerosYComasYPuntos(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode !== 44 && charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
    }
}


function ordenarSelectCuenta() {
    var selectCuentas = document.getElementById("cuentaDetalle");
    var opcionesSelect = [].slice.call(selectCuentas.options);

    opcionesSelect.sort(function (a, b) {
        if (a.text.toLowerCase() < b.text.toLowerCase()) return -1;
        if (a.text.toLowerCase() > b.text.toLowerCase()) return 1;
        return 0;
    });

    selectCuentas.innerHTML = '';

    opcionesSelect.forEach(function (option) {
        selectCuentas.add(option);
    });
}

function Mult_DebeHaber(num1, num2) {
    num1 = parseInt(num1);
    num2 = parseFloat(num2);
    var resultado = num1 * num2;

    return resultado.toPrecision();
}

function Div_DebeHaber(num1, num2) {
    num1 = parseInt(num1);
    num2 = parseFloat(num2);
    var resultado = num1 / num2;

    return resultado.toPrecision();
}

function totalTD() {
    const padreBody = document.getElementById("table_DetalleComprobante").getElementsByTagName("tbody")[0];
    const totalHaber = document.getElementById("td_debe");
    const totalDeber = document.getElementById("td_haber");

    totalHaber.textContent = "0";
    totalDeber.textContent = "0";

    padreBody.querySelectorAll("tr").forEach(element => {
        totalHaber.textContent = parseInt(totalHaber.textContent) + parseInt(element.getElementsByTagName("td")[2].textContent);
        totalDeber.textContent = parseInt(totalDeber.textContent) + parseInt(element.getElementsByTagName("td")[3].textContent);
    });
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////FUNCIONES LISTADO DE COMPROBANTE///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

var BD_Cuenta;
var ID_Imprimir;
var serieDetected;
GetBDCuenta_X_Empresa(data => {
    BD_Cuenta = data.result.cuenta;
}, new URLSearchParams(window.location.search).get("id_empresa"))

function cargarListaComprobante() {
    GetBDComprobante_X_Empresa(data => {
        let padre = document.getElementById("table_Comprobante").getElementsByTagName("tbody")[0];
        padre.innerHTML = ' ';

        data.result.comprobante.forEach(element => {
            padre.innerHTML = padre.innerHTML +
                '<tr id="List_comprobante#' + element.idComprobante + '" onclick="mostrarModalComprobante(this)">' +
                '<td>' + element.serie + '</td>' +
                '<td>' + invertirFecha(element.fecha) + '</td>' +
                '<td>' + element.glosa + '</td>' +
                '<td id="td_estado'+element.idComprobante+'">' + estadoString(element.estado,element.idComprobante) + '</td>' +
                '<td>' + element.tipoComprobante + '</td>' +
                '</tr>';
        });
    }, empresaNow);
}


function mostrarModalComprobante(id_lista) {
    document.getElementsByClassName("pantallaso")[0].style.display = "flex";
    document.getElementById("DetalleComprobante_modal").style.display = "flex";

    ID_Imprimir = id_lista.id.split("List_comprobante#")[1];

    Search_BD_Comprobante(data => {
        console.log(data.result.comprobante);
        if(data.result.comprobante[0].estado==2){
            document.getElementById("anularComprobante").style.display="none";
        }else{
            document.getElementById("anularComprobante").style="none";
        }

        document.getElementsByClassName("head_Comprobante")[0].getElementsByTagName("h2")[0].textContent = "Datos de Comprobante# " + data.result.comprobante[0].serie;
        serieDetected = data.result.comprobante[0].serie;
        document.getElementsByClassName("cuerpo_Comprobante")[0].getElementsByTagName("div")[0].innerHTML = '<p><b>Moneda Usada: </b>' + monedaString(data.result.comprobante[0].idMoneda) + ' </p>' +
            '<p><b>Tipo de Cambio: </b>' + data.result.comprobante[0].tc + ' </p>' +
            '<p><b>Glosa: </b>' + data.result.comprobante[0].glosa + ' </p>';

        document.getElementsByClassName("cuerpo_Comprobante")[0].getElementsByTagName("div")[1].innerHTML = ' <p><b>Estado: </b>' + estadoString(data.result.comprobante[0].estado) + ' </p>' +
            '<p><b>Fecha: </b>' + invertirFecha(data.result.comprobante[0].fecha) + ' </p>' +
            '<p><b>Comprobante: </b>' + data.result.comprobante[0].tipoComprobante + ' </p>';

        Search_BD_DetalleComprobante(detalleData => {
            console.log(detalleData.result.detalle);
            var padreD = document.getElementById("Detalles_Comprobante").getElementsByTagName("tbody")[0];
            var contador=0;

            padreD.innerHTML = ' ';
            if (data.result.comprobante[0].idMoneda == BD_EmpresaMoneda.idMonedaPrincipal) {
                detalleData.result.detalle.forEach(element => {
                    contador++;
                    padreD.innerHTML = padreD.innerHTML +
                        '<tr>' +
                        '<td style="display:none">' + contador + '</td>' +
                        '<td style="text-align: left;">' + cuentaString(element.idCuenta) + '</td>' +
                        '<td>' + element.glosa + '</td>' +
                        '<td style="text-align: right;">' + (element.montoDebe == 0 ? "" : DetectarDecimal(element.montoDebe)) + '</td>' +
                        '<td style="text-align: right;">' + (element.montoHaber == 0 ? "" : DetectarDecimal(element.montoHaber)) + '</td>' +
                        '</tr>';
                });
            } else {
                detalleData.result.detalle.forEach(element => {
                    contador++;
                    padreD.innerHTML = padreD.innerHTML +
                        '<tr>' +
                        '<td style="display:none">' + contador + '</td>' +
                        '<td style="text-align: left;">' + cuentaString(element.idCuenta) + '</td>' +
                        '<td>' + element.glosa + '</td>' +
                        '<td style="text-align: right;">' + (element.montoDebeAlt == 0 ? "" : DetectarDecimal(element.montoDebeAlt)) + '</td>' +
                        '<td style="text-align: right;">' + (element.montoHaberAlt == 0 ? "" : DetectarDecimal(element.montoHaberAlt)) + '</td>' +
                        '</tr>';
                });
            }

            totalTDDetalle();
        }, id_lista.id.split("List_comprobante#")[1]);
    }, id_lista.id.split("List_comprobante#")[1]);
}

if (document.getElementById("closedModel")) {
    document.getElementById("closedModel").addEventListener("click", function (params) {
        document.getElementsByClassName("pantallaso")[0].style = "none";
        document.getElementById("DetalleComprobante_modal").style = "none";
    });
}

function DetectarDecimal(valor1) {
    let numero = valor1;

    if (numero % 1 !== 0) {
        return parseFloat(numero).toFixed(2);
    } else {
        return parseFloat(numero);
    }

}

function invertirFecha(fecha) {
    fecha = fecha.split("T")[0];
    fecha = fecha.replace('-', '/');
    fecha = fecha.replace('-', '/');

    const partes = fecha.split('/');

    const dia = partes[2];
    const mes = partes[1];
    const anio = partes[0];

    return `${dia}/${mes}/${anio}`;
}

function estadoString(valor, id) {
    if(valor==2){
        setTimeout(() => {
            if(document.getElementById("td_estado"+id)){
                document.getElementById("td_estado"+id).style.color='var(--variable_5_0-5)';
                document.getElementById("td_estado"+id).style.fontWeight='bold';
            }
        }, 100)
    }

    const estados = {
        0: "Cerrado",
        1: "Abierto",
        2: "Anulado",
    }
    return estados[valor] ?? "No Found";
}

function monedaString(valor) {
    const buscar = BD_Monedas.find(moneda => {
        return moneda.idMoneda == valor;
    });
    return buscar.nombre;
}

function cuentaString(valor) {
    const buscar = BD_Cuenta.find(cuenta => {
        return cuenta.id_Cuenta == valor;
    });
    return buscar.codigo + " - " + buscar.nombre;
}

function totalTDDetalle() {
    const padreBody = document.getElementById("Detalles_Comprobante").getElementsByTagName("tbody")[0];

    const totalDefinitivo1 = document.getElementById("totalDefinitivo1");
    const totalDefinitivo2 = document.getElementById("totalDefinitivo2");

    totalDefinitivo1.textContent = "0";
    totalDefinitivo2.textContent = "0";

    padreBody.querySelectorAll("tr").forEach(element => {
        totalDefinitivo1.textContent = parseFloat(totalDefinitivo1.textContent) + parseFloat(element.getElementsByTagName("td")[3].textContent > 0 ? element.getElementsByTagName("td")[3].textContent : 0);
        totalDefinitivo2.textContent = parseFloat(totalDefinitivo2.textContent) + parseFloat(element.getElementsByTagName("td")[4].textContent > 0 ? element.getElementsByTagName("td")[4].textContent : 0);
    });
}


function imprimirComprobante() {
    window.open('http://localhost:80/ReportsERP/report/Empresas_ERP/ReporteComprobantes?parameter_idComprobante=' + ID_Imprimir, '_blank');
}

if (document.getElementById("anularComprobante")) {
    document.getElementById("anularComprobante").addEventListener("click", function (params) {
        document.getElementById("DetalleComprobante_modal").style = "none";
        document.getElementById("delete_Comprobante").style.display = "flex";

        document.getElementById("delete_Comprobante").style.width = "auto";
        document.getElementById("delete_Comprobante").style.borderRadius = "7%";
        document.getElementById("h2-deleteComprobante").textContent = 'Anular el comprobante con el Nro de serie "' + serieDetected + '"';
    });
}

if (document.getElementById("cerrarComprobante")) {
    document.getElementById("cerrarComprobante").addEventListener("click", function (params) {
        document.getElementById("delete_Comprobante").style = "none";
        document.getElementById("DetalleComprobante_modal").style.display = "flex";
    });
}

if (document.getElementById("btnDeleteComprobante")) {
    document.getElementById("btnDeleteComprobante").addEventListener("click", function (params) {
        if (ID_Imprimir > 0) {
            AnularComprobanteLogic(ID_Imprimir);
        }
    });
}

if(document.getElementById("modal-AddComprobante")){
    document.getElementById("modal-AddComprobante").addEventListener("click",function (e) {
        window.location.href = "http://" + window.location.host + "/Paginas/Comprobante/AddComprobante.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
    });
}