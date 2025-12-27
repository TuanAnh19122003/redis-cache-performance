/**
 * ⚠️ CHỈ CHẠY FILE NÀY TRONG DEV
 */
if (process.env.NODE_ENV === 'production') {
    console.error('❌ Không được chạy seed trên production');
    process.exit(1);
}

const sequelize = require('./src/config/database');
const { faker } = require('@faker-js/faker');

// Import models
const User = require('./src/models/user.model');
const Category = require('./src/models/category.model');
const Product = require('./src/models/product.model');
const RequestLog = require('./src/models/requestlog.model');
const Setting = require('./src/models/setting.model');

const PRODUCT_COUNT = 500;

async function seed() {
    try {
        // 1️⃣ Kết nối DB
        await sequelize.authenticate();
        console.log('✅ Connected to MySQL');

        // 2️⃣ Reset DB
        await sequelize.sync({ force: true });
        console.log('✅ Database synced (force)');

        /* ================= USERS ================= */
        const users = await User.bulkCreate([
            {
                name: 'Admin',
                email: 'admin@example.com',
                role: 'admin'
            },
            {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                role: 'user'
            }
        ]);

        /* ================= CATEGORIES ================= */
        const categories = await Category.bulkCreate([
            { name: 'Laptop' },
            { name: 'Điện thoại' },
            { name: 'Phụ kiện' },
            { name: 'Màn hình' }
        ]);

        /* ================= PRODUCTS ================= */
        const productsData = Array.from({ length: PRODUCT_COUNT }).map(() => ({
            name: faker.commerce.productName(),
            image_url: faker.image.urlLoremFlickr({ category: 'technology' }),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 100000, max: 50000000 }),
            categoryId: faker.helpers.arrayElement(categories).id,
            userId: users[0].id // admin tạo sản phẩm
        }));

        await Product.bulkCreate(productsData);

        /* ================= SETTINGS ================= */
        await Setting.bulkCreate([
            { key: 'CACHE_ENABLED', value: 'true' },
            { key: 'CACHE_TTL', value: '60' }
        ]);

        /* ================= REQUEST LOGS ================= */
        const logs = Array.from({ length: 50 }).map(() => ({
            endpoint: '/api/products',
            response_time: faker.number.int({ min: 10, max: 500 }),
            is_cached: faker.datatype.boolean()
        }));

        await RequestLog.bulkCreate(logs);

        console.log(`🎉 SEED DATA COMPLETED: ${PRODUCT_COUNT} PRODUCTS`);
        process.exit(0);

    } catch (error) {
        console.error('❌ SEED ERROR:', error);
        process.exit(1);
    }
}

seed();
