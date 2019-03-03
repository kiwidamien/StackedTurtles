const updateTable = (payback, noPayback) => {

  const writeHTML = (id, value) => {document.getElementById(id).innerHTML = value;}
  const digits = (num, places=3) => Number(num).toPrecision(places);

  writeHTML('table_payback_accepted', payback.accepted);
  writeHTML('table_payback_total', payback.total);
  writeHTML('table_payback_ratio', `${payback.accepted}/${payback.total}`);

  writeHTML('table_default_accepted', noPayback.accepted);
  writeHTML('table_default_total', noPayback.total);
  writeHTML('table_default_ratio', `${noPayback.accepted}/${noPayback.total}`);

  writeHTML('table_total_accepted', payback.accepted + noPayback.accepted);
  writeHTML('table_total', payback.total + noPayback.total);

  writeHTML('table_tpr_ratio', `${payback.accepted}/${payback.total}`);
  writeHTML('table_tpr_float', `${digits(payback.accepted/payback.total)}`);
  writeHTML('table_fpr_ratio', `${noPayback.accepted}/${noPayback.total}`);
  writeHTML('table_fpr_float', `${digits(noPayback.accepted/noPayback.total)}`);

  writeHTML('table_precision_ratio', `${payback.accepted}/${payback.accepted + noPayback.accepted}`);
  writeHTML('table_precision_float', `${digits(payback.accepted/(payback.accepted + noPayback.accepted))}`);

  writeHTML('table_recall_ratio', `${payback.accepted}/${payback.total}`);
  writeHTML('table_recall_float', `${digits(payback.accepted/payback.total)}`);

}
