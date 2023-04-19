sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Token",
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Filter',
    "../model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast, Token, FilterOperator, Filter, formatter) {
        "use strict";

        const oAppController = Controller.extend("it.orogel.crezioneordinibollebs.controller.View1", {
            formatter: formatter,
            onInit: function () {
                this.oComponent = this.getOwnerComponent();
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                this.Ora1 = [];
                this.Ora2 = [];
                this.Ora3 = [];
                this.function = 0;
                const oPromiseOra1 = new Promise((resolve, reject) => {
                    this.getView().getModel().read("/ZZ1_ORA1", {
                        success: (aData) => {
                            resolve(aData.results);
                        },
                        error: (oError) => {
                            reject;
                        }
                    });
                });
                const oPromiseOra2 = new Promise((resolve, reject) => {
                    this.getView().getModel("ora2Model").read("/ZZ1_ORA2", {
                        success: (aData) => {
                            resolve(aData.results);
                        },
                        error: (oError) => {
                            reject;
                        }
                    });
                });
                const oPromiseOra3 = new Promise((resolve, reject) => {
                    this.getView().getModel("ora3Model").read("/ZZ1_ORA3", {
                        success: (aData) => {
                            resolve(aData.results);
                        },
                        error: (oError) => {
                            reject;
                        }
                    });
                });
                Promise.all([oPromiseOra1, oPromiseOra2, oPromiseOra3]).then((aResults) => {
                    this.Ora1 = aResults[0];
                    aResults[1].forEach(x => {
                        if (x.BolleBSPuntoVendita === "*") {
                            x.BolleBSPuntoVendita = "";
                        }
                    })
                    this.Ora2 = aResults[1];
                    this.Ora3 = aResults[2];
                    this.oGlobalBusyDialog.close();
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.recuperodaticbo.text"));
                    this.oComponent.resetAllBusy();
                    this.oGlobalBusyDialog.close();
                });
            },

            onFailedType: function () {
                sap.m.MessageToast.show(this.oComponent.i18n().getText("msg.error.filetype"));
            },
            /**
 * On upload button event handler
 * ------------------------------
 */
            onUploadPress: function () {
                this.oGlobalBusyDialog.open();
                this._setTableModel([]);
                let ofile = this.byId("fileUploader"),
                    file = ofile.oFileUpload.files[0];
                if (file && window.FileReader) {
                    let reader = new FileReader();
                    if (file.name.includes("txt") || file.name.includes("TXT")) {
                        reader.onload = (e) => {
                            let strCSV = e.target.result,
                                separator = ";",
                                lines = strCSV.split("\r\n"),
                                start = "0",
                                end = lines.length,
                                massiveUploadTotal = [];
                            //Dati testata
                            var Flusso = "";
                            var OrganizzazioneCommerciale = "OPSU";
                            var CanaleDistributivo = "IT";
                            var SettoreMerceologico = "PV";
                            var Distributore = "";
                            var Distributoretmp = "";
                            var DescrizioneDistributore = "";
                            //Dati bolla
                            var ProgressivoBolla = "";
                            var NumeroBolla = "";
                            var DataBolla = "";
                            var Committente = "";
                            var Committentetmp = "";
                            var CommittenteTrovato = "";
                            var DescrizioneCommittente = "";
                            var DestinatarioMerci = "";
                            var DestinatarioMercitmp = "";
                            var DestinatarioMerciTrovato = "";
                            var DescrizioneDestinatarioMerci = "";
                            var RiferimentoOrdineCliente = "";
                            var DataOrdineCliente = "";
                            var DataConsegnaMerce = "";
                            //Posizione
                            var PosizioneOrdine = "";
                            var CategoriaDiPosizione = "";
                            var Materiale = "";
                            var Materialetmp = "";
                            var DescrizioneMateriale = "";
                            var Quantita = "";
                            var UDM = "";
                            var Lotto = "";
                            var DataScadenzaLotto = "";
                            var Note = "";
                            var StatoElaborazione = "";
                            var ErroriCBO = "";
                            var ErroriCBO00 = "";
                            var ErroriCBO01 = "";
                            var ErroriCBO02 = "";
                            for (let i = start; i < end; i++) {
                                ErroriCBO = "";
                                let linetype = lines[i].substring(0, 2);
                                if (linetype === "00") {
                                    Distributoretmp = lines[i].substring(2, 8);
                                    var Flussotmp = this.Ora1.find(x => x.BolleBSDistributore === Distributoretmp.trim());
                                    if (Flussotmp) {
                                        if (Flussotmp.CausaleBolla === "USD") {
                                            Flusso = "CONTO DEPOSITO";
                                        } else {
                                            Flusso = "RIFATTURAZIONE";
                                        }
                                        Distributore = Flussotmp.CodiceDestMerciSAP;
                                    } else {
                                        Distributore = Distributoretmp.trim();
                                        ErroriCBO00 = "Errore conversione Codice Distributore " + Distributoretmp.trim();
                                    }
                                    DescrizioneDistributore = lines[i].substring(8, 47);
                                } else if (linetype === "01") {
                                    ProgressivoBolla = "";
                                    NumeroBolla = "";
                                    DataBolla = "";
                                    Committente = "";
                                    Committentetmp = "";
                                    CommittenteTrovato = "";
                                    DescrizioneCommittente = "";
                                    DestinatarioMerci = "";
                                    DestinatarioMercitmp = "";
                                    DestinatarioMerciTrovato = "";
                                    DescrizioneDestinatarioMerci = "";
                                    RiferimentoOrdineCliente = "";
                                    DataOrdineCliente = "";
                                    DataConsegnaMerce = "";
                                    ProgressivoBolla = lines[i].substring(2, 8);
                                    NumeroBolla = lines[i].substring(8, 14);
                                    DataBolla = lines[i].substring(14, 20);
                                    Committentetmp = lines[i].substring(26, 46);
                                    //DescrizioneCommittente = lines[i].substring(8, 48);
                                    DestinatarioMercitmp = lines[i].substring(46, 66);
                                    RiferimentoOrdineCliente = lines[i].substring(72, 107);
                                    DataOrdineCliente = lines[i].substring(66, 72);
                                    DataConsegnaMerce = lines[i].substring(20, 26);
                                    ErroriCBO01 = "";
                                    var Ora2 = this.Ora2.find(x => x.BolleBSCliente === Committentetmp.trim() && x.BolleBSDistributore === Distributoretmp.trim());
                                    if (Ora2) {
                                        Committente = Ora2.CodiceCMSAP;
                                        CommittenteTrovato = "X";
                                    } else {
                                        Committente = Committentetmp.trim();
                                        ErroriCBO01 = "Errore conversione Codice Cliente " + Committentetmp.trim();
                                    }
                                    Ora2 = this.Ora2.find(x => x.BolleBSCliente === Committentetmp.trim() && x.BolleBSDistributore === Distributoretmp.trim() && x.BolleBSPuntoVendita === DestinatarioMercitmp.trim());
                                    if (Ora2) {
                                        DestinatarioMerci = Ora2.CodiceDMSAP;
                                        DestinatarioMerciTrovato = "X";
                                    } else {
                                        DestinatarioMerci = DestinatarioMercitmp.trim();
                                        if (ErroriCBO01 === "") {
                                            ErroriCBO01 = "Errore conversione Codice Destinatario Merci " + DestinatarioMercitmp.trim();
                                        } else {
                                            ErroriCBO01 = ErroriCBO01 + ",Errore conversione Codice Destinatario Merci " + DestinatarioMercitmp.trim();
                                        }
                                    }
                                } else if (linetype === "02") {
                                    DescrizioneCommittente = lines[i].substring(8, 48);
                                } else if (linetype === "03") {
                                    DescrizioneDestinatarioMerci = lines[i].substring(8, 48);
                                } else if (linetype === "10") {
                                    PosizioneOrdine = "";
                                    CategoriaDiPosizione = "";
                                    Materiale = "";
                                    Materialetmp = "";
                                    DescrizioneMateriale = "";
                                    Quantita = "";
                                    UDM = "";
                                    Lotto = "";
                                    DataScadenzaLotto = "";
                                    Note = "";
                                    StatoElaborazione = "";
                                    ErroriCBO02 = "";
                                    if (ErroriCBO00 !== "") {
                                        ErroriCBO = ErroriCBO + ErroriCBO00 + ",";
                                    }
                                    if (ErroriCBO01 !== "") {
                                        ErroriCBO = ErroriCBO + ErroriCBO01 + ",";
                                    }
                                    PosizioneOrdine = lines[i].substring(8, 11);
                                    //CATEGORIA DI POSIZIONE
                                    if (lines[i].substring(87, 88) === "X" && Flusso === "CONTO DEPOSITO") {
                                        CategoriaDiPosizione = "ZKLN";
                                    } else if (lines[i].substring(87, 88) === " " && Flusso === "CONTO DEPOSITO") {
                                        CategoriaDiPosizione = "ZKEN";
                                    } else if (Flusso === "RIFATTURAZIONE") {
                                        CategoriaDiPosizione = "ZKRN";
                                    }
                                    //END CATEGORIA DI POSIZIONE
                                    Materialetmp = lines[i].substring(11, 31);
                                    UDM = lines[i].substring(80, 83);
                                    DescrizioneMateriale = lines[i].substring(31, 71);
                                    Quantita = lines[i].substring(71, 80);
                                    Lotto = lines[i].substring(88, 99);
                                    DataScadenzaLotto = lines[i].substring(99, 107);
                                    /*var Ora3 = this.Ora3.find(x => x.BolleBSArticolo === Materialetmp.trim() && x.BolleBSDistributore === Distributoretmp.trim());
                                    if (Ora3) {
                                        Materiale = Ora3.MaterialeSAP;
                                        if (parseFloat(Ora3.FattoreConversione) !== 0) {
                                            Quantita = parseFloat(Quantita) * parseFloat(Ora3.FattoreConversione);
                                        } else {
                                            Quantita = parseFloat(Quantita);
                                        }
                                    } else {
                                        Materiale = Materialetmp.trim();
                                        Quantita = parseFloat(Quantita);
                                        ErroriCBO02 = "Nel CBO non è presente il materiale" + Materialetmp.trim();
                                    }*/
                                    Materiale = Materialetmp.trim();
                                    Quantita = parseFloat(Quantita.substring(0, 7) + "," + Quantita.substring(7, 9));
                                    var datatmp = "";
                                    //DataBolla
                                    //if è una data
                                    if (!(DataBolla instanceof Date)) {
                                        if (DataBolla.trimEnd() !== "") {
                                            datatmp = DataBolla.trimEnd().match(/..?/g);
                                            datatmp[0] = "20" + datatmp[0];
                                            DataBolla = new Date(+datatmp[0], datatmp[1] - 1, +datatmp[2]);
                                        } else {
                                            DataBolla = DataBolla.trimEnd();
                                        }
                                    }
                                    //DataOrdineCliente
                                    if (!(DataOrdineCliente instanceof Date)) {
                                        if (DataOrdineCliente.trimEnd() !== "") {
                                            datatmp = DataOrdineCliente.trimEnd().match(/..?/g);
                                            datatmp[0] = "20" + datatmp[0];
                                            DataOrdineCliente = new Date(+datatmp[0], datatmp[1] - 1, +datatmp[2]);
                                        } else {
                                            DataOrdineCliente = DataOrdineCliente.trimEnd();
                                        }
                                    }
                                    //DataConsegnaMerce
                                    if (!(DataConsegnaMerce instanceof Date)) {
                                        if (DataConsegnaMerce.trimEnd() !== "") {
                                            datatmp = DataConsegnaMerce.trimEnd().match(/..?/g);
                                            datatmp[0] = "20" + datatmp[0];
                                            DataConsegnaMerce = new Date(+datatmp[0], datatmp[1] - 1, +datatmp[2]);
                                        } else {
                                            DataConsegnaMerce = DataConsegnaMerce.trimEnd();
                                        }
                                    }
                                    //DataScadenzaLotto
                                    if (!(DataScadenzaLotto instanceof Date)) {
                                        if (DataScadenzaLotto.trimEnd() !== "") {
                                            datatmp = DataScadenzaLotto.trimEnd().match(/..?/g);
                                            datatmp[0] = "20" + datatmp[0];
                                            DataScadenzaLotto = new Date(+datatmp[0], datatmp[1] - 1, +datatmp[2]);
                                        } else {
                                            DataScadenzaLotto = DataScadenzaLotto.trimEnd();
                                        }
                                    }
                                    if (ErroriCBO02 !== "") {
                                        ErroriCBO = ErroriCBO + ErroriCBO02;
                                    } else {
                                        ErroriCBO = ErroriCBO.slice(0, ErroriCBO.length - 1);
                                    }
                                    var oMassiveUpload = {
                                        "Flusso": Flusso,
                                        "Distributore": Distributore,
                                        "DistributoreBolla": Distributoretmp.trim(),
                                        "DescrizioneDistributore": DescrizioneDistributore.trimEnd(),
                                        "ProgressivoBolla": ProgressivoBolla,
                                        "NumeroBolla": NumeroBolla,
                                        "DataBolla": DataBolla,
                                        "Committente": Committente,
                                        "Committentetmp": Committentetmp,
                                        "CommittenteTrovato": CommittenteTrovato,
                                        "DestinatarioMerci": DestinatarioMerci,
                                        "DestinatarioMerciTrovato": DestinatarioMerciTrovato,
                                        "RiferimentoOrdineCliente": RiferimentoOrdineCliente.trimEnd(),
                                        "DataOrdineCliente": DataOrdineCliente,
                                        "DataConsegnaMerce": DataConsegnaMerce,
                                        "PosizioneOrdine": PosizioneOrdine,
                                        "CategoriaDiPosizione": CategoriaDiPosizione,
                                        "Materiale": Materiale,
                                        "Quantita": Quantita,
                                        "Lotto": Lotto.trimEnd(),
                                        "DataScadenzaLotto": DataScadenzaLotto,
                                        "OrganizzazioneCommerciale": OrganizzazioneCommerciale,
                                        "CanaleDistributivo": CanaleDistributivo,
                                        "SettoreMerceologico": SettoreMerceologico,
                                        "Note": Note,
                                        "StatoElaborazione": StatoElaborazione,
                                        "UDM": UDM,
                                        "DescrizioneCommittente": DescrizioneCommittente,
                                        "DescrizioneDestinatarioMerci": DescrizioneDestinatarioMerci,
                                        "DescrizioneMateriale": DescrizioneMateriale,
                                        "editable": false,
                                        "ErroriCBO": ErroriCBO
                                    };
                                    massiveUploadTotal.push(oMassiveUpload);
                                }
                            };
                            this._startExtraction(massiveUploadTotal);
                            //this._setTableModel(massiveUploadTotal);
                            //this.oGlobalBusyDialog.close();
                        }
                        reader.readAsText(file);

                    }
                }
            },
            /**
 * Start extraction
 * ----------------
 * @param aFile - file
 */
            _startExtraction: function (aFile) {
                let aUniqueMaterial = [...new Set(aFile.map(item => item.Materiale))],
                    oPromise = Promise.resolve(),
                    oPromise2 = Promise.resolve(),
                    oPromise3 = Promise.resolve(),
                    oPromise4 = Promise.resolve(),
                    oPromiseMateriale = Promise.resolve(),
                    aUniqueCommittente = [...new Set(aFile.map(item => item.Committente))],
                    aUniqueDestinatarioMerci = [...new Set(aFile.map(item => item.DestinatarioMerci))];
                aUniqueMaterial.forEach(x => {
                    oPromiseMateriale = oPromiseMateriale.then(() => {
                        return this._callAPIMateriali(x, aFile);
                    });
                });
                //oPromiseMateriale.then(() => {
                Promise.all([oPromiseMateriale]).then(() => {
                    aUniqueMaterial.forEach(x => {
                        oPromise = oPromise.then(() => {
                            return this._callAPI(x, aFile);
                        });
                        oPromise2 = oPromise2.then(() => {
                            return this._callAPI2(x, aFile);
                        });
                    });
                    aUniqueCommittente.forEach(x => {
                        oPromise3 = oPromise3.then(() => {
                            return this._callAPI3(x, aFile);
                        });
                    });
                    aUniqueDestinatarioMerci.forEach(x => {
                        oPromise4 = oPromise4.then(() => {
                            return this._callAPI4(x, aFile);
                        });
                    });
                    Promise.all([oPromise, oPromise2, oPromise3, oPromise4]).then(() => {
                        this._controlli(aFile);
                        this._aggiornamentoStato(aFile);
                    }, oError => {
                        MessageToast.show(this.oComponent.i18n().getText("msg.error.recuperodatitabelleSAP.text"));
                        this.oGlobalBusyDialog.close();
                    });
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.recuperodatitabelleSAP.text"));
                    this.oGlobalBusyDialog.close();
                });
            },
            _callAPI: function (sMaterial, aFile) {
                return new Promise((resolve, reject) => {
                    this.getView().getModel("CreazioneOrdiniBolleBSModel").read("/MARASet('" + sMaterial + "')", {
                        success: oData => {
                            aFile.forEach(x => {
                                if (x.Materiale === oData.Matnr) {
                                    x.UDM = oData.Meins;
                                }
                            })
                            resolve();
                        },
                        error: (oError) => {
                            if (oError.statusCode === "404") {
                                resolve();
                            } else {
                                reject(oError);
                            }
                        }
                    }, [], true);
                });
            },
            _callAPI2: function (sMaterial, aFile) {
                return new Promise((resolve, reject) => {
                    this.getView().getModel("CreazioneOrdiniBolleBSModel").read("/MAKTSet('" + sMaterial + "')", {
                        success: oData => {
                            aFile.forEach(x => {
                                if (x.Materiale === oData.Matnr) {
                                    x.DescrizioneMateriale = oData.Maktx;
                                }
                            })
                            resolve();
                        },
                        error: (oError) => {
                            if (oError.statusCode === "404") {
                                resolve();
                            } else {
                                reject(oError);
                            }
                        }
                    }, [], true);
                });
            },
            _callAPI3: function (sMaterial, aFile) {
                return new Promise((resolve, reject) => {
                    this.getView().getModel("CreazioneOrdiniBolleBSModel").read("/KNA1Set('" + sMaterial + "')", {
                        success: oData => {
                            aFile.forEach(x => {
                                if (x.Committente === oData.Kunnr) {
                                    x.DescrizioneCommittente = oData.Name1;
                                }
                            })
                            resolve();
                        },
                        error: (oError) => {
                            if (oError.statusCode === "404") {
                                resolve();
                            } else {
                                reject(oError);
                            }
                        }
                    }, [], true);
                });
            },
            _callAPI4: function (sMaterial, aFile) {
                return new Promise((resolve, reject) => {
                    this.getView().getModel("CreazioneOrdiniBolleBSModel").read("/KNA1Set('" + sMaterial + "')", {
                        success: oData => {
                            aFile.forEach(x => {
                                if (x.DestinatarioMerci === oData.Kunnr) {
                                    x.DescrizioneDestinatarioMerci = oData.Name1;
                                }
                            })
                            resolve();
                        },
                        error: (oError) => {
                            if (oError.statusCode === "404") {
                                resolve();
                            } else {
                                reject(oError);
                            }
                        }
                    }, [], true);
                });
            },
            _callAPIMateriali: function (sMaterial, aFile) {
                return new Promise((resolve, reject) => {
                    this.getView().getModel("ProductModel").read("/A_ProductSalesDelivery(Product='" + sMaterial + "',ProductSalesOrg='OPSU',ProductDistributionChnl='IT')", {
                        urlParameters: {
                            "$select": "Product"
                        },
                        success: oData => {
                            var aFileMateriale = aFile.filter(x => x.Materiale === sMaterial);
                            aFileMateriale.forEach(y => {
                                var Ora3 = this.Ora3.find(x => x.BolleBSArticolo === sMaterial && x.BolleBSDistributore === y.DistributoreBolla);
                                if (Ora3) {
                                    if (parseFloat(Ora3.FattoreConversione) !== 0) {
                                        if (parseFloat(Ora3.GestCoeff) === 2) {
                                            y.Quantita = parseFloat(y.Quantita) / parseFloat(Ora3.FattoreConversione);
                                        } else {
                                            y.Quantita = parseFloat(y.Quantita) * parseFloat(Ora3.FattoreConversione);
                                        }
                                    }
                                }
                            });
                            resolve();
                        },
                        error: (oError) => {
                            if (oError.response.statusCode.toString() === "404") {
                                var aFileMateriale = aFile.filter(x => x.Materiale === sMaterial);
                                aFileMateriale.forEach(y => {
                                    var Ora3 = this.Ora3.find(x => x.BolleBSArticolo === sMaterial && x.BolleBSDistributore === y.DistributoreBolla);
                                    if (Ora3) {
                                        y.Materiale = Ora3.MaterialeSAP;
                                        if (parseFloat(Ora3.FattoreConversione) !== 0) {
                                            if (parseFloat(Ora3.GestCoeff) === 2) {
                                                y.Quantita = parseFloat(y.Quantita) / parseFloat(Ora3.FattoreConversione);
                                            } else {
                                                y.Quantita = parseFloat(y.Quantita) * parseFloat(Ora3.FattoreConversione);
                                            }
                                        }
                                    } else {
                                        if (y.ErroriCBO === "") {
                                            y.ErroriCBO = "Errore conversione Codice Materiale " + sMaterial;
                                        } else {
                                            y.ErroriCBO = y.ErroriCBO + ",Errore conversione Codice Materiale " + sMaterial;
                                        }
                                    }
                                });
                                resolve();
                            } else {
                                reject(oError);
                            }
                        }
                    }, [], true);
                });
            },
            onRicarica: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                var Rows = oAppModel.getProperty("/rows");
                var RowsError = Rows.filter(x => x.StatoOrdine === "Error");
                if (RowsError.length > 0) {
                    Rows.sort((x, y) => {
                        if (parseInt(x.NumeroBolla) - parseInt(y.NumeroBolla) > 0) {
                            return 1;
                        } else if ((parseInt(x.NumeroBolla) - parseInt(y.NumeroBolla) === 0)) {
                            if (parseInt(x.PosizioneOrdine) - parseInt(y.PosizioneOrdine) > 0) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            return -1;
                        }
                    });
                    var Distributore = RowsError[0].Distributore;
                    var Distributoretmp = RowsError[0].DistributoreBolla;
                    var DistributoretmpCambiato = "";
                    var Flusso = "";
                    var ErroriCBO00 = "";
                    if (RowsError[0].Flusso === "") {
                        var Flussotmp = this.Ora1.find(x => x.BolleBSDistributore === Distributore.trim());
                        if (Flussotmp) {
                            if (Flussotmp.CausaleBolla === "USD") {
                                Flusso = "CONTO DEPOSITO";
                            } else {
                                Flusso = "RIFATTURAZIONE";
                            }
                            Distributoretmp = Distributore;
                            DistributoretmpCambiato = "X";
                            Distributore = Flussotmp.CodiceDestMerciSAP;
                        } else {
                            Distributore = Distributore.trim();
                            ErroriCBO00 = "Errore conversione Codice Distributore " + Distributoretmp.trim();
                        }
                    } else {
                        Flusso = RowsError[0].Flusso;
                        Distributore = RowsError[0].Distributore;
                    }
                    let aUniqueBolla = [...new Set(RowsError.map(item => item.NumeroBolla))];
                    aUniqueBolla.forEach(x => {
                        var RowsBolla = RowsError.filter(y => y.NumeroBolla === x);
                        var Committente = RowsBolla[0].Committente;
                        var Committentetmp = RowsBolla[0].Committentetmp;
                        var DestinatarioMerci = RowsBolla[0].DestinatarioMerci;
                        var CommittenteTrovato = "";
                        var DestinatarioMerciTrovato = "";
                        var CommittentetmpCambiato = "";
                        var ErroriCBO01 = "";
                        if (RowsBolla[0].CommittenteTrovato === "") {
                            var Ora2 = this.Ora2.find(x => x.BolleBSCliente === Committente.trim() && x.BolleBSDistributore === Distributoretmp.trim());
                        } else {
                            var Ora2 = this.Ora2.find(x => x.BolleBSCliente === Committentetmp.trim() && x.BolleBSDistributore === Distributoretmp.trim());
                        }
                        if (Ora2) {
                            if (RowsBolla[0].CommittenteTrovato === "") {
                                Committentetmp = Committente;
                                CommittentetmpCambiato = "X";
                            }
                            Committente = Ora2.CodiceCMSAP;
                            CommittenteTrovato = "X";
                        } else {
                            Committente = Committente.trim();
                            ErroriCBO01 = "Errore conversione Codice Cliente " + Committente.trim();
                        }
                        if (RowsBolla[0].DestinatarioMerciTrovato === "") {
                            Ora2 = this.Ora2.find(x => x.BolleBSCliente === Committentetmp.trim() && x.BolleBSDistributore === Distributoretmp.trim() && x.BolleBSPuntoVendita === DestinatarioMerci.trim());
                            if (Ora2) {
                                DestinatarioMerci = Ora2.CodiceDMSAP;
                                DestinatarioMerciTrovato = "X";
                            } else {
                                DestinatarioMerci = DestinatarioMerci.trim();
                                if (ErroriCBO01 === "") {
                                    ErroriCBO01 = "Errore conversione Codice Destinatario Merci " + DestinatarioMerci.trim();
                                } else {
                                    ErroriCBO01 = ErroriCBO01 + ",Errore conversione Codice Destinatario Merci " + DestinatarioMerci.trim();
                                }
                            }
                        } else {
                            DestinatarioMerciTrovato = "X";
                        }
                        RowsBolla.forEach(z => {
                            z.Note = "";
                            z.ErroriCBO = "";
                            z.StatoOrdine = "";
                            z.DestinatarioMerciTrovato = DestinatarioMerciTrovato;
                            z.CommittenteTrovato = CommittenteTrovato;
                            if (DistributoretmpCambiato === "X") {
                                z.DistributoreBolla = Distributoretmp;
                            }
                            if (CommittentetmpCambiato === "X") {
                                z.Committentetmp = Committentetmp;
                            }
                            if (ErroriCBO00 === "") {
                                z.Distributore = Distributore;
                                z.DistributoreBolla = Distributoretmp;
                                z.Flusso = Flusso;
                            } else {
                                z.Distributore = Distributore;
                                z.DistributoreBolla = Distributoretmp;
                                z.Flusso = Flusso;
                                z.ErroriCBO = ErroriCBO00;
                                z.Note = ErroriCBO00;
                            }
                            if (ErroriCBO01 === "") {
                                z.Committente = Committente;
                                z.DestinatarioMerci = DestinatarioMerci;
                            } else {
                                z.DestinatarioMerci = DestinatarioMerci;
                                z.Committente = Committente;
                                if (ErroriCBO00 === "") {
                                    z.Note = ErroriCBO01;
                                    z.ErroriCBO = ErroriCBO01;
                                } else {
                                    z.ErroriCBO = ErroriCBO00 + "," + ErroriCBO01;
                                    z.Note = ErroriCBO00 + "," + ErroriCBO01;
                                }
                            }
                        });
                    });
                    this._startExtraction(Rows);
                } else {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.noerror"));
                    this.oGlobalBusyDialog.close();
                }

            },
            onCreaOrdine: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var RowNumber = oAppModel.getProperty("/rows").length;
                var oModelService = this.getView().getModel("SalesOrderModel");
                var aPayload = [];
                for (var i = 0; i < RowNumber; i++) {
                    if (oTable.getContextByIndex(i).getProperty("StatoElaborazione") === "DA ELABORARE" && oTable.getContextByIndex(i).getProperty("Flusso") === "CONTO DEPOSITO") {
                        var ItemExpand = {
                            "results": []
                        };
                        var PartnerExpand = {
                            "results": []
                        };
                        var salesordertype = "";
                        if (oTable.getContextByIndex(i).getProperty("Distributore") === oTable.getContextByIndex(i).getProperty("DestinatarioMerci")) {
                            salesordertype = "ZCD2";
                        } else {
                            salesordertype = "ZCD3";
                        }
                        var date = "";
                        var DataOrdineCliente = "";
                        var DataBolla = "";
                        var DataConsegnaMerce = "";
                        var DataScadenzaLotto = "";
                        if (oTable.getContextByIndex(i).getProperty("DataOrdineCliente") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataOrdineCliente").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataOrdineCliente"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataOrdineCliente = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataBolla") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataBolla").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataBolla"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataBolla = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataConsegnaMerce") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataConsegnaMerce").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataConsegnaMerce"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataConsegnaMerce = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataScadenzaLotto") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataScadenzaLotto").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataScadenzaLotto"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataScadenzaLotto = "/Date(" + date + ")/";
                        }
                        var Payload = {
                            "SalesOrderType": salesordertype,
                            "SalesOrganization": oTable.getContextByIndex(i).getProperty("OrganizzazioneCommerciale"),
                            "DistributionChannel": oTable.getContextByIndex(i).getProperty("CanaleDistributivo"),
                            "OrganizationDivision": oTable.getContextByIndex(i).getProperty("SettoreMerceologico"),
                            "SoldToParty": oTable.getContextByIndex(i).getProperty("Committente"),
                            "PurchaseOrderByCustomer": oTable.getContextByIndex(i).getProperty("RiferimentoOrdineCliente"),
                            //"CustomerPurchaseOrderDate": DataOrdineCliente,
                            //"SalesOrderDate": DataBolla,
                            //"PricingDate": DataBolla,
                            //"RequestedDeliveryDate": DataConsegnaMerce,
                            "ZZ1_ZNumeroBolla_SDH": oTable.getContextByIndex(i).getProperty("NumeroBolla"),
                            "to_Item": ItemExpand,
                            "to_Partner": PartnerExpand
                        };
                        if (DataOrdineCliente !== "") {
                            Payload.CustomerPurchaseOrderDate = DataOrdineCliente;
                        }
                        if (DataBolla !== "") {
                            Payload.SalesOrderDate = DataBolla;
                            Payload.PricingDate = DataBolla;
                        }
                        if (DataConsegnaMerce !== "") {
                            Payload.RequestedDeliveryDate = DataConsegnaMerce;
                        }
                        var Item = {
                            "SalesOrderItemCategory": oTable.getContextByIndex(i).getProperty("CategoriaDiPosizione"),
                            "SalesOrderItem": oTable.getContextByIndex(i).getProperty("PosizioneOrdine"),
                            "Material": oTable.getContextByIndex(i).getProperty("Materiale"),
                            "RequestedQuantity": oTable.getContextByIndex(i).getProperty("Quantita").toString(),
                            "RequestedQuantityUnit": oTable.getContextByIndex(i).getProperty("UDM"),
                            "ProductionPlant": "ORCS",
                            "ZZ1_LOTTOBOLLEBS_SDI": oTable.getContextByIndex(i).getProperty("Lotto"),
                            //"ZZ1_ScadenzaLotto": DataScadenzaLotto,
                        };
                        if (DataScadenzaLotto !== "") {
                            Item.ZZ1_SCADENZALOTTO_SDI = DataScadenzaLotto;
                        }
                        var trovato = aPayload.find(x => x.ZZ1_ZNumeroBolla_SDH === Payload.ZZ1_ZNumeroBolla_SDH);
                        if (trovato !== undefined) {
                            trovato.to_Item.results.push(Item);
                        } else {
                            var Partner = {
                                "PartnerFunction": "DM",
                                "Customer": oTable.getContextByIndex(i).getProperty("DestinatarioMerci")
                            };
                            Payload.to_Partner.results.push(Partner);
                            var Partner = {
                                "PartnerFunction": "BV",
                                "Customer": oTable.getContextByIndex(i).getProperty("Distributore")
                            };
                            Payload.to_Partner.results.push(Partner);
                            Payload.to_Item.results.push(Item);
                            aPayload.push(Payload);
                        }
                    }
                }
                let oPromise = Promise.resolve();
                aPayload.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaOrdine(y, oModelService);
                    });
                });
                //oPromise.then(oSuccess => {
                Promise.all([oPromise]).then(() => {
                    if (aPayload.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.creaordine"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    }
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.creaordine"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            },
            onConsegnaUscitaMerci: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var RowNumber = oAppModel.getProperty("/rows").length;
                var oModelService = this.getView().getModel("OutboundDeliveryModel");
                var aPayloadOutobound = [];
                for (var i = 0; i < RowNumber; i++) {
                    if (oTable.getContextByIndex(i).getProperty("StatoElaborazione") === "ORDINE CREATO" && oTable.getContextByIndex(i).getProperty("Flusso") === "CONTO DEPOSITO") {
                        var Payload = {
                            "ZZ1_ZNumeroBolla_SDH": oTable.getContextByIndex(i).getProperty("NumeroBolla"),
                            "ReferenceSDDocument": oTable.getContextByIndex(i).getProperty("Note")
                        };
                        var trovato = aPayloadOutobound.find(x => x.to_DeliveryDocumentItem.results[0].ReferenceSDDocument === Payload.ReferenceSDDocument);
                        if (trovato === undefined) {
                            var ItemExpand = {
                                "results": []
                            };
                            var ReferenceSDDocument = {
                                "to_DeliveryDocumentItem": ItemExpand
                            };
                            var Item = {
                                "ReferenceSDDocument": Payload.ReferenceSDDocument
                            };
                            ReferenceSDDocument.to_DeliveryDocumentItem.results.push(Item);
                            aPayloadOutobound.push(ReferenceSDDocument);
                        }
                    }
                }
                let oPromise = Promise.resolve()
                aPayloadOutobound.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaOutboundDelivery(y, oModelService);
                    });
                });
                //oPromise.then(() => {
                Promise.all([oPromise]).then(() => {
                    /*if (aPayloadOutobound.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {*/
                    if (aPayloadOutobound.length >= 1) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.creaoutbound"));
                    }
                    this.function = 1;
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    //}
                }, oError => {
                    if (aPayloadOutobound.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {
                        MessageToast.show(this.oComponent.i18n().getText("msg.error.api.creaoutbound"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    }
                });
            },
            onUscitaMerci: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var Rows = oAppModel.getProperty("/rows");
                var RowsFiltered = Rows.filter(x => x.StatoElaborazione === "CONSEGNA CREATA" && x.Flusso === "CONTO DEPOSITO");
                var oModelService = this.getView().getModel("CreazioneOrdiniBolleBSModel");
                var aPayloadUscitaMerci = [];
                let aUniqueBolla = [...new Set(RowsFiltered.map(item => item.Note))];
                let oPromise = Promise.resolve();
                aUniqueBolla.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaUscitaMerci(y, oModelService, aPayloadUscitaMerci);
                    });
                });
                //oPromise.then(() => {
                Promise.all([oPromise]).then(() => {
                    let oPromise2 = Promise.resolve();
                    var oOutboundDeliveryModel = this.getView().getModel("OutboundDeliveryModel");
                    aPayloadUscitaMerci.forEach(y => {
                        oPromise2 = oPromise2.then(() => {
                            return this._creaUscitaMerci2(y, oOutboundDeliveryModel, aPayloadUscitaMerci);
                        });
                    });
                    //oPromise2.then(() => {
                    Promise.all([oPromise2]).then(() => {
                        let oPromise3 = Promise.resolve();
                        var oCorrect = 0;
                        aPayloadUscitaMerci.forEach(y => {
                            oPromise3 = oPromise3.then(() => {
                                return this._creaUscitaMerci3(y, oCorrect);
                            });
                        });
                        //oPromise3.then(() => {
                        Promise.all([oPromise3]).then(() => {
                            if (aPayloadUscitaMerci.length === 0) {
                                MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                                this.oGlobalBusyDialog.close();
                            } else {
                                if (oCorrect === 0) {
                                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                                } else {
                                    MessageToast.show(this.oComponent.i18n().getText("msg.success.api.uscitamerci"));
                                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                                }
                            }
                        }, oError => {
                            MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                            this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                        });
                    }, oError => {
                        MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    });
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            },
            onCreaReso: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var RowNumber = oAppModel.getProperty("/rows").length;
                var oModelService = this.getView().getModel("CustomerReturnModel");
                var aPayload = [];
                for (var i = 0; i < RowNumber; i++) {
                    if (oTable.getContextByIndex(i).getProperty("StatoElaborazione") === "DA ELABORARE" && oTable.getContextByIndex(i).getProperty("Flusso") === "RIFATTURAZIONE") {
                        var ItemExpand = {
                            "results": []
                        };
                        var PartnerExpand = {
                            "results": []
                        };
                        var customerReturnType = "ZRRI";
                        var date = "";
                        var DataOrdineCliente = "";
                        var DataBolla = "";
                        var DataConsegnaMerce = "";
                        var DataScadenzaLotto = "";
                        if (oTable.getContextByIndex(i).getProperty("DataOrdineCliente") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataOrdineCliente").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataOrdineCliente"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataOrdineCliente = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataBolla") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataBolla").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataBolla"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataBolla = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataConsegnaMerce") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataConsegnaMerce").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataConsegnaMerce"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataConsegnaMerce = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataScadenzaLotto") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataScadenzaLotto").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataConsegnaMerce"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataScadenzaLotto = "/Date(" + date + ")/";
                        }
                        var find = this.Ora1.find(x => x.BolleBSDistributore === oTable.getContextByIndex(i).getProperty("DistributoreBolla"));
                        var SoldToParty = "";
                        if (find) {
                            SoldToParty = find.CodiceClienteSAP;
                        }
                        var Payload = {
                            "CustomerReturnType": customerReturnType,
                            "SalesOrganization": oTable.getContextByIndex(i).getProperty("OrganizzazioneCommerciale"),
                            "DistributionChannel": oTable.getContextByIndex(i).getProperty("CanaleDistributivo"),
                            "OrganizationDivision": oTable.getContextByIndex(i).getProperty("SettoreMerceologico"),
                            "SoldToParty": SoldToParty,
                            "PurchaseOrderByCustomer": oTable.getContextByIndex(i).getProperty("RiferimentoOrdineCliente"),
                            //"CustomerPurchaseOrderDate": DataOrdineCliente,
                            //"SalesOrderDate": DataBolla,
                            //"PricingDate": DataBolla,
                            //"RequestedDeliveryDate": DataConsegnaMerce,
                            "SDDocumentReason": "Z5",
                            "ZZ1_ZNumeroBolla_SDH": oTable.getContextByIndex(i).getProperty("NumeroBolla"),
                            "to_Item": ItemExpand,
                            "to_Partner": PartnerExpand
                        };
                        if (DataOrdineCliente !== "") {
                            Payload.CustomerPurchaseOrderDate = DataOrdineCliente;
                        }
                        if (DataBolla !== "") {
                            Payload.CustomerReturnDate = DataBolla;
                            Payload.PricingDate = DataBolla;
                        }
                        if (DataConsegnaMerce !== "") {
                            Payload.RequestedDeliveryDate = DataConsegnaMerce;
                        }
                        var Item = {
                            "CustomerReturnItemCategory": oTable.getContextByIndex(i).getProperty("CategoriaDiPosizione"),
                            "CustomerReturnItem": oTable.getContextByIndex(i).getProperty("PosizioneOrdine"),
                            "Material": oTable.getContextByIndex(i).getProperty("Materiale"),
                            "RequestedQuantity": oTable.getContextByIndex(i).getProperty("Quantita").toString(),
                            "RequestedQuantityUnit": oTable.getContextByIndex(i).getProperty("UDM"),
                            "ProductionPlant": "ORCV",
                            "ZZ1_LOTTOBOLLEBS_SDI": oTable.getContextByIndex(i).getProperty("Lotto"),
                            //"ZZ1_ScadenzaLotto": DataScadenzaLotto,
                        };
                        if (DataScadenzaLotto !== "") {
                            Item.ZZ1_SCADENZALOTTO_SDI = DataScadenzaLotto;
                        }
                        var trovato = aPayload.find(x => x.ZZ1_ZNumeroBolla_SDH === Payload.ZZ1_ZNumeroBolla_SDH);
                        if (trovato !== undefined) {
                            trovato.to_Item.results.push(Item);
                        } else {
                            var Partner = {
                                "PartnerFunction": "DM",
                                "Customer": oTable.getContextByIndex(i).getProperty("Distributore")
                            };
                            Payload.to_Partner.results.push(Partner);
                            var Partner = {
                                "PartnerFunction": "BV",
                                "Customer": oTable.getContextByIndex(i).getProperty("Distributore")
                            };
                            Payload.to_Partner.results.push(Partner);
                            Payload.to_Item.results.push(Item);
                            aPayload.push(Payload);
                        }
                    }
                }
                let oPromise = Promise.resolve();
                aPayload.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaReso(y, oModelService);
                    });
                });
                //oPromise.then(oSuccess => {
                Promise.all([oPromise]).then(() => {
                    if (aPayload.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.creareso"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    }
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.creareso"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            },
            onConsegnaEntrataMerci: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var RowNumber = oAppModel.getProperty("/rows").length;
                var oModelService = this.getView().getModel("CustomerReturnDeliveryModel");
                var aPayloadOutobound = [];
                for (var i = 0; i < RowNumber; i++) {
                    if (oTable.getContextByIndex(i).getProperty("StatoElaborazione") === "ORDINE DI RESO CREATO" && oTable.getContextByIndex(i).getProperty("Flusso") === "RIFATTURAZIONE") {
                        var Payload = {
                            "ZZ1_ZNumeroBolla_SDH": oTable.getContextByIndex(i).getProperty("NumeroBolla"),
                            "ReferenceSDDocument": oTable.getContextByIndex(i).getProperty("Note")
                        };
                        var trovato = aPayloadOutobound.find(x => x.to_DeliveryDocumentItem.results[0].ReferenceSDDocument === Payload.ReferenceSDDocument);
                        if (trovato === undefined) {
                            var ItemExpand = {
                                "results": []
                            };
                            var ReferenceSDDocument = {
                                "to_DeliveryDocumentItem": ItemExpand
                            };
                            var Item = {
                                "ReferenceSDDocument": Payload.ReferenceSDDocument
                            };
                            ReferenceSDDocument.to_DeliveryDocumentItem.results.push(Item);
                            aPayloadOutobound.push(ReferenceSDDocument);
                        }
                    }
                }
                let oPromise = Promise.resolve()
                aPayloadOutobound.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaCustomerReturnDelivery(y, oModelService);
                    });
                });
                //oPromise.then(() => {
                Promise.all([oPromise]).then(() => {
                    /*if (aPayloadOutobound.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {*/
                    if (aPayloadOutobound.length >= 1) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.creacustomerreturn"));
                    }
                    this.function = 2;
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    //}
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.creacustomerreturn"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            },
            onEntrataMerci: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var Rows = oAppModel.getProperty("/rows");
                var RowsFiltered = Rows.filter(x => x.StatoElaborazione === "CONSEGNA DI RESO CREATA" && x.Flusso === "RIFATTURAZIONE");
                var oModelService = this.getView().getModel("CreazioneOrdiniBolleBSModel");
                var aPayloadUscitaMerci = [];
                let aUniqueBolla = [...new Set(RowsFiltered.map(item => item.Note))];
                let oPromise = Promise.resolve();
                aUniqueBolla.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaUscitaMerci(y, oModelService, aPayloadUscitaMerci);
                    });
                });
                //oPromise.then(() => {
                Promise.all([oPromise]).then(() => {
                    let oPromise2 = Promise.resolve();
                    var oOutboundDeliveryModel = this.getView().getModel("CustomerReturnDeliveryModel");
                    aPayloadUscitaMerci.forEach(y => {
                        oPromise2 = oPromise2.then(() => {
                            return this._creaEntrataMerci(y, oOutboundDeliveryModel, aPayloadUscitaMerci);
                        });
                    });
                    //oPromise2.then(() => {
                    Promise.all([oPromise2]).then(() => {
                        let oPromise3 = Promise.resolve();
                        aPayloadUscitaMerci.forEach(y => {
                            oPromise3 = oPromise3.then(() => {
                                return this._creaEntrataMerci2(y);
                            });
                        });
                        //oPromise3.then(() => {
                        Promise.all([oPromise3]).then(() => {
                            if (aPayloadUscitaMerci.length === 0) {
                                MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                                this.oGlobalBusyDialog.close();
                            } else {
                                MessageToast.show(this.oComponent.i18n().getText("msg.success.api.entratamerci"));
                                this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                            }
                        }, oError => {
                            MessageToast.show(this.oComponent.i18n().getText("msg.error.api.entratamerci"));
                            this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                        });
                    }, oError => {
                        MessageToast.show(this.oComponent.i18n().getText("msg.error.api.entratamerci"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    });
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.entratamerci"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            },
            onCreaOrdineRifatturazione: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var RowNumber = oAppModel.getProperty("/rows").length;
                var oModelService = this.getView().getModel("SalesOrderModel");
                var aPayload = [];
                for (var i = 0; i < RowNumber; i++) {
                    if (oTable.getContextByIndex(i).getProperty("StatoElaborazione") === "RESO COMPLETATO" && oTable.getContextByIndex(i).getProperty("Flusso") === "RIFATTURAZIONE") {
                        var ItemExpand = {
                            "results": []
                        };
                        var PartnerExpand = {
                            "results": []
                        };
                        var salesordertype = "ZVRI";
                        var date = "";
                        var DataOrdineCliente = "";
                        var DataBolla = "";
                        var DataConsegnaMerce = "";
                        var DataScadenzaLotto = "";
                        if (oTable.getContextByIndex(i).getProperty("DataOrdineCliente") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataOrdineCliente").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataOrdineCliente"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataOrdineCliente = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataBolla") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataBolla").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataBolla"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataBolla = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataConsegnaMerce") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataConsegnaMerce").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataConsegnaMerce"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataConsegnaMerce = "/Date(" + date + ")/";
                        }
                        if (oTable.getContextByIndex(i).getProperty("DataScadenzaLotto") !== "") {
                            //date = oTable.getContextByIndex(i).getProperty("DataScadenzaLotto").getTime();
                            date = new Date(oTable.getContextByIndex(i).getProperty("DataScadenzaLotto"));
                            date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
                            date = date.getTime();
                            DataScadenzaLotto = "/Date(" + date + ")/";
                        }
                        var Payload = {
                            "SalesOrderType": salesordertype,
                            "SalesOrganization": oTable.getContextByIndex(i).getProperty("OrganizzazioneCommerciale"),
                            "DistributionChannel": oTable.getContextByIndex(i).getProperty("CanaleDistributivo"),
                            "OrganizationDivision": oTable.getContextByIndex(i).getProperty("SettoreMerceologico"),
                            "SoldToParty": oTable.getContextByIndex(i).getProperty("Committente"),
                            "PurchaseOrderByCustomer": oTable.getContextByIndex(i).getProperty("RiferimentoOrdineCliente"),
                            //"CustomerPurchaseOrderDate": DataOrdineCliente,
                            //"SalesOrderDate": DataBolla,
                            //"PricingDate": DataBolla,
                            //"RequestedDeliveryDate": DataConsegnaMerce,
                            "ZZ1_ZNumeroBolla_SDH": oTable.getContextByIndex(i).getProperty("NumeroBolla"),
                            "to_Item": ItemExpand,
                            "to_Partner": PartnerExpand
                        };
                        if (DataOrdineCliente !== "") {
                            Payload.CustomerPurchaseOrderDate = DataOrdineCliente;
                        }
                        if (DataBolla !== "") {
                            Payload.SalesOrderDate = DataBolla;
                            Payload.PricingDate = DataBolla;
                        }
                        if (DataConsegnaMerce !== "") {
                            Payload.RequestedDeliveryDate = DataConsegnaMerce;
                        }
                        var Item = {
                            //"SalesOrderItemCategory": oTable.getContextByIndex(i).getProperty("CategoriaDiPosizione"),
                            "SalesOrderItem": oTable.getContextByIndex(i).getProperty("PosizioneOrdine"),
                            "Material": oTable.getContextByIndex(i).getProperty("Materiale"),
                            "RequestedQuantity": oTable.getContextByIndex(i).getProperty("Quantita").toString(),
                            "RequestedQuantityUnit": oTable.getContextByIndex(i).getProperty("UDM"),
                            "ProductionPlant": "ORCV",
                            "ZZ1_LOTTOBOLLEBS_SDI": oTable.getContextByIndex(i).getProperty("Lotto"),
                            //"ZZ1_ScadenzaLotto": DataScadenzaLotto,
                        };
                        if (DataScadenzaLotto !== "") {
                            Item.ZZ1_SCADENZALOTTO_SDI = DataScadenzaLotto;
                        }
                        var trovato = aPayload.find(x => x.ZZ1_ZNumeroBolla_SDH === Payload.ZZ1_ZNumeroBolla_SDH);
                        if (trovato !== undefined) {
                            trovato.to_Item.results.push(Item);
                        } else {
                            var Partner = {
                                "PartnerFunction": "DM",
                                "Customer": oTable.getContextByIndex(i).getProperty("DestinatarioMerci")
                            };
                            Payload.to_Partner.results.push(Partner);
                            var Partner = {
                                "PartnerFunction": "BV",
                                "Customer": oTable.getContextByIndex(i).getProperty("Distributore")
                            };
                            Payload.to_Partner.results.push(Partner);
                            Payload.to_Item.results.push(Item);
                            aPayload.push(Payload);
                        }
                    }
                }
                let oPromise = Promise.resolve();
                aPayload.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaOrdine(y, oModelService);
                    });
                });
                //oPromise.then(oSuccess => {
                Promise.all([oPromise]).then(() => {
                    if (aPayload.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.creaordine"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    }
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.creaordine"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            },
            onConsegnaUscitaMerciRifatturazione: function (oEvent) {
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var RowNumber = oAppModel.getProperty("/rows").length;
                var oModelService = this.getView().getModel("OutboundDeliveryModel");
                var aPayloadOutobound = [];
                for (var i = 0; i < RowNumber; i++) {
                    if (oTable.getContextByIndex(i).getProperty("StatoElaborazione") === "ORDINE CREATO" && oTable.getContextByIndex(i).getProperty("Flusso") === "RIFATTURAZIONE") {
                        var Payload = {
                            "ZZ1_ZNumeroBolla_SDH": oTable.getContextByIndex(i).getProperty("NumeroBolla"),
                            "ReferenceSDDocument": oTable.getContextByIndex(i).getProperty("Note")
                        };
                        var trovato = aPayloadOutobound.find(x => x.to_DeliveryDocumentItem.results[0].ReferenceSDDocument === Payload.ReferenceSDDocument);
                        if (trovato === undefined) {
                            var ItemExpand = {
                                "results": []
                            };
                            var ReferenceSDDocument = {
                                "to_DeliveryDocumentItem": ItemExpand
                            };
                            var Item = {
                                "ReferenceSDDocument": Payload.ReferenceSDDocument
                            };
                            ReferenceSDDocument.to_DeliveryDocumentItem.results.push(Item);
                            aPayloadOutobound.push(ReferenceSDDocument);
                        }
                    }
                }
                let oPromise = Promise.resolve()
                aPayloadOutobound.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaOutboundDelivery(y, oModelService);
                    });
                });
                //oPromise.then(() => {
                Promise.all([oPromise]).then(() => {
                    /*if (aPayloadOutobound.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {*/
                    if (aPayloadOutobound.length >= 1) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.creaoutbound"));
                    }
                    this.function = 3;
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    //}
                }, oError => {
                    if (aPayloadOutobound.length === 0) {
                        MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                        this.oGlobalBusyDialog.close();
                    } else {
                        MessageToast.show(this.oComponent.i18n().getText("msg.error.api.creaoutbound"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    }
                });
            },
            onUscitaMerciRifatturazione: function (oEvent) {
                const oAppModel = this.getView().getModel("appModel");
                const oTable = this.getView().byId("Ordini");
                var Rows = oAppModel.getProperty("/rows");
                var RowsFiltered = Rows.filter(x => x.StatoElaborazione === "CONSEGNA CREATA" && x.Flusso === "RIFATTURAZIONE");
                var oModelService = this.getView().getModel("CreazioneOrdiniBolleBSModel");
                var aPayloadUscitaMerci = [];
                let aUniqueBolla = [...new Set(RowsFiltered.map(item => item.Note))];
                let oPromise = Promise.resolve();
                aUniqueBolla.forEach(y => {
                    oPromise = oPromise.then(() => {
                        return this._creaUscitaMerci(y, oModelService, aPayloadUscitaMerci);
                    });
                });
                //oPromise.then(() => {
                Promise.all([oPromise]).then(() => {
                    let oPromise2 = Promise.resolve();
                    var oOutboundDeliveryModel = this.getView().getModel("OutboundDeliveryModel");
                    aPayloadUscitaMerci.forEach(y => {
                        oPromise2 = oPromise2.then(() => {
                            return this._creaUscitaMerci2(y, oOutboundDeliveryModel, aPayloadUscitaMerci);
                        });
                    });
                    //oPromise2.then(() => {
                    Promise.all([oPromise2]).then(() => {
                        let oPromise3 = Promise.resolve();
                        var oCorrect = 0;
                        aPayloadUscitaMerci.forEach(y => {
                            oPromise3 = oPromise3.then(() => {
                                return this._creaUscitaMerci3(y, oCorrect);
                            });
                        });
                        //oPromise3.then(() => {
                        Promise.all([oPromise3]).then(() => {
                            if (aPayloadUscitaMerci.length === 0) {
                                MessageToast.show(this.oComponent.i18n().getText("msg.success.api.noPayload"));
                                this.oGlobalBusyDialog.close();
                            } else {
                                if (oCorrect === 0) {
                                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                                } else {
                                    MessageToast.show(this.oComponent.i18n().getText("msg.success.api.uscitamerci"));
                                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                                }
                            }
                        }, oError => {
                            MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                            this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                        });
                    }, oError => {
                        MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                        this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                    });
                }, oError => {
                    MessageToast.show(this.oComponent.i18n().getText("msg.error.api.uscitamerci"));
                    this._aggiornamentoStato(oAppModel.getProperty("/rows"));
                });
            }
        });


        /**
        * Set table model 
        * ---------------
        * @param aProducts - products
        * @private
        */
        oAppController.prototype._setTableModel = function (aResults) {
            //set model: concat new batch of data to previous model
            const oAppModel = this.getView().getModel("appModel");
            const oTable = this.getView().byId("Ordini");
            oAppModel.setProperty("/rows", aResults);
            oTable.setModel(oAppModel);
            oTable.bindRows("/rows");
            oTable.sort(oTable.getColumns()[2]);
            oAppModel.refresh(true);
        }
        oAppController.prototype._controlli = function (aResults) {
            aResults.forEach(x => {
                if (x.ErroriCBO === "") {
                    if (x.Distributore === "") {
                        x.Note = "Errore conversione Codice Distributore";
                        x.StatoOrdine = "Error";
                        x.editable = true;
                    }
                    if (x.Committente === "") {
                        if (x.Note !== "") {
                            x.Note = x.Note + ",";
                        }
                        x.Note = x.Note + "Errore conversione Codice Cliente";
                        x.StatoOrdine = "Error";
                        x.editable = true;
                    }
                    if (x.DestinatarioMerci === "") {
                        if (x.Note !== "") {
                            x.Note = x.Note + ",";
                        }
                        x.Note = x.Note + "Errore conversione Codice Destinatario Merci";
                        x.StatoOrdine = "Error";
                        x.editable = true;
                    }
                    if (x.Materiale === "") {
                        if (x.Note !== "") {
                            x.Note = x.Note + ",";
                        }
                        x.Note = x.Note + "Errore conversione Codice Materiale";
                        x.StatoOrdine = "Error";
                        x.editable = true;
                    }
                    if (x.Quantita === "" || parseFloat(x.Quantita) === 0) {
                        if (x.Note !== "") {
                            x.Note = x.Note + ",";
                        }
                        x.Note = x.Note + "Manca campo quantità";
                        x.StatoOrdine = "Error";
                        x.editable = true;
                    }
                    if (x.UDM === "") {
                        if (x.Note !== "") {
                            x.Note = x.Note + ",";
                        }
                        x.Note = x.Note + "Errore conversione unità di misura";
                        x.StatoOrdine = "Error";
                        x.editable = true;
                    }
                } else {
                    x.Note = x.ErroriCBO;
                    x.StatoOrdine = "Error";
                    x.editable = true;
                }
            });
        };
        oAppController.prototype._aggiornamentoStato = function (aResults) {
            let aUniqueBolla = [...new Set(aResults.map(item => item.NumeroBolla))];
            let oPromise = Promise.resolve(),
                oPromise2 = Promise.resolve();
            aUniqueBolla.forEach(x => {
                //if bolla ultima posizione array === bolla che sto controllando
                var aResultBolla = aResults.filter(y => y.NumeroBolla === x);
                var oBollaNote = aResultBolla.find(z => z.StatoOrdine === "Error");
                if (oBollaNote !== undefined) {
                    aResultBolla.forEach(z => {
                        z.StatoOrdine = "Error";
                    });
                } else {
                    if (aResultBolla[0].Flusso === "CONTO DEPOSITO") {
                        oPromise = oPromise.then(() => {
                            return this._callContoDeposito(aResultBolla);
                        });
                    } else if (aResultBolla[0].Flusso === "RIFATTURAZIONE") {
                        oPromise2 = oPromise2.then(() => {
                            return this._callRifatturazione(aResultBolla);
                        });
                    }
                }
            });
            Promise.all([oPromise, oPromise2]).then(() => {
                aResults.forEach(x => {
                    if (x.StatoElaborazione === "DA ELABORARE") {
                        x.StatoOrdine = "Information";//blu
                    } else if (x.StatoElaborazione === "ORDINE CREATO") {
                        x.StatoOrdine = "Warning";//arancione
                    } else if (x.StatoElaborazione === "CONSEGNA CREATA") {
                        x.StatoOrdine = "Warning"; //arancione
                    } else if (x.StatoElaborazione === "ORDINE DI RESO CREATO") {
                        x.StatoOrdine = "Warning";//arancione
                    } else if (x.StatoElaborazione === "CONSEGNA DI RESO CREATA") {
                        x.StatoOrdine = "Warning";//arancione
                    } else if (x.StatoElaborazione === "RESO COMPLETATO") {
                        x.StatoOrdine = "Warning"; //arancione
                    } else if (x.StatoElaborazione === "ELABORAZIONE COMPLETATA") {
                        x.StatoOrdine = "Success"; //verde
                    }
                });
                this._setTableModel(aResults);
                if (this.function === 0) {
                    this.oGlobalBusyDialog.close();
                } else if (this.function === 1) {
                    this.function = 0;
                    this.onUscitaMerci();
                } else if (this.function === 2) {
                    this.function = 0;
                    this.onEntrataMerci();
                } else if (this.function === 3) {
                    this.function = 0;
                    this.onUscitaMerciRifatturazione();
                }
            }, oError => {
                MessageToast.show(this.oComponent.i18n().getText("msg.error.recuperodatitabelleSAP.text"));
                this.oGlobalBusyDialog.close();
            });
        };
        oAppController.prototype._callContoDeposito = function (aResultBolla) {
            return new Promise((resolve, reject) => {
                var DataBollaCall = encodeURIComponent(sap.ui.model.odata.ODataUtils.formatValue(new Date(aResultBolla[0].DataBolla).setHours(aResultBolla[0].DataBolla.getHours() - aResultBolla[0].DataBolla.getTimezoneOffset() / 60), "Edm.DateTime"));
                this.getView().getModel("CreazioneOrdiniBolleBSModel").read("/CONTODEPOSITOSet(Kunnr='" + aResultBolla[0].Distributore + "',NumeroBolla='" + aResultBolla[0].NumeroBolla + "',DataBolla=" + DataBollaCall + ")", {
                    success: oData => {
                        aResultBolla.forEach(x => {
                            x.Note = oData.Vbeln;
                            x.StatoElaborazione = oData.Stato;
                        });
                        resolve();
                    },
                    error: (oError) => {
                        if (oError.statusCode === "404") {
                            resolve();
                        } else {
                            reject(oError);
                        }
                    }
                }, [], true);
            });
        };
        oAppController.prototype._callRifatturazione = function (aResultBolla) {
            return new Promise((resolve, reject) => {
                var DataBollaCall = encodeURIComponent(sap.ui.model.odata.ODataUtils.formatValue(new Date(aResultBolla[0].DataBolla).setHours(aResultBolla[0].DataBolla.getHours() - aResultBolla[0].DataBolla.getTimezoneOffset() / 60), "Edm.DateTime"));
                this.getView().getModel("CreazioneOrdiniBolleBSModel").read("/RIFATTURAZIONESet(Kunnr='" + aResultBolla[0].Distributore + "',KunnrCommittente='" + aResultBolla[0].Committente + "',NumeroBolla='" + aResultBolla[0].NumeroBolla + "',DataBolla=" + DataBollaCall + ")", {
                    success: oData => {
                        aResultBolla.forEach(x => {
                            x.Note = oData.Vbeln;
                            x.StatoElaborazione = oData.Stato;
                        });
                        resolve();
                    },
                    error: (oError) => {
                        if (oError.statusCode === "404") {
                            resolve();
                        } else {
                            reject(oError);
                        }
                    }
                }, [], true);
            });
        };
        oAppController.prototype._creaOrdine = function (Order, Model) {
            return new Promise((resolve, reject) => {
                Model.create("/A_SalesOrder", Order, {
                    success: oData => {
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                }, [], true);
            });
        };
        oAppController.prototype._creaReso = function (Order, Model) {
            return new Promise((resolve, reject) => {
                Model.create("/A_CustomerReturn", Order, {
                    success: oData => {
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                }, [], true);
            });
        };
        oAppController.prototype._creaOutboundDelivery = function (Order, Model) {
            return new Promise((resolve, reject) => {
                Model.create("/A_OutbDeliveryHeader", Order, {
                    success: oData => {
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                }, [], true);
            });
        };
        oAppController.prototype._creaUscitaMerci = function (Delivery, Model, aPayloadUscitaMerci) {
            return new Promise((resolve, reject) => {
                Model.read("/LIPSSet('" + Delivery + "')", {
                    success: oData => {
                        aPayloadUscitaMerci.push(oData);
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                }, [], true);
            });
        };
        oAppController.prototype._creaUscitaMerci2 = function (Delivery, Model, aPayloadUscitaMerci) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    cache: false,
                    crossDomain: true,
                    //async: true,
                    type: "GET",
                    url: "/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=0002/A_OutbDeliveryHeader('" + Delivery.Vbeln + "')",
                    headers: {
                        "Accept": "*/*",
                        "x-csrf-token": "fetch"
                    },
                    success: (oData, sTextStatus, oRequest) => {
                        var find = aPayloadUscitaMerci.find(x => x.Vbeln === Delivery.Vbeln);
                        if (find) {
                            find.Etag = this._getEtag(oRequest);
                        }
                        this.sToken = this._getToken(oRequest);
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                });
            });
        };
        oAppController.prototype._creaUscitaMerci3 = function (Delivery, oCorrect) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    cache: false,
                    crossDomain: true,
                    //async: true,
                    //dataType: "json",
                    type: "POST",
                    url: "/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=0002/PostGoodsIssue?DeliveryDocument='" + Delivery.Vbeln + "'",
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json",
                        "If-Match": Delivery.Etag,
                        "x-csrf-token": this.sToken
                    },
                    success: (oData, sTextStatus, oRequest) => {
                        oCorrect++;
                        resolve();
                    },
                    error: (oError) => {
                        resolve();
                    }
                });
            });
        };
        oAppController.prototype._creaCustomerReturnDelivery = function (Order, Model) {
            return new Promise((resolve, reject) => {
                Model.create("/A_ReturnsDeliveryHeader", Order, {
                    success: oData => {
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                }, [], true);
            });
        };
        oAppController.prototype._creaEntrataMerci = function (Delivery, Model, aPayloadUscitaMerci) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    cache: false,
                    crossDomain: true,
                    //async: true,
                    type: "GET",
                    url: "/sap/opu/odata/sap/API_CUSTOMER_RETURNS_DELIVERY_SRV;v=0002/A_ReturnsDeliveryHeader('" + Delivery.Vbeln + "')",
                    headers: {
                        "Accept": "*/*",
                        "x-csrf-token": "fetch"
                    },
                    success: (oData, sTextStatus, oRequest) => {
                        var find = aPayloadUscitaMerci.find(x => x.Vbeln === Delivery.Vbeln);
                        if (find) {
                            find.Etag = this._getEtag(oRequest);
                        }
                        this.sToken = this._getToken(oRequest);
                        resolve();
                    },
                    error: (oError) => {
                        reject(oError);
                    }
                });
            });
        };
        oAppController.prototype._creaEntrataMerci2 = function (Delivery) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    cache: false,
                    crossDomain: true,
                    async: true,
                    //data: "{}",
                    //dataType: "json",
                    type: "POST",
                    url: "/sap/opu/odata/sap/API_CUSTOMER_RETURNS_DELIVERY_SRV;v=0002/PostGoodsReceipt?DeliveryDocument='" + Delivery.Vbeln + "'",
                    headers: {
                        "Accept": "*/*",
                        "Content-Type": "application/json",
                        "If-Match": Delivery.Etag,
                        "x-csrf-token": this.sToken
                    },
                    success: (oData, sTextStatus, oRequest) => {
                        resolve();
                    },
                    error: (oError) => {
                        //reject(oError);
                        resolve();
                    }
                });
            });
        };
        /**
        * Get token from request
        * ----------------------
        * @param oRequest - request
        * @return token 
        * @private
        */
        oAppController.prototype._getToken = function (oRequest) {
            let aArr = oRequest.getAllResponseHeaders().split(/\r?\n/);
            const headers = aArr.reduce(function (sAcc, sCurr, i) {
                let parts = sCurr.split(': ');
                sAcc[parts[0]] = parts[1];
                return sAcc;
            }, {});
            return headers && headers["x-csrf-token"] ? headers["x-csrf-token"] : "";
        };
        oAppController.prototype._getEtag = function (oRequest) {
            let aArr = oRequest.getAllResponseHeaders().split(/\r?\n/);
            const headers = aArr.reduce(function (sAcc, sCurr, i) {
                let parts = sCurr.split(': ');
                sAcc[parts[0]] = parts[1];
                return sAcc;
            }, {});
            return headers && headers["etag"] ? headers["etag"] : "";
        };
        return oAppController;
    });
