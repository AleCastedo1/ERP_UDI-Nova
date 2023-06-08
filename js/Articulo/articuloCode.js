function GetBDArticulo_X_Empresa(done, idEmpresa) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/ListarArticulos?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDArticulo_X_ID(done, idArticulo) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/foundArticuloID?id=" + idArticulo);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDArticuloCategoria_X_IdCategoria(done, idArticulo) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/ListarArticuloCategoria?id=" + idArticulo);
    result.then(response => response.json()).then(data => {
        done(data.result.articulo_Categoria);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}


SaveDataArticulo = async (articulo_OBJ) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/agregarArticulo", {
        method: "POST",
        body: JSON.stringify(articulo_OBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
    .then((response) => {
        showToast(response.result);
        cargarListaArticulos();

        if(document.getElementById("AgregarArticulo_modal")){
            document.getElementById("AgregarArticulo_modal").style.display="none";
            document.getElementsByClassName("pantallaso")[0].style.display="none";
        }
        document.getElementById("form_Articulo").reset();

        if(document.getElementById("tbodyArticulo").offsetHeight >= 400){
            document.getElementById("tbodyArticulo").style.maxHeight = '420px';
        }
    })
    .catch((error) => console.log(error));
}

UpdateDataArticulo = async (articulo_OBJ) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/UpdateArticulo", {
        method: "POST",
        body: JSON.stringify(articulo_OBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
    .then((response) => {
        showToast(response.result);

        if(document.getElementById("ocultar")){
            document.getElementById("ocultar").click();  
        } 

        document.getElementById("List_articulos#"+articuloEliminar).children[0].textContent=articulo_OBJ.nombre;
        document.getElementById("List_articulos#"+articuloEliminar).children[1].textContent=articulo_OBJ.descripcion;
        document.getElementById("List_articulos#"+articuloEliminar).children[2].textContent=articulo_OBJ.precioVenta;

        cargarCategorias(articulo_OBJ.idArticulo);
        
        estadoEditar = false;
        
        if(document.getElementById("ocultar")){
            if(document.getElementById("tbodyArticulo").offsetHeight >= 400){
                document.getElementById("tbodyArticulo").style.maxHeight = '420px';
            }
        }


        if(document.getElementById("AgregarArticulo_modal").style.display == "flex"){
            document.getElementsByName("cancelar")[0].click();
        }
    })
    .catch((error) => console.log(error));
}

DeleteFisic_Articulo = async (id_Articulo) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/DeleteArticulo?id1=" + id_Articulo, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            showToast(response.result);
            document.getElementsByClassName("pantallaso")[0].style.display="none";
            document.getElementById("btnDeleteArticulo").removeAttribute("disabled");
            cargarListaArticulos();
        })
        .catch((error)=>{
            showToast(error);
            document.getElementsByClassName("pantallaso")[0].style.display="none";
            document.getElementById("btnDeleteArticulo").removeAttribute("disabled");
        });
};

DeleteFisic_ArticuloNew = async (id_Articulo) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Articulo/DeleteArticulo?id1=" + id_Articulo, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            showToast(response.result);
            document.getElementsByClassName("pantallaso")[0].style.display="none";
            document.getElementById("btnDeleteArticulo").removeAttribute("disabled");
            cargarListaArticulos();
        })
        .catch((error)=>{
            showToast(error);
            document.getElementsByClassName("pantallaso")[0].style.display="none";
            document.getElementById("btnDeleteArticulo").removeAttribute("disabled");
        });
};