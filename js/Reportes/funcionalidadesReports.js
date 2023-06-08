var verificar = {
    gestion: true,
    periodo: true,
    moneda: true
};

window.onload = () => {
    document.getElementById("List-Menu").children[3].click();

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

    GetBDGestion(data => {
        const padreSelect = document.getElementById("gestionesDatos");
        padreSelect.innerHTML = '';
        if (data.result.gestion.length > 0) {
            data.result.gestion.forEach(element => {
                padreSelect.innerHTML = padreSelect.innerHTML + '<option value="' + element.iD_Gestion + '">' + element.nombre + '</option>';
            });

            if (document.getElementById("periodosDatos")) {
                document.getElementsByTagName("form")[0].style.height = "48vh";
                
                document.getElementsByTagName("form")[0].style.width = "48%";
                document.getElementById("iFrameInformes").style.width="50.7%"; 

                GetBDPeriodoxGestion(data1 => {
                    const padreSelectPeriodo = document.getElementById("periodosDatos");

                    if (data1.result.periodo.length > 0) {
                        padreSelectPeriodo.innerHTML = '<option value="0">Todos</option>';

                        data1.result.periodo.forEach(element => {
                            padreSelectPeriodo.innerHTML = padreSelectPeriodo.innerHTML + '<option value="' + element.iD_Periodo + '">' + element.nombre + '</option>';
                        });
                    } else {
                        padreSelectPeriodo.innerHTML = '<option disabled selected>Sin Periodos<option>';
                        padreSelectPeriodo.setAttribute("disabled", "true");

                        document.getElementById("mostrarID").disabled = "true";
                    }
                }, document.getElementById("gestionesDatos").value);
            }
        }
        else {
            padreSelect.innerHTML = '<option disabled selected>Sin Gestiones<option>';
            padreSelect.setAttribute("disabled", "true");
            verificar.gestion = false;

            if (document.getElementById("periodosDatos")) {
                verificar.periodo = false;
                const padreSelectPeriodo = document.getElementById("periodosDatos");
                padreSelectPeriodo.innerHTML = '<option disabled selected>Sin Periodos<option>';
                padreSelectPeriodo.setAttribute("disabled", "true");
            }

            if (verificar.gestion == false || verificar.moneda == false || verificar.periodo == false) {
                document.getElementById("mostrarID").disabled = "true";
            }
        }
    }, empresaNow);


    GetBDMonedaXEmpresa(data => {
        if (data.result.moneda.length > 1) {
            GetAllDataMoneda(data2 => {
                let bd_Moneda = data2.result.moneda;

                const padreSelect = document.getElementById("monedasActivas");
                const option1 = document.createElement("option");
                const option2 = document.createElement("option");

                option1.value = data.result.moneda[0].idMonedaAlternativa;
                option1.textContent = bd_Moneda.find(moneda => {
                    return moneda.idMoneda == data.result.moneda[0].idMonedaAlternativa;
                }).nombre + " (Alternativo)";

                option2.value = data.result.moneda[0].idMonedaPrincipal;
                option2.textContent = bd_Moneda.find(moneda => {
                    return moneda.idMoneda == data.result.moneda[0].idMonedaPrincipal;
                }).nombre + " (Principal)";

                padreSelect.appendChild(option2);
                padreSelect.appendChild(option1);
            })
        } else {
            verificar.moneda = false;
            const padreSelect = document.getElementById("monedasActivas");
            padreSelect.innerHTML = '<option disabled selected>Sin Monedas<option>';
            padreSelect.setAttribute("disabled", "true");
        }

        if (verificar.gestion == false || verificar.moneda == false || verificar.periodo == false) {
            document.getElementById("mostrarID").disabled = "true";
        }
    }, empresaNow);
}


if (document.getElementById("periodosDatos")) {
    document.getElementById("gestionesDatos").addEventListener("change", function (params) {
        GetBDPeriodoxGestion(data1 => {
            const padreSelectPeriodo = document.getElementById("periodosDatos");
            if (data1.result.periodo.length > 0) {
                padreSelectPeriodo.innerHTML = '<option value="0">Todos</option>';

                data1.result.periodo.forEach(element => {
                    padreSelectPeriodo.innerHTML = padreSelectPeriodo.innerHTML + '<option value="' + element.iD_Periodo + '">' + element.nombre + '</option>';
                });

                padreSelectPeriodo.removeAttribute("disabled");
                document.getElementById("mostrarID").removeAttribute("disabled");
            } else {
                padreSelectPeriodo.innerHTML = '<option disabled selected>Sin Periodos<option>';
                padreSelectPeriodo.setAttribute("disabled", "true");
                document.getElementById("mostrarID").disabled = "true";
            }
        }, document.getElementById("gestionesDatos").value);
    });
}


if (document.getElementById("formBalIni")) {
    document.getElementById("formBalIni").addEventListener("submit", function (e) {
        e.preventDefault();
        let idGestion = document.getElementById("gestionesDatos").value;
        let idMoneda = document.getElementById("monedasActivas").value;

        const iFrameInformes = document.getElementById("iFrameInformes");
        iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteBalanceInicial?parameter_idGestion=" + idGestion + "&parameter_SwitchMoneda=" + idMoneda + "&rs:Embed=true");
        iFrameInformes.style.border = '3px solid var(--variable_5_0-7)';
    });
}

if (document.getElementById("formLibDia")) {
    document.getElementById("formLibDia").addEventListener("submit", function (e) {
        e.preventDefault();

        const iFrameInformes = document.getElementById("iFrameInformes");

        iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteLibroDiario?parameter_ID_Gestion=" + e.target.gestionesDatos.value + "&parameter_ID_Periodo=" + e.target.periodosDatos.value + "&parameter_Moneda=" + e.target.monedasActivas.value + "&rs:Embed=true");
        iFrameInformes.style.border = '3px solid var(--variable_5_0-7)';
    });
}

if (document.getElementById("formLibMay")) {
    document.getElementById("formLibMay").addEventListener("submit", function (e) {
        e.preventDefault();

        const iFrameInformes = document.getElementById("iFrameInformes");

        iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteLibroMayor?parameter_ID_Gestion=" + e.target.gestionesDatos.value + "&parameter_ID_Periodo=" + e.target.periodosDatos.value + "&parameter_Moneda=" + e.target.monedasActivas.value + "&rs:Embed=true");
        iFrameInformes.style.border = '3px solid var(--variable_5_0-7)';
    });
}

if (document.getElementById("formSumSal")) {
    document.getElementById("formSumSal").addEventListener("submit", function (e) {
        e.preventDefault();
        
        const iFrameInformes = document.getElementById("iFrameInformes");
        iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteSumaYSaldo?parameter_ID_Gestion=" + e.target.gestionesDatos.value + "&parameter_Moneda=" + e.target.monedasActivas.value + "&rs:Embed=true");
        iFrameInformes.style.border = '3px solid var(--variable_5_0-7)';
    });
}

if (document.getElementById("formBalGen")) {
    document.getElementById("formBalGen").addEventListener("submit", function (e) {
        e.preventDefault();
        
        const iFrameInformes = document.getElementById("iFrameInformes");
        iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteBalanceGeneral?parameter_ID_Gestion=" + e.target.gestionesDatos.value + "&parameter_Moneda=" + e.target.monedasActivas.value + "&rs:Embed=true");
        iFrameInformes.style.border = '3px solid var(--variable_5_0-7)';
    });
}

if (document.getElementById("formEstRes")) {
    document.getElementById("formEstRes").addEventListener("submit", function (e) {
        e.preventDefault();
        
        const iFrameInformes = document.getElementById("iFrameInformes");
        iFrameInformes.setAttribute("src", "http://localhost/ReportsERP/report/Empresas_ERP/ReporteEstadoResultado?parameter_ID_Gestion=" + e.target.gestionesDatos.value + "&parameter_Moneda=" + e.target.monedasActivas.value + "&rs:Embed=true");
        iFrameInformes.style.border = '3px solid var(--variable_5_0-7)';
    });
}
