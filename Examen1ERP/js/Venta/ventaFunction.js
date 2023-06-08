var userNow;
var empresaNow;

var BD_Articulos;
var BD_Lotes;
var arregloEditID;

GetBDArticulo_X_Empresa(data => {
    BD_Articulos = data.result.articulo;

    const select2 = document.getElementById("articuloSelect");

    select2.innerHTML = '';
    BD_Articulos.forEach(ele => {
        if (ele.cantidad > 0) {
            select2.innerHTML = select2.innerHTML + '<option id="opt_' + ele.idArticulo + '" value="' + ele.idArticulo + '">' + ele.nombre + '</option>';
        }
    });

    $('#articuloSelect').select2({
        placeholder: 'Seleccionar Articulos..'
    });

}, new URLSearchParams(window.location.search).get("id_empresa"));

GetBDLotes_X_IdEmpresa(data => {
    BD_Lotes = data.result.lote;
}, new URLSearchParams(window.location.search).get("id_empresa"));

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


}

document.getElementById("agregarArticulo").addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementsByClassName("pantallaso")[0].style.display = "flex";
    document.getElementById("contadorH2").textContent = "Agregar Nota de Venta";

    const bodyTable = document.getElementById("tbodyCompra");

    if (bodyTable.children[0].children[0].textContent == "Sin Datos") {
        bodyTable.innerHTML = '';
    }

    $("#articuloSelect").val(null).trigger("change");
});

document.getElementById("detalleArticulo").addEventListener("submit", function (e) {
    e.preventDefault();

    const bodyTable = document.getElementById("tbodyCompra");

    if (editarMode == false) {
        bodyTable.innerHTML = bodyTable.innerHTML + '<tr id="tr_' + e.target.articuloSelect.value + '">' +
            '<td style="display:none;">' + e.target.loteSelect.value + '</td>' +
            '<td>' + e.target.articuloSelect.value + '</td>' +
            '<td>' + e.target.cantidadDetalle.value + '</td>' +
            '<td>' + e.target.precioDetalle.value + '</td>' +
            '<td>' + parseInt(e.target.precioDetalle.value) * parseInt(e.target.cantidadDetalle.value) + '</td>' +
            '<td style="display:flex; flex-flow:row nowrap; justify-content:space-around; padding:10px">' +
            '<i class="i-td fa-solid fa-pen-to-square" onclick="Editar_TR(' + e.target.articuloSelect.value + ')"></i>' +
            '<i class="i-tdfa-sharp fa-solid fa-trash" onclick="quitar_TR(' + e.target.articuloSelect.value + ')"></i>' +
            '</td>' +
            '</tr>';
    } else {
        const trEdit = document.getElementById("tr_" + arregloEditID);

        trEdit.children[0].textContent = e.target.loteSelect.value;
        trEdit.children[1].textContent = e.target.articuloSelect.value;
        trEdit.children[2].textContent = e.target.cantidadDetalle.value;
        trEdit.children[3].textContent = e.target.precioDetalle.value;
        trEdit.children[4].textContent = parseInt(e.target.cantidadDetalle.value) * parseInt(e.target.precioDetalle.value);
        trEdit.children[5].innerHTML = '<i class="i-td fa-solid fa-pen-to-square" onclick="Editar_TR(' + e.target.articuloSelect.value + ')"></i>' +
            '<i class="i-tdfa-sharp fa-solid fa-trash" onclick="quitar_TR(' + e.target.articuloSelect.value + ')"></i>';
        document.getElementById("tr_" + arregloEditID).id = "tr_" + e.target.articuloSelect.value;

        editarMode = false;

        document.getElementsByClassName("pantallaso")[0].style.display = "none";
    }

    document.getElementById("tr_" + e.target.articuloSelect.value).children[1].textContent = BD_Articulos.find(buscar => buscar.idArticulo == e.target.articuloSelect.value).nombre;

    document.getElementById("opt_" + e.target.articuloSelect.value).setAttribute("disabled", true);

    document.getElementById("detalleArticulo").reset();
    document.getElementById("loteSelect").innerHTML = '<option value="" disabled selected>Selecciona un Articulo</option>';
    $("#cantidadDetalle").attr("placeholder", "");

    $("#articuloSelect").val(null).trigger("change");
    calcularTotal();
});

document.getElementById("detalleArticulo").getElementsByTagName("input")[3].addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementById("pantallaso").style.display = "none";

    document.getElementById("detalleArticulo").reset();
    document.getElementById("loteSelect").innerHTML = '<option value="" disabled selected>Selecciona un Articulo</option>';

    const bodyTable = document.getElementById("tbodyCompra");

    if (editarMode == true) {
        document.getElementById("opt_" + arregloEditID).setAttribute("disabled", true);
        editarMode = false;
    } else {
        if (bodyTable.children.length == 0) {
            bodyTable.innerHTML = '<tr><td colspan="5" style="text-align: center; width: 100%;">Sin Datos</td></tr>';
        }
    }

});

$("#articuloSelect").on("change", function (e) {
    const pillado = BD_Articulos.find(articulo => articulo.idArticulo == $(this).val());

    if (pillado) {
        const selectLotes = document.getElementById("loteSelect");
        selectLotes.innerHTML = '';
        let firs = true;

        BD_Lotes.forEach(lotes => {
            if (lotes.id_ArticuloF == $(this).val()) {
                if (firs == true) {
                    $("#cantidadDetalle").val(null);
                    $("#cantidadDetalle").attr("placeholder", "Stock: " + lotes.stock);
                    document.getElementById("cantidadDetalle").max = lotes.stock;
                    firs = false;
                }
                selectLotes.innerHTML = selectLotes.innerHTML + '<option val="' + lotes.nroLote + '">' + lotes.nroLote + '</option>';
            }
        });

        $("#precioDetalle").val(pillado.precioVenta);
    }
});

$("#loteSelect").on("change", function (e) {
    $("#cantidadDetalle").val(null);

    const valor1 = $("#articuloSelect").val();
    const valor2 = $(this).val();
    const valor3 = BD_Lotes.find(lote => lote.id_ArticuloF == valor1 && lote.nroLote == valor2).stock;

    $("#cantidadDetalle").attr("placeholder", "Stock: " + valor3);
    document.getElementById("cantidadDetalle").max = valor3;
});

document.getElementById("formCompra").addEventListener("submit", function (e) {
    e.preventDefault();

    const objetoVenta = {
        idNota: 0,
        fecha: e.target.fecha.value,
        descripcion: e.target.descripcion.value,
        total: 0,
        idEmpresa: parseInt(empresaNow),
        idUsuario: parseInt(userNow),
        listDetalle: null,
        objConfIntegrada: null
    };
    const arrayArticulos = [];
    const listaTable = document.getElementById("tbodyCompra");

    let denegarSave=false;
    if(listaTable.children[0].getElementsByTagName("td")[0].colSpan ==5 || listaTable.children.length==0){
        denegarSave =true;
    }

    if (denegarSave==false) {
        for (let i = 0; i < listaTable.children.length; i++) {
            arrayArticulos.push({
                idArticuloF: listaTable.children[i].id.split("_")[1],
                nroLote: listaTable.children[i].children[0].textContent,
                idNotaF: 0,
                cantidad: listaTable.children[i].children[2].textContent,
                precioVenta: parseInt(listaTable.children[i].children[3].textContent),
                estado: 1,
                Nombre: listaTable.children[i].children[1].textContent,
            });
            objetoVenta.total = objetoVenta.total + parseFloat(listaTable.children[i].children[4].textContent);
        }
        objetoVenta.listDetalle = arrayArticulos;

        GetAllDataConfCuenta(data => {
            if (data.result.datos[0].estado == 1) {
                objetoVenta.objConfIntegrada = {
                    iD_Empresa: data.result.datos[0].iD_Empresa,
                    estado: data.result.datos[0].estado,
                    cajaID: data.result.datos[0].cajaID,
                    creadiFiscal: data.result.datos[0].creadiFiscal,
                    debitoFiscal: data.result.datos[0].debitoFiscal,
                    compras: data.result.datos[0].compras,
                    ventas: data.result.datos[0].ventas,
                    it: data.result.datos[0].it,
                    iTxPagar: data.result.datos[0].iTxPagar
                };

                GetBDPeriodoxEmpresa(find => {
                    var ExisteFecha = false;

                    find.result.periodo.forEach(element => {
                        if (ExisteFecha == false && element.fechaInicio.split("T")[0] <= objetoVenta.fecha && element.fechaFin.split("T")[0] >= objetoVenta.fecha && element.estado == 1) {
                            ExisteFecha = true;
                        }
                    });

                    if (ExisteFecha == true) {
                        SaveDataNotaVenta(objetoVenta);
                    } else {
                        showToast(44);
                    }
                }, empresaNow);
            } else {
                objetoVenta.objConfIntegrada = {
                    iD_Empresa: 0,
                    estado: 0,
                    cajaID: 0,
                    creadiFiscal: 0,
                    debitoFiscal: 0,
                    compras: 0,
                    ventas: 0,
                    it: 0,
                    iTxPagar: 0
                }
                SaveDataNotaVenta(objetoVenta);
            }
        }, empresaNow);
    }else{
        showToast(46);
    }

});


var editarMode = false;
function Editar_TR(idSelected) {
    editarMode = true;
    const tr_Selected = document.getElementById("tr_" + idSelected);

    arregloEditID = idSelected;

    document.getElementById("contadorH2").textContent = "Editar Nota de Compra";

    setTimeout(() => {
        document.getElementById("loteSelect").value = tr_Selected.children[0].textContent;
        document.getElementById("cantidadDetalle").value = tr_Selected.children[2].textContent;
    }, 100);

    document.getElementById("precioDetalle").value = tr_Selected.children[3].textContent;


    document.getElementsByClassName("pantallaso")[0].style.display = "flex";

    document.getElementById("opt_" + idSelected).removeAttribute("disabled");


    $("#articuloSelect").val(idSelected).trigger("change");
}

function quitar_TR(idSelected) {
    document.getElementById("tr_" + idSelected).remove();

    document.getElementById("opt_" + idSelected).removeAttribute("disabled");

    const bodyTable = document.getElementById("tbodyCompra");

    if (bodyTable.children.length == 0) {
        bodyTable.innerHTML = '<tr><td colspan="5" style="text-align: center; width: 100%;">Sin Datos</td></tr>';
    }
}

function calcularTotal() {
    const listaTable = document.getElementById("tbodyCompra");
    var Total = 0;
    for (let i = 0; i < listaTable.children.length; i++) {
        Total = Total + parseFloat(listaTable.children[i].children[4].textContent);
    }
    $("#td_Total").text(Total);
}

function gatitos() {
    const listaTable = document.getElementById("tbodyCompra");
    console.log("Gatois en elk agua" + listaTable);
}