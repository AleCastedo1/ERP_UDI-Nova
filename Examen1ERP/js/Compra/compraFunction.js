var userNow;
var empresaNow;

var BD_Articulos;
var arregloEditID;

GetBDArticulo_X_Empresa(data=>{
    BD_Articulos = data.result.articulo;
    const select2 = document.getElementById("articuloSelect");

    select2.innerHTML ='';
    BD_Articulos.forEach(ele => {
        select2.innerHTML = select2.innerHTML+'<option id="opt_'+ele.idArticulo+'" value="'+ele.idArticulo+'">'+ele.nombre+'</option>';
    });
    
    $('#articuloSelect').select2({
        placeholder: 'Seleccionar Articulos..'
    });


},new URLSearchParams(window.location.search).get("id_empresa"));

window.onload = () => {
    document.getElementById("List-Menu").children[4].click();

    const paramUrl = window.location.search;
    const paramUrlPEG = new URLSearchParams(paramUrl);
    userNow = paramUrlPEG.get("currentUser");
    empresaNow = paramUrlPEG.get("id_empresa");

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

    
}

document.getElementById("agregarArticulo").addEventListener("click",function (e) {
    e.preventDefault();

    document.getElementsByClassName("pantallaso")[0].style.display="flex";
    document.getElementById("contadorH2").textContent="Agregar Nota de Compra";

    const bodyTable= document.getElementById("tbodyCompra");

    if(bodyTable.children[0].children[0].textContent == "Sin Datos"){
        bodyTable.innerHTML='';
    }

    $("#articuloSelect").val(null).trigger("change");
});

document.getElementById("detalleArticulo").addEventListener("submit",function (e) {
    e.preventDefault();

    const bodyTable= document.getElementById("tbodyCompra");

    if(editarMode==false){
        bodyTable.innerHTML=bodyTable.innerHTML+'<tr id="tr_'+e.target.articuloSelect.value+'">'+
            '<td style="display:none;">'+e.target.fechaDetalle.value+'</td>'+
            '<td>'+e.target.articuloSelect.value+'</td>'+
            '<td>'+e.target.cantidadDetalle.value+'</td>'+
            '<td style="text-align:right;">'+e.target.precioDetalle.value+'</td>'+
            '<td style="text-align:right;">'+parseInt(e.target.precioDetalle.value)*parseInt(e.target.cantidadDetalle.value)+'</td>'+
            '<td style="display:flex; flex-flow:row nowrap; justify-content:space-around; padding:10px">'+
                '<i class="i-td fa-solid fa-pen-to-square" onclick="Editar_TR(' + e.target.articuloSelect.value + ')"></i>' +
                '<i class="i-tdfa-sharp fa-solid fa-trash" onclick="quitar_TR(' + e.target.articuloSelect.value + ')"></i>' +
            '</td>'+
        '</tr>';
    }else{
        const trEdit=document.getElementById("tr_"+arregloEditID);
        
        trEdit.children[0].textContent=e.target.fechaDetalle.value;
        trEdit.children[1].textContent=e.target.articuloSelect.value;
        trEdit.children[2].textContent=e.target.cantidadDetalle.value;
        trEdit.children[3].textContent=e.target.precioDetalle.value;
        trEdit.children[4].textContent=parseInt(e.target.cantidadDetalle.value) * parseInt(e.target.precioDetalle.value);
        trEdit.children[5].innerHTML =  '<i class="i-td fa-solid fa-pen-to-square" onclick="Editar_TR('+e.target.articuloSelect.value+')"></i>'+
                                        '<i class="i-tdfa-sharp fa-solid fa-trash" onclick="quitar_TR('+e.target.articuloSelect.value+')"></i>';
        document.getElementById("tr_"+arregloEditID).id ="tr_"+e.target.articuloSelect.value;
        
        editarMode=false;

        document.getElementsByClassName("pantallaso")[0].style.display="none";
    }
    
    document.getElementById("tr_"+e.target.articuloSelect.value).children[1].textContent=BD_Articulos.find(buscar=>buscar.idArticulo == e.target.articuloSelect.value).nombre;

    document.getElementById("opt_"+e.target.articuloSelect.value).setAttribute("disabled",true);

    document.getElementById("detalleArticulo").reset();
    document.getElementById("fechaDetalle").value=new Date().toISOString().split("T")[0];
    $("#articuloSelect").val(null).trigger("change");
    calcularTotal();
});

document.getElementById("detalleArticulo").getElementsByTagName("input")[4].addEventListener("click",function (e) {
    e.preventDefault();

    document.getElementById("pantallaso").style.display="none";

    document.getElementById("detalleArticulo").reset();
    document.getElementById("fechaDetalle").value=new Date().toISOString().split("T")[0];

    const bodyTable= document.getElementById("tbodyCompra");

    if(editarMode==true){
        document.getElementById("opt_"+arregloEditID).setAttribute("disabled",true);
        editarMode=false;
    }else{
        if(bodyTable.children.length == 0){
            bodyTable.innerHTML='<tr><td colspan="5" style="text-align: center; width: 100%;">Sin Datos</td></tr>';
        }
    }

});

// $("#articuloSelect").on("change",function (e) {
//     const pillado = BD_Articulos.find(articulo=>articulo.idArticulo == $(this).val());

//     if(pillado){
//         $("#precioDetalle").val(pillado.precioVenta);
//         $("#cantidadDetalle").attr("placeholder", "Disponible: "+pillado.cantidad);
//     }
// });

document.getElementById("formCompra").addEventListener("submit",function (e) {
    e.preventDefault();

    const objetoCompra = {
        idNota:0,
        fecha: e.target.fecha.value,
        descripcion: e.target.descripcion.value,
        total: 0,
        idEmpresa:parseInt(empresaNow),
        idUsuario:parseInt(userNow),
        listLote: null,
        objConfIntegrada:null
    };
    const arrayArticulos=[];
    const listaTable= document.getElementById("tbodyCompra");
    
    for (let i = 0; i < listaTable.children.length; i++) {
        arrayArticulos.push({
            id_ArticuloF: listaTable.children[i].id.split("_")[1],
            nroLote:0,
            fechaIngreso: e.target.fecha.value,
            fechaVencimiento:listaTable.children[i].children[0].textContent,
            cantidad:parseInt(listaTable.children[i].children[2].textContent),
            precioCompra:parseFloat(listaTable.children[i].children[3].textContent),
            stock: parseInt(listaTable.children[i].children[2].textContent),
            estado: 1,
            idNotaF:0,
            nombre:""
        });
        objetoCompra.total= objetoCompra.total + parseFloat(listaTable.children[i].children[4].textContent);
    }
    objetoCompra.listLote=arrayArticulos;

    GetAllDataConfCuenta(data=>{
        if(data.result.datos[0].estado==1){
            objetoCompra.objConfIntegrada={
                iD_Empresa: data.result.datos[0].iD_Empresa,
                estado: data.result.datos[0].estado,
                cajaID: data.result.datos[0].cajaID,
                creadiFiscal: data.result.datos[0].creadiFiscal,
                debitoFiscal: data.result.datos[0].debitoFiscal,
                compras: data.result.datos[0].compras,
                ventas: data.result.datos[0].ventas,
                it: data.result.datos[0].it,
                iTxPagar: data.result.datos[0].iTxPagar
            };

            GetBDPeriodoxEmpresa(find=>{
                var ExisteFecha = false;
    
                find.result.periodo.forEach(element => {
                    if (ExisteFecha == false && element.fechaInicio.split("T")[0] <= objetoCompra.fecha && element.fechaFin.split("T")[0] >= objetoCompra.fecha && element.estado == 1) {
                        ExisteFecha = true;
                    }
                });
    
                if(ExisteFecha==true){
                    SaveDataNotaCompra(objetoCompra);
                }else{
                    showToast(44);
                }
            },empresaNow);
        }else{
            objetoCompra.objConfIntegrada={
                iD_Empresa: 0,
                estado: 0,
                cajaID: 0,
                creadiFiscal: 0,
                debitoFiscal: 0,
                compras: 0,
                ventas: 0,
                it: 0,
                iTxPagar: 0
            }
            SaveDataNotaCompra(objetoCompra);
        }
    },empresaNow);
});


var editarMode= false;
function Editar_TR(idSelected) {
    editarMode = true;
    const tr_Selected= document.getElementById("tr_"+idSelected);

    arregloEditID=idSelected;
    
    document.getElementById("contadorH2").textContent="Editar Nota de Compra";
    document.getElementById("fechaDetalle").value=tr_Selected.children[0].textContent;
    document.getElementById("cantidadDetalle").value=tr_Selected.children[2].textContent;
    document.getElementById("precioDetalle").value=tr_Selected.children[3].textContent;


    document.getElementsByClassName("pantallaso")[0].style.display="flex";

    document.getElementById("opt_"+idSelected).removeAttribute("disabled");


    $("#articuloSelect").val(idSelected).trigger("change");
}

function quitar_TR(idSelected) {
    document.getElementById("tr_"+idSelected).remove();
    
    document.getElementById("opt_"+idSelected).removeAttribute("disabled");

    const bodyTable= document.getElementById("tbodyCompra");

    if(bodyTable.children.length == 0){
        bodyTable.innerHTML='<tr><td colspan="5" style="text-align: center; width: 100%;">Sin Datos</td></tr>';
    }
}

function calcularTotal() {
    const listaTable= document.getElementById("tbodyCompra");
    var Total=0;
    for (let i = 0; i < listaTable.children.length; i++) {
        Total= Total + parseFloat(listaTable.children[i].children[4].textContent);
    }
    $("#td_Total").text(Total);
}



//http://localhost/ReportsERP/report/Empresas_ERP/ReporteNotaCompra