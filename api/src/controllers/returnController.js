import { asyncHandler } from '../utils/asyncHandler.js';

export class ReturnController {
    /**
     * @param {import('../services/returnService.js').ReturnService} returnService
     */
    constructor(returnService) {
        this.returnService = returnService;
    }

    createReturnRequest = asyncHandler(async (req, res, next) => {
        const { token, iadeTipi, sebepAciklamasi, fotografUrls } = req.body;

        if (!token) {
            return res.status(400).json({ status: 'error', errorMessage: 'Takip tokeni gerekli.' });
        }

        const result = await this.returnService.createReturnRequest({
            token,
            iadeTipi,
            sebepAciklamasi,
            fotografUrls
        });

        res.json({ status: 'success', data: result, message: 'İade talebiniz oluşturuldu. Onay bekleniyor.' });
    });

    getReturnStatus = asyncHandler(async (req, res, next) => {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ status: 'error', errorMessage: 'Token gerekli.' });
        }

        const result = await this.returnService.getReturnStatus(token);
        res.json({ status: 'success', data: result });
    });

    /**
     * Admin panel return requests listing.
     */
    adminGetAllReturns = asyncHandler(async (req, res, next) => {
        const returns = await this.returnService.getAllReturnsForAdmin();
        res.json({ status: 'success', data: returns });
    });

    /**
     * Admin panel return request approval / rejection.
     */
    adminUpdateReturnRequest = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        try {
            const updatedReturn = await this.returnService.updateReturnRequest(id, req.body);
            res.json({ status: 'success', data: updatedReturn });
        } catch (error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    });
}
