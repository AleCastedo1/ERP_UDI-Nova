
//GET
function GetDataUsuario(done) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Usuarios/Listar");
    result.then(response => response.json()).then(data => {
        done(data)
    }).catch(error=>{
        showToast(4);
    });
}
//GET
function GetDataUsuarioUnico(done, usuario, contraseña) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Usuarios/BuscarUser?usr=" + usuario + "&pass=" + contraseña);
    

    result.then(response => response.json()).then(data => {
        done(data);
    }).catch(error=>{
        showToast(4);
    });
}

function GetDataUsuarioID(done, idUser) {
    const result = fetch("https://microservicios-erp-udinova.azurewebsites.net/Usuarios/SearchUserID?id=" + idUser);
    result.then(response => response.json()).then(data => {
        done(data)
    }).catch(error=>{
        showToast(4);
    });
}

SetDataUsuario = async (nombre, usuario, pass, tipo) => {
    const objt = {
        iD_Usuario: 0,
        nombre: nombre,
        usuario: usuario,
        pass: pass,
        tipo: tipo,
        Estadi: 1
    };

    await fetch("https://microservicios-erp-udinova.azurewebsites.net/Usuarios/Agregar", {
        method: "POST",
        body: JSON.stringify(objt),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then((response) => console.log("Logrado ", response))
        .then((error) => console.log("Error ", error))
};

//APRENDER:
/*

closeWindows=()=>{
    window.close();
}
open_W=()=>{
  miPestaña= window.open("url","mi_pestaña","with=200,height=100");
}
mover_W=()=>{
    miPestaña.moveTo(500,100);
    miPestaña.focus();
}
nuevo_W=()=>{
    miPestaña.resizeTo(200,100);
}
*/
