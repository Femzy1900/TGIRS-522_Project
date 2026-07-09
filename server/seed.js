import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gadget from './src/models/Gadget.js';
import connectDB from './src/config/db.js';

dotenv.config();

// Connect to MongoDB
await connectDB();

const categories = ['Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'Gaming Console', 'Accessories'];
const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Xiaomi', 'ASUS', 'Acer', 'MSI', 'Sony', 'Microsoft', 'Nintendo'];
const osList = ['macOS', 'Windows 11', 'iOS', 'Android 14', 'Android 13', 'Chrome OS', 'HarmonyOS', 'Linux'];
const processors = ['Apple M3', 'Apple M2', 'Intel Core i9', 'Intel Core i7', 'AMD Ryzen 9', 'AMD Ryzen 7', 'Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 2', 'A17 Pro', 'A16 Bionic'];
const rams = ['4GB', '8GB', '12GB', '16GB', '32GB', '64GB'];
const storages = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];

const gadgets = [
  {
    productName: 'MacBook Pro 14" M3',
    brand: 'Apple',
    category: 'Laptop',
    operatingSystem: 'macOS',
    processor: 'Apple M3',
    ram: '16GB',
    storage: '512GB',
    screenSize: '14.2"',
    displayType: 'Liquid Retina XDR',
    battery: '70Wh',
    price: 1599,
    releaseYear: 2023,
    description: 'The latest MacBook Pro with the powerful M3 chip, delivering extraordinary performance and all-day battery life.',
    keywords: ['laptop', 'apple', 'm3', 'macbook pro', 'professional', 'retina'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    rating: 4.8,
    availability: 'In Stock'
  },
  {
    productName: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphone',
    operatingSystem: 'Android 14',
    processor: 'Snapdragon 8 Gen 3',
    ram: '12GB',
    storage: '256GB',
    screenSize: '6.8"',
    displayType: 'Dynamic AMOLED 2X',
    battery: '5000mAh',
    price: 1299,
    releaseYear: 2024,
    description: 'The ultimate Android flagship featuring Galaxy AI, a titanium body, and a 200MP camera system.',
    keywords: ['smartphone', 'samsung', 'android', 's24', 'ultra', 'camera', 'ai'],
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    rating: 4.9,
    availability: 'In Stock'
  },
  {
    productName: 'PlayStation 5 Pro',
    brand: 'Sony',
    category: 'Gaming Console',
    operatingSystem: 'Custom',
    processor: 'AMD Ryzen Zen 2 Custom',
    ram: '16GB',
    storage: '1TB',
    screenSize: null,
    displayType: null,
    battery: null,
    price: 499,
    releaseYear: 2020,
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    keywords: ['gaming', 'console', 'sony', 'playstation', 'ps5', '4k'],
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    rating: 4.9,
    availability: 'In Stock'
  },
  {
    productName: 'ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    category: 'Laptop',
    operatingSystem: 'Windows 11',
    processor: 'Intel Core i7',
    ram: '16GB',
    storage: '1TB',
    screenSize: '14"',
    displayType: 'OLED',
    battery: '57Wh',
    price: 1899,
    releaseYear: 2023,
    description: 'A premium business laptop designed for professionals on the go, offering superior performance, durability, and a legendary keyboard.',
    keywords: ['laptop', 'lenovo', 'thinkpad', 'business', 'windows'],
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    rating: 4.7,
    availability: 'In Stock'
  },
  {
    productName: 'iPad Pro 12.9"',
    brand: 'Apple',
    category: 'Tablet',
    operatingSystem: 'iPadOS',
    processor: 'Apple M2',
    ram: '8GB',
    storage: '256GB',
    screenSize: '12.9"',
    displayType: 'Liquid Retina XDR',
    battery: '40Wh',
    price: 1099,
    releaseYear: 2022,
    description: 'The ultimate iPad experience with the blazing fast M2 chip, a stunning XDR display, and superfast wireless connectivity.',
    keywords: ['tablet', 'apple', 'ipad pro', 'm2', 'drawing', 'productivity'],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    rating: 4.8,
    availability: 'In Stock'
  }
];

// Generate remaining items to reach 50 total gadgets
for (let i = 6; i <= 50; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const isPhoneOrTablet = category === 'Smartphone' || category === 'Tablet';
  const isLaptop = category === 'Laptop';
  
  const baseName = `${brand} ${category} Model X${i}`;
  
  const categoryImages = {
    'Laptop': ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', 'https://images.unsplash.com/photo-1531297172868-84225a3376ec?w=800&q=80', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'],
    'Smartphone': ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=800&q=80', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'],
    'Tablet': ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'],
    'Smartwatch': ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80'],
    'Gaming Console': ['https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800&q=80'],
    'Accessories': ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', 'https://images.unsplash.com/photo-1527814050087-15100c40acd8?w=800&q=80']
  };
  const imagesForCat = categoryImages[category];
  const randomImage = imagesForCat[Math.floor(Math.random() * imagesForCat.length)];
  
  gadgets.push({
    productName: baseName,
    brand: brand,
    category: category,
    operatingSystem: osList[Math.floor(Math.random() * osList.length)],
    processor: processors[Math.floor(Math.random() * processors.length)],
    ram: rams[Math.floor(Math.random() * rams.length)],
    storage: storages[Math.floor(Math.random() * storages.length)],
    screenSize: isLaptop ? '15.6"' : (isPhoneOrTablet ? '6.5"' : null),
    displayType: isLaptop || isPhoneOrTablet ? 'IPS LCD' : null,
    battery: isLaptop ? '60Wh' : (isPhoneOrTablet ? '4500mAh' : null),
    price: Math.floor(Math.random() * 2000) + 99,
    releaseYear: 2019 + Math.floor(Math.random() * 6), // 2019 to 2024
    description: `A highly anticipated ${category.toLowerCase()} from ${brand}, offering excellent performance and reliability for everyday use.`,
    keywords: [category.toLowerCase(), brand.toLowerCase(), 'tech', 'gadget', 'modern'],
    image: randomImage,
    rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
    availability: Math.random() > 0.8 ? 'Out of Stock' : 'In Stock'
  });
}

const importData = async () => {
  try {
    // Clear existing data
    await Gadget.deleteMany();
    console.log('Gadgets collection cleared.');

    // Insert new data
    await Gadget.insertMany(gadgets);
    console.log(`${gadgets.length} Gadgets imported successfully!`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
