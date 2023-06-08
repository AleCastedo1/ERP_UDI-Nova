function GetBDCategoria_X_Empresa(done, idEmpresa) {
    const result = fetch("https://localhost:7281/Categoria/ListarCategoria?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

function GetBDCategoria_X_ID(done, idEmpresa) {
    const result = fetch("https://localhost:7281/Categoria/searchCategoriaID?id=" + idEmpresa);
    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error => {
        console.log(error);
        showToast(4);
    });
}

SaveDataCategoria = async (categoriaOBJ,scroll) => {
    await fetch("https://localhost:7281/Categoria/agregarCategoria", {
        method: "POST",
        body: JSON.stringify(categoriaOBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
    .then((response) => {
        showToast(response.message);
        crearNodo(categoriaOBJ,response.result.categoria[0].column1,scroll);
    })
    .catch((error) => console.log(error));
}

function crearNodo(objCategoria, ID_Categoria,scroll){
    $('#Listado-Cuentas').jstree(true).delete_node("nodo-Doom");

    const newNode ={
        id: ID_Categoria,
        text: objCategoria.nombre,
    }

    if(parseInt(objCategoria.IdCategoriaPadre)>0){
        $('#Listado-Cuentas').jstree().create_node(objCategoria.IdCategoriaPadre, newNode);
    }else{
        $('#Listado-Cuentas').jstree().create_node("#", newNode);
        $('#Listado-Cuentas').scrollTop(scroll);
    }
}


UpdateDataCategoria = async (id_Categoria, nombreCat) => {
    await fetch("https://localhost:7281/Categoria/UpdateCategoria?id1="+id_Categoria+"&id2="+nombreCat, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json()).then((response) => {
        if(response.success == true){
            showToast(response.result);
        }else{
            showToast(response.success);
        }
    }).catch((error) => {
        showToast(18);
    });
};


DeleteFisic_Categoria = async (id_Categoria) => {
    await fetch("https://localhost:7281/Categoria/DeleteCategoria?id1=" + id_Categoria, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => {
            if(response.success==true){
                $('#Listado-Cuentas').jstree(true).delete_node(id_Categoria)
                showToast(response.result);
            }else{
                showToast(42);
            }
            document.getElementById("pantallasoDelete").style = "none";
        })
        .catch((error)=>{
            showToast(error);
        });
};