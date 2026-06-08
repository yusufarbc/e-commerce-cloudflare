import { z } from 'zod';

const phoneRegex = /^05\d{9}$/; // Starts with 05, followed by 9 digits
const taxNumberRegex = /^[0-9]{10,11}$/;

export const checkoutSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        quantity: z.coerce.number().int().positive(),
        name: z.string().optional(),
        price: z.coerce.number().optional(),
        selectedColor: z.string().trim().min(1).max(50).optional()
    })).nonempty("Sepet boş olamaz"),

    guestInfo: z.object({
        name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
        email: z.string().email("Geçerli bir e-posta adresi giriniz"),
        phone: z.string().regex(phoneRegex, "Telefon numarası 05XX XXX XX XX formatında olmalıdır (Bitişik yazıldığında 11 hane)"),
        address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
        city: z.string().min(2, "Şehir seçiniz"),
        district: z.string().min(2, "İlçe seçiniz"),
        zipCode: z.string().min(3, "Posta kodu giriniz")
    }),

    invoiceInfo: z.object({
        isCorporate: z.boolean(),
        companyName: z.string().optional(),
        taxOffice: z.string().optional(),
        taxNumber: z.string().optional()
    }).optional().refine((data) => {
        if (!data || !data.isCorporate) return true;
        // If corporate, these are required
        return data.companyName && data.taxOffice && data.taxNumber;
    }, {
        message: "Kurumsal fatura için Şirket Adı, Vergi Dairesi ve Vergi No zorunludur",
        path: ["companyName"] // Highlight this field on error
    })
});
