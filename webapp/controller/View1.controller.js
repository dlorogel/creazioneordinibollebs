sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/Token",
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Filter',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, Token, FilterOperator, Filter) {
        "use strict";

        const oAppController = Controller.extend("it.orogel.crezioneordinibollebs.controller.View1", {
            onInit: function () {
                debugger;
                this.oComponent = this.getOwnerComponent();
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
                this.oGlobalBusyDialog.open();
                this.Ora1 = [];
                this.Ora2 = [];
                this.Ora3 = [];
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
                            var DescrizioneDistributore = "";
                            //Dati bolla
                            var ProgressivoBolla = "";
                            var NumeroBolla = "";
                            var DataBolla = "";
                            var Committente = "";
                            var DescrizioneCommittente = "";
                            var DestinatarioMerci = "";
                            var DescrizioneDestinatarioMerci = "";
                            var RiferimentoOrdineCliente = "";
                            var DataOrdineCliente = "";
                            var DataConsegnaMerce = "";
                            //Posizione
                            var PosizioneOrdine = "";
                            var CategoriaDiPosizione = "";
                            var Materiale = "";
                            var DescrizioneMateriale = "";
                            var Quantita = "";
                            var UDM = "";
                            var Lotto = "";
                            var DataScadenzaLotto = "";
                            var Note = "";
                            var StatoElaborazione = "";
                            for (let i = start; i < end; i++) {
                                debugger;
                                let linetype = lines[i].substring(0, 2);
                                if (linetype === "00") {
                                    Distributore = lines[i].substring(2, 8);
                                    DescrizioneDistributore = lines[i].substring(8, 47);
                                } else if (linetype === "01") {
                                    ProgressivoBolla = lines[i].substring(2, 8);
                                    NumeroBolla = lines[i].substring(8, 14);
                                    DataBolla = lines[i].substring(14, 20);
                                    Committente = lines[i].substring(26, 46);                                    
                                } else {

                                }
                                massiveUploadTotal.push(oMassiveUpload);

                            };
                        }
                        reader.readAsText(file);
                        this.oGlobalBusyDialog.close();
                    }
                }
            },
        });
        return oAppController;
    });
