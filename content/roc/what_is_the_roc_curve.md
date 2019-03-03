Title: What is a ROC Curve?
Date: 2013-11-24
Category: Tools/Javascript
Tags: test
JavaScripts: https://d3js.org/d3.v3.min.js, roc_rates.js, roc_tableUpdate.js, roc_plot.js
Stylesheets: roc_tables.css, roc_style.css, roc_layout.css

This is an article about ROC curves

<div class='container'>
  <div id='people'>
  </div>

  <div class='label_area'>
    <div>
      <div class='title'>Threshold: <span class='threshold_label'></span></div>
      <div class='subtitle'>i.e. accept everyone with credit scores above <span class='threshold_label'></span></div>
      <div class='subtitle'>People shown in <b><span style="color: red;">red</span></b> actually defaulted</div>
      <div class='subtitle'>People shown in <b><span style="color: black;">black</span></b> actually repaid</div>
    </div>
  </div>

  <div id='plot_area'>
  </div>

  <div class='table_area'>
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Accepted</th>
            <th>Total</th>
            <th>Positive rate</th>
            <th></th>
          </tr>
          <tr>
            <td class='actual_payment_class'>Pay back</td>
            <td><span id='table_payback_accepted'></span></td>
            <td><span id='table_payback_total'></span></td>
            <td><span id='table_payback_ratio'></span></td>
            <td>(TPR)</td>
          </tr>
          <tr>
            <td class='actual_payment_class'>Default</td>
            <td><span id='table_default_accepted'></span></td>
            <td><span id='table_default_total'></span></td>
            <td><span id='table_default_ratio'></span></td>
            <td>(FPR)</td>
          </tr>
          <tr>
            <td class='actual_payment_class'>Total</td>
            <td><span id='table_total_accepted'></span></td>
            <td><span id='table_total'></span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
     <table>
       <tbody>
         <tr>
           <th>Measurement</th>
           <th>Fraction</th>
           <th>Value</th>
         </tr>
         <tr>
           <td class='actual_payment_class'>True positive rate</td>
           <td><span id='table_tpr_ratio'></span></td>
           <td><span id='table_tpr_float'></span></td>
         </tr>
         <tr>
           <td class='actual_payment_class'>False positive rate</td>
           <td><span id='table_fpr_ratio'></span></td>
           <td><span id='table_fpr_float'></span></td>
         </tr>
         <tr>
           <td class='actual_payment_class'>Precision</td>
           <td><span id='table_precision_ratio'></span></td>
           <td><span id='table_precision_float'></span></td>
         </tr>
         <tr>
           <td class='actual_payment_class'>Recall</td>
           <td><span id='table_recall_ratio'></span></td>
           <td><span id='table_recall_float'></span></td>
         </tr>
       </tbody>
     </table>
     </div>

     <div class='model_choice'>
       <h5>Model choice</h5>
       <div>
         <input type="radio" name="model" onChange="changeModelNumber(0)">&nbsp;&nbsp;Perfect Model
       </div>
       <div>
         <input type="radio" name="model" onChange="changeModelNumber(1)" checked="true">&nbsp;&nbsp;Model 1
       </div>
       <div>
         <input type="radio" name="model" onChange="changeModelNumber(2)">&nbsp;&nbsp;Model 2
       </div>
    </div>
  </div>
</div>
