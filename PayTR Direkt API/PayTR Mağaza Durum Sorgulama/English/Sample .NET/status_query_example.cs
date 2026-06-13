using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PayTrTest.Model;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace PayTrTest
{
    class Program
    {
        private readonly string TRANSFER_URL = "https://www.paytr.com/odeme/durum-sorgu";
        private readonly string MERCHANT_ID = "MERCHANT_ID";
        private readonly string MERCHANT_KEY = "MERCHANT_KEY";
        private readonly string MERCHANT_SALT = "MERCHANT_SALT";

        static void Main(string[] args)
        {
            var p = new Program();
            p.Start();
        }

        public void Start()
        {
            Dictionary<string, string> testCases = new Dictionary<string, string>
            {
                { "Geçersiz Merchant OID", "invalid_merchant_oid" } ,
                { "Başarılı Ödeme", "ffd0c5992212400cb87b88ff40bbcda2" } ,
                { "Başarısız Ödeme", "fed4b0f2aa33450bab58971ce5da75f0" } ,
                { "Kısmi Transfer (işlemde) ve Kısmi İade", "dbb5a788734f498e8490333936ec6e11" } ,
                { "Tamamı Transfer Edilmiş", "5cfbb224a9c44246853818c3082946d8" } ,
            };

            foreach(KeyValuePair<string, string> item in testCases)
            {
                Console.WriteLine($"TESTING '{item.Key}' using Merchant OID: `{item.Value}` {Environment.NewLine}");
                _DoQuery(item.Value);
                Console.WriteLine(new string('-',50) + Environment.NewLine);
                
            }
            Console.WriteLine($"{Environment.NewLine}{Environment.NewLine}Cikmak icin bir tusa basin...");
            Console.ReadKey();
        }

        private void _DoQuery(string merchantOid)
        {
            PaytrDurumSorguResponse res = _QueryPayment(
                MERCHANT_ID,
                MERCHANT_KEY,
                MERCHANT_SALT,
                merchantOid
            );

            if (res.Status != "success")
            {
                Console.WriteLine($"  {res.ErrorMessage} - {res.ErrorNo}");
                return;
            }

            Console.WriteLine($"  Sipariş Tutarı : {res.PaymentAmount} {res.Currency}");

            Console.WriteLine($"  Müşteri Ödeme Tutarı : {res.PaymentTotal} {res.Currency}");
            if(res.Returns.Count > 0) 
                Console.WriteLine("  ## IADELER ##");
            foreach (PaytrDurumSorguReturnItem returnItem in res.Returns)
            {
                Console.WriteLine($"    {returnItem.Amount} - {returnItem.Date} - {returnItem.Type} - {returnItem.DateCompleted} - {returnItem.AuthCode} - {returnItem.RefNum}");
            }
        }

        private PaytrDurumSorguResponse _QueryPayment(string merchantId, string merchantKey, string merchantSalt, string merchantOid)
        {
            NameValueCollection data = _GeneratePayTrSorguData(merchantId, merchantKey, merchantSalt, merchantOid);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            using (WebClient client = new WebClient())
            {
                client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");

                byte[] result = client.UploadValues(TRANSFER_URL, "POST", data);

                string ResultAuthTicket = Encoding.UTF8.GetString(result);
                dynamic json = JValue.Parse(ResultAuthTicket);

                return JsonConvert.DeserializeObject<PaytrDurumSorguResponse>(ResultAuthTicket);
            }
        }

        private NameValueCollection _GeneratePayTrSorguData(string merchantId, string merchantKey, string merchantSalt, string merchantOid)
        {
        
            NameValueCollection data = new NameValueCollection();
            data["merchant_id"] = merchantId;
            data["merchant_oid"] = merchantOid;

        
            string Birlestir = string.Concat(merchantId, merchantOid, merchantSalt);

            HMACSHA256 hmac = new HMACSHA256(Encoding.UTF8.GetBytes(merchantKey));
            byte[] b = hmac.ComputeHash(Encoding.UTF8.GetBytes(Birlestir));
            data["paytr_token"] = Convert.ToBase64String(b);

            return data;
        }
    }
}
