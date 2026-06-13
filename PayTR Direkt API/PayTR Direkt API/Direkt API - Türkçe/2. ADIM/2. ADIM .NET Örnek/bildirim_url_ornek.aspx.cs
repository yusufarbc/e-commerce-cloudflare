// 2. ADIM için örnek kodlar

// ÖNEMLİ UYARILAR!
// 1) Bu sayfaya oturum (SESSION) ile veri taşıyamazsınız. Çünkü bu sayfa müşterilerin yönlendirildiği bir sayfa değildir.
// 2) Entegrasyonun 1. ADIM'ında gönderdiğniz merchant_oid değeri bu sayfaya POST ile gelir. Bu değeri kullanarak
// veri tabanınızdan ilgili siparişi tespit edip onaylamalı veya iptal etmelisiniz.
// 3) Aynı sipariş için birden fazla bildirim ulaşabilir (Ağ bağlantı sorunları vb. nedeniyle). Bu nedenle öncelikle
// siparişin durumunu veri tabanınızdan kontrol edin, eğer onaylandıysa tekrar işlem yapmayın. Örneği aşağıda bulunmaktadır.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Net.Mail;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class bildirim_url_ornek : System.Web.UI.Page {

    // ####################### DÜZENLEMESİ ZORUNLU ALANLAR #######################
    //
    // API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
    string merchant_key     = "YYYYYYYYYYYYYY";
    string merchant_salt    = "ZZZZZZZZZZZZZZ";
    // ###########################################################################

    protected void Page_Load(object sender, EventArgs e) {

        // ####### Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur. #######
        // 
        // POST değerleri ile hash oluştur.
        string merchant_oid = Request.Form["merchant_oid"];
        string status = Request.Form["status"];
        string total_amount = Request.Form["total_amount"];
        string hash = Request.Form["hash"];

        string Birlestir = string.Concat(merchant_oid, merchant_salt, status, total_amount);
        HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchant_key));
        byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
        string token = Convert.ToBase64String(b);

        //
        // Oluşturulan hash'i, paytr'dan gelen post içindeki hash ile karşılaştır (isteğin paytr'dan geldiğine ve değişmediğine emin olmak için)
        // Bu işlemi yapmazsanız maddi zarara uğramanız olasıdır.
        if (hash.ToString() != token) {
            Response.Write("PAYTR notification failed: bad hash");
            return;
            }

        //###########################################################################
        
        // BURADA YAPILMASI GEREKENLER
        // 1) Siparişin durumunu $post['merchant_oid'] değerini kullanarak veri tabanınızdan sorgulayın.
        // 2) Eğer sipariş zaten daha önceden onaylandıysa veya iptal edildiyse  echo "OK"; exit; yaparak sonlandırın.

        if (status == "success") { //Ödeme Onaylandı

            // Bildirimin alındığını PayTR sistemine bildir.  
            Response.Write("OK");
            
            // BURADA YAPILMASI GEREKENLER ONAY İŞLEMLERİDİR.
            // 1) Siparişi onaylayın.
            // 2) iframe çağırma adımında merchant_oid ve diğer bilgileri veri tabanınıza kayıp edip bu aşamada karşılaştırarak eğer var ise bilgieri çekebilir ve otomatik sipariş tamamlama işlemleri yaptırabilirsiniz.
            // 2) Eğer müşterinize mesaj / SMS / e-posta gibi bilgilendirme yapacaksanız bu aşamada yapabilirsiniz. Bu işlemide yine iframe çağırma adımında merchant_oid bilgisini kayıt edip bu aşamada sorgulayarak verilere ulaşabilirsiniz.
            // 3) 1. ADIM'da gönderilen payment_amount sipariş tutarı taksitli alışveriş yapılması durumunda
            // değişebilir. Güncel tutarı Request.Form['total_amount'] değerinden alarak muhasebe işlemlerinizde kullanabilirsiniz.

            } else { //Ödemeye Onay Verilmedi
        
            // Bildirimin alındığını PayTR sistemine bildir.  
            Response.Write("OK");

            // BURADA YAPILMASI GEREKENLER
		    // 1) Siparişi iptal edin.
		    // 2) Eğer ödemenin onaylanmama sebebini kayıt edecekseniz aşağıdaki değerleri kullanabilirsiniz.
		    // $post['failed_reason_code'] - başarısız hata kodu
		    // $post['failed_reason_msg'] - başarısız hata mesajı
            }          
    }
}