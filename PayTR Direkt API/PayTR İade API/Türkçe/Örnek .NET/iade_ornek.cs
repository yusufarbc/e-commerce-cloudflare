using Newtonsoft.Json.Linq; // Bu satırda hata alırsanız, site dosyalarınızın olduğu bölümde bin isimli bir klasör oluşturup içerisine Newtonsoft.Json.dll adlı DLL dosyasını kopyalayın.
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

        // ####################### DÜZENLEMESİ ZORUNLU ALANLAR #######################
        //
        // API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
        string merchant_id      = "XXXXXX";
        string merchant_key     = "YYYYYYYYYYYYYY";
        string merchant_salt    = "ZZZZZZZZZZZZZZ";
        //
        // Mağaza sipariş no: Satış işlemi için belirlediğiniz benzersiz sipariş numarası 
        string merchant_oid     = "";
        //
        // Alıcıya yapılacak olan iade tutarı 
        string return_amount    = "11.97"; //örn. işlem TL ise on bir lira doksan yedi kuruş
        //
        // Referans Numarası: En fazla 64 karakter, alfa numerik. Zorunlu değil.
        string reference_no     = "XXXX1111";
        //
        // Gönderilecek veriler oluşturuluyor
        NameValueCollection data = new NameValueCollection();
        data["merchant_id"] = merchant_id;
        data["merchant_oid"] = merchant_oid;
        data["return_amount"] = return_amount;
        //data["reference_no"] = return_amount;
        //
        // Token oluşturma fonksiyonu, değiştirilmeden kullanılmalıdır.
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
                json değeri içerisinde;

                [status]        - İade talebi başarılı ise success döner.
                [is_test]       - İade talebi test işlem içinse 1 döner.
                [merchant_oid]  - İade talebi yapılan sipariş numarası.
                [return_amount] - İade talebi yapılan tutar.
                [reference_no]  - İade talebi referans numarası.

                bilgileri dönmektedir.
            */

            if (json.status == "success") {
                //VT işlemleri vs.
                Response.Write(json);
            }else{
                //Örn. $result -> array('status'=>'error', "err_no"=>"006", "err_msg"=>"Toplam iade tutarı odeme tutarindan fazla olamaz")
                Response.Write("PAYTR payment return failes. reason:" + json.err_msg + "");
            }
        }
    }
}