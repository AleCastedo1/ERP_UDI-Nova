window.onload = () => {
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

    if (document.getElementById("CountEmpresas")) {
        GetAllDataEmpresa(data => {
            document.getElementById("CountEmpresas").innerText = data.result.empresa.length;
        });
    }
    if (document.getElementById("CountGestiones")) {
        GetBDGestion(data => {
            document.getElementById("CountGestiones").innerText = data.result.gestion.length;
        }, empresaNow);

        const ctx = document.getElementById('myChart');

        var arrayNombre = new Array();
        var arrayTotal = new Array();
        GetBDData_ExG_Count(data => {
            data.result.datos.forEach(element => {
                arrayNombre.push(element.nombre);
                arrayTotal.push(element.total);
            });;

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: arrayNombre,
                    datasets: [
                        {
                            label: 'Nro de Gestiones',
                            borderWidth: 1,
                            data: arrayTotal,
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    }

    if (document.getElementById("CountPeriodos")) {
        nroPeriodos_X_Empresa(data => {
            document.getElementById("CountPeriodos").innerText = data.result.datos[0].cantidadPeriodos;
        }, empresaNow);

        const ctx1 = document.getElementById('myChart1');
        var arrayN2 = new Array();
        var arrayT2 = new Array();

        GetBDData_PxG_Count(data => {
            data.result.datos.forEach(element => {
                arrayN2.push(element.nombre);
                arrayT2.push(element.total);
            });;

            new Chart(ctx1, {
                type: 'pie',
                data: {
                    labels: arrayN2,
                    datasets: [
                        {
                            label: 'Nro de Periodos',
                            borderWidth: 1,
                            data: arrayT2,
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }, empresaNow);
    }

    if (document.getElementById("CountP_Cuentas")) {
        GetBDCuenta_X_Empresa(data => {
            document.getElementById("CountP_Cuentas").innerText = data.result.cuenta.length;
        }, empresaNow);
    }

}