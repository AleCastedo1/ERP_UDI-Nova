var BD_Moneda;
var decisionCambio = false;

GetAllDataMoneda(data => {
    BD_Moneda = data.result.moneda.map(function (params) { return params });
});

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

    GetBDMonedaXEmpresa(data1 => {
        var opt = '';
        var valorSec = null;
        var valorCambio = null;
        GetBDComprobante_X_Empresa(data2=>{
            BD_Moneda.forEach(params => {
                if (data1.result.moneda[0].idMonedaPrincipal == params.idMoneda) {
                    let coinPrincipal = document.getElementById("MonedaPrin");
                    coinPrincipal.value = params.nombre;
                    coinPrincipal.name = params.idMoneda;
                } else {
                    opt = opt + '<option value="' + params.idMoneda + '">' + params.nombre + '</option>';
                }
    
                if (data1.result.moneda[0].idMonedaAlternativa == params.idMoneda) {
                    valorSec = params.idMoneda;
                    valorCambio=data1.result.moneda[0].cambio;
                }
            });
            //HACES TODO ESTO PARA BUSCAR UN ESTADO VALIDO
            const buscarEstado_MonedaAlternativa=data2.result.comprobante.find(buscar=>{
                if(buscar.idMoneda==data1.result.moneda[0].idMonedaAlternativa && buscar.estado<=1){
                    return buscar;
                }
            })
            document.getElementById("MonedaSec").innerHTML = opt;
            
            if(buscarEstado_MonedaAlternativa){
                document.getElementById("MonedaSec").setAttribute("disabled","true");
            }else{
                document.getElementById("MonedaSec").removeAttribute("disabled");
            }
            
            if (valorSec != null) {
                document.getElementById("MonedaSec").value = valorSec;
                document.getElementById("monedaCambio").value = valorCambio;
            }
        },empresaNow);
    }, empresaNow);
    actualizarListaEmpMon();
};



function actualizarListaEmpMon() {
    let padre = document.getElementById("table_MonedaEmpresa").getElementsByTagName("tbody")[0];

    GetBDMonedaXEmpresa(data => {
        var trInner = '';
        data.result.moneda.forEach(element => {
            trInner = trInner + '<tr id="tr_' + element.idEmpresaMoneda + '">' +
                '<td>' + element.fechaRegistro.replace('T', ' ') + '</td>' +
                '<td>' + obtenerNombre(element.idMonedaPrincipal) + '</td>' +
                '<td>' + (element.idMonedaAlternativa == null ? "Ninguna" : obtenerNombre(element.idMonedaAlternativa)) + '</td>' +
                '<td style="text-align:right;">' + (element.cambio == 0 ? "0" : element.cambio) + '</td>' +
                '<td>' + (element.activo == 1 ? '<strong style="color:green;">SI</strong>' : "No") + '</td>' +
                '<tr>';
        });
        padre.innerHTML = trInner;
    }, empresaNow);
}

function obtenerNombre(idPrincipal) {
    var nombreMoneda = BD_Moneda.find(param => {
        return param.idMoneda == idPrincipal;
    });
    return nombreMoneda.abreviatura;
}

document.getElementById("form_MonEmp").addEventListener("submit", function (e) {
    e.preventDefault();

    if (decisionCambio == true) {
        GetBDMonedaXEmpresa(data => {
            if (data.result.moneda[0].cambio != e.srcElement.monedaCambio.value.trim()) {
                SetDataMonedaEmpresaComplete(e.srcElement.monedaCambio.value, empresaNow, e.srcElement.MonedaPrin.name, e.srcElement.MonedaSec.value, userNow);
                var principal = {
                    idPrin: e.srcElement.MonedaPrin.name,
                    nomPrin: e.srcElement.MonedaPrin.value,
                    idSec: e.srcElement.MonedaSec.value,
                }
                setTimeout(() => {
                    e.srcElement.MonedaPrin.name = principal.idPrin;
                    e.srcElement.MonedaPrin.value = principal.nomPrin;
                    e.srcElement.MonedaSec.value = principal.idSec;
                }, 1200);
            } else {
                showToast(25);
            }
        }, empresaNow);
    } else {
        showToast(26);
    }

});

document.getElementById("monedaCambio").addEventListener("keyup", function (params) {
    params.srcElement.value = params.srcElement.value.replace(",", ".");

    if (esNumeroValido(params.srcElement.value)) {
        decisionCambio = true;
    } else {
        showToast(26);
        decisionCambio = false;
    }
});

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