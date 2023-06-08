
function GetBDComprobante_X_Empresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/Listar?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBD_Detalles_X_Empresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/ListarDetallesXEmpresa?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function Search_BD_Comprobante(done, idComprobante) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/SearchComprobante?id=" + idComprobante);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function Search_BD_DetalleComprobante(done, idComprobante) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/SearchDetallesComprobante?id=" + idComprobante);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function Found_AperturaResult(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/searchArperturaAvailable?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

SaveDataComprobante = async (comprobanteOBJ) => {
    let inicio2 = performance.now();

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/AddComprobante", {
        method: "POST",
        body: JSON.stringify({
            "idComprobante": 0,
            "serie": comprobanteOBJ.serie,
            "glosa": comprobanteOBJ.glosa,
            "fecha": comprobanteOBJ.fecha,
            "tc": comprobanteOBJ.tc,
            "estado": comprobanteOBJ.estado == "Abierto" ? 1 : 2,
            "tipoComprobante": comprobanteOBJ.tipoComprobante,
            "idEmpresa": comprobanteOBJ.idEmpresa,
            "idUsuario": comprobanteOBJ.idUsuario,
            "idMoneda": comprobanteOBJ.idMoneda
        }),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            let fin2 = performance.now();
            let duracion2 = fin2 - inicio2;
            console.log("Este Comprobante demoro: " + duracion2 + " milisegundos");
            console.log(" ")
        })
}

SaveDataDetalleComprobante = async (DetallesOBJ) => {
    let inicio1 = performance.now();

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/AgregarDetalleComprobante", {
        method: "POST",
        body: JSON.stringify(DetallesOBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            let fin1 = performance.now();
            let duracion1 = fin1 - inicio1;
            console.log("Este detalle demoro: " + duracion1 + " milisegundos");
        })
        .catch((error) => console.log(error));
}


SaveDataComprobanteDetalle = async (ComprobanteDetalle_OBJ) => {
    // let inicio1 = performance.now();

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/NewAddComprobante", {
        method: "POST",
        body: JSON.stringify({
            "idComprobante": 0,
            "serie": ComprobanteDetalle_OBJ[0].serie,
            "glosa": ComprobanteDetalle_OBJ[0].glosa,
            "fecha": ComprobanteDetalle_OBJ[0].fecha,
            "tc": ComprobanteDetalle_OBJ[0].tc,
            "estado": ComprobanteDetalle_OBJ[0].estado,
            "tipoComprobante": ComprobanteDetalle_OBJ[0].tipoComprobante,
            "idEmpresa": ComprobanteDetalle_OBJ[0].idEmpresa,
            "idUsuario": ComprobanteDetalle_OBJ[0].idUsuario,
            "idMoneda": ComprobanteDetalle_OBJ[0].idMoneda,
            "detalle": ComprobanteDetalle_OBJ[0].detalle
        }),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            if (response.success == "Exito Total") {
                newDirigirXnombre("Comprobante-r");
            }
        })
        .catch((error) => console.log(error));
}


AnularComprobanteLogic = async (idComprobante) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Comprobante/UpdateSateComprobante?id=" + idComprobante, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementById("delete_Comprobante").style = "none";
        document.getElementById("DetalleComprobante_modal").style = "none";
        document.getElementsByClassName("pantallaso")[0].style = "none";
        cargarListaComprobante();
        showToast(response.result);
    }).catch((error) => {
        showToast(error)
    });
}

