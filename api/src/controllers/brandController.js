import { asyncHandler } from '../utils/asyncHandler.js';

export class BrandController {
    constructor(brandService) {
        this.brandService = brandService;
    }

    getBrands = asyncHandler(async (req, res, next) => {
        const brands = await this.brandService.getAllBrands();
        res.json(brands);
    });

    getBrand = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const brand = await this.brandService.getBrandById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Marka bulunamadı' });
        }
        res.json(brand);
    });

    getBrandBySlug = asyncHandler(async (req, res, next) => {
        const { slug } = req.params;
        const brand = await this.brandService.getBrandBySlug(slug);
        if (!brand) {
            return res.status(404).json({ message: 'Marka bulunamadı' });
        }
        res.json(brand);
    });

    /**
     * Admin panel brand listing.
     */
    adminGetBrands = asyncHandler(async (req, res, next) => {
        const brands = await this.brandService.getAllBrandsForAdmin();
        res.json({ status: 'success', data: brands });
    });

    /**
     * Admin panel brand creation.
     */
    adminCreateBrand = asyncHandler(async (req, res, next) => {
        const body = req.body;
        const slug = body.ad.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const marka = await this.brandService.createBrand({
            ad: body.ad,
            slug: slug,
            logoUrl: body.logoUrl || null,
            sira: parseInt(body.sira || 0, 10),
            aktif: body.aktif !== false
        });

        res.json({ status: 'success', data: marka });
    });

    /**
     * Admin panel brand update.
     */
    adminUpdateBrand = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const body = req.body;

        const data = {};
        if (body.ad !== undefined) {
            data.ad = body.ad;
            data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl;
        if (body.sira !== undefined) data.sira = parseInt(body.sira, 10);
        if (body.aktif !== undefined) data.aktif = body.aktif !== false;

        const marka = await this.brandService.updateBrand(id, data);
        res.json({ status: 'success', data: marka });
    });

    /**
     * Admin panel brand delete.
     */
    adminDeleteBrand = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        await this.brandService.deleteBrand(id);
        res.json({ status: 'success', message: 'Marka silindi.' });
    });
}
