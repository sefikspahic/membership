require('dotenv').config();
const config = {
    port: process.env.PORT || 5000,
    secret: process.env.JWT_SECRET || 'Your secret key',
    mongo: process.env.MONGO || "mongodb://loclahost:27017/mernproject"
}
export default config;