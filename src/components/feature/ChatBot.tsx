import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const SUGGESTIONS = [
  'Voir les produits',
  'Prix & livraison',
  'Configurateur',
  'Paiement',
  'Contact',
  'Certifications',
];

function getResponse(input: string): string {
  const q = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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
    return `Vous pouvez nous contacter via :\n\n📝 **Formulaire de contact** sur notre site (section Contact)\n📧 **contact@domainefendri.com**\n📍 **Domaine Fendri**, Meknessi, Sfax, Tunisie\n\nNous répondons sous **24 à 48h**.`;

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

  if (/langue|arabic|arabe|english|anglais|francais/.test(q))
    return `Notre site est disponible en **3 langues** :\n\n🇫🇷 **Français**\n🇸🇦 **العربية** (avec mode RTL automatique)\n🇬🇧 **English**\n\nChangez de langue via le sélecteur en haut à droite.`;

  if (/devise|monnaie|euro|dollar|tnd|dinar/.test(q))
    return `Nos prix sont affichés en **TND (Dinar Tunisien)** par défaut.\n\nVous pouvez changer la devise via le sélecteur 🇹🇳 **TND** en haut à droite de la page.`;

  if (/merci|parfait|super|nickel|tres bien|ok|bonne|bien/.test(q))
    return `Avec plaisir ! 🫒\nN'hésitez pas si vous avez d'autres questions. Bonne dégustation chez **Domaine Fendri** !`;

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

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: 'bot',
      text: "Bonjour ! 🫒 Je suis l'assistant **Domaine Fendri**.\nPosez-moi vos questions sur nos produits, livraisons ou le configurateur.",
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let msgId = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setPulse(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: msgId.current++, from: 'user', text: text.trim(), time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      const reply = getResponse(text);
      const botMsg: Message = { id: msgId.current++, from: 'bot', text: reply, time: now() };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      <style>{`
        @keyframes chatPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chat-window::-webkit-scrollbar { width: 4px; }
        .chat-window::-webkit-scrollbar-track { background: transparent; }
        .chat-window::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.25); border-radius: 4px; }
        .chat-input:focus { outline: none; }
        .chat-suggestion:hover { background: rgba(201,168,76,0.15) !important; border-color: rgba(201,168,76,0.5) !important; }
      `}</style>

      {/* ── Floating Button ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {pulse && (
          <span style={{
            position: 'absolute',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.5)',
            animation: 'chatPulse 2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a2617 60%, #2d4030)',
            border: '2px solid rgba(201,168,76,0.6)',
            boxShadow: '0 8px 32px rgba(26,38,23,0.45), 0 0 0 1px rgba(201,168,76,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            transform: open ? 'rotate(90deg) scale(1.05)' : 'scale(1)',
            position: 'relative',
          }}
        >
          {open
            ? <i className="ri-close-line" style={{ color: '#c9a84c', fontSize: 22 }} />
            : <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 22 }} />
          }
          {unread > 0 && !open && (
            <span style={{
              position: 'absolute',
              top: -4, right: -4,
              width: 18, height: 18,
              background: '#e74c3c',
              borderRadius: '50%',
              fontSize: 10,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif",
              border: '2px solid #fff',
            }}>{unread}</span>
          )}
        </button>
      </div>

      {/* ── Chat Window ── */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 28,
            zIndex: 9000,
            width: 370,
            height: 540,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#f7f5f0',
            boxShadow: '0 24px 80px rgba(26,38,23,0.25), 0 0 0 1px rgba(201,168,76,0.2)',
            animation: 'chatSlideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a2617 0%, #243320 100%)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.15)',
              border: '1.5px solid rgba(201,168,76,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garant', serif", fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                Assistant Fendri
              </p>
              <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: 10, color: 'rgba(201,168,76,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#4caf50', borderRadius: '50%', display: 'inline-block' }} />
                En ligne — Domaine Fendri, Sfax
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 16, padding: 4, lineHeight: 1 }}
            >
              <i className="ri-close-line" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div style={{
            padding: '10px 12px 6px',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            flexShrink: 0,
            background: '#f7f5f0',
            scrollbarWidth: 'none',
          }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="chat-suggestion"
                onClick={() => send(s)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '5px 11px',
                  borderRadius: 40,
                  background: 'rgba(201,168,76,0.07)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: '#5a6c56',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >{s}</button>
            ))}
          </div>

          {/* Messages */}
          <div
            className="chat-window"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 8,
                  animation: 'chatFadeIn 0.3s ease',
                }}
              >
                {msg.from === 'bot' && (
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    background: '#1a2617',
                    border: '1.5px solid rgba(201,168,76,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 13 }} />
                  </div>
                )}
                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    padding: '10px 13px',
                    borderRadius: msg.from === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, #1a2617, #2d4030)'
                      : '#fff',
                    color: msg.from === 'user' ? '#f0e6c8' : '#2d3a28',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12.5,
                    lineHeight: 1.7,
                    boxShadow: msg.from === 'user'
                      ? '0 4px 16px rgba(26,38,23,0.2)'
                      : '0 2px 12px rgba(0,0,0,0.07)',
                    border: msg.from === 'bot' ? '1px solid rgba(201,168,76,0.1)' : 'none',
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.from === 'bot'
                      ? msg.text.split('\n').map((line, i) => (
                        <span key={i} style={{ display: 'block' }}>
                          {formatMessage(line)}
                        </span>
                      ))
                      : msg.text
                    }
                  </div>
                  <p style={{
                    margin: '3px 0 0',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 9.5,
                    color: '#aaa',
                    textAlign: msg.from === 'user' ? 'right' : 'left',
                    paddingLeft: msg.from === 'bot' ? 4 : 0,
                    paddingRight: msg.from === 'user' ? 4 : 0,
                  }}>{msg.time}</p>
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, animation: 'chatFadeIn 0.3s ease' }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: '#1a2617',
                  border: '1.5px solid rgba(201,168,76,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <i className="ri-robot-2-line" style={{ color: '#c9a84c', fontSize: 13 }} />
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '4px 16px 16px 16px',
                  background: '#fff',
                  border: '1px solid rgba(201,168,76,0.1)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7,
                      borderRadius: '50%',
                      background: '#c9a84c',
                      display: 'inline-block',
                      animation: `typingBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 14px',
            background: '#fff',
            borderTop: '1px solid rgba(201,168,76,0.12)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question..."
              style={{
                flex: 1,
                background: '#f7f5f0',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 40,
                padding: '9px 16px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12.5,
                color: '#1a2617',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, #1a2617, #2d4030)' : 'rgba(26,38,23,0.08)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <i className="ri-send-plane-fill" style={{ color: input.trim() ? '#c9a84c' : '#aaa', fontSize: 15 }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
