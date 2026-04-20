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
    id: 'classique-ivoire',
    name: 'Classique Ivoire',
    description: 'Luxe artisanal, identité principale Fendri',
    priceAdd: 0,
    accentColor: '#c8a84b',
    bgColor: '#fdf8ee',
    borderColor: '#c8a84b',
  },
  {
    id: 'bio-moderne',
    name: 'Bio Moderne',
    description: 'Version export, minimaliste & écologique',
    priceAdd: 5,
    accentColor: '#3d7a4a',
    bgColor: '#f0f7ee',
    borderColor: '#3d7a4a',
  },
  {
    id: 'luxe-noir-or',
    name: 'Édition Luxe Noir & Or',
    description: 'Packaging haut de gamme, marché premium international',
    priceAdd: 14,
    accentColor: '#d4af37',
    bgColor: '#0e0e0e',
    borderColor: '#d4af37',
  },
  {
    id: 'heritage',
    name: 'Maison Fendri Héritage',
    description: 'Storytelling familial, tradition tunisienne authentique',
    priceAdd: 8,
    accentColor: '#8b5e3c',
    bgColor: '#f5ede0',
    borderColor: '#a67c5b',
  },
  {
    id: 'recolte-limitee',
    name: 'Récolte – Édition Limitée',
    description: 'Produit saisonnier, esprit terroir & récolte',
    priceAdd: 18,
    accentColor: '#c17f24',
    bgColor: '#fef6e4',
    borderColor: '#d4943a',
  },
];
