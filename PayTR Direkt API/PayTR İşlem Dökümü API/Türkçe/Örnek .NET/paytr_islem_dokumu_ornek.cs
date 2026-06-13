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


using System.Web.Routing;

namespace WebApplication1.Controllers
{
    public class TransactionDetailController : Controller
    {
        public ActionResult TransactionDetail()
        {
            // ########################### İŞLEM DÖKÜMÜ ALMAK  İÇİN ÖRNEK KODLAR #######################
            //
            // API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
            string merchant_id = "AAAAAA";
            string merchant_key = "XXXXXXXXXXXXXXXX";
            string merchant_salt = "XXXXXXXXXXXXXXXX";
            //
            string start_date = "2021-01-13 00:00:00";
            string end_date = "2021-01-13 23:59:59";
            // Başlangıç / Bitiş tarihi. En fazla 3 gün aralık tanımlanabilir.
            //
            //   ################ Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur. ################
            string Birlestir = string.Concat(merchant_id, start_date, end_date, merchant_salt);
            HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
            byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
            string paytr_token = Convert.ToBase64String(b);
            //
            NameValueCollection data = new NameValueCollection();
            data["merchant_id"] = merchant_id;
            data["start_date"] = start_date;
            data["end_date"] = end_date;
            data["paytr_token"] = paytr_token;
            //
            using (WebClient client = new WebClient())
            {
                client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                byte[] result = client.UploadValues("https://www.paytr.com/rapor/islem-dokumu", "POST", data);
                string ResultAuthTicket = Encoding.UTF8.GetString(result);
                dynamic json = JValue.Parse(ResultAuthTicket);

                if (json.status == "success")
                {
                    // VT işlemleri vs.
                    Response.Write(json);

                }
                else if (json.status == "failed")
                {
                    // sonuç bulunamadı
                    Response.Write("No transaction was found in date duration");

                }
                else
                {
                    // Hata durumu
                    Response.Write(json.err_no + "-" + json.err_msg);
                }
            }
            return View();
        }
    }
}