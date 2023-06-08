
function GetAllDataMoneda(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Moneda/ListarAll");
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log("GetAllDataMoneda:\n" + error);
        showToast(4);
    });
}

function GetBDMonedaXEmpresa(done, idempresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Moneda/SearchCoinXCompany?id=" + idempresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log("GetBDMonedaXEmpresa:\n" + error);
        showToast(4);
    });
}

SetDataMonedaEmpresa = async (idEmpresa, idMonedaPrincipal, idUsuario) => {
    var newfecha = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + new Date().toLocaleTimeString();

    const objt = {
        cambio: "0",
        activo: 1,
        fechaRegistro: newfecha,
        idEmpresa: idEmpresa,
        idMonedaPrincipal: idMonedaPrincipal,
        idUsuario: idUsuario,
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Moneda/Agregar", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => showToast(response.result))
        .catch(error => {
            console.log(error);
        });
};

SetDataMonedaEmpresaComplete = async (cambio, idEmpresa, idMonedaPrincipal, IdMonedaAlternativa, idUsuario) => {
    var newfecha = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + new Date().toLocaleTimeString();

    const objt = {
        cambio: cambio,
        activo: 1,
        fechaRegistro: newfecha,
        idEmpresa: idEmpresa,
        idMonedaPrincipal: idMonedaPrincipal,
        IdMonedaAlternativa: IdMonedaAlternativa,
        idUsuario: idUsuario,
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Moneda/AgregarMonEmp", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        actualizarListaEmpMon();
        showToast(response.result);
    }).catch(error => {
        console.log(error);
    });
};

UpdateDataEmpresaMoneda = async (id_EmpMon, id_MonPri) => {
    const objt1 = {
        idEmpresaMoneda: id_EmpMon,
        idMonedaPrincipal: id_MonPri,
    };

    await fetch('https://microservicios-erp-udinova.azurewebsites.net/Moneda/UpdateCompanyCoin', {
        method: "POST",
        body: JSON.stringify(objt1),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => showToast("Gatos<3"))
        .catch(error => {
            console.log(error);
        });
};

UpdateDataEmpMon = async (id_EmpMon, id_MonPri) => {

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Moneda/UpdateCompanyCoin?id1=" + id_EmpMon + "&id2=" + id_MonPri, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => showToast("Gatos"));
};
