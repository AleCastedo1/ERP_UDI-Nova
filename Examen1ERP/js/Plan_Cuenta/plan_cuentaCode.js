
function GetAllDataPlanCuentas(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/ListarAll");
    result.then(response => response.json()).then(data => {
        done(data)
    }).catch(error => {
        showToast(4);
    });
}

function GetBDCuentaPlan(done, idCuenta) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/Listar?id=" + idCuenta);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        showToast(4);
    });
}

function GetBDCuenta_X_Empresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/Call_Cuenta_Empresa?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDCuentaDetalle_X_Empresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/ListarDetallesCuenta?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

SaveDataPlanCuenta = async (Codigo, Nombre, Nivel, TipoCuenta, ID_Usuario, ID_Empresa, ID_CuentaPadre) => {
    const objt = {
        Codigo: Codigo,
        Nombre: Nombre,
        Nivel: Nivel,
        TipoCuenta: TipoCuenta,
        ID_Usuario: ID_Usuario,
        ID_Empresa: ID_Empresa,
        ID_CuentaPadre: ID_CuentaPadre == "0" ? null : ID_CuentaPadre,
        Estado: 1
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/Agregar", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        showToast(response.result);
        $('#Listado-Cuentas').jstree('destroy');
        cargarListaCuenta(empresaNow);
    })
        .catch((error) => {
            showToast(17);
        });
};

UpdateDataCuenta = async (id_Cuenta, nombre) => {
    const objt = {
        Id_Cuenta: id_Cuenta,
        Codigo: "Codigo",
        Nombre: nombre,
        Nivel: "Nivel",
        TipoCuenta: "TipoCuenta",
        ID_Usuario: "1",
        ID_Empresa: "1",
        ID_CuentaPadre: "0",
    };

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/UpdateCuentaPlan", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
//        document.getElementById(nodoContenido.idLI).textContent=nodoContenido.codigo;
        showToast(response.result);
        $('#Listado-Cuentas').jstree('destroy');
        cargarListaCuenta(empresaNow);
    }).catch((error) => {
        showToast(18);
    });
};


DeleteFisicP_Cuenta = async (id_Cuenta) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Plan_Cuentas/DeleteFisico_Cuenta?id=" + id_Cuenta, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            document.getElementById("pantallasoDelete").style = "none";
            $('#Listado-Cuentas').jstree('destroy');
            cargarListaCuenta(empresaNow);
            if(response.success=="true"){
                showToast(response.result);
            }else{
                showToast(40);
            }
        })
        .catch((error)=>{
            showToast(error);
        });
};