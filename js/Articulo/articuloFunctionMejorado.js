var userNow;
var empresaNow;

var BD_Categorias;
var estadoEditar=false;

GetBDCategoria_X_Empresa(data => {
    BD_Categorias = data.result.categoria;
}, new URLSearchParams(window.location.search).get("id_empresa"))

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

$('#ocultar').click(function () {
    if(document.getElementById("tbodyArticulo").offsetHeight >= 420){
        if(document.getElementById("form_Articulo").style.display === 'none'){
        
            document.getElementById("tbodyArticulo").style.maxHeight = '420px';
    
            setTimeout(()=>{
                $('#form_Articulo').slideToggle();
                
                $('#selectCategoria').select2({
                    placeholder: 'Seleccionar categorias..'
                });

                document.getElementById("ocultar").className="fa-solid fa-square-minus";
            },1100);
    
        }else{
            $('#form_Articulo').slideToggle();
            
            setTimeout(()=>{
                document.getElementById("tbodyArticulo").style.maxHeight = '655px';
                document.getElementById("ocultar").className="fa-solid fa-square-plus";
            },400);
    
        }
    }else{
        
        if(document.getElementById("form_Articulo").style.display === 'none'){
            document.getElementById("ocultar").className="fa-solid fa-square-minus";
        }else{
            document.getElementById("ocultar").className="fa-solid fa-square-plus";
        }
        $('#form_Articulo').slideToggle();

        $('#selectCategoria').select2({
            placeholder: 'Seleccionar categorias..'
        });
    }

    document.getElementById("h2-Articulo").textContent="AGREGAR ARTICULO";

    document.getElementById("form_Articulo").reset();
    estadoEditar = false;
});


document.getElementById("form_Articulo").addEventListener("submit",function (e) {
    e.preventDefault();

    const selectCategorias= $('#selectCategoria').val();
    const articuloSave={
        idArticulo:0,
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

var articuloEliminar= 0;

function EditarArt(id) {
    if(document.getElementById("form_Articulo").style.display === 'none'){
        document.getElementById("ocultar").click();
    }

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

    document.getElementById("h2-Articulo").textContent="EDITAR ARTICULO";
    estadoEditar = true;
    articuloEliminar = id;
}

function modalEliminar(idArticulo) {
    articuloEliminar = idArticulo;
    
    document.getElementsByClassName("pantallaso")[0].style.display = "flex";

    document.getElementById("h2-deleteArticulo").textContent='Anular el articulo "' + document.getElementById("List_articulos#"+idArticulo).children[0].textContent + '"';;
}

document.getElementById("cerrarDelete").addEventListener("click",function (e) {
    e.preventDefault();
    document.getElementsByClassName("pantallaso")[0].style = "none";
});

document.getElementById("btnDeleteArticulo").addEventListener("click",function (e) {
    e.preventDefault();
    document.getElementById("btnDeleteArticulo").setAttribute("disabled","disabled");
    DeleteFisic_Articulo(articuloEliminar);
});
