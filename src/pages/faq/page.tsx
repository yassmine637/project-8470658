import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GOLD = '#c9a84c';
const DARK = '#0f1409';
const GREEN = '#1a2617';
const CREAM = '#f7f5f0';
const MUTED = '#6b7c68';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  icon: string;
  label: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    id: 'produit',
    icon: '🫒',
    label: 'Le Produit',
    items: [
      {
        q: "Qu'est-ce qui fait d'une huile d'olive extra vierge un produit d'exception ?",
        a: "L'extra vierge est la catégorie la plus haute qui soit. Elle est obtenue par première pression à froid, sans aucun traitement chimique ni thermique — l'olive pressée, rien d'autre. Notre taux d'acidité libre est inférieur à 0,4 %, bien en dessous du seuil légal de 0,8 %. C'est cette pureté qui préserve tous les polyphénols, antioxydants et arômes que la nature a mis dans l'olive.",
      },
      {
        q: "Comment distinguer vos quatre formats, et lequel me correspond ?",
        a: "Le 500 ml est notre format cadeau par excellence — élégant, précis, parfait pour les fins palais. Le 750 ml, notre best-seller, accompagne quotidiennement les tables exigeantes. Le 1 L répond aux familles gourmandes qui refusent de transiger sur la qualité. Le 3 L, enfin, est notre format de chef — pensé pour les cuisines professionnelles et les maisons qui consomment beaucoup sans jamais vouloir manquer.",
      },
      {
        q: "Comment conserver l'or de votre bouteille une fois ouverte ?",
        a: "Trois ennemis à tenir à distance : la lumière, la chaleur et l'air. Après ouverture, rebouchez hermétiquement, placez à l'abri de la lumière directe, entre 14 et 18 °C idéalement. Un placard de cuisine, loin des fourneaux, est parfait. Évitez le réfrigérateur — le froid trouble l'huile sans l'améliorer. Une bouteille ouverte se consomme idéalement dans les six semaines.",
      },
      {
        q: "Quelle est la durée de vie de votre huile ?",
        a: "Nos bouteilles affichent une date limite d'utilisation optimale de 18 mois à compter de la mise en bouteille. Mais l'huile ne \"se périme\" pas au sens strict — elle s'oxyde progressivement et perd ses arômes. Une huile stockée correctement, non ouverte, reste de bonne qualité bien au-delà. L'odeur et la saveur sont vos meilleurs indicateurs.",
      },
    ],
  },
  {
    id: 'livraison',
    icon: '📦',
    label: 'Livraison',
    items: [
      {
        q: "Jusqu'où voyage votre or liquide ?",
        a: "Nous livrons en Tunisie, dans toute l'Europe, ainsi que dans les pays du Golfe et d'Afrique du Nord. Si votre pays ne figure pas dans les options de livraison lors de votre commande, contactez-nous directement — nous trouvons toujours une solution pour les amateurs d'huile d'olive qui savent ce qu'ils cherchent.",
      },
      {
        q: "En combien de temps ma commande m'atteindra-t-elle ?",
        a: "Les commandes sont préparées sous 48 h ouvrables. La livraison en Tunisie prend ensuite 2 à 4 jours. Pour l'Europe, comptez 5 à 8 jours ouvrables. Pour les livraisons en dehors de ces zones, les délais varient selon la destination — vous en serez informé précisément lors du passage en caisse.",
      },
      {
        q: "Puis-je modifier le cap d'une commande déjà validée ?",
        a: "Toute commande peut être modifiée ou annulée dans les 2 heures suivant sa validation, avant que notre équipe ne commence sa préparation. Passé ce délai, si la commande n'est pas encore expédiée, contactez-nous rapidement à contact@domainefendri.com — nous faisons notre possible. Une fois le colis parti, nous ne pouvons plus intervenir sur son contenu ou sa destination.",
      },
    ],
  },
  {
    id: 'configurateur',
    icon: '🎨',
    label: 'Configurateur',
    items: [
      {
        q: "Comment fonctionne la personnalisation de bouteille ?",
        a: "Notre configurateur vous guide en six étapes : le modèle de bouteille, le volume, le style d'étiquette, l'emballage, votre message personnalisé, puis la commande. Chaque choix se reflète en temps réel dans l'aperçu visuel. Ce n'est pas une simulation — ce que vous voyez est exactement ce que vous recevrez.",
      },
      {
        q: "Est-il possible de commander en volume pour un événement ou une entreprise ?",
        a: "Absolument. Nos bouteilles personnalisées sont très prisées pour les mariages, les cadeaux d'entreprise, les événements de prestige et les coffrets séminaires. Pour toute commande de 20 bouteilles et plus, notre équipe B2B vous accompagne avec des conditions dédiées. Contactez-nous via le formulaire ou directement à contact@domainefendri.com.",
      },
      {
        q: "Quel délai pour une création sur-mesure ?",
        a: "Les commandes configurées nécessitent un délai de production supplémentaire de 5 à 10 jours ouvrables, en fonction du volume et du type de personnalisation. Pour les événements, nous vous recommandons de commander au minimum 3 semaines à l'avance. Nous ne faisons jamais de compromis sur la qualité de finition.",
      },
    ],
  },
  {
    id: 'paiement',
    icon: '💳',
    label: 'Paiement',
    items: [
      {
        q: "Quels sont les modes de règlement acceptés ?",
        a: "Nous acceptons le paiement à la livraison (espèces ou chèque) pour la Tunisie. Les paiements par carte bancaire internationale sont disponibles via Stripe pour nos clients en Europe et dans le reste du monde. Konnect est également disponible pour les virements en dinars tunisiens.",
      },
      {
        q: "Mes données bancaires transitent-elles par vos serveurs ?",
        a: "Non. Vos données de paiement ne transitent jamais par nos serveurs. Nous utilisons Stripe, certifié PCI DSS niveau 1 — le standard de sécurité le plus élevé pour les paiements en ligne. Nous ne voyons jamais vos numéros de carte. Chaque transaction est chiffrée de bout en bout.",
      },
      {
        q: "Le paiement à la livraison est-il possible partout ?",
        a: "Le paiement à la livraison est disponible uniquement pour les livraisons en Tunisie. Pour les commandes internationales, un paiement en ligne est requis à la validation de la commande. Cette contrainte est liée à nos partenaires logistiques à l'international.",
      },
    ],
  },
  {
    id: 'retours',
    icon: '↩️',
    label: 'Retours',
    items: [
      {
        q: "Puis-je changer d'avis après réception de ma commande ?",
        a: "Les produits alimentaires ne peuvent légalement pas faire l'objet d'un retour une fois livrés, sauf défaut avéré. Si vous avez reçu un produit différent de celui commandé, ou si la qualité ne correspond pas à nos standards habituels, nous vous remboursons ou remplaçons le produit sans discussion. Votre confiance est notre engagement le plus précieux.",
      },
      {
        q: "Ma livraison est arrivée endommagée. Que faire ?",
        a: "Prenez des photos du colis et des produits dès réception, avant toute manipulation. Envoyez-les à contact@domainefendri.com avec votre numéro de commande dans les 48 heures suivant la livraison. Nous traitons chaque réclamation dans les 24 h ouvrables et procédons systématiquement au remplacement ou remboursement.",
      },
      {
        q: "Comment joindre notre équipe ?",
        a: "Par email à contact@domainefendri.com — notre délai de réponse moyen est inférieur à 12 heures. Via le formulaire de contact sur notre site pour toute demande détaillée. Pour les urgences ou les grosses commandes B2B, précisez-le dans l'objet de votre message et nous vous répondrons en priorité.",
      },
    ],
  },
  {
    id: 'maison',
    icon: '🏡',
    label: 'La Maison',
    items: [
      {
        q: "Depuis quand la famille Fendri cultive-t-elle l'olive ?",
        a: "Depuis 1911. Notre domaine a traversé plus d'un siècle, quatre générations, deux guerres mondiales et d'innombrables récoltes. Ce que nous savons faire, nous l'avons appris lentement, avec patience, en écoutant la terre de Sfax. Chaque bouteille porte le poids de cette histoire.",
      },
      {
        q: "Vos certifications garantissent-elles un produit réellement bio ?",
        a: "Oui. Notre certification bio est délivrée par un organisme tiers indépendant, qui inspecte nos pratiques agricoles chaque année. Cela signifie : aucun pesticide chimique, aucun engrais synthétique, aucun OGM. Les olives poussent comme elles l'ont toujours fait — avec l'eau de pluie, le soleil de Sfax et le travail de nos équipes.",
      },
      {
        q: "Où se trouve exactement votre domaine ?",
        a: "À Sfax, dans le centre-est de la Tunisie — capitale mondiale de l'huile d'olive, berceau de l'olivier méditerranéen. Notre domaine s'étend sur les plaines argilo-calcaires de la région, un terroir unique qui donne à notre huile ses notes herbacées et son léger piquant caractéristique. Une invitation permanente à venir nous rendre visite.",
      },
    ],
  },
];

export default function FaqPage() {
  const { i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('produit');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isAr = i18n.language === 'ar';

  const category = FAQ_DATA.find((c) => c.id === activeCategory)!;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Hero ── */}
      <div
        style={{
          background: DARK,
          paddingTop: '120px',
          paddingBottom: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px',
          background: `radial-gradient(ellipse, ${GOLD}0d 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 40px', textAlign: 'center', position: 'relative' }}>
          <Link
            to="/"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: GOLD,
              textDecoration: 'none',
              textTransform: 'uppercase',
              opacity: 0.7,
              display: 'inline-block',
              marginBottom: '2rem',
            }}
          >
            ← Retour à l'accueil
          </Link>

          <p style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
            letterSpacing: '0.4em',
            color: GOLD,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Maison Fendri · Sfax, Tunisie · Fondée en 1911
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            color: '#ffffff',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em',
          }}>
            Questions &<br />
            <em style={{ color: GOLD, fontStyle: 'italic' }}>Réponses</em>
          </h1>

          <div style={{ width: '48px', height: '1px', background: GOLD, margin: '0 auto 1.5rem' }} />

          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.9rem',
            lineHeight: 1.8,
            maxWidth: '480px',
            margin: '0 auto',
            letterSpacing: '0.02em',
          }}>
            Ce que vous voulez savoir sur notre huile, notre domaine, et notre façon de travailler.
          </p>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{
        background: GREEN,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {FAQ_DATA.map((cat) => {
            const active = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                  padding: '18px 20px 16px',
                  cursor: 'pointer',
                  color: active ? GOLD : 'rgba(255,255,255,0.45)',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.65rem',
                  fontWeight: active ? 700 : 400,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}
              >
                <span style={{ fontSize: '0.85rem' }}>{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ Items ── */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '64px 40px 120px' }}>

        {/* Category heading */}
        <div style={{ marginBottom: '56px' }}>
          <span style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(5rem, 12vw, 9rem)',
            color: 'rgba(26,38,23,0.05)',
            fontWeight: 700,
            lineHeight: 1,
            display: 'block',
            marginBottom: '-1.5rem',
            letterSpacing: '-0.03em',
            userSelect: 'none',
          }}>
            {String(FAQ_DATA.findIndex((c) => c.id === activeCategory) + 1).padStart(2, '0')}
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            color: GREEN,
            fontWeight: 600,
            marginBottom: '4px',
            letterSpacing: '0.02em',
          }}>
            {category.label}
          </h2>
          <div style={{ width: '32px', height: '2px', background: GOLD, borderRadius: '1px' }} />
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {category.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: `1px solid rgba(26,38,23,0.1)`,
                  ...(i === category.items.length - 1 ? { borderBottom: '1px solid rgba(26,38,23,0.1)' } : {}),
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '28px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '24px',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  {/* Number */}
                  <span style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: GOLD,
                    letterSpacing: '0.1em',
                    paddingTop: '4px',
                    minWidth: '28px',
                    opacity: isOpen ? 1 : 0.5,
                    transition: 'opacity 0.25s',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Question text */}
                  <span style={{
                    flex: 1,
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                    color: isOpen ? GREEN : '#2d3a2a',
                    fontWeight: isOpen ? 600 : 500,
                    lineHeight: 1.4,
                    transition: 'color 0.25s',
                  }}>
                    {item.q}
                  </span>

                  {/* Toggle icon */}
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: `1px solid ${isOpen ? GOLD : 'rgba(26,38,23,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.3s ease',
                    background: isOpen ? GOLD : 'transparent',
                  }}>
                    <span style={{
                      display: 'block',
                      width: '10px',
                      height: '1px',
                      background: isOpen ? GREEN : MUTED,
                      position: 'relative',
                      transition: 'background 0.25s',
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '10px',
                        height: '1px',
                        background: isOpen ? GREEN : MUTED,
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(90deg)',
                        transition: 'transform 0.3s ease',
                        transformOrigin: 'center',
                      }} />
                    </span>
                  </span>
                </button>

                {/* Answer — animated reveal */}
                <div
                  style={{
                    maxHeight: isOpen ? '600px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div style={{
                    paddingLeft: '52px',
                    paddingBottom: '32px',
                    paddingRight: '52px',
                  }}>
                    <div style={{
                      width: '24px',
                      height: '1px',
                      background: GOLD,
                      marginBottom: '16px',
                    }} />
                    <p style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.9rem',
                      color: MUTED,
                      lineHeight: 1.85,
                      margin: 0,
                      letterSpacing: '0.01em',
                    }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA ── */}
        <div style={{
          marginTop: '80px',
          padding: '48px',
          background: GREEN,
          borderRadius: '2px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at center, ${GOLD}0d 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <p style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(0.55rem, 1.2vw, 0.7rem)',
            letterSpacing: '0.35em',
            color: GOLD,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <h3 style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2rem)',
            color: '#ffffff',
            fontWeight: 400,
            marginBottom: '24px',
            letterSpacing: '0.01em',
          }}>
            Notre équipe est à votre écoute
          </h3>
          <div style={{ width: '32px', height: '1px', background: GOLD, margin: '0 auto 28px' }} />
          <Link
            to="/#contact"
            style={{
              display: 'inline-block',
              padding: '12px 36px',
              background: GOLD,
              color: GREEN,
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: '1px',
              transition: 'all 0.25s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#b8942a'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GOLD; }}
          >
            Nous écrire
          </Link>
        </div>

      </div>
    </div>
  );
}
