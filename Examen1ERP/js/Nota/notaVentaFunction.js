var userNow;
var empresaNow;

window.onload = () => {
    document.getElementById("List-Menu").children[4].click();

    const paramUrl = window.location.search;
    const paramUrlPEG = new URLSearchParams(paramUrl);
    userNow = paramUrlPEG.get("currentUser");
    empresaNow = paramUrlPEG.get("id_empresa");

    vistaComprobante = paramUrlPEG.get("msj");
    if (vistaComprobante) {
        showToast("La Nota y Venta han sido guardados satisfactoriamente.");
        var historial = window.history;
        historial.pushState({}, '', "Venta.html?id_empresa="+empresaNow+"&currentUser="+userNow);
        vistaComprobante = null;
        
        GetBDNotas_X_Empresa(llamada=>{
            setTimeout(() => {
                document.getElementById("List_notas#"+llamada.result.nota[0].idNota).click("true");
            }, 250);
        },empresaNow);
    }

    if (userNow == 0 || !userNow) {
        window.location.href = "http://127.0.0.1:" + window.location.port + "/index.html";
    } else {
        if (empresaNow == 0 || !empresaNow) {
            window.location.href = "http://127.0.0.1:" + window.location.port + "/Paginas/Empresa/Company.html?currentUser=" + userNow;
        }
    }

    GetBuscarEmpresa(dato => {
        document.getElementById("h1-header").innerText = 'Empresa "' + dato.result.empresa[0].nombre + '"';
    }, empresaNow);

    GetDataUsuarioID(data => {
        document.getElementById("name-User").innerText = data.result.usuario[0].nombre;
    }, userNow);
    
    cargarListaNotas();
}

function cargarListaNotas() {
    GetBDNotas_X_Empresa(data=>{
        let bodyPadre = document.getElementById("table_Notas").getElementsByTagName("tbody")[0];
        bodyPadre.innerHTML='';

        if(data.result.nota.length>0){
            data.result.nota.forEach(element => {
                if(element.tipo=="Venta"){
                    bodyPadre.innerHTML=bodyPadre.innerHTML+''+
                        '<tr id="List_notas#'+element.idNota+'" onclick="mostrarModalNota(this)">'+
                            '<td>'+element.nroNota+'</td>'+
                            '<td>'+invertirFecha(element.fecha)+'</td>'+
                            '<td>'+element.descripcion+'</td>'+
                            '<td>'+ (element.estado == 1? 'Activo':'<span style="color: var(--variable_5_0-5); font-weight: bold;">Anulado</span>') +'</td>'+
                            '<td>'+element.tipo+'</td>'+
                        '</tr>';
                }
            });
        }
    },empresaNow);
}

var notaDetected=0;

function mostrarModalNota(seleccion) {
    notaDetected=seleccion.id.split("#")[1];

    if(seleccion.children[3].textContent != "Activo"){
        document.getElementById("anularNota").style.display="none";
    }else{
        document.getElementById("anularNota").style.display="block";
    }

    document.getElementsByClassName("pantallaso")[0].style.display = "flex";
    document.getElementsByClassName("modal-view")[0].style.display = "flex";

    document.getElementsByClassName("head_Comprobante")[0].getElementsByTagName("h2")[0].textContent = "Datos de Nota# "+ seleccion.children[0].textContent;
    const bodyNota = document.getElementsByClassName("cuerpo_Comprobante")[0].children[0];
    
    bodyNota.innerHTML = 
                         '<p><span style="font-weight: bold;">Tipo: </span>'+ seleccion.children[4].textContent +'</p>'+
                         '<p><span style="font-weight: bold;">Fecha: </span>'+ seleccion.children[1].textContent +'</p>'+
                         '<p><span style="font-weight: bold;">Descripcion: </span>'+seleccion.children[2].textContent+'</p>'+
                         '<p><span style="font-weight: bold;">Estado: </span>'+(seleccion.children[3].textContent =="Activo"? 'Activo':'<span style="color: var(--variable_5_0-5); font-weight: bold;">Anulado</span>')+'</p>';
    
    const tablaDetalles = document.getElementById("Detalles_Comprobante");

    tablaDetalles.innerHTML=
        '<thead>'+
            '<tr>'+
                '<th colspan="1">Articulo</th>'+
                '<th colspan="1">Lote</th>'+
                '<th colspan="1">Cantidad</th>'+
                '<th colspan="1">Precio</th>'+
                '<th colspan="1">Sub Total</th>'+
            '</tr>'+
        '</thead>'+
        '<tbody>'+

        '</tbody>'+

        '<tfoot>'+
            '<tr>'+
                '<td colspan="4">TOTAL:</td>'+
                '<td colspan="1" id="totalDefinitivo2" style="text-align: right;">0</td>'+
            '</tr>'+
        '</tfoot>';
        
        GetBDDetalles_X_IdNota(datos=>{
            const bodyTable=tablaDetalles.getElementsByTagName("tbody")[0];
            let TotalDetalle=0;

            bodyTable.innerHTML='';

            datos.result.detalle.forEach(element => {
                bodyTable.innerHTML=bodyTable.innerHTML+
                    '<tr>'+
                        '<td>'+element.nombre+'</td>'+
                        '<td style="text-align:center;">'+element.nroLote+'</td>'+
                        '<td>'+element.cantidad+'</td>'+
                        '<td style="text-align:right;">'+element.precioVenta+'</td>'+
                        '<td style="text-align:right;">'+parseFloat(element.cantidad)*parseFloat(element.precioVenta)+'</td>'+
                    '</tr>';
                TotalDetalle=TotalDetalle+(parseFloat(element.cantidad)*parseFloat(element.precioVenta));
            });
            document.getElementById("totalDefinitivo2").textContent =TotalDetalle;
        },notaDetected);
}

function invertirFecha(fecha) {
    fecha = fecha.split("T")[0];
    fecha = fecha.replace('-', '/');
    fecha = fecha.replace('-', '/');

    const partes = fecha.split('/');

    const dia = partes[2];
    const mes = partes[1];
    const anio = partes[0];

    return `${dia}/${mes}/${anio}`;
}

document.getElementById("closedModel").addEventListener("click",function (e) {
    document.getElementsByClassName("pantallaso")[0].style.display="none";
    document.getElementsByClassName("modal-view")[0].style.display="none";

});

document.getElementById("anularNota").addEventListener("click",function (e) {
    document.getElementsByClassName("modal-view")[0].style.display="none";
    document.getElementsByClassName("modal-view")[1].style.display="flex";

    document.getElementsByClassName("modal-view")[1].style.width = "30%";
    document.getElementsByClassName("modal-view")[1].style.borderRadius = "7%";
    document.getElementById("h2-deleteNota").textContent = 'Anular la nota Nro "' + notaDetected + '"';
});

document.getElementById("cerrarAnular").addEventListener("click",function (e) {
    document.getElementsByClassName("pantallaso")[0].style.display="none";
    document.getElementsByClassName("modal-view")[1].style.display="none";
});

document.getElementById("btnAnularNota").addEventListener("click",function (e) {
    AnularNotaLogic(notaDetected,2);
});

function agregarVenta() {
    newDirigirXnombre("AddVenta");
}

function imprimirComprobante() {
    const iFrameInformes = document.getElementById("iFrameInformeVenta");
    document.getElementsByClassName("modal-view")[0].style.display="none";
    document.getElementsByClassName("modal-view")[2].style.display="flex";
    document.getElementsByClassName("modal-view")[2].style.width = "auto";

    document.getElementsByClassName("modal-view")[2].style.flexFlow = "row nowrap";
    document.getElementsByClassName("modal-view")[2].style.paddingRight = "0px";
    document.getElementsByClassName("modal-view")[2].style.gap = "7px";

    iFrameInformes.style.width="622px";
    iFrameInformes.style.height="700px";

    iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteNotaVenta?Parameter_IdNota=" + notaDetected +"&rs:Embed=true");
    iFrameInformes.style.border = '2px solid var(--variable_5_0-7)';
}

document.getElementById("closedModel1").addEventListener("click",function (e) {
    document.getElementsByClassName("pantallaso")[0].style.display="none";
    document.getElementsByClassName("modal-view")[2].style="none";
});