

function GetAllDataPeriodos(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/ListarAll");
    result.then(response => response.json()).then(data => {
        done(data)
    }).catch(error => {
        showToast(4);
    });
}

function GetBDPeriodoxGestion(done, idGestion) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/Listar?id=" + idGestion);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        showToast(4);
    });
}

function SearchPeriodo_One(done, idPeriodo) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/SearchPeriodOne?id=" + idPeriodo);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        showToast(4);
    });
}

function GetBDPeriodoxEmpresa(done, IdEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/ListarPeriodo_X_Empresa?id=" + IdEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        showToast(4);
    });
}

SaveDataPeriodo = async (nombre, fechaI, fechaF, usuario, id_gestion) => {
    const objt = {
        nombre: nombre,
        fechaInicio: fechaI,
        fechaFin: fechaF,
        iD_Usuario: usuario,
        iD_Gestion: id_gestion,
        estado: 1
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/Agregar", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementById("pantallasoGU").style.display = "none";
        showToast(response.result);
        LimpiarForm();
        cargarListaPeriodos(id_gestion);
    }).catch((error) => {
        showToast(17);
    });
};


UpdateDataPeriodo = async (nombre, fechaI, fechaF, usuario, id_gestion, id_periodo) => {
    const objt = {
        nombre: nombre,
        fechaInicio: fechaI,
        fechaFin: fechaF,
        iD_Usuario: usuario,
        iD_Gestion: id_gestion,
        iD_Periodo: id_periodo,
        estado: 1
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/UpdatePeriodo", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementById("pantallasoGU").style.display = "none";
        showToast(response.result);
        LimpiarForm();
        cargarListaPeriodos(id_gestion);
    }).catch((error) => {
        showToast(18);
    });
};

DeleteFisicPeriodo = async (idPeriodo) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Periodo/RemoveFisic_Periodo?id=" + idPeriodo, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            document.getElementById("pantallasoDE").style.display = "none";
            showToast(response.result);
            document.getElementById("tr_" + idPeriodo).remove();
            LimpiarForm();
        });
};