import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/feature/Header';
import Footer from '@/components/feature/Footer';

const GOLD = '#c9a84c';
const GREEN = '#1a2617';
const CREAM = '#f7f5f0';
const MUTED = '#7a8c77';
const TEXT = '#2a3527';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqCategory[] = [
  {
    id: 'produit',
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
        q: "Puis-je modifier une commande déjà validée ?",
        a: "Toute commande peut être modifiée ou annulée dans les 2 heures suivant sa validation, avant que notre équipe ne commence sa préparation. Passé ce délai, si la commande n'est pas encore expédiée, contactez-nous rapidement à contact@domainefendri.com — nous faisons notre possible. Une fois le colis parti, nous ne pouvons plus intervenir sur son contenu ou sa destination.",
      },
    ],
  },
  {
    id: 'configurateur',
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
      <Header />

      {/* ── Page header ── */}
      <div style={{
        background: CREAM,
        borderBottom: `1px solid rgba(26,38,23,0.08)`,
        paddingTop: '100px',
        paddingBottom: '40px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 40px' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: MUTED,
              textDecoration: 'none',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '28px',
            }}
          >
            ← Accueil
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                color: GOLD,
                textTransform: 'uppercase',
                marginBottom: '10px',
                fontWeight: 500,
              }}>
                Questions fréquentes
              </p>
              <h1 style={{
                fontFamily: "'Cormorant Garant', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: GREEN,
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}>
                Tout ce que vous voulez savoir
              </h1>
            </div>
            <p style={{
              fontSize: '0.82rem',
              color: MUTED,
              maxWidth: '260px',
              lineHeight: 1.7,
              margin: 0,
              textAlign: isAr ? 'right' : 'left',
            }}>
              Sur notre huile, notre domaine,<br />et notre façon de travailler.
            </p>
          </div>
        </div>
      </div>

      {/* ── Category tabs — light background ── */}
      <div style={{
        background: CREAM,
        borderBottom: `1px solid rgba(26,38,23,0.08)`,
        position: 'sticky',
        top: 64,
        zIndex: 30,
      }}>
        <div style={{
          maxWidth: '960px',
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
                  padding: '14px 18px 12px',
                  cursor: 'pointer',
                  color: active ? GREEN : MUTED,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: active ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = TEXT; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ content ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '56px 40px 100px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '64px' }}>

        {/* Sidebar label */}
        <div style={{ paddingTop: '8px' }}>
          <p style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: GOLD,
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            Catégorie
          </p>
          <p style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: '1.4rem',
            color: GREEN,
            fontWeight: 500,
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {category.label}
          </p>
          <div style={{ width: '24px', height: '1.5px', background: GOLD }} />
          <p style={{ fontSize: '0.75rem', color: MUTED, marginTop: '12px', lineHeight: 1.6 }}>
            {category.items.length} question{category.items.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Accordion list */}
        <div>
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
                    padding: '24px 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '20px',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <span style={{
                    fontFamily: "'Cormorant Garant', serif",
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: isOpen ? GREEN : TEXT,
                    fontWeight: isOpen ? 600 : 400,
                    lineHeight: 1.45,
                    transition: 'color 0.2s',
                    flex: 1,
                  }}>
                    {item.q}
                  </span>

                  {/* Plus / minus */}
                  <span style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `1px solid ${isOpen ? GOLD : 'rgba(26,38,23,0.18)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '3px',
                    transition: 'all 0.25s ease',
                    background: isOpen ? GOLD : 'transparent',
                    color: isOpen ? GREEN : MUTED,
                    fontSize: '14px',
                    fontWeight: 300,
                    lineHeight: 1,
                  }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {/* Answer */}
                <div style={{
                  maxHeight: isOpen ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <p style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.875rem',
                    color: MUTED,
                    lineHeight: 1.85,
                    margin: '0 0 28px',
                    letterSpacing: '0.01em',
                    borderLeft: `2px solid ${GOLD}`,
                    paddingLeft: '16px',
                  }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Contact nudge */}
          <div style={{
            marginTop: '48px',
            padding: '28px 32px',
            border: `1px solid rgba(201,168,76,0.3)`,
            borderRadius: '2px',
            background: 'rgba(201,168,76,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{
                fontFamily: "'Cormorant Garant', serif",
                fontSize: '1.1rem',
                color: GREEN,
                fontWeight: 500,
                marginBottom: '4px',
              }}>
                Vous n'avez pas trouvé votre réponse ?
              </p>
              <p style={{ fontSize: '0.8rem', color: MUTED, margin: 0 }}>
                Notre équipe répond en moins de 12 heures.
              </p>
            </div>
            <Link
              to="/#contact"
              style={{
                display: 'inline-block',
                padding: '10px 28px',
                background: GREEN,
                color: CREAM,
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#0f1409'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = GREEN; }}
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
