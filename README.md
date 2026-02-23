# HRFA.MA — منصة الحرفيين المغاربة

> 🔧 منصة رقمية تربط الحرفيين المهرة بالعملاء في جميع أنحاء المغرب.

[![Live Demo](https://img.shields.io/badge/Demo-Live-orange?style=for-the-badge)](https://github.com/mohamedaitbensaid52-oss/HRFA.MA)
[![HTML](https://img.shields.io/badge/HTML5-Static-blue?style=for-the-badge&logo=html5)](https://github.com/mohamedaitbensaid52-oss/HRFA.MA)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📖 نبذة عن المشروع

**HRFA.MA** هي منصة ويب مغربية تتيح للعملاء إيجاد الحرفيين المحترفين (السباكين، الكهربائيين، الصباغين...) بكل سهولة وسرعة. المنصة تدعم اللغتين العربية والإنجليزية وتعمل على جميع الأجهزة.

---

## 🚀 المميزات الرئيسية

- 🌍 **ثنائي اللغة** — دعم كامل للعربية والإنجليزية مع تبديل فوري
- 🔍 **بحث متقدم** — البحث عن حرفيين حسب المدينة والتخصص
- 👷 **لوحة حرفي** — إدارة الطلبات والملف الشخصي والمعرض
- 📋 **لوحة عميل** — تصفح الحرفيين ومتابعة الطلبات
- 💬 **نظام تراسل** — واجهة محادثة مدمجة
- 📱 **PWA** — قابل للتثبيت كتطبيق جوال
- ♿ **Accessibility** — تباين عالي ودعم RTL كامل

---

## 📁 هيكل المشروع

```
HRFA.MA/
├── index.html                 # الصفحة الرئيسية
├── css/
│   ├── variables.css          # متغيرات الألوان والتصميم
│   └── main.css               # الأنماط الرئيسية
├── js/
│   ├── i18n.js                # نظام الترجمة (AR/EN)
│   ├── components.js          # Navbar, Sidebar, Footer
│   ├── auth.js                # تسجيل الدخول والتحقق
│   ├── ui.js                  # Toast, Skeleton, Animations
│   ├── api.js                 # طبقة Mock API
│   ├── chat.js                # منطق المحادثة
│   ├── jobs.js                # منطق الطلبات
│   ├── notifications.js       # الإشعارات
│   └── main.js                # نقطة الدخول الرئيسية
├── pages/
│   ├── client-dashboard.html  # لوحة العميل
│   ├── artisan-dashboard.html # لوحة الحرفي
│   ├── search-results.html    # نتائج البحث
│   ├── profile.html           # الملف الشخصي
│   ├── edit-profile.html      # تعديل الملف
│   ├── portfolio-management.html # إدارة الأعمال
│   ├── chat.html              # المحادثات
│   ├── request-service.html   # طلب خدمة
│   ├── jobs.html              # الطلبات
│   ├── client-register.html   # تسجيل العميل
│   ├── artisan-register.html  # تسجيل الحرفي
│   ├── client-login.html      # دخول العميل
│   ├── artisan-login.html     # دخول الحرفي
│   ├── about.html             # من نحن
│   ├── contact.html           # اتصل بنا
│   └── 404.html               # صفحة الخطأ
├── manifest.json              # PWA Manifest
└── sw.js                      # Service Worker
```

---

## 🛠️ التقنيات المستعملة

| التقنية | الاستخدام |
|---|---|
| **HTML5** | هيكل الصفحات |
| **CSS3** | التصميم والمتغيرات |
| **Vanilla JS** | المنطق والتفاعل |
| **Font Awesome** | الأيقونات |
| **Google Fonts** | Cairo (AR) · Outfit (EN) |
| **PWA** | دعم العمل بدون إنترنت |

---

## ▶️ كيفية التشغيل

```bash
# 1. استنساخ المشروع
git clone https://github.com/mohamedaitbensaid52-oss/HRFA.MA.git

# 2. فتح المجلد
cd HRFA.MA

# 3. تشغيله محلياً (باستعمال أي خادم ساكن)
npx serve .
# أو افتح ملف index.html مباشرة في المتصفح
```

---

## 📸 لقطات الشاشة

> الصفحة الرئيسية، لوحة التحكم، وصفحة نتائج البحث

---

## 📄 الترخيص

المشروع متاح تحت رخصة [MIT](LICENSE).

---

<p align="center">صُنع بـ ❤️ في المغرب 🇲🇦</p>
