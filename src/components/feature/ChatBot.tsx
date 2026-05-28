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

  // ── Détection d'intention (ordre de priorité)
  const isGreeting   = lang === 'fr' ? /bonjour|salut|bonsoir|salam|hello|coucou|bonne? (journee|matin|soiree)/.test(q) : lang === 'en' ? /hello|hi\b|hey|good\s*(morning|evening|afternoon)/.test(q) : /مرحب|اهلا|سلام|صباح|مساء|هاي/.test(input);
  const isAdvice     = lang === 'fr' ? /conseil|conseill|recommand|par quoi|lequel|laquelle|quoi choisir|que choisir|quel produit|pour commencer|pour debuter|pour moi|m.aider a choisir|aide.moi|qu.est.ce que tu|que me|quoi pren|hesit|indecis|sais pas|ne sais pas|pas sur|pas sure|perdu|perdue|confus|confuse|orienter|oriente|j.hesite|je hesite/.test(q) : lang === 'en' ? /recommend|suggest|which (one|oil|product)|what (should|would you|do you)|help me choose|best for|where (to start|do i start)|hesitat|not sure|unsure|confused|undecided|lost|guide me/.test(q) : /انصح|ارشد|ماذا|اي منتج|ابدا|افضل|متردد|مش عارف|مو متأكد/.test(input);
  const isGift       = lang === 'fr' ? /cadeau|offrir|offre|anniversaire|noel|fete|mariage|paques|prestige|luxe|idee cadeau/.test(q) : lang === 'en' ? /gift|present|birthday|wedding|christmas|luxury|premium|prestige/.test(q) : /هدية|مناسبة|عيد|زفاف|فاخر/.test(input);
  const isFamily     = lang === 'fr' ? /famille|familial|maison|grande quantite|beaucoup|gros|reserve|economique/.test(q) : lang === 'en' ? /family|household|bulk|large|economy|stock up/.test(q) : /عائلة|كبير|كمية|اقتصاد/.test(input);
  const isBio        = lang === 'fr' ? /bio|biologique|sante|naturel|sans pesticide|sans produit|ecolo|vegeta|halal/.test(q) : lang === 'en' ? /organic|bio|health|natural|pesticide.free|vegan|eco/.test(q) : /عضوي|صحي|طبيعي|بدون مبيد/.test(input);
  const isDailyUse   = lang === 'fr' ? /quotidien|tous les jours|cuisine|cuisinier|cuisson|salade|dressing|repas|journalier/.test(q) : lang === 'en' ? /daily|everyday|cooking|cook|salad|kitchen|meal/.test(q) : /يومي|طبخ|سلطة|مطبخ/.test(input);
  const isPremium    = lang === 'fr' ? /meilleur|top|premium|luxe|excellent|qualite sup|haut de gamme|750/.test(q) : lang === 'en' ? /best|top|premium|luxury|finest|high.end|750/.test(q) : /افضل|ممتاز|فاخر|750/.test(input);
  const isProduct    = lang === 'fr' ? /produit|huile|collection|gamme|bouteille|bidon|fendri|olive/.test(q) : lang === 'en' ? /product|oil|collection|bottle|range|olive/.test(q) : /منتج|زيت|زيتون|مجموعة|زجاجة|علبة/.test(input);
  const isPrice      = lang === 'fr' ? /prix|tarif|cout|combien|tnd|dinar|cher|budget/.test(q) : lang === 'en' ? /price|cost|how much|tnd|dinar|budget|expensive/.test(q) : /سعر|ثمن|تكلفة|دينار|كم/.test(input);
  const isShipping   = lang === 'fr' ? /livraison|expedition|frais|zone|pays|transport|shipping|envoyer/.test(q) : lang === 'en' ? /deliver|ship|freight|zone|country|transport/.test(q) : /توصيل|شحن|تسليم|دولة/.test(input);
  const isConfig     = lang === 'fr' ? /configur|personnalis|etiquette|emballage|bouteille perso|creer|design/.test(q) : lang === 'en' ? /configur|custom|label|packaging|personali|design/.test(q) : /مهيئ|تخصيص|ملصق|تغليف|شخصي/.test(input);
  const isPayment    = lang === 'fr' ? /paiement|payer|carte|konnect|paypal|click|livraison paiement|cod/.test(q) : lang === 'en' ? /payment|pay|card|konnect|paypal|click to pay|cod/.test(q) : /دفع|بطاقة|كونيكت|بايبال|كلك/.test(input);
  const isContact    = lang === 'fr' ? /contact|message|email|telephone|joindre|whatsapp|ecrire/.test(q) : lang === 'en' ? /contact|message|email|phone|reach|whatsapp/.test(q) : /تواصل|رسالة|بريد|هاتف/.test(input);
  const isCertif     = lang === 'fr' ? /certif|bio|biologique|label|recompense|biol|evooleum|flos olei|siqev|solinas|award/.test(q) : lang === 'en' ? /certif|organic|bio|award|biol|evooleum|flos olei|siqev|solinas/.test(q) : /شهادة|عضوي|جائزة|ايفوليوم/.test(input);
  const isStock      = lang === 'fr' ? /stock|disponible|dispo|rupture|epuise/.test(q) : lang === 'en' ? /stock|available|out of stock|sold out/.test(q) : /مخزون|متوفر|نفد/.test(input);
  const isOrder      = lang === 'fr' ? /commande|commander|acheter|panier|cart/.test(q) : lang === 'en' ? /order|buy|purchase|cart|basket/.test(q) : /طلب|اشتر|سلة/.test(input);
  const isAccount    = lang === 'fr' ? /compte|connexion|inscription|login|profil/.test(q) : lang === 'en' ? /account|login|register|sign up|profile/.test(q) : /حساب|تسجيل|دخول/.test(input);
  const isOrigin     = lang === 'fr' ? /origine|sfax|tunisie|chemlali|meknessi|histoire|famille|siecle/.test(q) : lang === 'en' ? /origin|sfax|tunisia|chemlali|meknessi|history|family|century/.test(q) : /اصل|صفاقس|شملالي|مكنين/.test(input);
  const isSpec       = lang === 'fr' ? /spec|acidite|polyphenol|technique|oleique/.test(q) : lang === 'en' ? /spec|acid|polyphenol|technical|oleic/.test(q) : /مواصفات|حموضة|بوليفينول/.test(input);
  const isThanks     = lang === 'fr' ? /merci|parfait|super|nickel|tres bien|impeccable|genial/.test(q) : lang === 'en' ? /thank|perfect|great|awesome|excellent/.test(q) : /شكرا|ممتاز|رائع/.test(input);
  const isBye        = lang === 'fr' ? /au revoir|bye|ciao|adieu|a bientot/.test(q) : lang === 'en' ? /bye|goodbye|see you|ciao/.test(q) : /مع السلامة|وداعاً|باي/.test(input);

  if (lang === 'fr') {
    if (isGreeting)
      return "Bonjour ! Bienvenue chez **Domaine Fendri** 🫒\nRavi de vous accueillir. Je suis là pour vous guider sur nos huiles, la livraison ou le configurateur — qu'est-ce qui vous intéresse ?";

    if (isAdvice || (isProduct && !isPrice && !isShipping)) {
      if (isGift || isPremium)
        return "Pour offrir ou pour vous faire plaisir, je vous recommande sans hésiter la **Bouteille carrée 750ml Premium** à 42 TND 🏆\n\nC'est notre huile la plus raffinée — parmi le **TOP 100 EVOOLEUM** mondial, avec la plus faible acidité (≤ 0.2%) et les polyphénols les plus élevés (420 mg/kg). Un vrai bijou à offrir ou à s'offrir.\n\nVous voulez que je vous explique comment la commander ?";
      if (isFamily)
        return "Pour un usage familial ou pour faire des réserves, le **Bidon métallique 3L** à 68 TND est idéal 🥫\n\nIl offre une protection optimale contre la lumière, une longue conservation, et un excellent rapport qualité/prix. Très pratique au quotidien pour toute la famille.\n\nDites-moi si vous avez d'autres questions !";
      if (isBio)
        return "Si la santé et le naturel sont votre priorité, le **Bidon vert 1L — Bio** à 28 TND est fait pour vous 🌿\n\nCertifié agriculture biologique (EU & Tunisie), zéro pesticide, avec une acidité ≤ 0.3%. C'est l'huile idéale pour ceux qui veulent le meilleur pour leur corps.\n\nSouhaitez-vous plus d'infos sur nos certifications bio ?";
      if (isDailyUse)
        return "Pour un usage quotidien en cuisine, je vous suggère notre best-seller : la **Bouteille cylindrique 500ml** à 18 TND ✨\n\nC'est notre produit le plus vendu — format pratique, bouchon ergonomique, et une huile au goût équilibré parfaite pour les salades, la cuisson et les assaisonnements. Le rapport qualité/prix est excellent.\n\nVous souhaitez la commander ?";
      return "Avec plaisir ! Voici un petit tour d'horizon pour vous aider à choisir 🫒\n\n✨ **500ml** — pour un usage quotidien, notre best-seller (18 TND)\n🌿 **Bidon 1L Bio** — si vous privilégiez le naturel et le bio (28 TND)\n🏆 **750ml Premium** — notre cuvée prestige, idéale en cadeau (42 TND)\n🥫 **3L Familial** — économique et pratique pour la maison (68 TND)\n\nDites-moi pour quel usage vous cherchez, je vous oriente plus précisément !";
    }

    if (isGift)
      return "Pour un beau cadeau, la **Bouteille carrée 750ml Premium** est le choix parfait 🎁\n\nElle fait partie du **TOP 100 EVOOLEUM** et se distingue par son design élégant et sa qualité exceptionnelle. À 42 TND, c'est une attention qui impressionne toujours.\n\nVous pouvez même la personnaliser avec notre configurateur si vous souhaitez y ajouter un message ou un label unique !";

    if (isBio)
      return "Pour un choix 100% naturel, notre **Bidon vert 1L Bio** est certifié agriculture biologique 🌿\n\nZéro pesticide, acidité ≤ 0.3%, pressé à froid — c'est l'huile qui respecte votre santé et l'environnement. Certifié EU & Tunisie. À 28 TND, c'est aussi une belle valeur.\n\nAutre question ?";

    if (isPrice)
      return "Nos tarifs, en toute transparence 🫒\n\n• **Bouteille 500ml** → 18 TND — best-seller quotidien\n• **Bidon Bio 1L** → 28 TND — certifié agriculture bio\n• **Bouteille 750ml Premium** → 42 TND — prestige & cadeaux\n• **Bidon 3L Familial** → 68 TND — économique, longue durée\n\nTous les prix incluent la TVA. Vous avez un budget particulier en tête ?";

    if (isShipping)
      return "La livraison est assurée depuis **Sfax, Tunisie** 🚚\n\n🇹🇳 Tunisie → **7 TND**\n🌍 Pays arabes → **25 TND**\n🇪🇺 Europe → **35 TND**\n🌐 Reste du monde → **50 TND**\n\nVotre commande est expédiée dans les 24 à 48h ouvrables après validation. D'autres questions ?";

    if (isConfig)
      return "Le **configurateur interactif** est une expérience unique 🎨\n\nEn 6 étapes simples, vous créez une bouteille 100% à votre image : modèle, contenance, étiquette personnalisée, emballage, texte gravé... puis vous recevez un devis sur mesure.\n\nC'est parfait pour les entreprises, les événements ou les cadeaux d'exception. Accédez-y via **Collection** dans le menu !";

    if (isPayment)
      return "Nous proposons plusieurs moyens de paiement pour votre confort 💳\n\n💵 **Paiement à la livraison** (COD) — payez à la réception\n🔵 **Konnect** — paiement en dinars tunisiens en ligne\n🅿️ **PayPal** — rapide et sécurisé\n📱 **Click to Pay SMT** — solution bancaire tunisienne\n\nTous les paiements sont sécurisés et cryptés. Des questions sur un mode en particulier ?";

    if (isContact)
      return "Notre équipe est disponible et réactive 📬\n\n📝 Utilisez le **formulaire de contact** sur notre site\n📧 Écrivez-nous à **yassminehsin040@gmail.com**\n📍 Domaine Fendri, Meknessi, Sfax, Tunisie\n\nNous répondons généralement sous **24 à 48h**. Pour une urgence, le formulaire est le plus rapide !";

    if (isCertif)
      return "Domaine Fendri est une référence reconnue à l'international 🏅\n\n🥇 Médaille d'Or — BIOL International, Italie (2016)\n🏅 Finaliste IOC Mario Solinas (2018–2020)\n📖 Flos Olei — 8 mentions consécutives\n🌍 TOP 100 EVOOLEUM Guide\n🥈 Gourmet d'Argent — AVPA Paris (2015)\n✅ Label qualité SIQEV Madrid (2023)\n\nEt surtout, certifiés **Agriculture Biologique EU & Tunisie** depuis 2024. Une confiance méritée !";

    if (isStock)
      return "Voici l'état du stock en ce moment 📦\n\n🟢 Bidon Bio 1L — **disponible** (150 unités)\n🟢 Bouteille 500ml — **disponible** (300 unités)\n🟡 Bouteille 750ml Premium — **stock limité** (12 unités ⚠️)\n🟡 Bidon 3L Familial — **stock limité** (30 unités)\n\nJe vous conseille de ne pas attendre pour le **750ml Premium** — il part vite !";

    if (isOrder)
      return "Commander chez nous est simple et rapide 🛒\n\n1. Rendez-vous sur **Our Oils**\n2. Choisissez votre produit et la quantité\n3. Cliquez **Ajouter au panier**\n4. Renseignez votre adresse de livraison\n5. Sélectionnez votre mode de paiement\n6. Validez — c'est tout !\n\nPas besoin de créer un compte. Besoin d'aide pendant le processus ?";

    if (isAccount)
      return "Commander chez nous est flexible 🔐\n\nVous pouvez passer commande **sans compte** en tant que visiteur — rapide et sans inscription.\n\nSi vous créez un compte, vous bénéficiez d'un accès à votre **historique de commandes**, votre **liste de souhaits**, et un suivi facilité. Le bouton \"Sign up\" est en haut à droite !";

    if (isOrigin)
      return "**Domaine Fendri**, c'est une histoire de passion qui dure depuis plus d'un siècle 🫒\n\n📍 Meknessi, Sfax, Tunisie — berceau de l'olivier tunisien\n🌿 Cultivar : **Chemlali de Sfax**, une variété d'exception\n❄️ Extraction à froid (< 27°C) pour préserver tous les arômes\n👨‍👩‍👧‍👦 Trois générations de savoir-faire familial\n✅ Zéro pesticide — certifié depuis 2024\n\nUne huile qui porte en elle le soleil et la terre de Sfax.";

    if (isSpec)
      return "Nos huiles sont analysées et certifiées — voici les données techniques 🔬\n\n• **Bidon Bio 1L** : acidité ≤ 0.3% · polyphénols 350 mg/kg\n• **Bouteille 500ml** : acidité ≤ 0.4% · polyphénols 280 mg/kg\n• **Bouteille 750ml Premium** : acidité ≤ 0.2% · polyphénols 420 mg/kg ⭐\n• **Bidon 3L** : acidité ≤ 0.5% · polyphénols 250 mg/kg\n\nRécolte : Octobre–Novembre 2024. Plus l'acidité est basse et les polyphénols élevés, meilleure est la qualité !";

    if (isThanks)
      return "Avec grand plaisir ! 🫒\nN'hésitez pas si d'autres questions vous viennent — je suis là. Bonne dégustation !";

    if (isBye)
      return "À bientôt ! 👋\nMerci de votre visite chez **Domaine Fendri**. Passez une excellente journée !";

    return "Je n'ai pas tout à fait saisi, mais je suis là pour vous aider 😊\n\nVous pouvez me poser des questions sur :\n• **Quel produit choisir** selon vos besoins\n• Nos **prix** et notre **gamme**\n• La **livraison** dans votre pays\n• Le **configurateur** pour personnaliser une bouteille\n• Nos **certifications** et récompenses\n• Comment nous **contacter**\n\nQu'est-ce qui vous intéresse ?";
  }

  if (lang === 'en') {
    if (isGreeting)
      return "Hello! Welcome to **Domaine Fendri** 🫒\nGreat to have you here. I can help you choose the right oil, learn about delivery, or explore our configurator — what are you looking for?";

    if (isAdvice || (isProduct && !isPrice && !isShipping)) {
      if (isGift || isPremium)
        return "For a gift or a premium experience, I highly recommend our **Square Bottle 750ml Premium** at 42 TND 🏆\n\nRanked in the **TOP 100 EVOOLEUM** worldwide, it has the lowest acidity (≤ 0.2%) and highest polyphenols (420 mg/kg) in our range. An exceptional bottle that always impresses.\n\nWould you like to know how to order it?";
      if (isFamily)
        return "For a family or bulk use, the **Metal Can 3L** at 68 TND is the smart choice 🥫\n\nIt offers excellent light protection, long shelf life, and the best value per litre. Perfect to keep at home and always have great olive oil on hand.\n\nAny other questions?";
      if (isBio)
        return "If health and natural products matter to you, our **Green Bio Can 1L** at 28 TND is your match 🌿\n\nCertified organic (EU & Tunisia), zero pesticides, cold-pressed — it's the purest oil in our range. Acidity ≤ 0.3%, full of goodness.\n\nWant to know more about our organic certifications?";
      if (isDailyUse)
        return "For everyday cooking, our best-seller is the **Cylindrical Bottle 500ml** at 18 TND ✨\n\nPractical, elegantly designed, and with a well-balanced flavour perfect for salads, cooking and dressings. Our most popular choice by far.\n\nShall I help you order one?";
      return "Happy to help you choose! Here's a quick overview 🫒\n\n✨ **500ml** — everyday cooking, our best-seller (18 TND)\n🌿 **Bio Can 1L** — organic, health-conscious choice (28 TND)\n🏆 **750ml Premium** — prestige, great as a gift (42 TND)\n🥫 **3L Family** — economical, great for households (68 TND)\n\nTell me a bit more about your use — I'll point you to the right one!";
    }

    if (isGift)
      return "For a memorable gift, the **Square Bottle 750ml Premium** is the obvious choice 🎁\n\nTOP 100 EVOOLEUM, stunning packaging, finest quality — at 42 TND it's a gift that speaks for itself. You can even personalise it with our configurator for an extra special touch!";

    if (isBio)
      return "Our **Green Bio Can 1L** is certified organic by both the EU and Tunisia 🌿\n\nZero pesticides, cold-pressed, acidity ≤ 0.3% — the cleanest, most natural oil in our range. At 28 TND, it's also excellent value.\n\nAny other questions?";

    if (isPrice)
      return "Here's our full pricing 🫒\n\n• **Bottle 500ml** → 18 TND — everyday best-seller\n• **Bio Can 1L** → 28 TND — certified organic\n• **Bottle 750ml Premium** → 42 TND — prestige & gifts\n• **Can 3L Family** → 68 TND — bulk, great value\n\nAll prices include VAT. Do you have a specific budget in mind?";

    if (isShipping)
      return "We ship from **Sfax, Tunisia** 🚚\n\n🇹🇳 Tunisia → **7 TND**\n🌍 Arab countries → **25 TND**\n🇪🇺 Europe → **35 TND**\n🌐 Worldwide → **50 TND**\n\nOrders are processed within 24–48 business hours. Any other questions?";

    if (isConfig)
      return "Our **interactive configurator** is a unique experience 🎨\n\nIn 6 simple steps, you design a fully custom bottle: model, volume, label, packaging, personalised text... and receive a tailored quote. Perfect for corporate gifts, events or special occasions. Find it under **Collection** in the menu!";

    if (isPayment)
      return "We offer several payment options for your convenience 💳\n\n💵 **Cash on delivery** (COD) — pay when you receive\n🔵 **Konnect** — online Tunisian dinar payment\n🅿️ **PayPal** — fast and secure\n📱 **Click to Pay SMT** — Tunisian banking solution\n\nAll payments are encrypted and secure. Any specific questions?";

    if (isContact)
      return "Our team is friendly and responsive 📬\n\n📝 Use the **contact form** on our website\n📧 Email us at **yassminehsin040@gmail.com**\n📍 Domaine Fendri, Meknessi, Sfax, Tunisia\n\nWe typically reply within **24 to 48 hours**. Don't hesitate!";

    if (isCertif)
      return "Domaine Fendri is internationally recognised 🏅\n\n🥇 Gold Medal — BIOL International, Italy (2016)\n🏅 IOC Mario Solinas Finalist (2018–2020)\n📖 Flos Olei — 8 consecutive mentions\n🌍 TOP 100 EVOOLEUM Guide\n🥈 Gourmet d'Argent — AVPA Paris (2015)\n✅ SIQEV Quality Label Madrid (2023)\n\nCertified **Organic Agriculture EU & Tunisia** since 2024. Every award is a promise of quality.";

    if (isStock)
      return "Here's the current stock status 📦\n\n🟢 Bio Can 1L — **in stock** (150 units)\n🟢 Bottle 500ml — **in stock** (300 units)\n🟡 Bottle 750ml Premium — **low stock** (12 units ⚠️)\n🟡 Can 3L Family — **low stock** (30 units)\n\nI'd recommend acting quickly on the **750ml Premium** — it sells fast!";

    if (isOrder)
      return "Ordering is quick and easy 🛒\n\n1. Head to **Our Oils**\n2. Pick your product and quantity\n3. Click **Add to cart**\n4. Enter your delivery address\n5. Choose your payment method\n6. Confirm — done!\n\nNo account needed. Need help during checkout?";

    if (isAccount)
      return "You have two options 🔐\n\nOrder as a **guest** — no registration needed, quick and simple.\n\nOr **create an account** to track your orders, manage your wishlist, and reorder easily. The \"Sign up\" button is in the top right corner!";

    if (isOrigin)
      return "**Domaine Fendri** is a story of passion spanning over a century 🫒\n\n📍 Meknessi, Sfax, Tunisia — heart of Tunisian olive culture\n🌿 Cultivar: **Chemlali de Sfax**, a truly exceptional variety\n❄️ Cold extraction (< 27°C) to preserve all aromas\n👨‍👩‍👧‍👦 Three generations of family expertise\n✅ Zero pesticides — certified since 2024\n\nEvery bottle carries the sunshine and soul of Sfax.";

    if (isSpec)
      return "All our oils are independently tested and certified 🔬\n\n• **Bio Can 1L** : acidity ≤ 0.3% · polyphenols 350 mg/kg\n• **Bottle 500ml** : acidity ≤ 0.4% · polyphenols 280 mg/kg\n• **Bottle 750ml Premium** : acidity ≤ 0.2% · polyphenols 420 mg/kg ⭐\n• **Can 3L** : acidity ≤ 0.5% · polyphenols 250 mg/kg\n\nHarvest: October–November 2024. Lower acidity + higher polyphenols = superior quality!";

    if (isThanks)
      return "You're very welcome! 🫒\nFeel free to ask anything else — enjoy your Domaine Fendri experience!";

    if (isBye)
      return "Goodbye! 👋\nThank you for visiting **Domaine Fendri**. Have a wonderful day!";

    return "I didn't quite catch that, but I'm here to help 😊\n\nFeel free to ask me about:\n• **Which oil to choose** for your needs\n• Our **prices** and **product range**\n• **Shipping** to your country\n• The **configurator** for custom bottles\n• Our **awards** and certifications\n• How to **contact** us\n\nWhat would you like to know?";
  }

  // Arabic
  if (isGreeting)
    return "أهلاً وسهلاً بك في **دومين فندري** 🫒\nيسعدني مساعدتك! هل تبحث عن منتج معين، معلومات عن التوصيل، أو شيء آخر؟";

  if (isAdvice || (isProduct && !isPrice && !isShipping)) {
    if (isGift || isPremium)
      return "للهدايا أو للتميز، أنصحك بـ **الزجاجة المربعة 750 مل بريميوم** بـ 42 دت 🏆\n\nهي أفضل زيوتنا — ضمن **TOP 100 EVOOLEUM** عالمياً، حموضة ≤ 0.2% وبوليفينول 420 ملغ/كغ. هدية لا تُنسى.\n\nتريد أن أشرح لك كيف تطلبها؟";
    if (isFamily)
      return "للاستخدام العائلي، **علبة 3 لتر المعدنية** بـ 68 دت هي الخيار الأمثل 🥫\n\nحماية ممتازة، حفظ طويل، وأفضل سعر لكل وحدة. عملية ومريحة للمنزل.\n\nهل لديك سؤال آخر؟";
    if (isBio)
      return "إذا كانت الصحة والطبيعة أولويتك، **علبة 1 لتر البيو** بـ 28 دت هي خيارك 🌿\n\nمعتمدة عضوياً من الاتحاد الأوروبي وتونس، بدون مبيدات، عصر بارد — زيت نقي 100%.\n\nهل تريد معلومات عن شهاداتنا العضوية؟";
    if (isDailyUse)
      return "للاستخدام اليومي في المطبخ، أقترح **الزجاجة الاسطوانية 500 مل** بـ 18 دت ✨\n\nهي الأكثر مبيعاً — سهلة الاستخدام، طعم متوازن رائع للسلطات والطبخ.\n\nهل تريد طلبها؟";
    return "بكل سرور! إليك نظرة سريعة لمساعدتك على الاختيار 🫒\n\n✨ **500 مل** — للاستخدام اليومي، الأكثر مبيعاً (18 دت)\n🌿 **بيو 1 لتر** — للاهتمام بالصحة (28 دت)\n🏆 **750 مل بريميوم** — للهدايا والتميز (42 دت)\n🥫 **3 لتر عائلي** — اقتصادي وعملي (68 دت)\n\nأخبرني باستخدامك وسأرشدك بدقة أكثر!";
  }

  if (isPrice)
    return "أسعارنا بكل شفافية 🫒\n\n• **زجاجة 500 مل** ← 18 دت — الأكثر مبيعاً\n• **بيو 1 لتر** ← 28 دت — معتمد عضوياً\n• **750 مل بريميوم** ← 42 دت — للهدايا والفخامة\n• **3 لتر عائلي** ← 68 دت — اقتصادي\n\nجميع الأسعار بالدينار التونسي وتشمل الضريبة.";

  if (isShipping)
    return "التوصيل يتم من **صفاقس، تونس** 🚚\n\n🇹🇳 تونس ← **7 دت**\n🌍 الدول العربية ← **25 دت**\n🇪🇺 أوروبا ← **35 دت**\n🌐 دولي ← **50 دت**\n\nالطلبات تُعالج في غضون 24 إلى 48 ساعة عمل.";

  if (isConfig)
    return "**المُهيِّئ التفاعلي** تجربة فريدة من نوعها 🎨\n\nفي 6 خطوات بسيطة، تصمم زجاجتك بالكامل: النموذج، الحجم، الملصق، التغليف، نص شخصي... ثم تتلقى عرض سعر مخصص.\n\nمثالي للهدايا والمناسبات. ادخل إليه عبر **Collection** في القائمة!";

  if (isPayment)
    return "نقبل عدة طرق دفع لراحتك 💳\n\n💵 **الدفع عند الاستلام** (COD)\n🔵 **Konnect** — دفع إلكتروني بالدينار\n🅿️ **PayPal** — سريع وآمن\n📱 **Click to Pay SMT** — الحل المصرفي التونسي\n\nجميع المدفوعات مشفرة وآمنة.";

  if (isContact)
    return "فريقنا في خدمتك 📬\n\n📝 **نموذج التواصل** على موقعنا\n📧 **yassminehsin040@gmail.com**\n📍 دومين فندري، مكنين، صفاقس، تونس\n\nنرد في خلال **24 إلى 48 ساعة**.";

  if (isCertif)
    return "دومين فندري مرجع دولي معترف به 🏅\n\n🥇 ميدالية ذهبية — BIOL الدولي، إيطاليا (2016)\n🏅 نهائي IOC ماريو سولينا (2018–2020)\n📖 Flos Olei — 8 ذكر متتالي\n🌍 TOP 100 EVOOLEUM\n🥈 Gourmet d'Argent — AVPA باريس (2015)\n✅ SIQEV مدريد (2023)\n\nمعتمد **زراعة عضوية — EU وتونس** منذ 2024.";

  if (isStock)
    return "حالة المخزون الحالية 📦\n\n🟢 بيو 1 لتر — **متوفر** (150 وحدة)\n🟢 500 مل — **متوفر** (300 وحدة)\n🟡 750 مل بريميوم — **كمية محدودة** (12 وحدة ⚠️)\n🟡 3 لتر عائلي — **كمية محدودة** (30 وحدة)\n\nأنصحك بعدم التأخر في طلب **750 مل** — الكمية محدودة!";

  if (isOrder)
    return "الطلب سهل وسريع 🛒\n\n1. اذهب إلى **Our Oils**\n2. اختر المنتج والكمية\n3. **أضف إلى السلة**\n4. أدخل عنوان التوصيل\n5. اختر طريقة الدفع\n6. أكد الطلب — تم!\n\nلا حاجة لإنشاء حساب. هل تحتاج مساعدة؟";

  if (isAccount)
    return "لديك خياران 🔐\n\nطلب **كزائر** — بدون تسجيل، سريع وبسيط.\n\nأو **إنشاء حساب** لمتابعة طلباتك وقائمة أمنياتك. زر \"Sign up\" في أعلى اليمين!";

  if (isOrigin)
    return "**دومين فندري** — أكثر من قرن من الشغف 🫒\n\n📍 مكنين، صفاقس، تونس — قلب الزيتون التونسي\n🌿 الصنف: **شملالي صفاقسي**، متميز وفريد\n❄️ عصر بارد (< 27 درجة) للحفاظ على كل النكهات\n👨‍👩‍👧‍👦 ثلاثة أجيال من الخبرة العائلية\n✅ صفر مبيدات — معتمد منذ 2024\n\nكل زجاجة تحمل شمس وتراب صفاقس.";

  if (isSpec)
    return "زيوتنا محللة ومعتمدة — إليك البيانات التقنية 🔬\n\n• **بيو 1 لتر** : حموضة ≤ 0.3% · بوليفينول 350 ملغ/كغ\n• **500 مل** : حموضة ≤ 0.4% · بوليفينول 280 ملغ/كغ\n• **750 مل بريميوم** : حموضة ≤ 0.2% · بوليفينول 420 ملغ/كغ ⭐\n• **3 لتر** : حموضة ≤ 0.5% · بوليفينول 250 ملغ/كغ\n\nموسم الحصاد : أكتوبر – نوفمبر 2024. كلما قلت الحموضة وارتفع البوليفينول، كانت الجودة أعلى!";

  if (isThanks)
    return "بكل سرور وامتنان! 🫒\nلا تتردد إذا كان لديك سؤال آخر. استمتع بمنتجات **دومين فندري**!";

  if (isBye)
    return "إلى اللقاء! 👋\nشكراً لزيارتك **دومين فندري**. يوم موفق!";

  return "لم أفهم تماماً، لكنني هنا لمساعدتك 😊\n\nيمكنك سؤالي عن:\n• **أي منتج تختار** حسب احتياجاتك\n• **الأسعار** والـ**تشكيلة**\n• **التوصيل** إلى بلدك\n• **المُهيِّئ** لتخصيص زجاجتك\n• **جوائزنا** وشهاداتنا\n• كيفية **التواصل** معنا\n\nماذا يهمك؟";
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
    if (open) {
      setUnread(0); setPulse(false); setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setMessages([{ id: 0, from: 'bot', text: WELCOME_MAP[lang], time: now() }]);
      msgId.current = 1;
    }
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
