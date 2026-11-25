import React, { useMemo, useState } from 'react';

const SUPABASE_URL = "https://asspfwcgvnveejobxrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9";

async function zadQuery(table: string, query = "", init: RequestInit = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `HTTP ${res.status}`);
  }
  return init.method === "DELETE" ? null : res.json();
}

type CustomerType = 'retail' | 'wholesale';

interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface ProductItem {
  id: number;
  categoryId: string;
  name: string;
  retailUnit: string;
  wholesaleUnit: string;
  retailPrice: number;
  wholesalePrice: number;
  badge?: string;
  image: string;
}

interface OrderSummary {
  itemsCount: number;
  total: number;
  type: CustomerType;
  savedLocally?: boolean;
  reason?: string;
}

const CART_STORAGE_KEY = 'zadlink_cart_v1';
const PENDING_ORDERS_KEY = 'zadlink_pending_orders';
let memoryCartFallback: Record<number, number> = {};

const CATEGORIES: CategoryItem[] = [
  {
    id: 'oils-basics',
    title: 'زيوت وسمن وأساسيات',
    subtitle: 'زيوت، سمن، أرز، مكرونة، دقيق، سكر، طحينة، عسل، خل',
    image: './oil.png.png',
  },
  {
    id: 'frozen-meats',
    title: 'مجمدات ومصنعات لحوم',
    subtitle: 'بطاطس نصف مقلية، خضروات مجمدة، مثلجات، برجر، سجق، كبدة، كفتة، مفروم',
    image: './processed-meats.jpg.jpg',
  },
  {
    id: 'poultry-fish',
    title: 'دواجن وبيض وأسماك',
    subtitle: 'فراخ، بط، بيض، أسماك مجمدة، رنجة',
    image: './chicken.jpg.jpg',
  },
  {
    id: 'dairy-cheese',
    title: 'ألبان وأجبان',
    subtitle: 'ألبان متنوعة وأجبان بكافة أنواعها',
    image: './dairy.jpg.jpg',
  },
  {
    id: 'canned-sauces',
    title: 'معلبات وصوصات',
    subtitle: 'صلصة طماطم، صوصات، مربى وشوكولاتة دهن',
    image: './sauces.jpg.jpg',
  },
  {
    id: 'beverages',
    title: 'مشروبات وشاي وقهوة',
    subtitle: 'شاي، قهوة، نسكافية، عصائر ومشروبات، مياه',
    image: './juices-drinks.jpg.jpg',
  },
  {
    id: 'bakery-supplies',
    title: 'مخبوزات ومستلزمات خبز',
    subtitle: 'مخبوزات، بسكويت وكيك، خميرة وبيكنج باودر ونشا وكاكاو',
    image: './bakery.jpg.jpg',
  },
  {
    id: 'spices-salt',
    title: 'توابل وبهارات وملح',
    subtitle: 'فلفل أسود، كمون، كزبرة، بابريكا، كركم، سبع بهارات، ملح',
    image: './spices.jpg.jpg',
  },
  {
    id: 'fruits-veggies',
    title: 'فاكهة وخضار',
    subtitle: 'فاكهة وخضروات طازجة ومجمدة',
    image: './fruits.jpg.jpg',
  },
  {
    id: 'cleaning-paper',
    title: 'منظفات وورقيات',
    subtitle: 'مساحيق غسيل، منظفات سائلة وكلور، مناديل وفويل واسترتش وأكياس',
    image: './liquid-cleaners.jpg.jpg',
  },
];

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    categoryId: 'oils-basics',
    name: 'زيت طعام نقي',
    retailUnit: 'قطاعي: زجاجة 1 لتر',
    wholesaleUnit: 'جملة: جركن 18 لتر',
    retailPrice: 85,
    wholesalePrice: 1280,
    badge: 'عرض مميز',
    image: './oil.png.png',
  },
  {
    id: 2,
    categoryId: 'oils-basics',
    name: 'دقيق فاخر للمخبوزات والحلويات',
    retailUnit: 'قطاعي: كيس 1 كجم',
    wholesaleUnit: 'جملة: شيكارة 25 كجم',
    retailPrice: 28,
    wholesalePrice: 620,
    image: './flour.png.jpg',
  },
  {
    id: 3,
    categoryId: 'oils-basics',
    name: 'أرز',
    retailUnit: 'قطاعي: كيس 1 كجم',
    wholesaleUnit: 'جملة: شيكارة 25 كجم',
    retailPrice: 34,
    wholesalePrice: 800,
    badge: 'الأكثر طلباً',
    image: './rice.jpg.png',
  },
  {
    id: 4,
    categoryId: 'oils-basics',
    name: 'مكرونات',
    retailUnit: 'قطاعي: كيس 400 جم',
    wholesaleUnit: 'جملة: كرتونة (20 كيس)',
    retailPrice: 16,
    wholesalePrice: 290,
    image: './pasta.png.jpg',
  },
  {
    id: 5,
    categoryId: 'oils-basics',
    name: 'سكر',
    retailUnit: 'قطاعي: كيس 1 كجم',
    wholesaleUnit: 'جملة: شيكارة 50 كجم',
    retailPrice: 36,
    wholesalePrice: 1700,
    image: './sugar.png.jpg',
  },
  {
    id: 6,
    categoryId: 'oils-basics',
    name: 'طحينة',
    retailUnit: 'قطاعي: عبوة 500 جم',
    wholesaleUnit: 'جملة: جركن 5 كجم',
    retailPrice: 95,
    wholesalePrice: 860,
    image: './tahini.jpg.jpg',
  },
  {
    id: 7,
    categoryId: 'oils-basics',
    name: 'عسل نحل',
    retailUnit: 'قطاعي: برطمان 500 جم',
    wholesaleUnit: 'جملة: كرتونة (12 عبوة)',
    retailPrice: 120,
    wholesalePrice: 1320,
    image: './honey.jpg.jpg',
  },
  {
    id: 8,
    categoryId: 'oils-basics',
    name: 'عسل أسود',
    retailUnit: 'قطاعي: عبوة 1 كجم',
    wholesaleUnit: 'جملة: جركن 10 كجم',
    retailPrice: 45,
    wholesalePrice: 410,
    image: './molasses.jpg.jpg',
  },
  {
    id: 9,
    categoryId: 'oils-basics',
    name: 'خل أبيض',
    retailUnit: 'قطاعي: زجاجة 1 لتر',
    wholesaleUnit: 'جملة: كرتونة (12 زجاجة)',
    retailPrice: 18,
    wholesalePrice: 185,
    image: './vinegar.jpg.jpg',
  },
  {
    id: 10,
    categoryId: 'frozen-meats',
    name: 'مصنعات لحوم (برجر، سجق، كبدة، كفتة، لحم مفروم)',
    retailUnit: 'قطاعي: عبوة / كيلو',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 165,
    wholesalePrice: 0,
    image: './processed-meats.jpg.jpg',
  },
  {
    id: 11,
    categoryId: 'frozen-meats',
    name: 'بطاطس نصف مقلية',
    retailUnit: 'قطاعي: كيس 2.5 كجم',
    wholesaleUnit: 'جملة: كرتونة (4 × 2.5 كجم)',
    retailPrice: 135,
    wholesalePrice: 510,
    image: './frozen-fries.jpg.jpg',
  },
  {
    id: 12,
    categoryId: 'frozen-meats',
    name: 'خضروات مجمدة',
    retailUnit: 'قطاعي: كيس 400 جم',
    wholesaleUnit: 'جملة: كرتونة (20 كيس)',
    retailPrice: 25,
    wholesalePrice: 440,
    image: './frozen-veggies.jpg.jpg',
  },
  {
    id: 13,
    categoryId: 'frozen-meats',
    name: 'مثلجات',
    retailUnit: 'قطاعي: عبوة',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 45,
    wholesalePrice: 0,
    image: './ice-cream.jpg.jpg',
  },
  {
    id: 14,
    categoryId: 'poultry-fish',
    name: 'فراخ',
    retailUnit: 'قطاعي: كيلو',
    wholesaleUnit: 'جملة: كرتونة (10 كجم)',
    retailPrice: 95,
    wholesalePrice: 900,
    image: './chicken.jpg.jpg',
  },
  {
    id: 15,
    categoryId: 'poultry-fish',
    name: 'بط',
    retailUnit: 'قطاعي: كيلو',
    wholesaleUnit: 'جملة: كرتونة / بالوزن',
    retailPrice: 125,
    wholesalePrice: 0,
    image: './duck.jpg.jpg',
  },
  {
    id: 16,
    categoryId: 'poultry-fish',
    name: 'بيض',
    retailUnit: 'قطاعي: طبق (30 بيضة)',
    wholesaleUnit: 'جملة: كرتونة (6 أطباق)',
    retailPrice: 165,
    wholesalePrice: 960,
    image: './eggs.jpg.jpg',
  },
  {
    id: 17,
    categoryId: 'poultry-fish',
    name: 'أسماك مجمدة',
    retailUnit: 'قطاعي: كيلو',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 90,
    wholesalePrice: 0,
    image: './frozen-fish.jpg.jpg',
  },
  {
    id: 18,
    categoryId: 'poultry-fish',
    name: 'رنجة',
    retailUnit: 'قطاعي: كيلو',
    wholesaleUnit: 'جملة: صندوق / كرتونة',
    retailPrice: 130,
    wholesalePrice: 0,
    image: './herring.jpg.jpg',
  },
  {
    id: 19,
    categoryId: 'dairy-cheese',
    name: 'ألبان متنوعة',
    retailUnit: 'قطاعي: عبوة 1 لتر',
    wholesaleUnit: 'جملة: كرتونة (12 عبوة)',
    retailPrice: 42,
    wholesalePrice: 480,
    image: './dairy.jpg.jpg',
  },
  {
    id: 20,
    categoryId: 'dairy-cheese',
    name: 'أجبان متنوعة',
    retailUnit: 'قطاعي: عبوة / كيلو',
    wholesaleUnit: 'جملة: صفيحة / كرتونة',
    retailPrice: 85,
    wholesalePrice: 0,
    image: './cheese.jpg.jpg',
  },
  {
    id: 21,
    categoryId: 'canned-sauces',
    name: 'صلصة طماطم مركزة',
    retailUnit: 'قطاعي: برطمان / عبوة',
    wholesaleUnit: 'جملة: كرتونة 24 عبوة',
    retailPrice: 26,
    wholesalePrice: 540,
    image: './tomato-paste.jpg.jpg',
  },
  {
    id: 22,
    categoryId: 'canned-sauces',
    name: 'صوصات (كاتشب، مايونيز، مستردة، صوصات)',
    retailUnit: 'قطاعي: عبوة',
    wholesaleUnit: 'جملة: كرتونة / جركن',
    retailPrice: 48,
    wholesalePrice: 0,
    image: './sauces.jpg.jpg',
  },
  {
    id: 23,
    categoryId: 'canned-sauces',
    name: 'مربى وشوكولاتة قابلة للدهن',
    retailUnit: 'قطاعي: برطمان / عبوة',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 65,
    wholesalePrice: 0,
    image: './jam-spreads.jpg.jpg',
  },
  {
    id: 24,
    categoryId: 'beverages',
    name: 'شاي',
    retailUnit: 'قطاعي: عبوة 250 جم',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 68,
    wholesalePrice: 0,
    image: './tea.jpg.jpg',
  },
  {
    id: 25,
    categoryId: 'beverages',
    name: 'قهوة',
    retailUnit: 'قطاعي: عبوة 200 جم',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 140,
    wholesalePrice: 0,
    image: './coffee.jpg.jpg',
  },
  {
    id: 26,
    categoryId: 'beverages',
    name: 'نسكافية',
    retailUnit: 'قطاعي: باكت / عبوة',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 95,
    wholesalePrice: 0,
    image: './nescafe.jpg.jpg',
  },
  {
    id: 27,
    categoryId: 'beverages',
    name: 'عصائر ومشروبات',
    retailUnit: 'قطاعي: عبوة',
    wholesaleUnit: 'جملة: كرتونة (24 عبوة)',
    retailPrice: 15,
    wholesalePrice: 320,
    image: './juices-drinks.jpg.jpg',
  },
  {
    id: 28,
    categoryId: 'beverages',
    name: 'مياه',
    retailUnit: 'قطاعي: زجاجة كبيرة',
    wholesaleUnit: 'جملة: كرتونة (12 زجاجة)',
    retailPrice: 10,
    wholesalePrice: 95,
    image: './water.jpg.jpg',
  },
  {
    id: 29,
    categoryId: 'bakery-supplies',
    name: 'مخبوزات',
    retailUnit: 'قطاعي: عبوة / قطعة',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 35,
    wholesalePrice: 0,
    image: './bakery.jpg.jpg',
  },
  {
    id: 30,
    categoryId: 'bakery-supplies',
    name: 'بسكويت وكيك',
    retailUnit: 'قطاعي: باكت / عبوة',
    wholesaleUnit: 'جملة: كرتونة',
    retailPrice: 20,
    wholesalePrice: 0,
    image: './biscuits-cake.jpg.jpg',
  },
  {
    id: 31,
    categoryId: 'bakery-supplies',
    name: 'مستلزمات خبز (خميرة، بيكنج باودر، نشا، كاكاو)',
    retailUnit: 'قطاعي: عبوة',
    wholesaleUnit: 'جملة: كرتونة / شيكارة',
    retailPrice: 30,
    wholesalePrice: 0,
    image: './baking-supplies.jpg.jpg',
  },
  {
    id: 32,
    categoryId: 'spices-salt',
    name: 'توابل وبهارات',
    retailUnit: 'قطاعي: عبوة / وزن',
    wholesaleUnit: 'جملة: شيكارة / كرتونة',
    retailPrice: 45,
    wholesalePrice: 0,
    image: './spices.jpg.jpg',
  },
  {
    id: 33,
    categoryId: 'spices-salt',
    name: 'ملح طعام',
    retailUnit: 'قطاعي: كيس',
    wholesaleUnit: 'جملة: كرتونة (20 كيس)',
    retailPrice: 5,
    wholesalePrice: 85,
    image: './salt.jpg.jpg',
  },
  {
    id: 34,
    categoryId: 'fruits-veggies',
    name: 'فاكهة',
    retailUnit: 'قطاعي: كيلو',
    wholesaleUnit: 'جملة: قفص / كرتونة',
    retailPrice: 40,
    wholesalePrice: 0,
    image: './fruits.jpg.jpg',
  },
  {
    id: 35,
    categoryId: 'cleaning-paper',
    name: 'منظفات سائلة وكلور',
    retailUnit: 'قطاعي: عبوة 1 لتر',
    wholesaleUnit: 'جملة: جركن / كرتونة',
    retailPrice: 25,
    wholesalePrice: 0,
    image: './liquid-cleaners.jpg.jpg',
  },
  {
    id: 36,
    categoryId: 'cleaning-paper',
    name: 'مساحيق غسيل',
    retailUnit: 'قطاعي: كيس / عبوة',
    wholesaleUnit: 'جملة: شيكارة / كرتونة',
    retailPrice: 65,
    wholesalePrice: 0,
    image: './laundry-detergent.jpg.jpg',
  },
  {
    id: 37,
    categoryId: 'cleaning-paper',
    name: 'ورقيات وبلاستيكيات (مناديل، فويل، استرتش، أكياس)',
    retailUnit: 'قطاعي: رول / عبوة',
    wholesaleUnit: 'جملة: كرتونة / ربطة',
    retailPrice: 45,
    wholesalePrice: 0,
    image: './paper-wraps.jpg.jpg',
  },
];

function sanitizeCartObject(source: unknown): Record<number, number> {
  if (!source || typeof source !== 'object') return {};
  const clean: Record<number, number> = {};
  for (const [k, v] of Object.entries(source as Record<string, unknown>)) {
    const idNum = Number(k);
    const qtyNum = Number(v);
    if (!Number.isNaN(idNum) && qtyNum > 0) {
      clean[idNum] = qtyNum;
    }
  }
  return clean;
}

function loadSavedCart(): Record<number, number> {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return sanitizeCartObject(memoryCartFallback);
    const parsed = sanitizeCartObject(JSON.parse(raw));
    memoryCartFallback = parsed;
    return parsed;
  } catch {
    return sanitizeCartObject(memoryCartFallback);
  }
}

function saveCartToStorage(nextCart: Record<number, number>) {
  const clean = sanitizeCartObject(nextCart);
  memoryCartFallback = clean;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(clean));
  } catch {}
}

function savePendingOrderLocally(orderRecord: Record<string, any>) {
  try {
    const existingRaw = window.localStorage.getItem(PENDING_ORDERS_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const list = Array.isArray(existing) ? existing : [];
    list.push({
      created_at: new Date().toISOString(),
      ...orderRecord,
    });
    window.localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(list));
  } catch {}
}

const getPriceByCustomer = (product: ProductItem, customerType: CustomerType) =>
  customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

const getUnitByCustomer = (product: ProductItem, customerType: CustomerType) =>
  customerType === 'wholesale' ? product.wholesaleUnit : product.retailUnit;

export function App() {
  const [customerType, setCustomerType] = useState<CustomerType>('wholesale');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>(() => loadSavedCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState<OrderSummary | null>(null);
  const [storeName, setStoreName] = useState('زاد لينك | ZadLink');
  const [account, setAccount] = useState<Record<string, any> | null>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS);

  React.useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  React.useEffect(() => {
    zadQuery("store_settings", "select=*&limit=1")
      .then((rows) => {
        const row = Array.isArray(rows) ? rows[0] : null;
        if (!row) return;
        if (row.store_name) setStoreName(String(row.store_name));
        if (row.default_customer_type === 'retail' || row.default_customer_type === 'wholesale') {
          setCustomerType(row.default_customer_type);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    zadQuery("products", "select=*")
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const mapped: ProductItem[] = rows
          .map((r: any, idx: number) => ({
            id: Number(r.id ?? idx + 1),
            categoryId: String(r.category_id ?? r.categoryId ?? 'oils-basics'),
            name: String(r.name ?? ''),
            retailUnit: String(r.retail_unit ?? r.retailUnit ?? 'قطاعي'),
            wholesaleUnit: String(r.wholesale_unit ?? r.wholesaleUnit ?? 'جملة'),
            retailPrice: Number(r.retail_price ?? r.retailPrice ?? 0),
            wholesalePrice: Number(r.wholesale_price ?? r.wholesalePrice ?? 0),
            badge: r.badge ? String(r.badge) : undefined,
            image: String(r.image ?? './oil.png.png'),
          }))
          .filter((p) => p.name);
        if (mapped.length > 0) setProductsList(mapped);
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    zadQuery("accounts", "select=*&limit=1")
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setAccount(rows[0]);
        }
      })
      .catch(() => {});
  }, []);

  const cartEntries = useMemo(
    () =>
      Object.entries(cart)
        .map(([idStr, qty]) => {
          const idNum = Number(idStr);
          if (Number.isNaN(idNum) || qty <= 0) return null;
          const found =
            productsList.find((p) => p.id === idNum) ||
            PRODUCTS.find((p) => p.id === idNum) || {
              id: idNum,
              categoryId: 'oils-basics',
              name: `صنف رقم #${idNum}`,
              retailUnit: 'قطاعي',
              wholesaleUnit: 'جملة',
              retailPrice: 0,
              wholesalePrice: 0,
              image: './oil.png.png',
            };
          const unitPrice = getPriceByCustomer(found, customerType);
          return {
            product: found,
            qty,
            unitPrice,
            lineTotal: unitPrice * qty,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [cart, productsList, customerType]
  );

  const totalItems = useMemo(
    () => cartEntries.reduce((sum, entry) => sum + entry.qty, 0),
    [cartEntries]
  );

  const totalAmount = useMemo(
    () => cartEntries.reduce((sum, entry) => sum + entry.lineTotal, 0),
    [cartEntries]
  );

  const currentCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId]
  );

  const visibleProducts = useMemo(() => {
    const q = searchQuery.trim();
    return productsList.filter((item) => {
      const matchesCategory = q
        ? true
        : selectedCategoryId
        ? item.categoryId === selectedCategoryId
        : false;
      const matchesSearch = q
        ? item.name.includes(q) ||
          item.retailUnit.includes(q) ||
          item.wholesaleUnit.includes(q)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [productsList, selectedCategoryId, searchQuery]);

  const addToCart = (productId: number) => {
    setOrderSent(null);
    setOrderError(null);
    setCart((prev) => {
      const next = {
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      
