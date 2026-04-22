import { PRODUCT_IMAGES } from '@/assets/images';
import cylindriqueOriginale from '@assets/originale_1776865694722.png';
import cylindrique750ClassiqueIvoire from '@assets/750ml_1776865864090.png';
import cylindrique500ClassiqueIvoire from '@assets/500ml_1776866216044.png';
import cylindrique1LClassiqueIvoire from '@assets/1L_1776866329394.png';
import cylindrique3LClassiqueIvoire from '@assets/3L_1776866414091.png';
import carree500ClassiqueIvoire from '@assets/500ml_1776867176849.png';
import carree750ClassiqueIvoire from '@assets/750ml_1776867264312.png';
import carree1LClassiqueIvoire from '@assets/1L_1776867322586.png';
import carree3LClassiqueIvoire from '@assets/3L_1776867624778.png';
import bidonMetal500ClassiqueIvoire from '@assets/500ml_1776868215567.png';
import bidonMetal750ClassiqueIvoire from '@assets/750ml_1776868394733.png';
import bidonMetal1LClassiqueIvoire from '@assets/1L_1776868636686.png';
import bidonMetal3LClassiqueIvoire from '@assets/3L_1776868988026.png';
import bidonVert500ClassiqueIvoire from '@assets/500ml_1776869267382.png';
import bidonVert750ClassiqueIvoire from '@assets/750ml_1776869583044.png';
import bidonVert1LClassiqueIvoire from '@assets/1L_1776869885058.png';
import bidonVert3LClassiqueIvoire from '@assets/3L_1776870093774.png';
import labelBioModerne from '@assets/étiquette_1776870454089.png';
import cylindrique500BioModerne from '@assets/500ml_1776871148928.png';
import cylindrique750BioModerne from '@assets/750ml_1776871200979.png';
import cylindrique1LBioModerne from '@assets/1L_1776871245531.png';
import cylindrique3LBioModerne from '@assets/3L_1776871521555.png';
import carree500BioModerne from '@assets/500ml_1776871857534.png';
import carree750BioModerne from '@assets/750ml_1776871910154.png';
import carree1LBioModerne from '@assets/1L_1776872101730.png';
import carree3LBioModerne from '@assets/3L_1776872298266.png';
import bidonVert500BioModerne from '@assets/500ml_1776872537715.png';
import bidonVert750BioModerne from '@assets/750ml_1776872641234.png';
import bidonVert1LBioModerne from '@assets/1L_1776872898224.png';
import bidonVert3LBioModerne from '@assets/3L_1776873004010.png';
import bidonMetal500BioModerne from '@assets/500ml_1776873224731.png';
import bidonMetal750BioModerne from '@assets/750ml_1776873382832.png';

export const COMBO_IMAGES: Record<string, string> = {
  'cylindrique-500__500ml__classique-ivoire': cylindrique500ClassiqueIvoire,
  'cylindrique-500__500ml__bio-moderne': cylindrique500BioModerne,
  'cylindrique-500__750ml__classique-ivoire': cylindrique750ClassiqueIvoire,
  'cylindrique-500__750ml__bio-moderne': cylindrique750BioModerne,
  'cylindrique-500__1l__classique-ivoire': cylindrique1LClassiqueIvoire,
  'cylindrique-500__1l__bio-moderne': cylindrique1LBioModerne,
  'cylindrique-500__3l__classique-ivoire': cylindrique3LClassiqueIvoire,
  'cylindrique-500__3l__bio-moderne': cylindrique3LBioModerne,
  'carree-750__500ml__classique-ivoire': carree500ClassiqueIvoire,
  'carree-750__500ml__bio-moderne': carree500BioModerne,
  'carree-750__750ml__classique-ivoire': carree750ClassiqueIvoire,
  'carree-750__750ml__bio-moderne': carree750BioModerne,
  'carree-750__1l__classique-ivoire': carree1LClassiqueIvoire,
  'carree-750__1l__bio-moderne': carree1LBioModerne,
  'carree-750__3l__classique-ivoire': carree3LClassiqueIvoire,
  'carree-750__3l__bio-moderne': carree3LBioModerne,
  'bidon-metal-3l__500ml__classique-ivoire': bidonMetal500ClassiqueIvoire,
  'bidon-metal-3l__500ml__bio-moderne': bidonMetal500BioModerne,
  'bidon-metal-3l__750ml__classique-ivoire': bidonMetal750ClassiqueIvoire,
  'bidon-metal-3l__750ml__bio-moderne': bidonMetal750BioModerne,
  'bidon-metal-3l__1l__classique-ivoire': bidonMetal1LClassiqueIvoire,
  'bidon-metal-3l__3l__classique-ivoire': bidonMetal3LClassiqueIvoire,
  'bidon-vert-1l__500ml__classique-ivoire': bidonVert500ClassiqueIvoire,
  'bidon-vert-1l__500ml__bio-moderne': bidonVert500BioModerne,
  'bidon-vert-1l__750ml__classique-ivoire': bidonVert750ClassiqueIvoire,
  'bidon-vert-1l__750ml__bio-moderne': bidonVert750BioModerne,
  'bidon-vert-1l__1l__classique-ivoire': bidonVert1LClassiqueIvoire,
  'bidon-vert-1l__1l__bio-moderne': bidonVert1LBioModerne,
  'bidon-vert-1l__3l__classique-ivoire': bidonVert3LClassiqueIvoire,
  'bidon-vert-1l__3l__bio-moderne': bidonVert3LBioModerne,
};

export function getComboImageKey(modelId: string, sizeId: string, labelId: string) {
  return `${modelId}__${sizeId}__${labelId}`;
}

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
    image: cylindriqueOriginale,
    defaultSizeId: '500ml',
    sizeImages: {
      '500 ml': cylindriqueOriginale,
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
    defaultSizeId: '1l',
    sizeImages: {
      '500 ml': PRODUCT_IMAGES.bidonVert500ml,
      '750 ml': PRODUCT_IMAGES.bidonVert750ml,
      '3 L': PRODUCT_IMAGES.bidonVert3L,
    },
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
    image: labelBioModerne,
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
