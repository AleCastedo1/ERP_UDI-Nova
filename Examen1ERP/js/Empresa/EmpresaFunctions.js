
var updatebtn = 0;

window.onload = () => {
    const paramUrl = window.location.search;
    const paramUrlPEG = new URLSearchParams(paramUrl);
    userNow = paramUrlPEG.get("currentUser");
    empresaNow = paramUrlPEG.get("id_empresa");

    if (userNow == 0 || !userNow) {
        window.location.href = "http://127.0.0.1:" + window.location.port + "/index.html";
    }

    GetAllDataMoneda(data => {
        var opciones = '';
        data.result.moneda.map(function (params) {
            opciones = opciones + '<option value="' + params.idMoneda + '">' + params.nombre + '</option>';
        });
        document.getElementById("selectMoneda").innerHTML = opciones;
    });
    ActualizarLista();
}

$(document).ready(function () {

})

function ActualizarLista() {
    var padreSelect = document.getElementById("selectAqui");

    padreSelect.innerHTML = '<select id="SelectCompanyJS" name="SelectCompanyJS" style="width:100%;">';

    $("#SelectCompanyJS").select2();

    GetAllDataEmpresa(element => {

        element.result.empresa.map(function (params) {
            const options = document.createElement("option");

            options.id = 'opt_' + params.iD_Empresa;
            options.textContent = params.nombre;
            options.value = params.iD_Empresa;

            document.getElementById("SelectCompanyJS").appendChild(options);
        });
    });
}


document.getElementById("btn-seleccion").addEventListener("click", function () {
    empresaNow = $('#SelectCompanyJS').val();
    dirigirEnlace("Inicio");
});

document.getElementById("btn-AgregarCom").addEventListener("click", function (params) {
    document.getElementById("pantallaso").style.display = "block";
});

document.getElementById("cerrarAddUpd").addEventListener("click", function (params) {
    restablecerForm();
    document.getElementById("pantallaso").style = "none";
});

document.getElementById("form_Empresa").addEventListener("submit", e => {
    const datos = Object.fromEntries(new FormData(e.target));
    e.preventDefault();

    if (validarForm(datos.nombre, datos.Nit, datos.Sigla) == true) {
        GetAllDataEmpresa(dataEmp => {
            var decision = {
                nom: true,
                nit: true,
                sigla: true
            }
            dataEmp.result.empresa.forEach(element => {
                if (empresaNow != element.iD_Empresa) {
                    if (element.nombre.toLowerCase() == datos.nombre.toLowerCase().trim() && decision.nom == true) {
                        decision.nom = false;
                        showToast(11);
                    }
                    if (element.nit == datos.Nit.trim() && decision.nit == true) {
                        decision.nit = false;
                        showToast(12);
                    }
                    if (element.sigla.toLowerCase() == datos.Sigla.toLowerCase().trim() && decision.sigla == true) {
                        decision.sigla = false;
                        showToast(13);
                    }
                }
            });
            //console.log(decision);
            if (decision.nom == true && decision.nit == true && decision.sigla == true) {
                if (updatebtn == 0) {
                    SetDataEmpresa(
                        datos.nombre,
                        datos.Nit,
                        datos.Sigla,
                        datos.Telefono,
                        datos.Correo,
                        datos.Direccion,
                        datos.Nivel,
                        userNow,
                        datos.selectMoneda);
                } else {
                    UpdateDataEmpresa(
                        datos.nombre,
                        datos.Nit,
                        datos.Sigla,
                        datos.Telefono,
                        datos.Correo,
                        datos.Direccion,
                        datos.Nivel,
                        userNow, empresaNow);

                    GetBDMonedaXEmpresa(data => {
                        if (data.result.moneda.length > 1) {
                            document.getElementById("selectMoneda").setAttribute("disabled", "disabled");
                        } else {
                            var valor = document.getElementById("selectMoneda").value;
                            UpdateDataEmpMon(data.result.moneda[0].idEmpresaMoneda, valor);
                        }
                    }, empresaNow);


                    setTimeout(() => {
                        showToast("hecho");
                        ActualizarLista();
                        restablecerForm();
                    }, 1500);
                    setTimeout(() => {
                        $('#SelectCompanyJS').select2().val(empresaNow).trigger("change");
                    }, 1600);
                }
            }
        });
    }

})

var resultadoVa = false;

const validarForm = (nombre, nit, sigla) => {
    var decision = {
        nom: true,
        nit: true,
        sigla: true
    }

    if (nombre.trim().length == 0) {
        showToast(5);
        decision.nom = false;
    }

    if (nombre.trim().length > 40) {
        showToast(8);
        decision.nom = false;
    }

    if (nit.trim().length == 0) {
        showToast(6);
        decision.nit = false;
    }
    if (nit.trim().length > 15) {
        showToast(9);
        decision.nit = false;
    }

    if (sigla.trim().length == 0) {
        showToast(7);
        decision.sigla = false;
    }

    if (sigla.trim().length > 9) {
        showToast(10);
        decision.sigla = false;
    }

    if (decision.nom == true && decision.nit == true && decision.sigla == true) {
        return true;
    } else {
        return false;
    }
}

document.getElementById("btn-editar_Company").addEventListener("click", function (params) {
    empresaNow = $('#SelectCompanyJS').val();
    GetBuscarEmpresa(attr => {
        GetBDMonedaXEmpresa(data => {
            if (data.result.moneda.length > 1) {
                document.getElementById("selectMoneda").setAttribute("disabled", "disabled");
            } else {
                document.getElementById("selectMoneda").value = data.result.moneda[0].idMonedaPrincipal;
            }
        }, empresaNow);
        document.getElementById("pantallaso").style.display = "block";
        document.getElementById("titleNewCompany").textContent = 'Actualizar "' + attr.result.empresa[0].nombre + '"';
        document.getElementById("button-save").value = "Guardar Cambios";

        document.getElementById("EmpresNombre").value = attr.result.empresa[0].nombre;
        document.getElementById("EmpresNIT").value = attr.result.empresa[0].nit;
        document.getElementById("EmpresaSigla").value = attr.result.empresa[0].sigla;
        document.getElementById("EmpresTelefono").value = attr.result.empresa[0].telefono;
        document.getElementById("EmpresaCorreo").value = attr.result.empresa[0].correo;
        document.getElementById("EmpresaDireccion").value = attr.result.empresa[0].direccion;
        document.getElementById("EmpresaNivel").value = attr.result.empresa[0].niveles;
    }, empresaNow);
    updatebtn = 1;
});


document.getElementById("btn-eliminar_company").addEventListener("click", function (params) {
    empresaNow = $('#SelectCompanyJS').val();

    document.getElementById("pantallaso2").style.display = "block";
    GetBuscarEmpresa(data => {
        document.getElementById("h2-deleteCompany").innerText = 'Eliminar la Empresa "' + data.result.empresa[0].nombre + '"';
    }, empresaNow);

});

document.getElementById("cerrarDeleteCompany").addEventListener("click", function (params) {
    document.getElementById("pantallaso2").style = "none";
});

document.getElementById("btnDeleteCompany").addEventListener("click", function (params) {
    DeleteCompanyLogic(empresaNow);
    document.getElementById("opt_" + empresaNow).remove();
    document.getElementById("pantallaso2").style = "none";
    showToast(0);
});
function restablecerForm() {
    document.getElementById("pantallaso").style = "none";

    document.getElementById("titleNewCompany").innerText = "Nueva Empresa:";
    document.getElementById("form_Empresa").reset();
    document.getElementById("selectMoneda").removeAttribute("disabled");
    updatebtn = 0;
}

document.getElementById("logOut").addEventListener("click", function (params) {
    dirigirEnlace("cerrar");
})
/*

document.getElementById("Editar_Empresa").addEventListener("click", function (parameters) {
    GetBuscarEmpresa(attr => {
        document.getElementById("form-h3").style.display = "block";
        document.getElementById("form-h3").textContent = 'Actualizar "' + attr.result.empresa[0].nombre + '"';
        document.getElementById("button-save").value = "Guardar Cambios";

        document.getElementById("EmpresNombre").value = attr.result.empresa[0].nombre;
        document.getElementById("EmpresNIT").value = attr.result.empresa[0].nit;
        document.getElementById("EmpresaSigla").value = attr.result.empresa[0].sigla;
        document.getElementById("EmpresTelefono").value = attr.result.empresa[0].telefono;
        document.getElementById("EmpresaCorreo").value = attr.result.empresa[0].correo;
        document.getElementById("EmpresaDireccion").value = attr.result.empresa[0].direccion;
        document.getElementById("EmpresaNivel").value = attr.result.empresa[0].niveles;

        document.getElementById("mensaje_accion").textContent = 'La Empresa "' + attr.result.empresa[0].nombre + '" fue actualizada correctamente.';

    }, empresaNow);

    document.getElementById("Agregar").click();
    document.getElementById("title_cabeza-2-1").style = "none";
    document.getElementById("Agregar").style.width = "100%";

    document.getElementById("padreCabeza-1").style.width = "20%";
    document.getElementById("padreCabeza-2").style.width = "20%";

    document.getElementById("padreCabeza-1").style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    document.getElementById("padreCabeza-2").style.backgroundColor = "rgba(255, 255, 255, 0.4)";
    document.getElementById("padreCabeza-3").style.backgroundColor = "rgba(255, 255, 255, 0.6)";

    document.getElementById("padreCabeza-2").style.borderRadius = "0px";

    document.getElementById("padreCabeza-3").style.display = "flex";


    limpiarCampos();
    updatebtn = 1;
});

document.getElementById("Eliminar_Empresa").addEventListener("click", function (params) {
    GetBuscarEmpresa(data => {
        GetDataUsuarioID(data2 => {
            document.getElementById("ususarioDeleteCompany").textContent = data2.result.usuario[0].nombre;
        }, userNow);
        document.getElementById("content_delete_P").textContent = '¿Esta seguro que deseas eliminar la empresa "' + data.result.empresa[0].nombre + '"?';
    }, empresaNow);
    document.getElementById("opciones_listado").style = "none";
});


document.getElementById("CancelarDelete").addEventListener("click",function (params) {
    history.go(-1);
});

var anteriorList = "";

function mostrarOpciones(id) {
    empresaNow = id;
    document.getElementById("opciones_listado").style.display = "flex";
    document.getElementById("list_" + id).style.backgroundColor = "rgba(248, 249, 250, 0.8)";
    if (anteriorList.length > 0) {
        document.getElementById(anteriorList).style = "none";
    }
    anteriorList = "list_" + id;
}

document.getElementById("cerrar_opciones").addEventListener("click", function () {
    document.getElementById("opciones_listado").style.display = "none";
    if (anteriorList.length > 0) {
        document.getElementById(anteriorList).style = "none";
    }
});

function limpiarCampos() {
    document.getElementById("form_Empresa").reset();
    updatebtn = 0;
}




var comunicado = "";
function validarRegistro(nombre, Nit, Sigla, Telefono, Correo, Direccion, Nivel) {
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    let decision = true;
    var mensaje = '<div style="display:flex; flex-flow:column nowrap; justify-content:space-between;">' +
        '<h4> Datos erroneos de los campos: </h4>';

    if (nombre.length < 2 || nombre.length > 30) {
        mensaje = mensaje + '<label>- Nombre de la empresa.</label>';
        decision = false;
    }

    if (Nit.length < 1 || Nit.length > 15) {
        mensaje = mensaje + '<label>- NIT de la empresa.</label>';
        decision = false;
    }

    if (Sigla.length <= 1 || Sigla.length > 7) {
        mensaje = mensaje + '<label>- La Sigla de la empresa.</label>';
        decision = false;
    }

    if (Telefono.length <= 5 || Telefono.length > 8) {
        mensaje = mensaje + '<label>- Numero de telefono/celular.</label>';
        decision = false;
    }

    if (Correo.trim().length <= 4 || Correo.trim().length > 30) {
        if (!emailRegex.test(Correo)) {
            mensaje = mensaje + '<label>- Correo electronico u Email.</label>';
            decision = false;
        }
    }

    if (Direccion.length <= 1 || Direccion.length > 150) {
        mensaje = mensaje + '<label>- Dirección de empresa.</label>';
    }
    comunicado = mensaje + '</div>';
    return decision;
    // document.getElementById("mensaje_company").textContent=mensaje;
    // document.getElementById("mensaje_company").autofocus;
}

document.getElementById("devolver_normalidad").addEventListener("click", function (params) {
    document.body.classList.remove('active');
    document.body.style = "none";
    document.getElementById("seccion-2").style.opacity = 1;
    document.getElementById("Buscar").click();
});



*/