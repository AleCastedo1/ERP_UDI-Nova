
function GetAllDataConfCuenta(done, idCuenta) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Data/ListarCuentaIntegrada?id=" + idCuenta);
    result.then(response => response.json()).then(data => {
        done(data);
        
        if(document.getElementsByName("bototnesForm")[1])
            document.getElementsByName("bototnesForm")[1].removeAttribute("disabled");  
    }).catch(error => {
        showToast(4);
    });
}

UpdateDataConfCuenta = async (conf_OBJ) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Data/UpdateCuentaIntegrada", {
        method: "POST",
        body: JSON.stringify(conf_OBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
    .then((response) => {
        showToast(response.result);
    })
    .catch((error) => console.log(error));
}