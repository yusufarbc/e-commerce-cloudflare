export class BrandController {
    constructor(brandService) {
        this.brandService = brandService;
        this.getBrands = this.getBrands.bind(this);
        this.getBrand = this.getBrand.bind(this);
        this.getBrandBySlug = this.getBrandBySlug.bind(this);
    }

    async getBrands(req, res, next) {
        try {
            const brands = await this.brandService.getAllBrands();
            res.json(brands);
        } catch (error) {
            next(error);
        }
    }

    async getBrand(req, res, next) {
        try {
            const { id } = req.params;
            const brand = await this.brandService.getBrandById(id);
            if (!brand) {
                return res.status(404).json({ message: 'Marka bulunamadı' });
            }
            res.json(brand);
        } catch (error) {
            next(error);
        }
    }

    async getBrandBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const brand = await this.brandService.getBrandBySlug(slug);
            if (!brand) {
                return res.status(404).json({ message: 'Marka bulunamadı' });
            }
            res.json(brand);
        } catch (error) {
            next(error);
        }
    }
}
