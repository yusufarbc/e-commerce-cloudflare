using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Net.Mail;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class callback_url_sample : System.Web.UI.Page {
    string merchant_key     = "YYYYYYYYYYYYYY";
    string merchant_salt    = "ZZZZZZZZZZZZZZ";

    protected void Page_Load(object sender, EventArgs e) {
        string merchant_oid = Request.Form["merchant_oid"];
        string status = Request.Form["status"];
        string total_amount = Request.Form["total_amount"];
        string hash = Request.Form["hash"];

        string Birlestir = string.Concat(merchant_oid, merchant_salt, status, total_amount);
        HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
        byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
        string token = Convert.ToBase64String(b);

        if (hash.ToString() != token) {
            Response.Write("PAYTR notification failed: bad hash");
            return;
            }

        if (status == "success") {

            Response.Write("OK");

            } else {

            Response.Write("OK");

            }          
    }
}