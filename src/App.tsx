import React, { useMemo, useState } from 'react';

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
  unit: string;
  price: number;
  badge?: string;
  image: string;
}

// 1. الأقسام الرئيسية (تظهر أولاً في واجهة المتجر)
const CATEGORIES: CategoryItem[] = [
  {
    id: 'oil-basics',
    title: 'زيوت وسمن وأساسيات',
    subtitle: 'زيوت، سمن، أرز، مكرونة، دقيق، سكر، طحينة، عسل، خل',
    image: './oil.jpg.jpg',
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

// 2. المنتجات الداخلية لكل قسم (تظهر عند الضغط على القسم، ويمكن إضافة أسعار كل منتج هنا)
const PRODUCTS: ProductItem[] = [
  // --- زيوت وسمن وأساسيات ---
  {
    id: 1,
    categoryId: 'oils-basics',
    name: 'زيت طعام نقي',
    unit: 'العبوة: جركن 18 لتر',
    price: 1280,
    badge: 'عرض مميز',
    image: './oils-ghee.jpg.jpg',
  },
  {
    id: 2,
    categoryId: 'oils-basics',
    name: 'دقيق فاخر للمخبوزات والحلويات',
    unit: 'العبوة: شيكارة 25 كجم',
    price: 620,
    image: './flour.jpg.jpg',
  },
  {
    id: 3,
    categoryId: 'oils-basics',
    name: 'أرز',
    unit: 'العبوة: شيكارة',
    price: 0,
    badge: 'الأكثر طلباً',
    image: './rice.jpg.jpg',
  },
  {
    id: 4,
    categoryId: 'oils-basics',
    name: 'مكرونات',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './pasta.jpg.jpg',
  },
  {
    id: 5,
    categoryId: 'oils-basics',
    name: 'سكر',
    unit: 'العبوة: شيكارة',
    price: 0,
    image: './sugar.jpg.jpg',
  },
  {
    id: 6,
    categoryId: 'oils-basics',
    name: 'طحينة',
    unit: 'العبوة: جركن / عبوة',
    price: 0,
    image: './tahini.jpg.jpg',
  },
  {
    id: 7,
    categoryId: 'oils-basics',
    name: 'عسل نحل',
    unit: 'العبوة: عبوة / كرتونة',
    price: 0,
    image: './honey.jpg.jpg',
  },
  {
    id: 8,
    categoryId: 'oils-basics',
    name: 'عسل أسود',
    unit: 'العبوة: جركن / عبوة',
    price: 0,
    image: './molasses.jpg.jpg',
  },
  {
    id: 9,
    categoryId: 'oils-basics',
    name: 'خل أبيض',
    unit: 'العبوة: جركن / كرتونة',
    price: 0,
    image: './vinegar.jpg.jpg',
  },

  // --- مجمدات ومصنعات لحوم ---
  {
    id: 10,
    categoryId: 'frozen-meats',
    name: 'مصنعات لحوم (برجر، سجق، كبدة، كفتة، لحم مفروم)',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './processed-meats.jpg.jpg',
  },
  {
    id: 11,
    categoryId: 'frozen-meats',
    name: 'بطاطس نصف مقلية',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './frozen-fries.jpg.jpg',
  },
  {
    id: 12,
    categoryId: 'frozen-meats',
    name: 'خضروات مجمدة',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './frozen-veggies.jpg.jpg',
  },
  {
    id: 13,
    categoryId: 'frozen-meats',
    name: 'مثلجات',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './ice-cream.jpg.jpg',
  },

  // --- دواجن وبيض وأسماك ---
  {
    id: 14,
    categoryId: 'poultry-fish',
    name: 'فراخ',
    unit: 'العبوة: كرتونة / بالوزن',
    price: 0,
    image: './chicken.jpg.jpg',
  },
  {
    id: 15,
    categoryId: 'poultry-fish',
    name: 'بط',
    unit: 'العبوة: كرتونة / بالوزن',
    price: 0,
    image: './duck.jpg.jpg',
  },
  {
    id: 16,
    categoryId: 'poultry-fish',
    name: 'بيض',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './eggs.jpg.jpg',
  },
  {
    id: 17,
    categoryId: 'poultry-fish',
    name: 'أسماك مجمدة',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './frozen-fish.jpg.jpg',
  },
  {
    id: 18,
    categoryId: 'poultry-fish',
    name: 'رنجة',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './herring.jpg.jpg',
  },

  // --- ألبان وأجبان ---
  {
    id: 19,
    categoryId: 'dairy-cheese',
    name: 'ألبان متنوعة',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './dairy.jpg.jpg',
  },
  {
    id: 20,
    categoryId: 'dairy-cheese',
    name: 'أجبان متنوعة',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './cheese.jpg.jpg',
  },

  // --- معلبات وصوصات ---
  {
    id: 21,
    categoryId: 'canned-sauces',
    name: 'صلصة طماطم مركزة',
    unit: 'العبوة: كرتونة 24 عبوة',
    price: 540,
    image: './tomato-paste.jpg.jpg',
  },
  {
    id: 22,
    categoryId: 'canned-sauces',
    name: 'صوصات (كاتشب، مايونيز، مستردة، صوصات)',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './sauces.jpg.jpg',
  },
  {
    id: 23,
    categoryId: 'canned-sauces',
    name: 'مربى وشوكولاتة قابلة للدهن',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './jam-spreads.jpg.jpg',
  },

  // --- مشروبات وشاي وقهوة ---
  {
    id: 24,
    categoryId: 'beverages',
    name: 'شاي',
    unit: 'العبوة: كرتونة / عبوة',
    price: 0,
    image: './tea.jpg.jpg',
  },
  {
    id: 25,
    categoryId: 'beverages',
    name: 'قهوة',
    unit: 'العبوة: كرتونة / عبوة',
    price: 0,
    image: './coffee.jpg.jpg',
  },
  {
    id: 26,
    categoryId: 'beverages',
    name: 'نسكافية',
    unit: 'العبوة: كرتونة / عبوة',
    price: 0,
    image: './nescafe.jpg.jpg',
  },
  {
    id: 27,
    categoryId: 'beverages',
    name: 'عصائر ومشروبات',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './juices-drinks.jpg.jpg',
  },
  {
    id: 28,
    categoryId: 'beverages',
    name: 'مياه',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './water.jpg.jpg',
  },

  // --- مخبوزات ومستلزمات خبز ---
  {
    id: 29,
    categoryId: 'bakery-supplies',
    name: 'مخبوزات',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './bakery.jpg.jpg',
  },
  {
    id: 30,
    categoryId: 'bakery-supplies',
    name: 'بسكويت وكيك',
    unit: 'العبوة: كرتونة',
    price: 0,
    image: './biscuits-cake.jpg.jpg',
  },
  {
    id: 31,
    categoryId: 'bakery-supplies',
    name: 'مستلزمات خبز (خميرة، بيكنج باودر، نشا، كاكاو)',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './baking-supplies.jpg.jpg',
  },

  // --- توابل وبهارات وملح ---
  {
    id: 32,
    categoryId: 'spices-salt',
    name: 'توابل وبهارات',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './spices.jpg.jpg',
  },
  {
    id: 33,
    categoryId: 'spices-salt',
    name: 'ملح طعام',
    unit: 'العبوة: كرتونة / شيكارة',
    price: 0,
    image: './salt.jpg.jpg',
  },

  // --- فاكهة وخضار ---
  {
    id: 34,
    categoryId: 'fruits-veggies',
    name: 'فاكهة',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './fruits.jpg.jpg',
  },

  // --- منظفات وورقيات ---
  {
    id: 35,
    categoryId: 'cleaning-paper',
    name: 'منظفات سائلة وكلور',
    unit: 'العبوة: جركن / عبوة',
    price: 0,
    image: './liquid-cleaners.jpg.jpg',
  },
  {
    id: 36,
    categoryId: 'cleaning-paper',
    name: 'مساحيق غسيل',
    unit: 'العبوة: شيكارة / كرتونة',
    price: 0,
    image: './laundry-detergent.jpg.jpg',
  },
  {
    id: 37,
    categoryId: 'cleaning-paper',
    name: 'ورقيات وبلاستيكيات (مناديل، فويل، استرتش، أكياس)',
    unit: 'العبوة: حسب الصنف',
    price: 0,
    image: './paper-wraps.jpg.jpg',
  },
];

export function App() {
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
        return sum + (prod ? prod.price * qty : 0);
      }, 0),
    [cart]
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
      const matchesSearch = q ? item.name.includes(q) || item.unit.includes(q) : true;
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
              <div className="text-xs text-[#0b7a4b]">توريد غذائي وتوزيع جملة</div>
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

        <div className="max-w-4xl mx-auto mt-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتج أو عبوة..."
            className="w-full rounded-xl border border-gray-300 bg-[#f9fbfa] px-4 py-2 text-sm focus:outline-none focus:border-[#0b7a4b]"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-5">
        {orderSent && (
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-sm font-medium">
            تم تسجيل طلبك مبدئياً بنجاح.
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
                {visibleProducts.map((product) => (
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
                        <p className="text-xs text-gray-600 mt-1">{product.unit}</p>
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
                        {product.price > 0 ? `${product.price} ج.م` : 'حسب السعر'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-gray-900">الأقسام الرئيسية</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                اختر القسم لاستعراض المنتجات المتاحة بالأسعار والعبوات
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
