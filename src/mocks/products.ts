import { PRODUCT_IMAGES } from '@/assets/images';

const bouteille500mlVideo = '/images/videos/bouteille-500ml.mp4';
const bouteille750mlVideo = '/images/videos/bouteille-750ml.mp4';
const bidon1LVideo = '/images/videos/bidon-1l.mp4';
const bidon3LVideo = '/images/videos/fendri-luxe-cinematic.mp4';

export interface Product {
  id: string;
  name: string;
  volume: string;
  price: number;
  currency: string;
  tagline: string;
  description: string;
  details: string[];
  image: string;
  badge?: string;
  videoUrl?: string;
  accentColor?: string;
  imageScale?: number;
  stock: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 30) return 'low_stock';
  return 'in_stock';
}

export const STOCK_DISPLAY: Record<StockStatus, { label: string; color: string; bg: string; icon: string }> = {
  in_stock:     { label: 'En stock',      color: '#2d7a3a', bg: 'rgba(45,122,58,0.1)',   icon: 'ri-checkbox-circle-line' },
  low_stock:    { label: 'Stock limité',  color: '#b8750a', bg: 'rgba(184,117,10,0.1)',  icon: 'ri-error-warning-line' },
  out_of_stock: { label: 'Bientôt disponible', color: '#7b5e3a', bg: 'rgba(123,94,58,0.1)', icon: 'ri-time-line' },
};

export const products: Product[] = [
  {
    id: 'bouteille-1l',
    name: "Huile d'olive FENDRI",
    volume: 'Bidon vert 1L — Bio',
    price: 42,
    currency: 'TND',
    tagline: "L'authenticité biologique dans un flacon pensé pour la nature.",
    description:
      "Le Bidon vert 1L FENDRI est bien plus qu'un contenant — c'est un engagement. Conçu pour répondre à la demande croissante des consommateurs tunisiens sensibles aux valeurs écologiques, ce format arbore fièrement sa teinte verte, symbole de naturalité et de respect de l'environnement. Il renferme une huile d'olive extra vierge 100 % biologique, extraite à froid d'olives sélectionnées dans nos oliveraies certifiées, sans intrant chimique ni traitement industriel.",
    details: [
      'Certifié Agriculture Biologique (EU & Tunisie)',
      'Extraction à froid — polyphénols préservés',
      'Flacon teinté anti-UV pour une conservation optimale',
      'Zéro pesticide, zéro intrant chimique',
      'BIOL International Award — référence bio mondiale',
      'Acide oléique ≤ 0.3%',
    ],
    image: PRODUCT_IMAGES.bidonVert1L,
    imageScale: 1,
    badge: 'Bio & Naturel',
    videoUrl: bidon1LVideo,
    accentColor: '#3a6040',
    stock: 150,
  },
  {
    id: 'bouteille-500ml',
    name: "Huile d'olive FENDRI",
    volume: 'Bouteille cylindrique 500ml',
    price: 26,
    currency: 'TND',
    tagline: 'Le format du quotidien — accessible, raffiné, tunisien.',
    description:
      "La Bouteille cylindrique 500ml FENDRI est le format de référence sur le marché tunisien. Pensée pour s'adapter aux habitudes de consommation locales, elle combine praticité, accessibilité et qualité premium. Sa silhouette élégante et son format maniable en font la bouteille idéale pour les ménages consommant régulièrement de l'huile d'olive.",
    details: [
      'Format le plus répandu sur le marché tunisien',
      'Idéal pour épiceries fines & grandes surfaces',
      'Parfait pour coffrets cadeaux',
      'Première pression à froid certifiée',
      'Finaliste IOC Mario Solinas 2018, 2019, 2020',
      'Mentionné Flos Olei 8 fois consécutives',
    ],
    image: PRODUCT_IMAGES.bouteilleCylindrique500ml,
    imageScale: 1.25,
    badge: 'Best-seller',
    videoUrl: bouteille500mlVideo,
    accentColor: '#c9a84c',
    stock: 300,
  },
  {
    id: 'bouteille-250ml',
    name: "Huile d'olive FENDRI",
    volume: 'Bouteille carrée élancée 750ml',
    price: 58,
    currency: 'TND',
    tagline: "L'art de l'huile d'olive pour une clientèle urbaine et exigeante.",
    description:
      "La Bouteille carrée élancée 750ml FENDRI est une déclaration esthétique autant qu'un choix gustatif. Son design géométrique moderne et sa silhouette élancée ciblent une clientèle urbaine, branchée, sensible au prestige et à la différenciation. Elle incarne la rencontre entre tradition olivière tunisienne et codes du luxe contemporain.",
    details: [
      'Design différenciant — segment prestige',
      'Ciblage clientèle urbaine & haut de gamme',
      'Volume idéal pour amateurs exigeants',
      'TOP 100 EVOOLEUM — classement mondial',
      "Médaille d'Or BIOL International (Italie, 2016)",
      "Gourmet d'Argent — AVPA Paris (2015)",
    ],
    image: PRODUCT_IMAGES.bouteilleCarree750ml,
    imageScale: 1.2,
    badge: 'Premium',
    videoUrl: bouteille750mlVideo,
    accentColor: '#b8942a',
    stock: 12,
  },
  {
    id: 'bouteille-speciale',
    name: "Huile d'olive FENDRI",
    volume: 'Bidon métallique 3L',
    price: 89,
    currency: 'TND',
    tagline: 'La référence familiale — économique, robuste, fiable.',
    description:
      "Le Bidon métallique 3L FENDRI répond à une demande forte et bien identifiée sur le marché tunisien : offrir une huile d'olive de qualité supérieure dans un grand format économique, conçu pour les familles qui consomment régulièrement. Le métal garantit une meilleure protection contre la lumière et l'oxydation.",
    details: [
      'Format familial — grand volume économique',
      'Métal : protection totale lumière & oxydation',
      'Conservation longue durée garantie',
      'Label de qualité SIQEV (Madrid)',
      "Médaille de Bronze — Extra Virgin Oil Awards LA 2016",
      'Rapport qualité/prix optimal',
    ],
    image: PRODUCT_IMAGES.bidonMetallique3L,
    imageScale: 1.15,
    badge: 'Format Familial',
    videoUrl: bidon3LVideo,
    accentColor: '#7b5e3a',
    stock: 0,
  },
];
