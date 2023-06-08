
function GetBDEmpresa(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/Listar");
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error=>{
        showToast(4);
    });
}

function GetAllDataEmpresa(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/ListarAll");
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error=>{
        showToast(4);
    });
}

function GetBuscarEmpresa(done,ID_Empresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/SearchCompanyOne?id="+ID_Empresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error=>{
        console.log(error);
        showToast(4);
    });
}

function GetBuscarEmpresaNombre(done,nombreEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/SearchCompanyForWord?nombre="+nombreEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error=>{
        showToast(4);
    });
}

SetDataEmpresa = async (nombre, nit, sigla, telefono, correo, direccion, niveles, iD_Usuario,idMoneda) => {
    const objt = {
        iD_Empresa: 0,
        nombre: nombre,
        nit: nit,
        sigla: sigla,
        telefono: telefono,
        correo: correo,
        direccion: direccion,
        niveles: niveles,
        iD_Usuario: iD_Usuario,
        Estado: 1
    };

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/Agregar?idmoneda="+idMoneda, {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            showToast(response.result);
            restablecerForm();
            ActualizarLista();
        })
        .catch((error)=>{
            showToast(error);
        });
};


UpdateDataEmpresa = async (nombre, nit, sigla, telefono, correo, direccion, niveles, iD_Usuario,ID_Empresa) => {
    const objt = {
        nombre: nombre,
        nit: nit,
        sigla: sigla,
        telefono: telefono,
        correo: correo,
        direccion: direccion,
        niveles: niveles,
        iD_Usuario: iD_Usuario,
        Estado: 1,
        ID_Empresa:ID_Empresa
    };
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/UpdateCompany", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            console.log("Registro Ingresado correctamente");
        })
};


DeleteCompanyLogic = async (empresa) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Empresa/Delete_Company?id="+empresa, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => console.log())
}
