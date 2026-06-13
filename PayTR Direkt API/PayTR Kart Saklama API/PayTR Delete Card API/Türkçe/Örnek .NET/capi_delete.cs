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
        public ActionResult Delete()
        {
            // ####################### DÜZENLEMESİ ZORUNLU ALANLAR #######################
            //
            // API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
            string merchant_id = "XXXXXX";
            string merchant_key = "XXXXXX";
            string merchant_salt = "XXXXXX";
            //

            // Kart kayıt sonrası ödeme bildiriminde tarafınıza PAYTR sisteminden bildirilen kullanıcıya özel token
            string utoken = "";
	        //
	        // Kullanıcının kayıtlı kartını tanımlayan token (Kullanıcı kayıtlı kart listesini alma sonucunda dönen yanıtta bulunur)
	        string ctoken = "";
            //
            
            //
            // Token oluşturma fonksiyonu, değiştirilmeden kullanılmalıdır.
            string Birlestir = string.Concat(ctoken, utoken, merchant_salt);
            HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
            byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
            string paytr_token = Convert.ToBase64String(b);

            // Gönderilecek veriler oluşturuluyor
            NameValueCollection data = new NameValueCollection();
            data["merchant_id"] = merchant_id;
            data["ctoken"] = ctoken;
            data["utoken"] = utoken;
            data["paytr_token"] = paytr_token;
            //


            using (WebClient client = new WebClient())
            {
                client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
                byte[] result = client.UploadValues("https://www.paytr.com/odeme/capi/delete", "POST", data);
                string ResultAuthTicket = Encoding.UTF8.GetString(result);
                dynamic json = JValue.Parse(ResultAuthTicket);
                if (json.status == "success")
                {
                    Response.Write("Kart başarıyla silindi!");
                }
                else
                {
                    Response.Write("PAYTR CAPI Delete failed. reason:" + json.err_msg + "");
                }
            }
            
            return View();
        }
    }
}