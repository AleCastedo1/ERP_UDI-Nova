function GetBDData_ExG_Count(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Data/CountExG");
    result.then(response => response.json()).then(data => {
        done(data);
    });
}

function GetBDData_PxG_Count(done,id_empresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Data/CountPxG?id=" + id_empresa);
    result.then(response => response.json()).then(data => {
        done(data);
    });
}

function nroPeriodos_X_Empresa(done,id_empresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Data/CountPxE?id=" + id_empresa);
    result.then(response => response.json()).then(data => {
        done(data);
    });
}