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
        public ActionResult NewCard()
        {
            string merchant_id = "MERCHANT_ID";
            string merchant_key = "XXXXXXXXXXX";
            string merchant_salt = "YYYYYYYYYYY";
            //
            string emailstr = "info@siteniz.com";
            //
            int payment_amountstr = 100.99;
            //
            string merchant_oid = "";
            //
            string user_namestr = "";
            //
            string user_addressstr = "";
            //
            string user_phonestr = "";
            //
            string merchant_ok_url = "http://example.com/success";
            //
            string merchant_fail_url = "http://example.com/failed";
            //
            string user_ip = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
			if (user_ip == "" || user_ip == null){
				user_ip = Request.ServerVariables["REMOTE_ADDR"];
			}
            //
            object[][] user_basket = {
            // Array items: Product name - Price - Piece
            new object[] {"Örnek ürün 1", "18.00", 1},
            new object[] {"Örnek ürün 2", "33.25", 2}
            };
            /* ############################################################################################ */
            //
            string card_type = "bonus"; // Sent only in installments. Avaliable values; advantage, axess, bonus, cardfinans, maximum, paraf, world
            //
            string debug_on = "1";
            //
            string test_mode = "0";
            //
            string non_3d = "0";
            //
            string non3d_test_failed = "0";
            //
            string installment_count = "0"; // 2-12 sent only in installments.
            //
            string payment_type = "card";
            //
            string post_url = "https://www.paytr.com/odeme";
            //
            string currency = "TL";
            //
            JavaScriptSerializer ser = new JavaScriptSerializer();
            string user_basket_json = ser.Serialize(user_basket);
            //
            string Birlestir = string.Concat(merchant_id, user_ip, merchant_oid, emailstr, payment_amountstr.ToString(), payment_type, installment_count, currency, test_mode, non_3d, merchant_salt);
            HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
            byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
            //

            // IF THE UTOKEN IS NOT SHIPPED, THIS USER IS ASSUMED THAT THERE IS NO PRE-RECORDED CARD.
            // AND CREATE A NEW UTOKEN BY PAYTR, IT IS RETURNED IN THE ANSWER OF THE PAYMENT PROCEDURE (TO THE NOTICE URL)!
            // IF THE USER SAVES A CARD IN YOUR SYSTEM BEFORE POST THE UTOKEN PARAMETER REGISTERED BY YOU
            // YOU MUST ADD TO THE CONTENT. THIS CARD WILL BE IDENTIFIED TO THE SAME USER. FOR EXISTING USER
            // USE A NEW UTOKEN WILL BE CREATED IF A NEW CARD DESCRIPTION IS NOT SENT TO THE EXISTING UTOKEN.
            // ALL CARDS ARE NOT GROUPED UNDER ONE UTOKEN !!!
            string utoken = "";
            //

            ViewBag.MerchantId = merchant_id;
            ViewBag.UserIp = user_ip;
            ViewBag.MerchantOid = merchant_oid;
            ViewBag.Email = emailstr;
            ViewBag.PaymentType = payment_type;
            ViewBag.PaymentAmount = payment_amountstr.ToString();
            ViewBag.InstallmentCount = installment_count;
            ViewBag.Currency = currency;
            ViewBag.TestMode = test_mode;
            ViewBag.Non3d = non_3d;
            ViewBag.MerchantOkUrl = merchant_ok_url;
            ViewBag.MerchantFailUrl = merchant_fail_url;
            ViewBag.UserName = user_namestr;
            ViewBag.UserAddress = user_addressstr;
            ViewBag.UserPhone = user_phonestr;
            ViewBag.UserBasket = user_basket_json;
            ViewBag.Non3dTestFailed = non3d_test_failed;
            ViewBag.DebugOn = debug_on;
            ViewBag.CardType = card_type;
            ViewBag.PostUrl = post_url;
            ViewBag.uToken = utoken;
            ViewBag.PaytrToken = Convert.ToBase64String(b);

            return View();
        }
    }
}