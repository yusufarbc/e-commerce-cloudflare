import { ReturnService } from '../services/returnService.js';


const returnService = new ReturnService();

export class ReturnController {
    async createReturnRequest(req, res) {
        try {
            const { token, iadeTipi, sebepAciklamasi, fotografUrls } = req.body;
            // token from body or auth? User is tracking with token, so body is fine.

            if (!token) {
                return res.status(400).json({ status: 'error', errorMessage: 'Takip tokeni gerekli.' });
            }

            const result = await returnService.createReturnRequest({
                token,
                iadeTipi,
                sebepAciklamasi,
                fotografUrls
            });

            res.json({ status: 'success', data: result, message: 'İade talebiniz oluşturuldu. Onay bekleniyor.' });
        } catch (error) {
            console.error('İade Talebi Hatası:', error);
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }

    async getReturnStatus(req, res) {
        try {
            const { token } = req.query;
            if (!token) return res.status(400).json({ status: 'error', errorMessage: 'Token gerekli.' });

            const result = await returnService.getReturnStatus(token);
            res.json({ status: 'success', data: result });
        } catch (error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
}
