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

public partial class taksit_ornek : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e) {

        // ########################################
        //
        string merchant_id      = "XXXXXX";
        string merchant_key     = "YYYYYYYYYYYYYY";
        string merchant_salt    = "ZZZZZZZZZZZZZZ";
        //
        string request_id       = "";
        //
        // ########################################
        NameValueCollection data = new NameValueCollection();
        data["merchant_id"] = merchant_id;
        data["request_id"] = request_id;
      
        // ######################################################################
        string Birlestir = string.Concat(merchant_id, request_id, merchant_salt);
        HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
        byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
        data["paytr_token"] = Convert.ToBase64String(b);
        // ######################################################################

        using (WebClient client = new WebClient()) {
            client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            byte[] result = client.UploadValues("https://www.paytr.com/odeme/taksit-oranlari", "POST", data);
            string ResultAuthTicket = Encoding.UTF8.GetString(result);
            dynamic json = JValue.Parse(ResultAuthTicket);

            if (json.status == "success") {
       
                Response.Write(json);
            }else{ 

                Response.Write(json.err_msg);
            }
        }
    }
}
