import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const SUGGESTIONS_FR = ['Voir les produits', 'Prix & livraison', 'Configurateur', 'Paiement', 'Contact', 'Certifications'];
const SUGGESTIONS_EN = ['Our products', 'Prices & shipping', 'Configurator', 'Payment', 'Contact us', 'Certifications'];
const SUGGESTIONS_AR = ['منتجاتنا', 'الأسعار والتوصيل', 'المُهيِّئ', 'الدفع', 'تواصل معنا', 'الشهادات'];

const WELCOME_FR = "Bonjour ! 🫒 Je suis l'assistant **Domaine Fendri**.\nPosez-moi vos questions sur nos produits, livraisons ou le configurateur.";
const WELCOME_EN = "Hello! 🫒 I'm the **Domaine Fendri** assistant.\nAsk me anything about our products, delivery or the configurator.";
const WELCOME_AR = "أهلاً وسهلاً! 🫒 أنا مساعد **دومين فندري**.\nاسألني عن منتجاتنا أو التوصيل أو المُهيِّئ.";

type Lang = 'fr' | 'en' | 'ar';

function getLang(i18nLang: string): Lang {
  if (i18nLang?.startsWith('en')) return 'en';
  if (i18nLang?.startsWith('ar')) return 'ar';
  return 'fr';
}

function getResponse(input: string, lang: Lang): string {
  const q = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (lang === 'ar') {
    if (/مرحب|اهلا|سلام|صباح|مساء|هاي/.test(input))
      return "أهلاً بك في **دومين فندري** 🫒\nأنا مساعدك الشخصي. كيف يمكنني مساعدتك اليوم؟";

    if (/منتج|زيت|زيتون|مجموعة|زجاجة|علبة|قنينة/.test(input))
      return `تشمل مجموعتنا **4 منتجات** :\n\n🟢 **علبة خضراء 1 لتر — بيو** · 28 دينار\nمعتمدة عضوياً، بدون مبيدات.\n\n✨ **زجاجة اسطوانية 500 مل** · 18 دينار\nالأكثر مبيعاً — أناقة يومية.\n\n🏆 **زجاجة مربعة 750 مل بريميوم** · 42 دينار\nTOP 100 EVOOLEUM — شريحة الفخامة.\n\n🥫 **علبة معدنية 3 لتر عائلية** · 68 دينار\nحماية مثالية، اقتصادية، طويلة الأمد.\n\nزوروا صفحة **Our Oils** للتفاصيل.`;

    if (/سعر|ثمن|تكلفة|دينار|كم/.test(input))
      return `أسعارنا :\n\n• علبة خضراء 1 لتر بيو → **28 دت**\n• زجاجة اسطوانية 500 مل → **18 دت**\n• زجاجة مربعة 750 مل بريميوم → **42 دت**\n• علبة معدنية 3 لتر عائلية → **68 دت**\n\nجميع الأسعار بالدينار التونسي (دت) وتشمل الضريبة.`;

    if (/توصيل|شحن|تسليم|دولة|منطقة/.test(input))
      return `رسوم التوصيل حسب الوجهة :\n\n🇹🇳 **تونس** → 7 دت\n🌍 **الدول العربية** → 25 دت\n🇪🇺 **أوروبا** → 35 دت\n🌐 **الدولي** → 50 دت\n\nيتم الشحن من صفاقس، تونس.`;

    if (/مهيئ|تخصيص|ملصق|تغليف|نموذج|شخصي/.test(input))
      return `يتيح لك **المُهيِّئ التفاعلي** تصميم زجاجة مخصصة 100% في 6 خطوات :\n\n1️⃣ اختيار النموذج\n2️⃣ الحجم\n3️⃣ تصميم الملصق\n4️⃣ نوع التغليف\n5️⃣ نص مخصص\n6️⃣ ملخص وعرض سعر\n\nادخل إليه عبر قسم **Collection** في القائمة.`;

    if (/دفع|بطاقة|كونيكت|بايبال|نقداً|كلك|سداد/.test(input))
      return `نقبل عدة طرق للدفع :\n\n💵 **الدفع عند الاستلام** (COD)\n💳 **بطاقة بنكية** عبر Stripe\n🔵 **Konnect** (دفع إلكتروني بالدينار)\n🅿️ **PayPal**\n📱 **Click to Pay** (SMT)\n\nجميع المدفوعات آمنة ومشفرة.`;

    if (/تواصل|رسالة|بريد|هاتف|واتساب|اتصال/.test(input))
      return `يمكنك التواصل معنا عبر :\n\n📝 **نموذج الاتصال** على موقعنا (قسم Contact)\n📧 **yassminehsin040@gmail.com**\n📍 **دومين فندري**، مكنين، صفاقس، تونس\n\nنرد خلال **24 إلى 48 ساعة**.`;

    if (/شهادة|عضوي|جائزة|تكريم|بيول|ايفوليوم|فلوس اولي|سيكيف|سولاناس/.test(input))
      return `**دومين فندري** حائز على جوائز دولية :\n\n🥇 ميدالية ذهبية — BIOL International (إيطاليا، 2016)\n🏅 نهائي IOC Mario Solinas 2018–2020\n📖 Flos Olei — 8 إشارات متتالية\n🌍 TOP 100 EVOOLEUM Guide\n🥈 Gourmet d'Argent — AVPA Paris (2015)\n✅ شهادة جودة SIQEV مدريد (2023)\n\nمعتمد **زراعة عضوية — الاتحاد الأوروبي وتونس**.`;

    if (/مخزون|متوفر|نفد|كمية/.test(input))
      return `حالة المخزون الحالية :\n\n🟢 علبة خضراء 1 لتر بيو — **متوفر** (150 وحدة)\n🟢 زجاجة 500 مل — **متوفر** (300 وحدة)\n🟡 زجاجة 750 مل بريميوم — **كمية محدودة** (12 وحدة)\n🟡 علبة 3 لتر عائلية — **كمية محدودة** (30 وحدة)\n\nاطلب زجاجة 750 مل سريعاً!`;

    if (/طلب|اشتر|سلة|شراء/.test(input))
      return `لإتمام الطلب :\n\n1. انتقل إلى **Our Oils**\n2. اختر المنتج\n3. حدد الكمية\n4. انقر **أضف إلى السلة**\n5. أدخل معلومات التوصيل\n6. اختر طريقة الدفع\n\nيمكنك الطلب **بدون إنشاء حساب**!`;

    if (/حساب|تسجيل|دخول|ملف شخصي/.test(input))
      return `يمكنك :\n\n👤 **الطلب كزائر** بدون حساب\n📝 **إنشاء حساب** لمتابعة طلباتك\n🔐 **تسجيل الدخول** عبر زر "Sign up" في أعلى اليمين\n\nحسابك يمنحك الوصول إلى سجل الطلبات وقائمة الأمنيات.`;

    if (/اصل|صفاقس|تونس|شملالي|مكنين|تاريخ|عائلة|قرن/.test(input))
      return `**دومين فندري** — أكثر من قرن من الخبرة.\n\n📍 مكنين، صفاقس، تونس\n🫒 الصنف : **شملالي صفاقسي**\n❄️ عصر بارد < 27 درجة مئوية\n👨‍👩‍👧‍👦 ثلاثة أجيال من شغف الزيتون\n🌿 صفر مبيدات — 100% طبيعي\n\nمزارعنا معتمدة منذ 2024.`;

    if (/مواصفات|حموضة|بوليفينول|فني/.test(input))
      return `المواصفات الفنية :\n\n• **علبة 1 لتر بيو** : حموضة ≤ 0.3% · بوليفينول 350 ملغ/كغ\n• **زجاجة 500 مل** : حموضة ≤ 0.4% · بوليفينول 280 ملغ/كغ\n• **زجاجة 750 مل** : حموضة ≤ 0.2% · بوليفينول 420 ملغ/كغ\n• **علبة 3 لتر** : حموضة ≤ 0.5% · بوليفينول 250 ملغ/كغ\n\nموسم الحصاد : أكتوبر – نوفمبر 2024`;

    if (/شكرا|ممتاز|رائع|حسنا|تمام/.test(input))
      return `بكل سرور! 🫒\nلا تتردد في طرح أي سؤال آخر. استمتع بمنتجات **دومين فندري**!`;

    if (/مع السلامة|وداعاً|باي/.test(input))
      return `إلى اللقاء! 👋\nشكراً لزيارتك **دومين فندري**. يوم سعيد!`;

    return `لم أفهم سؤالك جيداً 😊\n\nيمكنك سؤالي عن :\n• **المنتجات** والـ**أسعار**\n• **التوصيل**\n• **المُهيِّئ**\n• طرق **الدفع**\n• **شهاداتنا**\n• كيفية **التواصل** معنا`;
  }

  if (lang === 'en') {
    if (/hello|hi\b|hey|good\s*(morning|evening|afternoon)|bonjour|salut|salam/.test(q))
      return "Welcome to **Domaine Fendri** 🫒\nI'm your personal assistant. How can I help you today?";

    if (/product|oil|collection|bottle|range|bidon/.test(q))
      return `Our collection includes **4 references** :\n\n🟢 **Green Bio Can 1L** · 28 TND\nCertified organic, zero pesticides.\n\n✨ **Cylindrical Bottle 500ml** · 18 TND\nBest-seller — elegant everyday format.\n\n🏆 **Square Bottle 750ml Premium** · 42 TND\nTOP 100 EVOOLEUM — prestige segment.\n\n🥫 **Metal Can 3L Family** · 68 TND\nOptimal protection, economical, long-lasting.\n\nVisit the **Our Oils** page for full details.`;

    if (/price|cost|how much|tnd|dinar|tariff/.test(q))
      return `Our prices :\n\n• Green Bio Can 1L → **28 TND**\n• Cylindrical Bottle 500ml → **18 TND**\n• Square Bottle 750ml Premium → **42 TND**\n• Metal Can 3L Family → **68 TND**\n\nAll prices are in Tunisian Dinars (TND) and include VAT.`;

    if (/deliver|shipping|freight|zone|country|transport/.test(q))
      return `Shipping fees by destination :\n\n🇹🇳 **Tunisia** → 7 TND\n🌍 **Arab countries** → 25 TND\n🇪🇺 **Europe** → 35 TND\n🌐 **International** → 50 TND\n\nShipping is handled from Sfax, Tunisia.`;

    if (/configur|custom|label|packaging|model|personali/.test(q))
      return `Our **interactive configurator** lets you design a 100% custom bottle in 6 steps :\n\n1️⃣ Choose the model\n2️⃣ Select volume\n3️⃣ Label design\n4️⃣ Packaging type\n5️⃣ Custom text\n6️⃣ Summary & quote\n\nAccess it via the **Collection** section in the menu.`;

    if (/payment|pay|card|cod|stripe|konnect|paypal|click to pay/.test(q))
      return `We accept several payment methods :\n\n💵 **Cash on delivery** (COD)\n💳 **Credit card** via Stripe\n🔵 **Konnect** (online TND payment)\n🅿️ **PayPal**\n📱 **Click to Pay** (SMT)\n\nAll payments are secure and encrypted.`;

    if (/contact|message|email|phone|reach|whatsapp/.test(q))
      return `You can reach us via :\n\n📝 **Contact form** on our website (Contact section)\n📧 **yassminehsin040@gmail.com**\n📍 **Domaine Fendri**, Meknessi, Sfax, Tunisia\n\nWe respond within **24 to 48 hours**.`;

    if (/certif|organic|bio|label|award|biol|evooleum|flos olei|siqev|solinas|recognition/.test(q))
      return `Domaine Fendri is **internationally awarded** :\n\n🥇 Gold Medal — BIOL International (Italy, 2016)\n🏅 IOC Mario Solinas Finalist 2018–2020\n📖 Flos Olei — 8 consecutive mentions\n🌍 TOP 100 EVOOLEUM Guide\n🥈 Gourmet d'Argent — AVPA Paris (2015)\n✅ SIQEV Quality Label Madrid (2023)\n\nCertified **Organic Agriculture EU & Tunisia**.`;

    if (/stock|available|availab|out of stock|sold out/.test(q))
      return `Current stock status :\n\n🟢 Green Bio Can 1L — **In stock** (150 units)\n🟢 Cylindrical Bottle 500ml — **In stock** (300 units)\n🟡 Square Bottle 750ml Premium — **Low stock** (12 units)\n🟡 Metal Can 3L Family — **Low stock** (30 units)\n\nOrder the 750ml quickly before it runs out!`;

    if (/order|buy|purchase|cart|basket/.test(q))
      return `To place an order :\n\n1. Go to **Our Oils**\n2. Select a product\n3. Choose the quantity\n4. Click **Add to cart**\n5. Enter your delivery information\n6. Choose your payment method\n\nYou can order **without creating an account**!`;

    if (/account|login|register|sign up|sign in|profile/.test(q))
      return `You can :\n\n👤 **Order as a guest** without an account\n📝 **Create an account** to track your orders\n🔐 **Sign in** via the "Sign up" button at the top right\n\nYour account gives you access to order history and your wishlist.`;

    if (/origin|sfax|tunisia|chemlali|meknessi|domain|history|family|century/.test(q))
      return `**Domaine Fendri** — over a century of expertise.\n\n📍 Meknessi, Sfax, Tunisia\n🫒 Cultivar : **Chemlali de Sfax**\n❄️ Cold extraction < 27°C\n👨‍👩‍👧‍👦 Three generations of olive passion\n🌿 Zero pesticides — 100% natural\n\nOur groves have been certified since 2024.`;

    if (/spec|acid|polyphenol|technical|oleic/.test(q))
      return `Technical specifications :\n\n• **Bio Can 1L** : acidity ≤ 0.3% · polyphenols 350 mg/kg\n• **Bottle 500ml** : acidity ≤ 0.4% · polyphenols 280 mg/kg\n• **Bottle 750ml** : acidity ≤ 0.2% · polyphenols 420 mg/kg\n• **Can 3L** : acidity ≤ 0.5% · polyphenols 250 mg/kg\n\nHarvest : October–November 2024`;

    if (/thank|perfect|great|awesome|nice|good|ok\b/.test(q))
      return `You're welcome! 🫒\nFeel free to ask if you have more questions. Enjoy **Domaine Fendri**!`;

    if (/bye|goodbye|see you|ciao/.test(q))
      return `Goodbye! 👋\nThank you for visiting **Domaine Fendri**. Have a great day!`;

    return `I didn't quite understand your question 😊\n\nYou can ask me about :\n• Our **products** & **prices**\n• **Shipping**\n• The **configurator**\n• **Payment** methods\n• Our **certifications**\n• How to **contact** us`;
  }

  // French (default)
  if (/bonjour|salut|salam|hello|hi\b|bonsoir/.test(q))
    return "Bienvenue chez **Domaine Fendri** 🫒\nJe suis votre assistant personnel. Comment puis-je vous aider aujourd'hui ?";

  if (/produit|huile|collection|gamme|bouteille|bidon/.test(q))
    return `Notre collection comprend **4 références** :\n\n🟢 **Bidon vert 1L — Bio** · 28 TND\nCertifié agriculture biologique, zéro pesticide.\n\n✨ **Bouteille cylindrique 500ml** · 18 TND\nBest-seller — format quotidien raffiné.\n\n🏆 **Bouteille carrée 750ml Premium** · 42 TND\nTOP 100 EVOOLEUM — segment prestige.\n\n🥫 **Bidon métallique 3L Familial** · 68 TND\nProtection optimale, économique, longue durée.\n\nVisitez la page **Our Oils** pour les détails.`;

  if (/prix|tarif|cout|combien|tnd|dinar/.test(q))
    return `Voici nos prix :\n\n• Bidon vert 1L Bio → **28 TND**\n• Bouteille cylindrique 500ml → **18 TND**\n• Bouteille carrée 750ml Premium → **42 TND**\n• Bidon métallique 3L Familial → **68 TND**\n\nTous nos prix sont en dinars tunisiens (TND) et incluent la TVA.`;

  if (/livraison|expedition|expedi|frais|zone|pays|transport|shipping/.test(q))
    return `Frais de livraison selon votre pays :\n\n🇹🇳 **Tunisie** → 7 TND\n🌍 **Pays arabes** → 25 TND\n🇪🇺 **Europe** → 35 TND\n🌐 **International** → 50 TND\n\nLa livraison est assurée depuis Sfax, Tunisie.`;

  if (/configur|devis|personnalis|etiquette|emballage|model|bouteille perso/.test(q))
    return `Le **configurateur interactif** vous permet de créer une bouteille 100% personnalisée en 6 étapes :\n\n1️⃣ Choix du modèle\n2️⃣ Contenance\n3️⃣ Design de l'étiquette\n4️⃣ Type d'emballage\n5️⃣ Texte personnalisé\n6️⃣ Récapitulatif & devis\n\nAccédez-y via la section **Collection** du menu.`;

  if (/paiement|payer|carte|cod|stripe|konnect|paypal|click to pay|livraison paiement/.test(q))
    return `Nous acceptons plusieurs modes de paiement :\n\n💵 **Paiement à la livraison** (COD)\n💳 **Carte bancaire** via Stripe\n🔵 **Konnect** (paiement TND en ligne)\n🅿️ **PayPal**\n📱 **Click to Pay** (SMT)\n\nTous les paiements sont sécurisés et cryptés.`;

  if (/contact|message|email|telephone|nous joindre|whatsapp/.test(q))
    return `Vous pouvez nous contacter via :\n\n📝 **Formulaire de contact** sur notre site (section Contact)\n📧 **yassminehsin040@gmail.com**\n📍 **Domaine Fendri**, Meknessi, Sfax, Tunisie\n\nNous répondons sous **24 à 48h**.`;

  if (/certif|bio|biologique|label|recompense|prix intern|award|biol|evooleum|flos olei|siqev|solinas/.test(q))
    return `Domaine Fendri est **récompensé internationalement** :\n\n🥇 Médaille d'Or — BIOL International (Italie, 2016)\n🏅 Finaliste IOC Mario Solinas 2018–2020\n📖 Flos Olei — 8 mentions consécutives\n🌍 TOP 100 EVOOLEUM Guide\n🥈 Gourmet d'Argent — AVPA Paris (2015)\n✅ Label SIQEV Madrid (2023)\n\nCertifiés **Agriculture Biologique EU & Tunisie**.`;

  if (/stock|disponible|dispo|rupture|epuise/.test(q))
    return `État du stock actuel :\n\n🟢 Bidon vert 1L Bio — **En stock** (150 unités)\n🟢 Bouteille 500ml — **En stock** (300 unités)\n🟡 Bouteille 750ml Premium — **Stock limité** (12 unités)\n🟡 Bidon 3L Familial — **Stock limité** (30 unités)\n\nPassez votre commande rapidement pour le 750ml !`;

  if (/commande|commander|achat|acheter|panier|cart/.test(q))
    return `Pour passer une commande :\n\n1. Accédez à **Our Oils**\n2. Sélectionnez un produit\n3. Choisissez la quantité\n4. Cliquez **Ajouter au panier**\n5. Renseignez vos informations de livraison\n6. Choisissez votre mode de paiement\n\nVous pouvez commander **sans créer de compte** !`;

  if (/compte|connexion|inscription|login|register|profil/.test(q))
    return `Vous pouvez :\n\n👤 **Commander sans compte** en tant que visiteur\n📝 **Créer un compte** pour suivre vos commandes\n🔐 **Se connecter** via le bouton "Sign up" en haut à droite\n\nVotre compte vous donne accès à l'historique de vos commandes et votre liste de souhaits.`;

  if (/origine|sfax|tunisie|chemlali|meknessi|domaine|histoire|famille|ans/.test(q))
    return `**Domaine Fendri** — plus d'un siècle de savoir-faire.\n\n📍 Meknessi, Sfax, Tunisie\n🫒 Cultivar : **Chemlali de Sfax**\n❄️ Extraction à froid < 27°C\n👨‍👩‍👧‍👦 Trois générations de passion olivière\n🌿 Zéro pesticide — 100% naturel\n\nNos oliveraies sont certifiées depuis 2024.`;

  if (/spec|acidite|polyphenol|acide|oleique|technique/.test(q))
    return `Spécifications techniques de nos huiles :\n\n• **Bidon 1L Bio** : acidité ≤ 0.3% · polyphénols 350 mg/kg\n• **Bouteille 500ml** : acidité ≤ 0.4% · polyphénols 280 mg/kg\n• **Bouteille 750ml** : acidité ≤ 0.2% · polyphénols 420 mg/kg\n• **Bidon 3L** : acidité ≤ 0.5% · polyphénols 250 mg/kg\n\nRécolte : Octobre–Novembre 2024`;

  if (/merci|parfait|super|nickel|tres bien|ok|bonne|bien/.test(q))
    return `Avec plaisir ! 🫒\nN'hésitez pas si vous avez d'autres questions.`;

  if (/au revoir|bye|ciao|adieu|a bientot/.test(q))
    return `À bientôt ! 👋\nMerci de votre visite chez **Domaine Fendri**. Bonne journée !`;

  return `Je n'ai pas bien compris votre question 😊\n\nVous pouvez me demander des informations sur :\n• Nos **produits** et **prix**\n• La **livraison**\n• Le **configurateur**\n• Les **paiements**\n• Nos **certifications**\n• Pour nous **contacter**`;
}

function formatMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#c9a84c', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const UI = {
  fr: { title: 'Assistant Fendri', online: 'En ligne — Domaine Fendri, Sfax', placeholder: 'Posez votre question...' },
  en: { title: 'Fendri Assistant', online: 'Online — Domaine Fendri, Sfax', placeholder: 'Ask your question...' },
  ar: { title: 'مساعد فندري', online: 'متصل — دومين فندري، صفاقس', placeholder: 'اكتب سؤالك هنا...' },
};

const SUGGESTIONS_MAP = { fr: SUGGESTIONS_FR, en: SUGGESTIONS_EN, ar: SUGGESTIONS_AR };
const WELCOME_MAP = { fr: WELCOME_FR, en: WELCOME_EN, ar: WELCOME_AR };

export default function ChatBot() {
  const { i18n } = useTranslation();
  const lang = getLang(i18n.language);
  const isRTL = lang === 'ar';
  const ui = UI[lang];
  const suggestions = SUGGESTIONS_MAP[lang];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'bot', text: WELCOME_MAP[lang], time: now() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgId = useRef(1);
  const prevLang = useRef(lang);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); setPulse(false); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (prevLang.current !== lang) {
      prevLang.current = lang;
      setMessages([{ id: 0, from: 'bot', text: WELCOME_MAP[lang], time: now() }]);
      msgId.current = 1;
    }
  }, [lang]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: msgId.current++, from: 'user', text: text.trim(), time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      const botMsg: Message = { id: msgId.current++, from: 'bot', text: getResponse(text, lang), time: now() };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const btnRight = isRTL ? 'auto' : 28;
  const btnLeft  = isRTL ? 28 : 'auto';
  const winRight = isRTL ? 'auto' : 28;
  const winLeft  = isRTL ? 28 : 'auto';

  return (
    <>
      <style>{`
        @keyframes chatPulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.35);opacity:0} }
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes chatFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .chat-window::-webkit-scrollbar{width:4px}
        .chat-window::-webkit-scrollbar-track{background:transparent}
        .chat-window::-webkit-scrollbar-thumb{background:rgba(201,168,76,.25);border-radius:4px}
        .chat-suggestion:hover{background:rgba(201,168,76,.15)!important;border-color:rgba(201,168,76,.5)!important}
      `}</style>

      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: 28, right: btnRight, left: btnLeft, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56 }}>
        {pulse && <span style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,168,76,.5)', animation: 'chatPulse 2s ease-out infinite', pointerEvents: 'none' }} />}
        <button onClick={() => setOpen(o => !o)} style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#1a2617 60%,#2d4030)', border: '2px solid rgba(201,168,76,.6)', boxShadow: '0 8px 32px rgba(26,38,23,.45),0 0 0 1px rgba(201,168,76,.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .25s cubic-bezier(.34,1.56,.64,1)', transform: open ? 'rotate(90deg) scale(1.05)' : 'scale(1)', position: 'relative' }}>
          {open ? <i className="ri-close-line" style={{ color: '#c9a84c', fontSize: 22 }} /> : <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 22 }} />}
          {unread > 0 && !open && <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: '#e74c3c', borderRadius: '50%', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',sans-serif", border: '2px solid #fff' }}>{unread}</span>}
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div dir={isRTL ? 'rtl' : 'ltr'} style={{ position: 'fixed', bottom: 96, right: winRight, left: winLeft, zIndex: 9000, width: 370, height: 540, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#f7f5f0', boxShadow: '0 24px 80px rgba(26,38,23,.25),0 0 0 1px rgba(201,168,76,.2)', animation: 'chatSlideUp .35s cubic-bezier(.22,1,.36,1)', fontFamily: isRTL ? "'Tajawal', 'Outfit', sans-serif" : "'Outfit', sans-serif" }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#1a2617 0%,#243320 100%)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(201,168,76,.15)', border: '1.5px solid rgba(201,168,76,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 18 }} />
            </div>
            <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garant', serif", fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{ui.title}</p>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(201,168,76,.8)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                <span style={{ width: 6, height: 6, background: '#4caf50', borderRadius: '50%', display: 'inline-block' }} />
                {ui.online}
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.5)', fontSize: 16, padding: 4, lineHeight: 1 }}>
              <i className="ri-close-line" />
            </button>
          </div>

          {/* Suggestions */}
          <div style={{ padding: '10px 12px 6px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0, background: '#f7f5f0', scrollbarWidth: 'none', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {suggestions.map(s => (
              <button key={s} className="chat-suggestion" onClick={() => send(s)} style={{ whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: 40, background: 'rgba(201,168,76,.07)', border: '1px solid rgba(201,168,76,.25)', fontSize: 11, color: '#5a6c56', cursor: 'pointer', transition: 'all .2s', flexShrink: 0 }}>{s}</button>
            ))}
          </div>

          {/* Messages */}
          <div className="chat-window" style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(msg => {
              const isUser = msg.from === 'user';
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: isRTL ? (isUser ? 'row' : 'row-reverse') : (isUser ? 'row-reverse' : 'row'), alignItems: 'flex-end', gap: 8, animation: 'chatFadeIn .3s ease' }}>
                  {msg.from === 'bot' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a2617', border: '1.5px solid rgba(201,168,76,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 13 }} />
                    </div>
                  )}
                  <div style={{ maxWidth: '78%' }}>
                    <div style={{ padding: '10px 13px', borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: isUser ? 'linear-gradient(135deg,#1a2617,#2d4030)' : '#fff', color: isUser ? '#f0e6c8' : '#2d3a28', fontSize: 12.5, lineHeight: 1.7, boxShadow: isUser ? '0 4px 16px rgba(26,38,23,.2)' : '0 2px 12px rgba(0,0,0,.07)', border: !isUser ? '1px solid rgba(201,168,76,.1)' : 'none', whiteSpace: 'pre-line', textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' }}>
                      {msg.from === 'bot'
                        ? msg.text.split('\n').map((line, i) => <span key={i} style={{ display: 'block' }}>{formatMessage(line)}</span>)
                        : msg.text}
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 9.5, color: '#aaa', textAlign: isRTL ? (isUser ? 'left' : 'right') : (isUser ? 'right' : 'left'), paddingLeft: (!isRTL && !isUser) ? 4 : 0, paddingRight: (!isRTL && isUser) ? 4 : 0 }}>{msg.time}</p>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, animation: 'chatFadeIn .3s ease', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a2617', border: '1.5px solid rgba(201,168,76,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 13 }} />
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#fff', border: '1px solid rgba(201,168,76,.1)', boxShadow: '0 2px 12px rgba(0,0,0,.07)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9a84c', display: 'inline-block', animation: `typingBounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 14px', background: '#fff', borderTop: '1px solid rgba(201,168,76,.12)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={ui.placeholder}
              dir={isRTL ? 'rtl' : 'ltr'}
              style={{ flex: 1, background: '#f7f5f0', border: '1px solid rgba(201,168,76,.2)', borderRadius: 40, padding: '9px 16px', fontSize: 12.5, color: '#1a2617', outline: 'none', transition: 'border-color .2s', textAlign: isRTL ? 'right' : 'left' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,.2)')}
            />
            <button onClick={() => send(input)} disabled={!input.trim()} style={{ width: 38, height: 38, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg,#1a2617,#2d4030)' : 'rgba(26,38,23,.08)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
              <i className="ri-send-plane-fill" style={{ color: input.trim() ? '#c9a84c' : '#aaa', fontSize: 15 }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
