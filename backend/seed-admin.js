const { sequelize, User, Account } = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await sequelize.sync();

        const existingAdmin = await User.findOne({ where: { email: 'admin@nexus.com' } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password

        const admin = await User.create({
            fullName: 'Nexus Administrator',
            email: 'admin@nexus.com',
            password: hashedPassword,
            phoneNumber: '+19999999999',
            role: 'admin',
            kycStatus: 'VERIFIED'
        });

        console.log('------------------------------------------------');
        console.log('✅ Admin User Created Successfully');
        console.log('📧 Email: admin@nexus.com');
        console.log('🔑 Password: admin123');
        console.log('------------------------------------------------');

    } catch (err) {
        console.error('Failed to seed admin:', err);
    } finally {
        await sequelize.close();
    }
};

seedAdmin();
