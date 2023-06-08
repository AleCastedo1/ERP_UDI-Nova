function GetBDNotas_X_Empresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/ListarNotas?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDNota_X_ID(done, idNota) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/ListarNotaUnica?id=" + idNota);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDLotes_X_IdNota(done, idNota) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/ListarLotes?id=" + idNota);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDDetalles_X_IdNota(done, idNota) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/ListarDetalles?id=" + idNota);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDLotes_X_IdEmpresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/ListarLotesX_Articulo?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDLotes_X_IdArticulo(done, idArticulo) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/ListarLotesX_IdArticulo?id=" + idArticulo);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

AnularNotaLogic = async (idNota, nro) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/AnularNota?id=" + idNota+"&nro="+nro, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        document.getElementsByClassName("pantallaso")[0].style.display="none";
        document.getElementsByClassName("modal-view")[1].style.display="none";
        cargarListaNotas();
        //document.getElementById("List_notas#"+idNota).remove();

        showToast(response.result);
    }).catch((error) => {
        showToast(error)
    });
}
