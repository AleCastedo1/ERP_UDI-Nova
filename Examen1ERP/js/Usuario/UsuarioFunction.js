var userNow = 0;
var updatebtn = 0;

document.getElementById("login-form").addEventListener("submit", event => {
    event.preventDefault();
    let usr = event.srcElement.username.value;
    let pass = event.srcElement.password.value;
    if (usr.trim().length == 0){
        showToast(1);
    }
    if (pass.trim().length == 0){
        showToast(2);
    }

    if (pass.trim().length == 0 || usr.trim().length == 0) {
        return;
    }

    loginUser(usr, pass);
})

var select = document.getElementById("select_empresa");
var empresa = 0;
function loginUser(username, password) {
    GetDataUsuarioUnico(data => {
        console.log(data.message);
        if (data.message == "Encontrado") {
            userNow = data.result.usuario[0].iD_Usuario;
            window.location.href = "http://" + window.location.host + "/Paginas/Empresa/Company.html?currentUser=" + userNow;
        }else{
            showToast(3);
        }
    }, username, password);
}

/*
//GET
var login = document.getElementById('login-form');

if (login) {
    login.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe y recargue la página
        
    });
}



document.getElementById("Ingresar_empresa").addEventListener("click", function () {
    empresa = document.getElementById("select_empresa").value;
    if (empresa > 0) {
        window.location.href = "http://"+window.location.host+"/Paginas/Empresa/inicio.html?id_empresa=" + empresa + "&currentUser=" + userNow;
    } else {
        alert("Selecciones una Empresa PERR0");
    }
});

document.getElementById("newEmpr").addEventListener("click", function () {
    document.getElementById("pag-2").style.display = "none";
    abrirVentanas("NewEmpresa","form_Empresa");
});

document.getElementById("form_Empresa").addEventListener("submit", e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    if(updatebtn==0){
        SetDataEmpresa(
            datos.nombre,
            datos.Nit,
            datos.Sigla,
            datos.Telefono,
            datos.Correo,
            datos.Direccion,
            datos.Nivel,
            userNow);
    
        const nuewOpt=parseInt(select.children[select.length-1].value)+1
        const options = document.createElement("option");
        options.setAttribute("value", nuewOpt);
        options.setAttribute("id", "opt"+nuewOpt);
        options.textContent = datos.nombre;
        select.appendChild(options);

    }else{
        empresa = select.value;
        UpdateDataEmpresa(  datos.nombre,
                            datos.Nit,
                            datos.Sigla,
                            datos.Telefono,
                            datos.Correo,
                            datos.Direccion,
                            datos.Nivel,
                            userNow, empresa);
    }
    restablecerForm();
});

document.getElementById("deleteEmpr").addEventListener("click", function (){
    empresa = select.value;

    if (empresa > 0) {
        DeleteCompanyLogic(empresa);
        select.selectedIndex=0;
        document.getElementById("opt"+empresa).setAttribute("hidden","");
    } else {
        alert("Selecciones una Empresa PERR0");
    }
})
document.getElementById("UpdateEmpr").addEventListener("click",function () {
    empresa = select.value;

    if (empresa > 0) {
        GetBuscarEmpresa(data => {
            if (data.message == "Encontrado") {
                document.getElementById("titleNewCompany").innerText='Editar Empresa "'+data.result.empresa[0].nombre+'" ';
                document.getElementById("EmpresNombre").value=data.result.empresa[0].nombre;
                document.getElementById("EmpresNIT").value=data.result.empresa[0].nit;
                document.getElementById("EmpresaSigla").value=data.result.empresa[0].sigla;
                document.getElementById("EmpresTelefono").value=data.result.empresa[0].telefono;
                document.getElementById("EmpresaCorreo").value=data.result.empresa[0].correo;
                document.getElementById("EmpresaDireccion").value=data.result.empresa[0].direccion;
                document.getElementById("EmpresaNivel").value=data.result.empresa[0].niveles;

                document.getElementById("pag-2").style.display = "none";
                abrirVentanas("NewEmpresa","form_Empresa");
                updatebtn=1;
            }
        }, empresa);
    
        
    } else {
        alert("Selecciones una Empresa PERR0");
    }
});

function restablecerForm() {
    document.getElementById("titleNewCompany").innerText="Nueva Empresa:";
    document.getElementById("EmpresNombre").value="";
    document.getElementById("EmpresNIT").value="";
    document.getElementById("EmpresaSigla").value="";
    document.getElementById("EmpresTelefono").value="";
    document.getElementById("EmpresaCorreo").value="";
    document.getElementById("EmpresaDireccion").value="";
    document.getElementById("EmpresaNivel").value="";
    updatebtn=0;
}*/