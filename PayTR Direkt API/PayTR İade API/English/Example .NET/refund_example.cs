using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class iade_ornek : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e) {
        //
        string merchant_id      = "XXXXXX";
        string merchant_key     = "YYYYYYYYYYYYYY";
        string merchant_salt    = "ZZZZZZZZZZZZZZ";
        //
        string merchant_oid     = "";
        //
        string return_amount    = "11.97";
        //
        string reference_no     = "XXXX1111"; // Not required
        //
        NameValueCollection data = new NameValueCollection();
        data["merchant_id"] = merchant_id;
        data["merchant_oid"] = merchant_oid;
        data["return_amount"] = return_amount;
        //data["reference_no"] = reference_no;
        //
        string Birlestir = string.Concat(merchant_id, merchant_oid, return_amount, merchant_salt);
        HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
        byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
        data["paytr_token"] = Convert.ToBase64String(b);
        //

        using (WebClient client = new WebClient()) {
            client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            byte[] result = client.UploadValues("https://www.paytr.com/odeme/iade", "POST", data);
            string ResultAuthTicket = Encoding.UTF8.GetString(result);
            dynamic json = JValue.Parse(ResultAuthTicket);

            /*
                $result - return response content example;

                [status] - If the return request is successful, success returns.
                [is_test] - Returns 1 if the return request is for testing.
                [merchant_oid] - Order number for which a return request was made.
                [return_amount] - Amount made for a refund.
                [reference_no] - Return request reference number.
            */

            if (json.status == "success") {
                // DB operations
                Response.Write(json);
            }else{
                // Example: $result -> array('status'=>'error', "err_no"=>"006", "err_msg"=>"Toplam iade tutarı odeme tutarindan fazla olamaz")
                Response.Write("PAYTR payment return failes. reason:" + json.err_msg + "");
            }
        }
    }
}