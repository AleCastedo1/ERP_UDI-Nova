var userNow;
var empresaNow;

var BD_Categorias;
var estadoEditar=false;

GetBDCategoria_X_Empresa(data=>{
    BD_Categorias=data.result.categoria;
},new URLSearchParams(window.location.search).get("id_empresa"))

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

    cargarListaArticulos();
}

function cargarListaArticulos() {
    GetBDArticulo_X_Empresa(data => {
        const padre = document.getElementsByClassName("tableContenido")[0].getElementsByTagName("tbody")[0];
        padre.innerHTML = ' ';

        data.result.articulo.forEach(element => {
            padre.innerHTML = padre.innerHTML +
                '<tr id="List_articulos#' + element.idArticulo + '">' +
                    '<td>' + element.nombre + '</td>' +
                    '<td>' + element.descripcion + '</td>' +
                    '<td style="text-align:right;">' + element.precioVenta + '</td>' +
                    '<td style="text-align:center;">cargando...</td>' +
                    '<td style="position:relative;">'+
                        '<div style="position:absolute; inset: 0px 0px 0px 0px; width: 100%; height: 100%; display:flex; flex-flow:row nowrap; justify-content:space-around; align-items:center;">'+
                            '<i class="fa-solid fa-circle-info" onclick="mostrarLotes('+element.idArticulo+')"></i>'+
                            '<i class="fa-solid fa-pen-to-square" onclick="EditarArt(' + element.idArticulo + ')" title="Editar Articulo"></i>'+
                            '<i class="fa-sharp fa-solid fa-trash" onclick="modalEliminar(' + element.idArticulo + ')" title="Eliminar Articulo"></i></td>' +
                        '</div>'+
                '</tr>';
        });
        
        data.result.articulo.forEach(element => {
            cargarCategorias(element.idArticulo);
        });
        
    }, empresaNow);

    const selectCategoria = document.getElementById("selectCategoria");
    selectCategoria.innerHTML = '';

    GetBDCategoria_X_Empresa(data => {
        data.result.categoria.forEach(datos => {
            selectCategoria.innerHTML = selectCategoria.innerHTML + '<option value="' + datos.idCategoria + '">' + datos.nombre + '</option>';
        });
    }, empresaNow);
}

function cargarCategorias(id) {
    GetBDArticuloCategoria_X_IdCategoria(data => {
        var lectura = "";
        data.forEach(items => {
            lectura = lectura + ", " + BD_Categorias.find(item => item.idCategoria === items.idCategoria_AC).nombre;
        });
        lectura = lectura.replace(",", "");
        lectura = lectura + ".";

        document.getElementById("List_articulos#"+id).children[3].textContent=lectura;
    }, id);
}


document.getElementById("btn-add-Articulo").addEventListener("click",function (e) {
    e.preventDefault();

    document.getElementById("h2-Articulo").textContent="AGREGAR ARTICULO";
    document.getElementsByClassName("pantallaso")[0].style.display="flex";
    document.getElementsByClassName("modal-view")[0].style.display="flex";

    $('#selectCategoria').select2({
        placeholder: 'Seleccionar categorias..'
    });
});

document.getElementById("form_Articulo").addEventListener("submit",function (e) {
    e.preventDefault();

    const selectCategorias= $('#selectCategoria').val();
    const articuloSave={
        nombre: e.target.nombre.value,
        descripcion: e.target.descripcion.value,
        cantidad: 0,
        precioVenta: e.target.precio.value,
        idEmpresa: empresaNow,
        idUsuario: userNow,
        categoriaLista:null
    }

    articuloSave.categoriaLista= selectCategorias.map(function(current) {
        return current;
    });

    if (estadoEditar==false) {
        SaveDataArticulo(articuloSave);
    }else{
        articuloSave.idArticulo= articuloEliminar;
        UpdateDataArticulo(articuloSave);
    }
});

document.getElementsByName("cancelar")[0].addEventListener("click",function (params) {
    params.preventDefault();
    document.getElementById("form_Articulo").reset();
    document.getElementsByClassName("pantallaso")[0].style.display="none";
    document.getElementById("AgregarArticulo_modal").style.display="none";
    estadoEditar = false;
});

function EditarArt(id) {
    document.getElementsByClassName("pantallaso")[0].style.display="flex";
    document.getElementById("AgregarArticulo_modal").style.display="flex";

    const formPadre=document.getElementById("form_Articulo");
    const listaEditar=document.getElementById("List_articulos#"+id).children;

    formPadre.nombre.value= listaEditar[0].textContent;
    formPadre.descripcion.value= listaEditar[1].textContent;
    formPadre.precio.value= listaEditar[2].textContent;
    
    GetBDArticuloCategoria_X_IdCategoria(data=>{
        let listaCategorias=data.map(function(datos) {
            return datos.idCategoria_AC;
        });
        
        $('#selectCategoria').val(listaCategorias).trigger('change');
    },id)

    $('#selectCategoria').select2({
        placeholder: 'Seleccionar categorias..'
    });

    document.getElementById("h2-Articulo").textContent="EDITAR ARTICULO";
    estadoEditar = true;
    articuloEliminar = id;
}



var articuloEliminar= 0;


function modalEliminar(idArticulo) {
    articuloEliminar = idArticulo;
    
    document.getElementsByClassName("pantallaso")[0].style.display = "flex";
    document.getElementsByClassName("modal-view")[1].style.display = "flex";


    document.getElementById("h2-deleteArticulo").textContent='Anular el articulo "' + document.getElementById("List_articulos#"+idArticulo).children[0].textContent + '"';;
}

document.getElementById("cerrarDelete").addEventListener("click",function (e) {
    e.preventDefault();
    document.getElementsByClassName("pantallaso")[0].style = "none";
    document.getElementsByClassName("modal-view")[1].style.display = "none";
});

document.getElementById("btnDeleteArticulo").addEventListener("click",function (e) {
    e.preventDefault();
    document.getElementById("btnDeleteArticulo").setAttribute("disabled","disabled");
    DeleteFisic_Articulo(articuloEliminar);
});


function mostrarLotes(id) {
    document.getElementsByClassName("modal-view")[2].style.width = "auto";
    document.getElementsByClassName("pantallaso")[0].style.display = "flex";
    document.getElementsByClassName("modal-view")[2].style.display = "flex";
    document.getElementsByClassName("head")[0].getElementsByTagName("h2")[0].textContent="Lotes del Articulo: "+ document.getElementById("List_articulos#"+id).children[0].textContent;
    GetBDLotes_X_IdArticulo(data=>{
        const modalTableBody = document.getElementById("modalTable").getElementsByTagName("tbody")[0];
        modalTableBody.innerHTML='';

        if(data.result.lote.length>0){
            data.result.lote.forEach(item => {
                modalTableBody.innerHTML=modalTableBody.innerHTML+''+
                    '<tr>'+
                        '<td>'+item.nroLote+'</td>'+
                        '<td>'+invertirFecha(item.fechaIngreso)+'</td>'+
                        '<td>'+invertirFecha(item.fechaVencimiento)+'</td>'+
                        '<td>'+item.cantidad+'</td>'+
                        '<td>'+item.stock+'</td>'+
                        '<td>'+calcularEstado(item.estado)+'</td>'+
                    '</tr>'+
                '';
            });
        }else{
            modalTableBody.innerHTML='<tr><td colspan="6" style="text-align:center;">Sin Datos</td></tr>';
        }

        console.log(data.result.lote);
    },id);
}

document.getElementById("closedModal").addEventListener("click",function (e) {
    document.getElementsByClassName("pantallaso")[0].style.display = "none";
    document.getElementsByClassName("modal-view")[2].style = "none";
    document.getElementsByClassName("modal-view")[2].style.display = "none";
});

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

function calcularEstado(estado) {
    const elementos= {
        0 : '<span style="color:#4C4C4C; font-weight:bold;"> Anulado</span>',
        1 : '<span> Activo</span>',
        2 : '<span style="color:red;"> Agotado</span>'
    }
    return elementos[estado];
}