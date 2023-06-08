var userNow = 0;
var empresaNow = 0;


function abrirVentanas(id_Pantalla_negra, id_hijo_Negro) {
    document.getElementById(id_Pantalla_negra).style.display = "flex";
    document.getElementById(id_hijo_Negro).style.display = "flex";
}

var toastBox = document.getElementById("toastBox");

function showToast(nro) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    const CheckMessage = '<i class="fa-sharp fa-solid fa-circle-check"></i>';
    const advertenciaMessage = '<i class="fa-solid fa-circle-exclamation"></i>';
    const ErrorMessage = '<i class="fa-sharp fa-solid fa-circle-xmark"></i>';

    switch (nro) {
        case 0:
            toast.innerHTML = CheckMessage + ' Eliminado Exitoso...';
            break;
        case 1:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Usuario no debe llevar espacios.';
            break;
        case 2:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Password no debe llevar espacios.';
            break;
        case 3:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' Usuario u Contraseña invalido.';
            break;
        case 4:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Estado de la API "Desconectado".';
            break;
        case 5:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' No se permite solo "Espacios" en nombre.';
            break;
        case 6:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' No se permite solo "Espacios" en NIT.';
            break;
        case 7:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' No se permite solo "Espacios" en sigla.';
            break;
        case 8:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Excedio la cantidad de caracteres permitidos en nombre.';
            break;
        case 9:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Excedio la cantidad de caracteres permitidos en Nit.';
            break;
        case 10:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Excedio la cantidad de caracteres permitidos en Sigla.';
            break;
        case 11:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Error, Nombre ingresado ya existe.';
            break;
        case 12:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Error, NIT ingresado ya existe.';
            break;
        case 13:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Error, Sigla ingresada ya existe.';
            break;
        case 14:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' Fecha inicio dentro del rango de una Gestion.';
            break;
        case 15:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' Fecha Fin dentro del rango de una Gestion.';
            break;
        case 16:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Limite de Gestiones Activas Alcanzadas';
            break;
        case 17:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Registro Fallido...';
            break;
        case 18:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Actualizacion Fallida...';
            break;
        case 19:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible eliminar una gestion relacionada.';
            break;
        case 20:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible Editar una Gestion que lleva periodos.';
            break;
        case 21:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible eliminar una gestion relacionada.';
            break;
        case 22:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible eliminar una gestion relacionada.';
            break;
        case 23:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible eliminar un Plan de Cuenta relacionado.';
            break;
        case 24:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible crear mas hijos, Eres el ultimo nivel.';
            break;
        case 25:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible crear un mismo "Cambio" al anterior.';
            break;
        case 26:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'Valor "Cambio" invalido, como usted.';
            break;
        case 27:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'No es posible eliminar a un nodo mayor.';
            break;
        case 28:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + 'Nombre de cuenta ya existe, no es posible guardar.';
            break;
        case 29:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' No se permite solo "Espacios" o "Campos vacios" en Nombre.';
            break;
        case 30:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' No quedan cuentas de tipo "Detalle".';
            break;
        case 31:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' No es posible guardar el comprobante, detalles minimos "2".';
            break;
        case 32:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' No existe un periodo dentro de la fecha ingresada.';
            break;
        case 33:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' No se permite una Glosa vacia.';
            break;
        case 34:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Tipo de cambio no debe ser menor o igual a "0".';
            break;
        case 35:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' El total no puede ser menor o igual a "0".';
            break;
        case 36:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' No se permiten valorenes desiguales en "Debe Total" y "Haber Total" ';
            break;
        case 37:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' No es posible guardar detalles sin un Comprobante valido." ';
            break;
        case 38:
            toast.classList.add('invalid');
            toast.innerHTML = advertenciaMessage + ' Los Campos Debe o Haber deben tener un valor mayor a "0". ';
            break;
        case 39:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' Ya existe una apertura en esta Gestion. ';
            break;
        case 40:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' No es posible eliminar una cuenta con comprobante.';
            break;
        case 41:
            toast.innerHTML = ErrorMessage + ' Boton "Guardar" habilitado.';
            break;
        case 42:
            toast.classList.add('error');
            toast.innerHTML = ErrorMessage + ' No es posible eliminar una categoria relacionada.';
            break;
        case 43:
            toast.classList.add('invalid');
            toast.innerHTML = ErrorMessage + ' Tiene que Seleccionar un valor para todos los campos...';
            break;
        case 44:
            toast.classList.add('invalid');
            toast.innerHTML = ErrorMessage + ' Fecha fuera del rango permitido para un comprobante.';
            break;
        case 45:
            toast.classList.add('invalid');
            toast.innerHTML = ErrorMessage + ' Accion denegada, Esta nota de Compra ya tiene Ventas.';
            break;
        case 46:
            toast.classList.add('invalid');
            toast.innerHTML = ErrorMessage + ' Accion denegada, Debe contar con al menos un Detalle de Venta.';
            break;
        default:
            toast.innerHTML = CheckMessage + nro;
            break;
    }
    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000)
}

function dirigirEnlace(nombre) {
    switch (nombre) {
        case "Inicio":
            window.location.href = "http://" + window.location.host + "/Paginas/Inicio/inicio.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Empresa":
            window.location.href = "http://" + window.location.host + "/Paginas/Empresa/Company.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Gestion":
            window.location.href = "http://" + window.location.host + "/Paginas/Gestiones/management.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Periodo":
            window.location.href = "http://" + window.location.host + "/Paginas/Periodo/periodo.html?id_empresa=" + empresaNow + "&currentUser=" + userNow
            break;
        case "Plan_Cuentas":
            window.location.href = "http://" + window.location.host + "/Paginas/Plan de Cuenta/AcountPlan.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        default:
            window.location.href = "http://127.0.0.1:" + window.location.port + "/index.html";
            break;
    }
}

function newDirigirXnombre(nombre, user, company, management, period) {
    console.log("llegue");
    switch (nombre) {
        case "Inicio":
            window.location.href = "http://" + window.location.host + "/Paginas/Inicio/inicio.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Empresa":
            window.location.href = "http://" + window.location.host + "/Paginas/Empresa/Company.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Gestion":
            window.location.href = "http://" + window.location.host + "/Paginas/Gestiones/management.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case 4:
            window.location.href = "http://" + window.location.host + "/Paginas/Periodo/periodo.html?id_empresa=" + company + "&currentUser=" + user + "&keyManagement=" + management;
            break;
        case "Plan_Cuentas":
            window.location.href = "http://" + window.location.host + "/Paginas/Plan de Cuenta/AcountPlan.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Moneda":
            window.location.href = "http://" + window.location.host + "/Paginas/Moneda/Coin.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Comprobante":
            window.location.href = "http://" + window.location.host + "/Paginas/Comprobante/Comprobante.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "Comprobante-r":
            window.location.replace("http://" + window.location.host + "/Paginas/Comprobante/Comprobante.html?id_empresa=" + empresaNow + "&currentUser=" + userNow + "&msj=1");
            break;
        case "DetalleComprobante":
            window.location.href = "http://" + window.location.host + "/Paginas/Comprobante/DetalleComprobante.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "BalanceInicial":
            window.location.href = "http://" + window.location.host + "/Paginas/Reportes/BalanceInicial.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
            break;
        case "LibroDiario":
            window.location.href = "http://" + window.location.host + "/Paginas/Reportes/LibroDiario.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "LibroMayor":
            window.location.href = "http://" + window.location.host + "/Paginas/Reportes/libroMayor.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "SumaSaldo":
            window.location.href = "http://" + window.location.host + "/Paginas/Reportes/suma&Saldo.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "BalanceGeneral":
            window.location.href = "http://" + window.location.host + "/Paginas/Reportes/BalanceGeneral.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "EstadoResultado":
            window.location.href = "http://" + window.location.host + "/Paginas/Reportes/EstadoResultado.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "Categoria":
            window.location.href = "http://" + window.location.host + "/Paginas/Inventario/Categoria.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "Articulo":
            window.location.href = "http://" + window.location.host + "/Paginas/Inventario/Articulo.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "NotaCompra":
            window.location.href = "http://" + window.location.host + "/Paginas/Inventario/Compra.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "AddCompra":
            window.location.href = "http://" + window.location.host + "/Paginas/Inventario/AddCompra.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "NotaCompraVenta":
            window.location.href = "http://" + window.location.host + "/Paginas/Inventario/Venta.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "AddVenta":
            window.location.href = "http://" + window.location.host + "/Paginas/Inventario/AddVenta.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        case "CuentaIntegracion":
            window.location.href = "http://" + window.location.host + "/Paginas/Integracion/cuentasIntegracion.html?id_empresa=" + empresaNow + "&currentUser=" + userNow;
        break;
        default:
            window.location.href = "http://127.0.0.1:" + window.location.port + "/index.html";
            break;
    }
}

function quitarE(param) {
    const num = param.value;
    if (num.includes('e')) {
        console.log("se detecto");
    };
}

if(document.getElementById("List-Menu")){
    const padreLista=document.getElementById("List-Menu");
    
    padreLista.children[1].addEventListener("click",function (params) {
        document.getElementById("ulNro1").style.display="Flex";
        document.getElementById("ulNro2").style.display="None";
        document.getElementById("ulNro3").style.display="None";
        document.getElementById("ulNro4").style.display="None";
    });
    padreLista.children[2].addEventListener("click",function (params) {
        document.getElementById("ulNro2").style.display="Flex";
        document.getElementById("ulNro1").style.display="None";
        document.getElementById("ulNro3").style.display="None";
        document.getElementById("ulNro4").style.display="None";
    });
    padreLista.children[3].addEventListener("click",function (params) {
        document.getElementById("ulNro3").style.display="Flex";
        document.getElementById("ulNro2").style.display="None";
        document.getElementById("ulNro1").style.display="None";
        document.getElementById("ulNro4").style.display="None";
    });
    padreLista.children[4].addEventListener("click",function (params) {
        document.getElementById("ulNro4").style.display="Flex";
        document.getElementById("ulNro3").style.display="None";
        document.getElementById("ulNro2").style.display="None";
        document.getElementById("ulNro1").style.display="None";
    });
}

