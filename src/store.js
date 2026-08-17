const STORAGE_KEY = 'dropforge-store-v1';

const seedProducts = [
  { id:'p1', name:'AeroPulse Mini Fan', category:'Home', price:24.99, old:34.99, rating:4.8, badge:'Bestseller', stock:25, description:'A compact rechargeable fan for desks, bedside tables and travel.', image:'https://images.unsplash.com/photo-1587014265270-2a4d6d7f3e8c?auto=format&fit=crop&w=900&q=80' },
  { id:'p2', name:'NovaCharge 3-in-1 Dock', category:'Tech', price:39.99, old:59.99, rating:4.9, badge:'Hot', stock:18, description:'One clean charging station for your everyday devices.', image:'https://images.unsplash.com/photo-1609592424970-8b2b7a5c8c13?auto=format&fit=crop&w=900&q=80' },
  { id:'p3', name:'CloudSoft Everyday Slides', category:'Fashion', price:29.99, old:44.99, rating:4.7, badge:'New', stock:31, description:'Lightweight everyday slides designed for comfort.', image:'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80' },
  { id:'p4', name:'GlowMist LED Humidifier', category:'Home', price:32.99, old:49.99, rating:4.8, badge:'Deal', stock:20, description:'Ambient mist and soft lighting for your room.', image:'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=900&q=80' },
  { id:'p5', name:'FlexiGrip Phone Stand', category:'Tech', price:18.99, old:27.99, rating:4.6, badge:'Value', stock:42, description:'A compact adjustable stand for phones and small tablets.', image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80' },
  { id:'p6', name:'Luma Everyday Tote', category:'Fashion', price:34.99, old:52.99, rating:4.8, badge:'Popular', stock:15, description:'A simple carry-all tote for everyday essentials.', image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80' }
];

const defaults = { products: seedProducts, orders: [], wishlist: [], cart: [], customer: null };
export function loadStore(){ try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; } catch { return defaults; } }
export function saveStore(store){ localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); return store; }
export function createOrder({ items, customer, coupon = null }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = coupon === 'FORGE20' ? subtotal * .2 : 0;
  const shipping = subtotal - discount >= 50 ? 0 : 4.99;
  return { id:`DF-${Date.now().toString(36).toUpperCase()}`, createdAt:new Date().toISOString(), items, customer, coupon, subtotal, discount, shipping, total:Math.max(0, subtotal-discount+shipping), status:'Pending payment' };
}
export { seedProducts };
