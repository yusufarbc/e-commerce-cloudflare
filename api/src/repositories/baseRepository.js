/**
 * Ortak CRUD işlemlerini sağlayan Temel Repository sınıfı.
 * Açık/Kapalı Prensibine (OCP) uygundur, özel modeller için genişletilebilir.
 */
export class BaseRepository {
    /**
     * @param {Object} model - Belirli bir model için Prisma temsili (örn. prisma.urun).
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Verilen seçeneklere uyan tüm kayıtları bulur.
     * @param {Object} [options={}] - Prisma findMany seçenekleri.
     * @returns {Promise<Array<Object>>} Kayıt listesi.
     */
    async findAll(options = {}) {
        return this.model.findMany(options);
    }

    /**
     * ID'ye göre tek bir kayıt bulur.
     * @param {string} id - Kaydın UUID'si.
     * @returns {Promise<Object|null>} Kayıt veya bulunamazsa null.
     */
    async findById(id) {
        return this.model.findUnique({
            where: { id }
        });
    }

    /**
     * Yeni bir kayıt oluşturur.
     * @param {Object} data - Yeni kayıt için veri.
     * @returns {Promise<Object>} Oluşturulan kayıt.
     */
    async create(data) {
        return this.model.create({ data });
    }

    /**
     * Mevcut bir kaydı ID ile günceller.
     * @param {string} id - Güncellenecek kaydın UUID'si.
     * @param {Object} data - Güncellenecek veri.
     * @returns {Promise<Object>} Güncellenen kayıt.
     */
    async update(id, data) {
        return this.model.update({
            where: { id },
            data
        });
    }

    /**
     * ID ile bir kaydı siler.
     * @param {string} id - Silinecek kaydın UUID'si.
     * @returns {Promise<Object>} Silinen kayıt.
     */
    async delete(id) {
        return this.model.delete({
            where: { id }
        });
    }
}
