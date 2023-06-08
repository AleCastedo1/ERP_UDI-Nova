
function GetAllDataGestiones(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/ListarAll");
    result.then(response => response.json()).then(data => {
        done(data)
    }).catch(error => {
        showToast(4);
    });
}

function GetBDGestion(done, idempresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/Listar?id=" + idempresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        showToast(4);
    });
}

function GetBuscarGestion(done, ID_Gestion) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/SearchManagement?id=" + ID_Gestion);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        showToast(4);
    });
}

SaveDataGestion = async (nombre, fechaI, fechaF, usuario, ID_Empresa) => {
    const objt = {
        nombre: nombre,
        fechaInicio: fechaI,
        fechaFin: fechaF,
        iD_Usuario: usuario,
        iD_Empresa: ID_Empresa,
        estado: 1
    };

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/Agregar", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementById("pantallasoG").style.display = "none";
        showToast(response.result);
        limpiarForm();
        cargarListaGestion(ID_Empresa);
    }).catch((error) => {
        showToast(error)
    })
};



UpdateManagement = async (nombre, fechaI, fechaF, usuario, ID_Empresa, id_gestion) => {
    const objt = {
        nombre: nombre,
        fechaInicio: fechaI,
        fechaFin: fechaF,
        iD_Usuario: usuario,
        iD_Empresa: ID_Empresa,
        estado: 1,
        iD_Gestion: id_gestion
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/UpdateManagement", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            document.getElementById("pantallasoG").style.display = "none";
            showToast(response.result);
            cargarListaGestion(ID_Empresa);
            limpiarForm();
        })
};

DeleteLogicManagement = async (id_gestion) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/DeleteLogico_Management?id=" + id_gestion, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementById("pantallasoGD").style.display = "none";
        showToast(response.result);
        document.getElementById("tr_" + id_gestion).remove();
        limpiarForm();
    });
};

DeleteFisicManagement = async (id_gestion) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Gestion/DeleteFisico_Management?id=" + id_gestion, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementById("pantallasoGD").style.display = "none";
        showToast(response.result);
        document.getElementById("tr_" + id_gestion).remove();
        limpiarForm();
    });
};