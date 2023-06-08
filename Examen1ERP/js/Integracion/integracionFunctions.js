const select1 = document.getElementById("selectCaja");
const select2 = document.getElementById("selectCreFis");
const select3 = document.getElementById("selectDebFis");
const select4 = document.getElementById("selectCompras");
const select5 = document.getElementById("selectVenta");
const select6 = document.getElementById("selectIT");
const select7 = document.getElementById("selectIT_Pagar");


var userNow;
var empresaNow;
var arregloEditID;
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

    GetBuscarEmpresa(dato => {
        document.getElementById("h1-header").innerText = 'Empresa "' + dato.result.empresa[0].nombre + '"';
    }, empresaNow);

    GetDataUsuarioID(data => {
        document.getElementById("name-User").innerText = data.result.usuario[0].nombre;
    }, userNow);

    GetBDCuentaDetalle_X_Empresa(data => {
        if (data.result.cuenta.length > 0) {
            data.result.cuenta.forEach(item => {
                select1.innerHTML = select1.innerHTML + '<option value="' + item.id_Cuenta + '">' + item.codigo + " - " + item.nombre + '</option>';
            });
        }

        select2.innerHTML = select1.innerHTML;
        select3.innerHTML = select1.innerHTML;
        select4.innerHTML = select1.innerHTML;
        select5.innerHTML = select1.innerHTML;
        select6.innerHTML = select1.innerHTML;
        select7.innerHTML = select1.innerHTML;
        CargarValoresSelects();
    }, empresaNow);

}

function CargarValoresSelects() {
    GetAllDataConfCuenta(data => {
        select1.value = data.result.datos[0].cajaID == null ? "null" : data.result.datos[0].cajaID;
        select2.value = data.result.datos[0].creadiFiscal == null ? "null" : data.result.datos[0].creadiFiscal;
        select3.value = data.result.datos[0].debitoFiscal == null ? "null" : data.result.datos[0].debitoFiscal;
        select4.value = data.result.datos[0].compras == null ? "null" : data.result.datos[0].compras;
        select5.value = data.result.datos[0].ventas == null ? "null" : data.result.datos[0].ventas;
        select6.value = data.result.datos[0].it == null ? "null" : data.result.datos[0].it;
        select7.value = data.result.datos[0].iTxPagar == null ? "null" : data.result.datos[0].iTxPagar;

        if (data.result.datos[0].estado == 1) {
            document.getElementById("eleccion1").checked = true;
        } else {
            document.getElementById("eleccion2").checked = true;
        }

        //DesbloquearBloquear();

        $('#selectCaja').select2({
            placeholder: "Seleccione una cuenta"
        });
        $('#selectCreFis').select2({
            placeholder: "Seleccione una cuenta"
        });
        $('#selectDebFis').select2({
            placeholder: "Seleccione una cuenta"
        });
        $('#selectCompras').select2({
            placeholder: "Seleccione una cuenta"
        });
        $('#selectVenta').select2({
            placeholder: "Seleccione una cuenta"
        });
        $('#selectIT').select2({
            placeholder: "Seleccione una cuenta"
        });
        $('#selectIT_Pagar').select2({
            placeholder: "Seleccione una cuenta"
        });
        DesbloquearBloquear();
    }, empresaNow);
}
document.getElementsByTagName("form")[0].addEventListener("submit", function (e) {
    e.preventDefault();

    const objetoConf = {
        iD_Empresa: empresaNow,
        estado: e.target.eleccion1.checked == false ? 0 : 1,
        cajaID: e.target.selectCaja.value,
        creadiFiscal: e.target.selectCreFis.value,
        debitoFiscal: e.target.selectDebFis.value,
        compras: e.target.selectCompras.value,
        ventas: e.target.selectVenta.value,
        it: e.target.selectIT.value,
        iTxPagar: e.target.selectIT_Pagar.value
    }

    if (objetoConf.cajaID == "null" || objetoConf.creadiFiscal == "null" || objetoConf.debitoFiscal == "null" || objetoConf.compras == "null" || objetoConf.ventas == "null" || objetoConf.it == "null" || objetoConf.iTxPaga == "null") {
        showToast(43);
        return;
    }
    UpdateDataConfCuenta(objetoConf);
});

document.getElementsByName("bototnesForm")[1].addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementsByName("bototnesForm")[1].setAttribute("disabled", "true");
    CargarValoresSelects();
});

var listSelected = {
    selectCaja: null,
    selectCreFis: null,
    selectDebFis: null,
    selectCompras: null,
    selectVenta: null,
    selectIT: null,
    selectIT_Pagar: null,
}

$(document).on("change", "select", function (e) {
    DesbloquearBloquear();
});


function DesbloquearBloquear() {
    listSelected.selectCaja = select1.value == ""? null:select1.value;
    listSelected.selectCompras = select4.value == ""? null:select4.value;
    listSelected.selectCreFis = select2.value == ""? null:select2.value;
    listSelected.selectDebFis = select3.value == ""? null:select3.value;
    listSelected.selectIT = select6.value == ""? null:select6.value;
    listSelected.selectIT_Pagar = select7.value == ""? null:select7.value;
    listSelected.selectVenta = select5.value == ""? null:select5.value;

    for (let i = 0; i < select1.options.length; i++) {
        select1.options[i].disabled = false;
        select2.options[i].disabled = false;
        select3.options[i].disabled = false;
        select4.options[i].disabled = false;
        select5.options[i].disabled = false;
        select6.options[i].disabled = false;
        select7.options[i].disabled = false;
    }
    if (listSelected.selectCaja != null) {
        select1.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectCaja + '"]').disabled = true;
    }

    if (listSelected.selectCompras != null) {
        select1.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectCompras + '"]').disabled = true;
    }

    if (listSelected.selectCreFis != null) {
        select1.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectCreFis + '"]').disabled = true;
    }

    if (listSelected.selectDebFis != null) {
        select1.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectDebFis + '"]').disabled = true;
    }

    if (listSelected.selectIT != null) {
        select1.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectIT + '"]').disabled = true;
    }

    if (listSelected.selectIT_Pagar != null) {
        select1.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectIT_Pagar + '"]').disabled = true;
    }

    if (listSelected.selectVenta != null) {
        select1.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
        select2.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
        select3.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
        select4.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
        select5.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
        select6.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
        select7.querySelector('option[value="' + listSelected.selectVenta + '"]').disabled = true;
    }
}