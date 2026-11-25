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
  if (!res.ok) throw new Error(await res.text());
  return init.method === "DELETE" ? null : res.json();
}

import React, { useMemo, useState } from 'react';

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

// 1. الأقسام الرئيسية (تظهر أولاً في واجهة المتجر)
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

// 2. المنتجات الداخلية لكل قسم (أسعار استرشادية تقريبية قابلة للتعديل)
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

const getPriceByCustomer = (product: ProductItem, customerType: CustomerType) =>
  customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

const getUnitByCustomer = (product: ProductItem, customerType: CustomerType) =>
  customerType === 'wholesale' ? product.wholesaleUnit : product.retailUnit;

export function App() {
  const [customerType, setCustomerType] = useState<CustomerType>('wholesale');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState<{
    itemsCount: number;
    total: number;
    type: CustomerType;
    savedLocally?: boolean;
    reason?: string;
  } | null>(null);
  const [storeName, setStoreName] = useState('زاد لينك | ZadLink');
  const [account, setAccount] = useState<Record<string, any> | null>(null);
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS);

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
          const product = productsList.find((p) => p.id === Number(idStr));
          if (!product || qty <= 0) return null;
          const unitPrice = getPriceByCustomer(product, customerType);
          return {
            product,
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
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const updateCartQty = (productId: number, nextQty: number) => {
    setOrderError(null);
    setCart((prev) => {
      const copy = { ...prev };
      if (nextQty <= 0) {
        delete copy[productId];
      } else {
        copy[productId] = nextQty;
      }
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
    setOrderError(null);
  };

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cartEntries.length === 0 || submittingOrder) return;

    setSubmittingOrder(true);
    setOrderError(null);

    const orderItems = cartEntries.map(({ product, qty, unitPrice }) => ({
      product_id: product.id,
      name: product.name,
      qty,
      unit_price: unitPrice,
    }));

    const payload: Record<string, any> = {
      customer_type: customerType,
      customer_name: customerName.trim() || null,
      customer_phone: customerPhone.trim() || null,
      notes: orderNotes.trim() || null,
      total_amount: totalAmount,
      items_count: totalItems,
      items: orderItems,
    };

    if (account?.id !== undefined && account?.id !== null) {
      payload.account_id = account.id;
    }

    const summary = {
      itemsCount: totalItems,
      total: totalAmount,
      type: customerType,
    };

    try {
      await zadQuery("orders", "", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCart({});
      setCustomerNotes('');
      setCartOpen(false);
      setOrderSent(summary);
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : 'Failed to fetch';
      try {
        const existing = JSON.parse(localStorage.getItem('zadlink_pending_orders') || '[]');
        existing.push({
          created_at: new Date().toISOString(),
          ...payload,
        });
        localStorage.setItem('zadlink_pending_orders', JSON.stringify(existing));
      } catch {}

      setCart({});
      setCustomerNotes('');
      setCartOpen(false);
      setOrderSent({
        ...summary,
        savedLocally: true,
        reason: msg,
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f8f7] text-gray-900 pb-14">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId(null);
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 text-right"
          >
            <span className="w-10 h-10 rounded-xl bg-[#0b7a4b] text-white font-bold text-xl flex items-center justify-center">
              ز
            </span>
            <div>
              <div className="font-bold text-base leading-tight">{storeName}</div>
              <div className="text-xs text-[#0b7a4b]">
                {customerType === 'wholesale' ? 'أسعار الجملة للتجار والمطاعم' : 'أسعار القطاعي للأفراد'}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setOrderError(null);
              setCartOpen(true);
            }}
            className="bg-[#0b7a4b] hover:bg-[#09633c] text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shrink-0"
          >
            <span>السلة والطلب ({totalItems})</span>
            {totalAmount > 0 && <span>• {totalAmount} ج.م</span>}
          </button>
        </div>

        <div className="max-w-4xl mx-auto mt-3 flex flex-col sm:flex-row gap-2.5">
          <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1 border border-gray-200 shrink-0">
            <button
              type="button"
              onClick={() => setCustomerType('wholesale')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                customerType === 'wholesale'
                  ? 'bg-[#0b7a4b] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              تاجر (جملة)
            </button>
            <button
              type="button"
              onClick={() => setCustomerType('retail')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                customerType === 'retail'
                  ? 'bg-[#0b7a4b] text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              فرد (قطاعي)
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتج أو عبوة..."
            className="flex-1 rounded-xl border border-gray-300 bg-[#f9fbfa] px-4 py-2 text-sm focus:outline-none focus:border-[#0b7a4b]"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-5">
        {orderSent && (
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-sm flex items-center justify-between gap-3">
            <div>
              <div className="font-bold">
                {orderSent.savedLocally
                  ? 'تم تسجيل طلبك وحفظه مؤقتاً على الجهاز!'
                  : 'تم إرسال طلبك بنجاح إلى قاعدة البيانات!'}
              </div>
              <div className="text-xs mt-0.5">
                عدد الأصناف: {orderSent.itemsCount} • الإجمالي: {orderSent.total} ج.م • النظام:{' '}
                {orderSent.type === 'wholesale' ? 'تاجر (جملة)' : 'فرد (قطاعي)'}
              </div>
              {orderSent.savedLocally && orderSent.reason && (
                <div className="text-[11px] text-amber-800 mt-1">
                  ملاحظة اتصال السيرفر: {orderSent.reason}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOrderSent(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
            >
              إغلاق
            </button>
          </div>
        )}

        {searchQuery.trim() || selectedCategoryId ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {searchQuery.trim()
                    ? `نتائج البحث عن: "${searchQuery.trim()}"`
                    : currentCategory?.title}
                </h1>
                {!searchQuery.trim() && currentCategory && (
                  <p className="text-xs text-gray-500 mt-0.5">{currentCategory.subtitle}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSearchQuery('');
                }}
                className="rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
              >
                ← الأقسام الرئيسية
              </button>
            </div>

            {visibleProducts.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">
                لا توجد منتجات مطابقة حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visibleProducts.map((product) => {
                  const activePrice = getPriceByCustomer(product, customerType);
                  const activeUnit = getUnitByCustomer(product, customerType);
                  const secondaryPrice =
                    customerType === 'wholesale' ? product.retailPrice : product.wholesalePrice;
                  const qtyInCart = cart[product.id] || 0;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 w-full bg-gray-100 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs text-gray-500">
                              {CATEGORIES.find((c) => c.id === product.categoryId)?.title}
                            </span>
                            {product.badge && (
                              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <h2 className="font-bold text-base text-gray-900">{product.name}</h2>
                          <p className="text-xs text-gray-700 mt-1 font-medium">{activeUnit}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {customerType === 'wholesale'
                              ? `القطاعي: ${secondaryPrice > 0 ? `${secondaryPrice} ج.م` : 'حسب السعر'}`
                              : `الجملة: ${secondaryPrice > 0 ? `${secondaryPrice} ج.م` : 'حسب السعر'}`}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-gray-100">
                        {qtyInCart > 0 ? (
                          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, qtyInCart + 1)}
                              className="w-8 h-8 rounded-lg bg-[#0b7a4b] text-white font-bold text-base leading-none"
                            >
                              +
                            </button>
                            <span className="min-w-6 text-center text-sm font-bold">{qtyInCart}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, qtyInCart - 1)}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-300 text-gray-800 font-bold text-base leading-none"
                            >
                              -
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl"
                          >
                            أضف للطلب
                          </button>
                        )}

                        <div className="font-bold text-base text-gray-900">
                          {activePrice > 0 ? `${activePrice} ج.م` : 'حسب السعر'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-gray-900">الأقسام الرئيسية</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                اختر القسم لاستعراض المنتجات المتاحة بالأسعار والعبوات ({customerType === 'wholesale' ? 'جملة' : 'قطاعي'})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((category) => {
                const count = productsList.filter((p) => p.categoryId === category.id).length;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="group text-right bg-white rounded-2xl border border-gray-200 hover:border-[#0b7a4b] overflow-hidden shadow-xs transition"
                  >
                    <div className="h-44 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-200"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="font-bold text-base text-gray-900">{category.title}</h2>
                        <span className="text-xs font-semibold bg-emerald-50 text-[#0b7a4b] px-2.5 py-1 rounded-full">
                          {count} صنف
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{category.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* نافذة السلة وإتمام عملية الشراء */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3.5">
                <div>
                  <h2 className="font-bold text-lg text-gray-900">سلة الطلب وإتمام الشراء</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    النظام الحالي: {customerType === 'wholesale' ? 'تاجر (جملة)' : 'فرد (قطاعي)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  إغلاق ✕
                </button>
              </div>

              {cartEntries.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  السلة فارغة حالياً. اختر قسماً وأضف المنتجات التي تريد طلبها.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {cartEntries.map(({ product, qty, unitPrice, lineTotal }) => (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-gray-200 p-3 flex items-center justify-between gap-3 bg-[#f9fbfa]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-gray-900 truncate">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {getUnitByCustomer(product, customerType)} • {unitPrice} ج.م
                        </div>
                        <div className="text-xs font-bold text-[#0b7a4b] mt-1">
                          الإجمالي: {lineTotal} ج.م
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, qty + 1)}
                          className="w-7 h-7 rounded-lg bg-[#0b7a4b] text-white font-bold text-sm"
                        >
                          +
                        </button>
                        <span className="min-w-5 text-center text-xs font-bold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, qty - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 text-gray-800 font-bold text-sm"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      تفريغ السلة
                    </button>
                    <div className="text-sm font-bold text-gray-900">
                      إجمالي الطلب ({totalItems} عنصر): {totalAmount} ج.م
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cartEntries.length > 0 && (
              <form onSubmit={handleCheckout} className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    الاسم / اسم المنشأة
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: مطعم البركة أو أ/ محمد"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#0b7a4b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    رقم الهاتف / واتساب
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#0b7a4b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ملاحظات التوصيل
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="العنوان أو موعد الاستلام..."
                    className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm focus:outline-none focus:border-[#0b7a4b]"
                  />
                </div>

                {orderError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                    {orderError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full bg-[#0b7a4b] hover:bg-[#09633c] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition"
                >
                  {submittingOrder
                    ? 'جاري إتمام عملية الشراء...'
                    : `إتمام عملية الشراء (${totalAmount} ج.م)`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
