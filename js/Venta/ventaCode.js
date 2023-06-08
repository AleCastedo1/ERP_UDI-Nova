

SaveDataNotaVenta = async (nota_OBJ) => {
    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Nota/agregarNotaDetalle", {
        method: "POST",
        body: JSON.stringify(nota_OBJ),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
    .then((response) => {
        console.log(response.result);
        window.location.replace("http://" + window.location.host + "/Paginas/Inventario/Venta.html?id_empresa=" + empresaNow + "&currentUser=" + userNow + "&msj=1");
    })
    .catch((error) => console.log(error));
}