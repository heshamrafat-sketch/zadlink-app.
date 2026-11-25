const SUPABASE_URL = "https://asspfwcgvnveejobxrm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "Sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9";

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
  // --- زيوت وسمن وأساسيات ---
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

  // --- مجمدات ومصنعات لحوم ---
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

  // --- دواجن وبيض وأسماك ---
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

  // --- ألبان وأجبان ---
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

  // --- معلبات وصوصات ---
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

  // --- مشروبات وشاي وقهوة ---
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

  // --- مخبوزات ومستلزمات خبز ---
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

  // --- توابل وبهارات وملح ---
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

  // --- فاكهة وخضار ---
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

  // --- منظفات وورقيات ---
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
  const [orderSent, setOrderSent] = useState(false);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [idStr, qty]) => {
        const prod = PRODUCTS.find((p) => p.id === Number(idStr));
        return sum + (prod ? getPriceByCustomer(prod, customerType) * qty : 0);
      }, 0),
    [cart, customerType]
  );

  const currentCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategoryId) || null,
    [selectedCategoryId]
  );

  const visibleProducts = useMemo(() => {
    const q = searchQuery.trim();
    return PRODUCTS.filter((item) => {
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
  }, [selectedCategoryId, searchQuery]);

  const addToCart = (productId: number) => {
    setOrderSent(false);
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleCheckout = () => {
    if (totalItems === 0) return;
    setOrderSent(true);
    setCart({});
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f8f7] text-gray-900 pb-12">
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
              <div className="font-bold text-base leading-tight">زاد لينك | ZadLink</div>
              <div className="text-xs text-[#0b7a4b]">
                {customerType === 'wholesale' ? 'أسعار الجملة للتجار والمطاعم' : 'أسعار القطاعي للأفراد'}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCheckout}
            className="bg-[#0b7a4b] hover:bg-[#09633c] text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <span>الطلب ({totalItems})</span>
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
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-sm font-medium">
            تم تسجيل طلبك مبدئياً بنظام ({customerType === 'wholesale' ? 'تاجر / جملة' : 'فرد / قطاعي'}).
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

                      <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => addToCart(product.id)}
                          className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-4 py-2 rounded-xl"
                        >
                          أضف للطلب {cart[product.id] ? `(${cart[product.id]})` : ''}
                        </button>

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
                const count = PRODUCTS.filter((p) => p.categoryId === category.id).length;
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
    </div>
  );
}

export default App;
