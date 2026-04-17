export interface BottleModel {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  description: string;
}

export interface BottleSize {
  id: string;
  label: string;
  volume: string;
  priceAdd: number;
}

export interface LabelStyle {
  id: string;
  name: string;
  description: string;
  priceAdd: number;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

export const bottleModels: BottleModel[] = [
  {
    id: 'cylindrique-500',
    name: 'Cylindrique 500 ml',
    basePrice: 26,
    description: 'Silhouette classique, format idéal pour offrir',
    image: 'https://readdy.ai/api/search-image?query=cylindrical%20clear%20glass%20olive%20oil%20bottle%20500ml%20premium%20gold%20label%20isolated%20pure%20white%20background%20product%20photography%20studio%20lighting%20elegant%20tall%20packaging%20minimalist&width=340&height=520&seq=cfg-bottle-cyl500-001&orientation=portrait',
  },
  {
    id: 'carree-750',
    name: 'Carrée Élancée 750 ml',
    basePrice: 58,
    description: 'Design géométrique moderne, segment prestige',
    image: 'https://readdy.ai/api/search-image?query=square%20slim%20tall%20elegant%20glass%20olive%20oil%20bottle%20750ml%20luxury%20premium%20gold%20label%20isolated%20white%20background%20product%20photography%20studio%20shot%20high%20end%20packaging%20geometric%20modern&width=340&height=520&seq=cfg-bottle-sq750-001&orientation=portrait',
  },
  {
    id: 'bidon-metal-3l',
    name: 'Bidon Métallique 3 L',
    basePrice: 74,
    description: 'Contenant professionnel, conservation optimale',
    image: 'https://readdy.ai/api/search-image?query=metallic%20silver%20tin%20can%20olive%20oil%203%20liters%20professional%20premium%20label%20isolated%20white%20background%20product%20photography%20studio%20shot%20industrial%20large%20format%20packaging%20rectangular&width=340&height=520&seq=cfg-bidon-metal-001&orientation=portrait',
  },
  {
    id: 'bidon-vert-1l',
    name: 'Bidon Vert 1 L Bio',
    basePrice: 42,
    description: 'Éco-responsable, certifié bio, esprit nature',
    image: 'https://readdy.ai/api/search-image?query=green%20matte%20eco%20friendly%20olive%20oil%20tin%20can%201%20liter%20organic%20bio%20label%20natural%20isolated%20white%20background%20product%20photography%20studio%20shot%20sustainable%20packaging%20forest%20green%20color&width=340&height=520&seq=cfg-bidon-vert-001&orientation=portrait',
  },
];

export const bottleSizes: BottleSize[] = [
  { id: '250ml', label: '250 ml', volume: '250ml', priceAdd: 0 },
  { id: '500ml', label: '500 ml', volume: '500ml', priceAdd: 12 },
  { id: '750ml', label: '750 ml', volume: '750ml', priceAdd: 22 },
  { id: '1l', label: '1 L', volume: '1L', priceAdd: 34 },
];

export const labelStyles: LabelStyle[] = [
  {
    id: 'classique',
    name: 'Classique',
    description: 'Étiquette crème avec dorures',
    priceAdd: 0,
    accentColor: '#d4af37',
    bgColor: '#fdf8ee',
    borderColor: '#c5a028',
  },
  {
    id: 'noir-or',
    name: 'Noir & Or',
    description: 'Fond noir, finitions or mat',
    priceAdd: 8,
    accentColor: '#d4af37',
    bgColor: '#1a1a0e',
    borderColor: '#d4af37',
  },
  {
    id: 'vert-nature',
    name: 'Vert Nature',
    description: 'Tons verts, esprit bio & terroir',
    priceAdd: 5,
    accentColor: '#5a8a4a',
    bgColor: '#f0f5ec',
    borderColor: '#5a8a4a',
  },
  {
    id: 'blanc-epure',
    name: 'Blanc Épuré',
    description: 'Minimalisme absolu, luxe discret',
    priceAdd: 6,
    accentColor: '#888',
    bgColor: '#ffffff',
    borderColor: '#ccc',
  },
];
