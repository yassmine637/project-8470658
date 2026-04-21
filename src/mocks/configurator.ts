import { PRODUCT_IMAGES } from '@/assets/images';

export interface BottleModel {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  description: string;
  sizeImages?: Record<string, string>;
  defaultSizeId?: string;
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
  image?: string;
}

export const bottleModels: BottleModel[] = [
  {
    id: 'cylindrique-500',
    name: 'Cylindrique 500 ml',
    basePrice: 26,
    description: 'Silhouette classique, format idéal pour offrir',
    image: PRODUCT_IMAGES.bouteilleCylindrique500ml,
    defaultSizeId: '500ml',
    sizeImages: {
      '500 ml': PRODUCT_IMAGES.bouteilleCylindrique500mlFendri,
      '750 ml': PRODUCT_IMAGES.bouteilleCylindrique750ml,
      '1 L': PRODUCT_IMAGES.bouteilleCylindrique1L,
      '3 L': PRODUCT_IMAGES.bouteilleCylindrique3L,
    },
  },
  {
    id: 'carree-750',
    name: 'Carrée Élancée 750 ml',
    basePrice: 58,
    description: 'Design géométrique moderne, segment prestige',
    image: PRODUCT_IMAGES.bouteilleCarree750ml,
    defaultSizeId: '750ml',
    sizeImages: {
      '500 ml': PRODUCT_IMAGES.bouteilleCarree500ml,
      '1 L': PRODUCT_IMAGES.bouteilleCarree1L,
      '3 L': PRODUCT_IMAGES.bouteilleCarree3L,
    },
  },
  {
    id: 'bidon-metal-3l',
    name: 'Bidon Métallique 3 L',
    basePrice: 74,
    description: 'Contenant professionnel, conservation optimale',
    image: PRODUCT_IMAGES.bidonMetallique3L,
    defaultSizeId: '3l',
    sizeImages: {
      '500 ml': PRODUCT_IMAGES.bidonMetallique500ml,
      '750 ml': PRODUCT_IMAGES.bidonMetallique750ml,
      '1 L': PRODUCT_IMAGES.bidonMetallique1L,
    },
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
  { id: '500ml', label: '500 ml', volume: '500ml', priceAdd: 12 },
  { id: '750ml', label: '750 ml', volume: '750ml', priceAdd: 22 },
  { id: '1l', label: '1 L', volume: '1L', priceAdd: 34 },
  { id: '3l', label: '3 L', volume: '3L', priceAdd: 48 },
];

export const labelStyles: LabelStyle[] = [
  {
    id: 'classique-ivoire',
    name: 'Classique Ivoire',
    description: 'Luxe artisanal, identité principale Fendri',
    priceAdd: 3,
    accentColor: '#3d6b3a',
    bgColor: '#f7fbf5',
    borderColor: '#3d6b3a',
    image: '/labels/label-classique.png',
  },
  {
    id: 'bio-moderne',
    name: 'Bio Moderne',
    description: 'Version export, minimaliste & écologique',
    priceAdd: 5,
    accentColor: '#3d7a4a',
    bgColor: '#f0f7ee',
    borderColor: '#3d7a4a',
    image: '/labels/label-bio-moderne.png',
  },
  {
    id: 'luxe-noir-or',
    name: 'Édition Luxe Noir & Or',
    description: 'Packaging haut de gamme, marché premium international',
    priceAdd: 14,
    accentColor: '#d4af37',
    bgColor: '#0e0e0e',
    borderColor: '#d4af37',
    image: '/labels/label-luxe-noir-or.png',
  },
  {
    id: 'heritage',
    name: 'Maison Fendri Héritage',
    description: 'Storytelling familial, tradition tunisienne authentique',
    priceAdd: 8,
    accentColor: '#8b5e3c',
    bgColor: '#f5ede0',
    borderColor: '#a67c5b',
    image: '/labels/label-heritage.png',
  },
  {
    id: 'recolte-limitee',
    name: 'Récolte – Édition Limitée',
    description: 'Produit saisonnier, esprit terroir & récolte',
    priceAdd: 18,
    accentColor: '#c17f24',
    bgColor: '#fef6e4',
    borderColor: '#d4943a',
    image: '/labels/label-recolte.png',
  },
];
