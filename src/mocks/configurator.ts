import { PRODUCT_IMAGES } from '@/assets/images';

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
    image: PRODUCT_IMAGES.bouteilleCylindrique500ml,
  },
  {
    id: 'carree-750',
    name: 'Carrée Élancée 750 ml',
    basePrice: 58,
    description: 'Design géométrique moderne, segment prestige',
    image: PRODUCT_IMAGES.bouteilleCarree750ml,
  },
  {
    id: 'bidon-metal-3l',
    name: 'Bidon Métallique 3 L',
    basePrice: 74,
    description: 'Contenant professionnel, conservation optimale',
    image: PRODUCT_IMAGES.bidonMetallique3L,
  },
  {
    id: 'bidon-vert-1l',
    name: 'Bidon Vert 1 L Bio',
    basePrice: 42,
    description: 'Éco-responsable, certifié bio, esprit nature',
    image: PRODUCT_IMAGES.bidonVert1L,
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
