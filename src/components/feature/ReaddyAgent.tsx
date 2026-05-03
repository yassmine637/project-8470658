import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Bot } from 'lucide-react';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type Lang = 'ar' | 'fr' | 'en';

function detectLang(input: string): Lang {
  if (/[\u0600-\u06FF]/.test(input)) return 'ar';
  const q = input.toLowerCase();
  if (/[àâçéèêëîïôùûüÿœ]/i.test(input) || /(^|\\s)(bonjour|salut|merci|huile|commande|livraison|contact|bouteille)/.test(q)) return 'fr';
  return 'en';
}

const COPY: Record<Lang, { welcome: string; fallback: string; greeting: string; voiceUnsupported: string }> = {
  fr: {
    welcome: "Bonjour 👋 Je suis l’assistant virtuel de Domaine Fendri. Comment puis-je vous aider aujourd’hui ? Vous pouvez poser des questions sur nos huiles d’olive, les bouteilles personnalisées ou votre commande.",
    fallback: "Merci pour votre message. Pour toute demande spéciale, je vous invite à visiter la page collection ou à nous contacter directement. Notre équipe est à votre service !",
    greeting: "Bonjour ! Ravi de vous accueillir chez Fendri. Comment puis-je vous aider ?",
    voiceUnsupported: "La reconnaissance vocale n’est pas prise en charge par votre navigateur.",
  },
  en: {
    welcome: "Hello 👋 I’m Domaine Fendri’s virtual assistant. How can I help you today? You can ask about our olive oils, personalized bottles, or your order.",
    fallback: "Thanks for your message. For any special request, please visit the collection page or contact us directly. Our team is here to help!",
    greeting: "Hello! Glad to welcome you to Fendri. How can I help?",
    voiceUnsupported: "Speech recognition is not supported by your browser.",
  },
  ar: {
    welcome: "مرحبًا 👋 أنا المساعد الافتراضي لضيعة فندري. كيف يمكنني مساعدتك اليوم؟ يمكنك طرح أسئلة حول زيوتنا، القوارير المخصصة، أو طلبك.",
    fallback: "شكرًا على رسالتك. لأي طلب خاص، أدعوك إلى زيارة صفحة المجموعة أو التواصل معنا مباشرة. فريقنا في خدمتك!",
    greeting: "مرحبًا! يسعدني تواجدك لدى فندري. كيف يمكنني مساعدتك؟",
    voiceUnsupported: "التعرّف على الصوت غير مدعوم في متصفحك.",
  },
};

function getBotReply(input: string): string {
  const q = input.toLowerCase();
  const lang = detectLang(input);
  if (lang === 'ar') {
    if (q.includes('زيت') || q.includes('زيو') || q.includes('olive')) return 'زيوتنا البكر الممتازة تُنتَج منذ 1911 في صفاقس، تونس. كل قارورة تعكس خبرة متوارثة وطابعًا فريدًا. هل ترغب في استكشاف مجموعتنا؟';
    if (q.includes('قارورة') || q.includes('تخصيص') || q.includes('معدّل') || q.includes('configur')) return 'يتيح لك المُعدِّل تخصيص القارورة بالكامل: الطراز، الحجم، الملصق والنص. ابدأ من قسم المجموعة!';
    if (q.includes('طلب') || q.includes('سعر') || q.includes('شراء')) return 'لإتمام طلب أو الحصول على عرض مخصص، تواصل معنا عبر نموذج الاتصال أو من صفحة المجموعة. سيقوم فريقنا بالرد خلال 24 ساعة.';
    if (q.includes('توصيل') || q.includes('شحن') || q.includes('مدة')) return 'نحن نشحن داخل تونس وإلى الخارج. تختلف المدة حسب الوجهة: 3–5 أيام داخل تونس، و7–14 يومًا دوليًا. الشحن مجاني ابتداءً من 150 دينار.';
    if (q.includes('جائزة') || q.includes('ميدالية') || q.includes('award')) return 'حصلت ضيعة فندري على العديد من الجوائز الدولية، بما في ذلك ميداليات ذهبية في Concours Mondial de Bruxelles. زيوتنا من بين الأفضل عالميًا.';
    if (q.includes('اتصال') || q.includes('هاتف') || q.includes('email') || q.includes('عنوان')) return 'يمكنك التواصل معنا عبر نموذج الاتصال أسفل الصفحة، أو مباشرة على contact@domainefendri.com. نحن متاحون من الاثنين إلى الجمعة، من 9 صباحًا إلى 6 مساءً.';
    if (q.includes('مرحبا') || q.includes('سلام') || q.includes('أهلا')) return COPY.ar.greeting;
    if (q.includes('شكرا') || q.includes('thanks')) return 'بكل سرور! لا تتردد في طرح أي سؤال آخر. نتمنى لك زيارة ممتعة لموقعنا!';
    return COPY.ar.fallback;
  }
  if (lang === 'fr') {
    if (q.includes('huile') || q.includes('olive') || q.includes('produit')) return "Nos huiles d’olive extra vierges sont produites depuis 1911 à Sfax, en Tunisie. Chaque bouteille reflète un savoir-faire transmis et un caractère unique. Souhaitez-vous découvrir notre collection ?";
    if (q.includes('bouteille') || q.includes('personnalis') || q.includes('configur')) return "Le configurateur vous permet de personnaliser entièrement la bouteille : modèle, taille, étiquette et texte. Commencez par la section collection !";
    if (q.includes('commande') || q.includes('commander') || q.includes('acheter') || q.includes('prix')) return "Pour finaliser une commande ou obtenir un devis personnalisé, contactez-nous via le formulaire ou depuis la page collection. Notre équipe vous répond sous 24 heures.";
    if (q.includes('livraison') || q.includes('délai') || q.includes('expédition')) return "Nous livrons en Tunisie et à l’international. Les délais varient selon la destination : 3 à 5 jours en Tunisie et 7 à 14 jours à l’étranger. La livraison est offerte dès 150 dinars.";
    if (q.includes('récompense') || q.includes('award') || q.includes('médaille') || q.includes('prix')) return "Le Domaine Fendri a reçu de nombreuses distinctions internationales, dont des médailles d’or au Concours Mondial de Bruxelles. Nos huiles sont reconnues parmi les meilleures au monde.";
    if (q.includes('contact') || q.includes('téléphone') || q.includes('email') || q.includes('adresse')) return "Vous pouvez nous joindre via le formulaire de contact en bas de page, ou directement à contact@domainefendri.com. Nous sommes disponibles du lundi au vendredi, de 9h à 18h.";
    if (q.includes('bonjour') || q.includes('salut') || q.includes('hello') || q.includes('bonsoir')) return COPY.fr.greeting;
    if (q.includes('merci') || q.includes('thank')) return "Avec plaisir ! N’hésitez pas si vous avez d’autres questions. Bonne visite sur notre site !";
    return COPY.fr.fallback;
  }
  if (q.includes('oil') || q.includes('olive') || q.includes('product')) return "Our extra virgin olive oils have been produced since 1911 in Sfax, Tunisia. Each bottle reflects a passed-down craft and a unique identity. Would you like to explore our collection?";
  if (q.includes('bottle') || q.includes('custom') || q.includes('config')) return "The configurator lets you fully customize the bottle: model, size, label, and text. Start with the collection section!";
  if (q.includes('order') || q.includes('buy') || q.includes('price')) return "To place an order or get a custom quote, contact us through the form or from the collection page. Our team will reply within 24 hours.";
  if (q.includes('delivery') || q.includes('shipping') || q.includes('time')) return "We ship in Tunisia and internationally. Delivery times vary by destination: 3–5 days in Tunisia and 7–14 days abroad. Shipping is free from 150 dinars.";
  if (q.includes('award') || q.includes('medal') || q.includes('prize')) return "Domaine Fendri has received many international distinctions, including gold medals at the Concours Mondial de Bruxelles. Our oils are recognized among the best in the world.";
  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('address')) return "You can reach us through the contact form at the bottom of the page, or directly at contact@domainefendri.com. We are available Monday to Friday, 9am to 6pm.";
  if (q.includes('hello') || q.includes('hi') || q.includes('good morning') || q.includes('good evening')) return COPY.en.greeting;
  if (q.includes('thank')) return "With pleasure! Feel free to ask if you have any other questions. Enjoy your visit to our site!";
  return COPY.en.fallback;
}

export default function ReaddyAgent() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const detected = detectLang(trimmed);
    setLang(detected);

    if (messages.length === 0) {
      setMessages([{ id: 0, from: 'bot', text: COPY[detected].welcome }]);
    }

    const userMsg: Message = { id: Date.now(), from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(trimmed);
      setTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }]);
    }, 900 + Math.random() * 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage(input);
  };

  const toggleVoice = () => {
    type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
    const w = window as unknown as Record<string, unknown>;
    const SpeechRecognitionAPI =
      (w['SpeechRecognition'] as SpeechRecognitionCtor | undefined) ||
      (w['webkitSpeechRecognition'] as SpeechRecognitionCtor | undefined);

    if (!SpeechRecognitionAPI) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: 'bot', text: COPY.fr.voiceUnsupported },
      ]);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'fr-FR';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <>
      {/* Pulse ring behind the button */}
      {!open && (
        <span
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#d4af37',
            opacity: 0.35,
            zIndex: 9997,
            pointerEvents: 'none',
            animation: 'fendriPulse 2.4s ease-out 2s infinite',
          }}
        />
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir l'assistant"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#1a1a0e',
          border: '2px solid #d4af37',
          color: '#d4af37',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          animation: open ? 'none' : 'fendriBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) 1.5s both',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 20,
            width: 360,
            maxWidth: 'calc(100vw - 40px)',
            height: 480,
            maxHeight: 'calc(100vh - 120px)',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9998,
            animation: 'fendriSlideUp 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#1a1a0e',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot size={18} color="#1a1a0e" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>
                Assistant Fendri
              </div>
              <div style={{ color: '#d4af37', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
                En ligne
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 6,
              }}
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#f8f6f1',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  gap: 8,
                  alignItems: 'flex-end',
                }}
              >
                {msg.from === 'bot' && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#1a1a0e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={14} color="#d4af37" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '9px 13px',
                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'user' ? '#1a1a0e' : '#fff',
                    color: msg.from === 'user' ? '#fff' : '#1a1a0e',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    borderLeft: msg.from === 'bot' ? '3px solid #d4af37' : 'none',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#1a1a0e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={14} color="#d4af37" />
                </div>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '16px 16px 16px 4px',
                    padding: '10px 14px',
                    borderLeft: '3px solid #d4af37',
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#d4af37',
                        display: 'inline-block',
                        animation: `fendriDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div
            style={{
              padding: '10px 12px',
              background: '#fff',
              borderTop: '1px solid #ede8df',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === 'ar' ? 'رسالتك...' : lang === 'en' ? 'Your message...' : 'Votre message...'}
              style={{
                flex: 1,
                border: '1px solid #e0dbd0',
                borderRadius: 24,
                padding: '9px 14px',
                fontSize: 13.5,
                outline: 'none',
                background: '#f8f6f1',
                color: '#1a1a0e',
                fontFamily: 'inherit',
              }}
            />
            {/* Voice button */}
            <button
              onClick={toggleVoice}
              aria-label={listening ? 'Arrêter' : 'Message vocal'}
              title={listening ? 'Arrêter' : 'Message vocal'}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: `2px solid ${listening ? '#e53935' : '#d4af37'}`,
                background: listening ? '#e53935' : 'transparent',
                color: listening ? '#fff' : '#d4af37',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              aria-label="Envoyer"
              title="Envoyer"
              disabled={!input.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: 'none',
                background: input.trim() ? '#1a1a0e' : '#ccc',
                color: input.trim() ? '#d4af37' : '#fff',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Global keyframe animations */}
      <style>{`
        @keyframes fendriBounce {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fendriPulse {
          0%   { transform: scale(1); opacity: 0.35; }
          70%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes fendriSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fendriDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40%            { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
