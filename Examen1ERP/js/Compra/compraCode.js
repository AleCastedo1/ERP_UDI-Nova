
SaveDataNotaCompra = async (nota_OBJ) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/agregarNotaLote", {
        method: "POST",
        body: JSON.stringify(nota_OBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
    .then((response) => {
        window.location.replace("http://" + window.location.host + "/Paginas/Inventario/Compra.html?id_empresa=" + empresaNow + "&currentUser=" + userNow + "&msj=1");
    })
    .catch((error) => console.log(error));
}
