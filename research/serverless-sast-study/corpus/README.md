# Deney Korpusu

Her vaka, aynı CWE ve aynı sink kullanılarak farklı source türleriyle yazılan
ikizlerden oluşur. Açıklı dosyaların yanında precision ölçümü için düzeltilmiş
negatif örnek bulunur.

Bir bulgu, `ground_truth.csv` içindeki dosya ve sink satırının ±3 satırı içinde
raporlanır ve doğru CWE ailesiyle eşleşirse true positive kabul edilir.
Düzeltilmiş dosyalardaki eşleşmeler false positive olarak sayılır.

Bu kod deney içindir ve deploy edilmemelidir.
