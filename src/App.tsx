import React, { useState, useMemo } from 'react';

// إعدادات الاتصال بقاعدة بيانات Supabase
const SUPABASE_URL = 'https://asspfwcgvnveejobxrm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Eqym1DI9Vyp5zSliHweaRw_1cwRfIN9';

// واجهة بيانات المنتج الشامل (طعام، مستلزمات البيت، سوبر ماركت)
interface Product {
  id: number;
  name: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  unit: string;
  description: string;
  image: string;
  emoji: string;
  available: boolean;
}

type CustomerType = 'wholesale' | 'retail';

interface CartItem {
  product: Product;
  quantity: number;
}

// قائمة المنتجات المتنوعة للطعام ومستلزمات البيت والسوبر ماركت
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'أرز أبيض مصري فاخر (شكارة / عبوة)',
    category: 'بقالة وسلع أساسية',
    wholesalePrice: 26,
    retailPrice: 32,
    unit: 'كجم',
    description: 'أرز مصري نقي عريض الحبة مناسب للبيت والسوبر ماركت والتجار.',
    image: '1000250092.jpg',
    emoji: '🌾',
    available: true,
  },
  {
    id: 2,
    name: 'زيوت طعام نقية ومعلبات غذائية',
    category: 'زيوت ومعلبات',
    wholesalePrice: 68,
    retailPrice: 80,
    unit: 'عبوة',
    description: 'تشكيلة زيوت قلي وطهي ومعلبات غذائية بجودة عالية وتوريد منتظم.',
    image: '1000250093.jpg',
    emoji: '🫙',
    available: true,
  },
  {
    id: 3,
    name: 'خضروات وفواكه طازجة يومياً',
    category: 'طعام وطازج',
    wholesalePrice: 18,
    retailPrice: 24,
    unit: 'كجم',
    description: 'أصناف طازجة ومفرزة يومياً للمنازل والمطاعم ومحلات السوبر ماركت.',
    image: '1000250094.jpg',
    emoji: '🛒',
    available: true,
  },
  {
    id: 4,
    name: 'منظفات وعناية بالمنزل',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 45,
    retailPrice: 58,
    unit: 'عبوة',
    description: 'مساحيق غسيل ومطهرات ومنظفات أسطح ومستلزمات نظافة يومية للمنزل.',
    image: '1000250095.jpg',
    emoji: '🧴',
    available: true,
  },
  {
    id: 5,
    name: 'ألبان وأجبان ومخبوزات',
    category: 'ألبان ومخبوزات',
    wholesalePrice: 34,
    retailPrice: 42,
    unit: 'عبوة',
    description: 'منتجات ألبان وأجبان ومخبوزات طازجة لاحتياجات الأسرة والسوبر ماركت.',
    image: '1000250096.jpg',
    emoji: '🧀',
    available: true,
  },
  {
    id: 6,
    name: 'مستلزمات ورقية وأدوات مطبخ',
    category: 'مستلزمات البيت والمنظفات',
    wholesalePrice: 29,
    retailPrice: 38,
    unit: 'عبوة',
    description: 'مناديل ورقية، أكياس حفظ وتغليف، وأدوات منزلية عملية للاستخدام اليومي.',
    image: '1000250097.jpg',
    emoji: '🧺',
    available: true,
  },
];

// بيانات مؤشر التداول الأسبوعي للمنصة
const WEEKLY_CHART_BARS = [45, 62, 56, 78, 72, 88, 95];
const WEEK_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

/**
 * المكون الرئيسي لمنصة زاد لينك (ZadLink)
 * منصة شاملة للطعام ومستلزمات البيت والسوبر ماركت للتاجر والعميل القطاعي.
 */
export function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<CustomerType>('retail');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(PRODUCTS.map((p) => p.category)));
    return ['الكل', ...unique];
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'الكل' || product.category === selectedCategory;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery && product.available;
    });
  }, [selectedCategory, searchQuery]);

  const getUnitPrice = (product: Product) =>
    customerType === 'wholesale' ? product.wholesalePrice : product.retailPrice;

  const customerTypeLabel = customerType === 'wholesale' ? 'تاجر (جملة)' : 'عميل قطاعي';

  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () => cart.reduce((sum, item) => sum + getUnitPrice(item.product) * item.quantity, 0),
    [cart, customerType]
  );

  function showToast(message: string, isError = false) {
    setToast({ message, isError });
  }

  function handleAddToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`تمت إضافة "${product.name}" إلى سلة الطلبات`);
  }

  function updateCartQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function handleOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      showToast('يرجى إدخال اسم العميل ورقم الهاتف لإتمام الطلب', true);
      return;
    }

    const itemsSummary =
      cart.length > 0
        ? cart
            .map((item) => {
              const unitPrice = getUnitPrice(item.product);
              return `${item.product.name} (${item.quantity} ${item.product.unit} × ${unitPrice} ج.م)`;
            })
            .join(' | ')
        : 'طلب مباشر من السوبر ماركت / مستلزمات البيت';

    const combinedNotes = [
      `نوع الحساب: ${customerTypeLabel}`,
      `الأصناف: ${itemsSummary}`,
      totalCartPrice > 0 ? `الإجمالي التقديري: ${totalCartPrice} ج.م` : null,
      notes.trim() ? `ملاحظات العميل: ${notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' — ');

    setLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          notes: combinedNotes,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'تعذر تسجيل الطلب في قاعدة البيانات');
      }

      setCustomerName('');
      setPhone('');
      setNotes('');
      setCart([]);
      setIsOrderModalOpen(false);
      showToast('تم إرسال طلبك بنجاح! سيتواصل معك فريق زاد لينك قريباً.');
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء الإرسال';
      const friendlyMessage =
        rawMessage === 'Failed to fetch'
          ? 'تعذر الاتصال بخادم قاعدة البيانات حالياً. تأكد من تفعيل مشروع Supabase أو تواصل معنا مباشرة على 01224966506.'
          : rawMessage;
      showToast(`تنبيه: ${friendlyMessage}`, true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="app-shell">
      {/* الشريط العلوي */}
      <header className="topbar">
        <div className="container nav-wrap">
          <a href="#top" className="brand">
            <div className="brand-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </div>
          </a>

          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>المنتجات والأسعار</a>
            <a href="#trade" onClick={() => setMobileMenuOpen(false)}>مؤشر التداول</a>
            <a href="#steps" onClick={() => setMobileMenuOpen(false)}>آلية الطلب</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>تواصل معنا</a>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="cart-button"
              onClick={() => setIsOrderModalOpen(true)}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>سلة الطلبات</span>
              <em>{totalCartItems}</em>
            </button>

            <button
              type="button"
              className="mobile-menu"
              aria-label="القائمة"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* القسم الافتتاحي */}
      <section id="top" className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="pulse-dot" />
              زاد لينك • سوق متكامل للطعام ومستلزمات البيت والسوبر ماركت
            </div>

            <h1>
              كل احتياجات الطعام <span>ومستلزمات البيت</span> للتاجر والقطاعي
            </h1>

            <p>
              منصة زاد لينك تجمع كل ما تحتاجه الأسرة والسوبر ماركت والتجار من مواد غذائية، بقالة، منظفات، ومستلزمات منزلية بتسعير واضح وتوصيل سريع.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="primary-button"
                onClick={() => setIsOrderModalOpen(true)}
              >
                <span>سجّل طلبك الآن</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>

              <a href="#products" className="text-button">
                <span>تصفح المنتجات والأسعار</span>
              </a>
            </div>

            <div className="hero-proof">
              <div className="proof-avatars">
                <span>ز</span>
                <span>ل</span>
                <span>ك</span>
              </div>
              <div>
                <strong>خدمة التاجر والعميل القطاعي</strong>
                <small>طعام • مستلزمات بيت • سوبر ماركت</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-ring ring-a" />
            <div className="visual-ring ring-b" />

            <div className="visual-center">
              <div className="crate crate-back">
                <span style={{ fontSize: '36px' }}>🛒</span>
              </div>
              <div className="crate crate-front">
                <span style={{ fontSize: '40px' }}>🧺</span>
              </div>
              <span className="leaf leaf-one">✨</span>
              <span className="leaf leaf-two">🌿</span>
            </div>

            <div className="floating-card card-delivery">
              <div className="mini-icon">🚚</div>
              <div>
                <b>توصيل سريع للمنزل والمتجر</b>
                <small>طلب سهل ومباشر للبيت والتاجر</small>
              </div>
            </div>

            <div className="floating-card card-quality">
              <div className="quality-icon">✓</div>
              <div>
                <b>تنوع شامل وسوبر ماركت</b>
                <small>غذاء، بقالة، ومستلزمات منزلية</small>
              </div>
            </div>

            <div className="visual-label">
              <span />
              ZADLINK MARKET • WHOLESALE &amp; RETAIL
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero-stats">
            <div>
              <strong>+120</strong>
              <span>صنف غذائي ومنزلي</span>
            </div>
            <div>
              <strong>جملة + قطاعي</strong>
              <span>تسعير مرن لكل فئة</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>استقبال الطلبات يومياً</span>
            </div>
            <div>
              <strong>سريع</strong>
              <span>تجهيز وتوصيل منظم</span>
            </div>
          </div>
        </div>
      </section>

      {/* قسم المنتجات والأسعار */}
      <section id="products" className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">قائمة المنتجات — تاجر وعميل قطاعي</span>
              <h2>
                منتجات الطعام <span>ومستلزمات البيت</span>
              </h2>
              <p>اختر نوع حسابك لعرض أسعار الجملة للتجار أو الأسعار القطاعية للعملاء.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div className="customer-type-switch" role="group" aria-label="نوع العميل">
                <button
                  type="button"
                  className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
                  onClick={() => setCustomerType('wholesale')}
                >
                  تاجر (جملة)
                </button>
                <button
                  type="button"
                  className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
                  onClick={() => setCustomerType('retail')}
                >
                  عميل قطاعي
                </button>
              </div>

              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن أرز، زيوت، منظفات..."
                />
                <kbd>بحث</kbd>
              </div>
            </div>
          </div>

          <div className="category-row" role="tablist" aria-label="تصنيفات المنتجات">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const unitPrice = getUnitPrice(product);
                return (
                  <article key={product.id} className="product-card">
                    <div className="product-image">
                      <span className="availability">
                        <i />
                        متوفر بالمنصة
                      </span>
                      <div className="image-orb" />
                      <span className="product-emoji" aria-hidden="true">
                        {product.emoji}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>

                      <div className="product-bottom">
                        <div>
                          <strong>
                            {unitPrice} <small>ج.م / {product.unit}</small>
                          </strong>
                          <span>
                            {customerType === 'wholesale'
                              ? `سعر التاجر (قطاعي: ${product.retailPrice} ج.م)`
                              : `سعر العميل القطاعي (تاجر: ${product.wholesalePrice} ج.م)`}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="add-button"
                          onClick={() => handleAddToCart(product)}
                        >
                          <span>أضف للطلب</span>
                          <strong>+</strong>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <b>لا توجد منتجات مطابقة لبحثك حالياً</b>
              <span>جرّب كلمة بحث أخرى أو اختر تصنيف «الكل».</span>
            </div>
          )}

          <div className="market-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              تتوفر خيارات الشراء للتاجر بسعر الجملة وللعميل القطاعي بسعر التجزئة، مع إمكانية إضافة أي أصناف أو طلبات منزلية إضافية في نموذج الطلب.
            </span>
          </div>
        </div>
      </section>

      {/* قسم مؤشر التداول والنشاط */}
      <section id="trade" className="section trade-section">
        <div className="container">
          <div className="trade-panel">
            <div className="trade-intro">
              <span className="section-kicker">مؤشر حركة التداول والطلبات</span>
              <h2>
                بيانات حية لحركة <span>البيع والتوريد</span>
              </h2>
              <p>
                متابعة مستمرة لحركة الطلبات اليومية بين التاجر والعميل القطاعي عبر أقسام الطعام ومستلزمات البيت والسوبر ماركت.
              </p>
              <a href="#contact" className="outline-button">
                <span>تواصل لترتيب طلباتك</span>
                <span>←</span>
              </a>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <span>حجم الطلبات اليومي</span>
                  <span>📈</span>
                </div>
                <strong>+240 طلب</strong>
                <small>طلبات منزلية وتجارية يومية</small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>سرعة تجهيز السلة</span>
                  <span>⚡</span>
                </div>
                <strong>سريع</strong>
                <small>تجهيز منظم ومباشر للطلبات</small>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <span>تنوع الأصناف</span>
                  <span>🛍️</span>
                </div>
                <strong>شامل</strong>
                <small>طعام، بقالة، ومستلزمات منزلية</small>
              </div>

              <div className="metric-card metric-highlight">
                <div className="metric-top">
                  <span>نظام التسعير</span>
                  <span>🤝</span>
                </div>
                <strong>تاجر + قطاعي</strong>
                <small>أسعار واضحة لكل نوع عميل</small>
              </div>
            </div>

            <div className="trade-chart">
              <div className="chart-heading">
                <span>مؤشر النشاط الأسبوعي للمنصة</span>
                <small>آخر 7 أيام</small>
              </div>
              <div className="chart-bars">
                {WEEKLY_CHART_BARS.map((value, idx) => (
                  <span key={WEEK_DAYS[idx]} style={{ height: `${value}%` }} title={`${WEEK_DAYS[idx]}: ${value}%`} />
                ))}
              </div>
              <div className="chart-foot">
                {WEEK_DAYS.map((day) => (
                  <small key={day}>{day}</small>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم آلية الطلب */}
      <section id="steps" className="section">
        <div className="container">
          <div className="center-heading">
            <span className="section-kicker">كيف نعمل</span>
            <h2>
              ثلاث خطوات بسيطة <span>لإتمام طلبك</span>
            </h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon">🛒</div>
              <h3>اختر الأصناف والكميات</h3>
              <p>أضف منتجات الطعام ومستلزمات البيت إلى السلة أو اكتب قائمة احتياجاتك كاملة.</p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon">📋</div>
              <h3>سجّل بياناتك وتفاصيل التوصيل</h3>
              <p>أدخل اسمك ورقم هاتفك وملاحظات العنوان ليتم حفظ طلبك في النظام فوراً.</p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon">🚚</div>
              <h3>التأكيد والتوصيل</h3>
              <p>يتم مراجعة طلبك وتأكيد الأصناف والأسعار والتوصيل إلى باب منزلك أو متجرك.</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم التواصل والعنوان */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="contact-panel">
            <div className="contact-copy">
              <span className="section-kicker">التواصل والعنوان</span>
              <h2>
                تواصل مع <span>زاد لينك</span>
              </h2>
              <p>
                نسعد باستقبال طلبات العملاء القطاعي والتجار وطلبات السوبر ماركت ومستلزمات البيت على مدار الساعة.
              </p>

              <div className="contact-details">
                <a href="tel:01224966506">
                  <span>📞</span>
                  <div>
                    <small>الهاتف وخدمة العملاء</small>
                    <b dir="ltr">0122 496 6506</b>
                  </div>
                </a>

                <div>
                  <span>📍</span>
                  <div>
                    <small>العنوان</small>
                    <b>بورفؤاد — مساكن الطاقة الشمسية، بورسعيد، مصر</b>
                  </div>
                </div>

                <div>
                  <span>⏰</span>
                  <div>
                    <small>مواعيد العمل والطلبات</small>
                    <b>يومياً على مدار 24 ساعة</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-side">
              <div className="contact-side-top">
                <div className="contact-symbol">🛍️</div>
                <div className="online-label">
                  <i />
                  <span>استقبال الطلبات متاح الآن</span>
                </div>
              </div>

              <h3>اطلب كل ما تحتاجه بسهولة</h3>
              <p>اختر بين حساب تاجر أو عميل قطاعي وأرسل طلبك مباشرة عبر نموذج الطلبات.</p>

              <button
                type="button"
                className="contact-cta"
                onClick={() => setIsOrderModalOpen(true)}
              >
                <span>فتح نموذج إرسال الطلب</span>
                <span>←</span>
              </button>

              <div className="contact-pattern">
                <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* التذييل */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand footer-brand">
            <div className="brand-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
              </svg>
            </div>
            <div>
              <b>زاد لينك</b>
              <small>ZADLINK</small>
            </div>
          </div>

          <span>© {new Date().getFullYear()} زاد لينك — كل الطعام ومستلزمات البيت والسوبر ماركت. جميع الحقوق محفوظة.</span>

          <a href="#top">العودة للأعلى ↑</a>
        </div>
      </footer>

      {/* نافذة سلة الطلبات وإرسال الطلب */}
      {isOrderModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOrderModalOpen(false);
          }}
        >
          <div className="order-modal">
            <div className="modal-head">
              <div>
                <span className="section-kicker">تأكيد وإرسال الطلب</span>
                <h2>إرسال طلب جديد</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="إغلاق"
                onClick={() => setIsOrderModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="customer-type-switch modal-type-switch" role="group" aria-label="نوع العميل">
              <button
                type="button"
                className={`type-pill ${customerType === 'wholesale' ? 'active' : ''}`}
                onClick={() => setCustomerType('wholesale')}
              >
                تاجر (جملة)
              </button>
              <button
                type="button"
                className={`type-pill ${customerType === 'retail' ? 'active' : ''}`}
                onClick={() => setCustomerType('retail')}
              >
                عميل قطاعي
              </button>
            </div>

            {cart.length > 0 ? (
              <div className="cart-lines">
                {cart.map((item) => {
                  const unitPrice = getUnitPrice(item.product);
                  return (
                    <div key={item.product.id} className="cart-line">
                      <div className="cart-line-info">
                        <b>{item.product.name}</b>
                        <small>
                          {unitPrice} ج.م / {item.product.unit} ({customerTypeLabel})
                        </small>
                      </div>

                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                        >
                          -
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <strong className="cart-line-total">
                        {unitPrice * item.quantity} ج.م
                      </strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cart-empty">
                <small style={{ color: '#94a3b8' }}>
                  لم تختر أصنافاً من القائمة بعد — يمكنك كتابة الأصناف المطلوبة مباشرة في خانة الملاحظات بالأسفل.
                </small>
              </div>
            )}

            <div className="order-summary">
              <div>
                <span>📦</span>
                <span>نوع الحساب ({customerTypeLabel})</span>
              </div>
              <b>{totalCartItems} صنف</b>

              <div>
                <span>الإجمالي التقديري</span>
                <b>
                  {totalCartPrice} <small>ج.م</small>
                </b>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="order-form">
              <label>
                <span>اسم العميل أو المنشأة *</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="اكتب اسم العميل أو اسم المتجر"
                  required
                />
              </label>

              <label>
                <span>رقم الهاتف *</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </label>

              <label>
                <span>ملاحظات وتفاصيل التوصيل</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اكتب الأصناف المطلوبة أو عنوان التوصيل وأي ملاحظات إضافية"
                />
              </label>

              <span className="form-hint">
                سيتم تسجيل طلبك مباشرة في النظام والتواصل معك لتأكيد الكميات وموعد التسليم.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="primary-button submit-button"
              >
                {loading && <span className="spinner" />}
                <span>{loading ? 'جاري إرسال الطلب...' : 'تأكيد وإرسال الطلب'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* إشعار الحالة */}
      {toast && (
        <div className={`toast ${toast.isError ? 'error' : ''}`} role="status">
          <span>{toast.isError ? '⚠️' : '✅'}</span>
          <p>{toast.message}</p>
          <button type="button" onClick={() => setToast(null)} aria-label="إغلاق">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
