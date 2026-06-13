using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Collections.Specialized;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult GetBinDetail()
        {
            // ####################### DÜZENLEMESİ ZORUNLU ALANLAR #######################
            //
            string merchant_id = "XXXXXX";
            string merchant_key = "XXXXXX";
            string merchant_salt = "XXXXXX";
            //
            string bin_number = "";
            //
            // ###########################################################################
            string Birlestir = string.Concat(bin_number, merchant_id, merchant_salt);
            HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
            byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
            string paytr_token = Convert.ToBase64String(b);
            //
            NameValueCollection data = new NameValueCollection();
            data["merchant_id"] = merchant_id;
            data["bin_number"] = bin_number;
            data["paytr_token"] = paytr_token;
            //
            using (WebClient client = new WebClient())
            {
                client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                byte[] result = client.UploadValues("https://www.paytr.com/odeme/api/bin-detail", "POST", data);
                string ResultAuthTicket = Encoding.UTF8.GetString(result);
                dynamic json = JValue.Parse(ResultAuthTicket);
                if (json.status == "success")
                {
                    Response.Write(json);
                }
				            else if (json.status == "failed")
                {
                    Response.Write("BIN is not defined. (For example, a foreign card)");
                }
				            else if (json.status == "error")
                {
                    Response.Write("PAYTR BIN detail request error. Error:" + json.err_msg + "");
                }
            }

            return View();
        }
    }
}
