export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: { size: string; price: number }[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export const categories: Category[] = [
  {
    id: 'muscle-growth',
    name: 'Muscle Growth & Performance',
    description: 'Peptides designed to enhance muscle growth, recovery, and athletic performance.'
  },
  {
    id: 'healing-recovery',
    name: 'Healing & Recovery',
    description: 'Peptides that support tissue repair, healing, and recovery processes.'
  },
  {
    id: 'anti-aging',
    name: 'Anti-Aging & Skin',
    description: 'Peptides that promote skin health, collagen production, and anti-aging effects.'
  },
  {
    id: 'energy-metabolism',
    name: 'Energy & Metabolism',
    description: 'Peptides that support metabolic function, energy production, and weight management.'
  }
];

export const products: Product[] = [
  {
    id: 'reta',
    name: 'Reta',
    description: 'A research peptide known for its potential effects on metabolic function and weight management.',
    price: 100,
    image: '/products/reta 10mg bottle.png',
    category: 'energy-metabolism',
    sizes: [
      { size: '10mg', price: 100 },
      { size: '15mg', price: 140 }
    ]
  },
  {
    id: 'triz',
    name: 'Triz',
    description: 'A research peptide being studied for its potential effects on glucose metabolism and weight management.',
    price: 90,
    image: '/products/tirz 15mg.png',
    category: 'energy-metabolism',
    sizes: [
      { size: '10mg', price: 90 },
      { size: '15mg', price: 130 }
    ]
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    description: 'A research peptide being studied for its potential effects on reducing visceral fat and improving body composition.',
    price: 70,
    image: '/products/tesamorlin 10mg bottle.png',
    category: 'energy-metabolism',
    sizes: [
      { size: '5mg', price: 70 },
      { size: '10mg', price: 110 }
    ]
  },
  {
    id: 'bpc-157-tb-500',
    name: 'BPC-157 + TB-500',
    description: 'A research peptide blend being studied for its potential healing and recovery properties.',
    price: 100,
    image: '/products/bpc 157 tb500 10mg.png',
    category: 'healing-recovery',
    sizes: [
      { size: '10mg', price: 100 },
      { size: '20mg', price: 140 }
    ]
  },
  {
    id: 'ghk',
    name: 'GHK-Cu',
    description: 'A research peptide being studied for its potential skin rejuvenation and wound healing properties.',
    price: 50,
    image: '/products/ghk cu 50mg.png',
    category: 'anti-aging',
    sizes: [
      { size: '50mg', price: 50 }
    ]
  },
  {
    id: 'mots-c',
    name: 'MOTS-C',
    description: 'A research peptide being studied for its potential effects on metabolic function and exercise performance.',
    price: 70,
    image: '/products/Mots c 10mg bottle.png',
    category: 'energy-metabolism',
    sizes: [
      { size: '10mg', price: 70 }
    ]
  },
  {
    id: 'melanotan-ii',
    name: 'Melanotan II',
    description: 'A research peptide being studied for its potential effects on skin pigmentation and tanning.',
    price: 40,
    image: '/products/Melanotan II 10mg bottle.png',
    category: 'anti-aging',
    sizes: [
      { size: '10mg', price: 40 }
    ]
  },
  {
    id: 'igf-1',
    name: 'IGF-1 LR3',
    description: 'A research peptide being studied for its potential effects on muscle growth and recovery.',
    price: 60,
    image: '/products/IGF1 lr3 1mg bottle.png',
    category: 'muscle-growth',
    sizes: [
      { size: '1mg', price: 60 }
    ]
  },
  {
    id: 'nad',
    name: 'NAD+',
    description: 'A research compound being studied for its potential effects on cellular energy production and anti-aging properties.',
    price: 30,
    image: '/products/NAD+ 100mg (2).png',
    category: 'anti-aging',
    sizes: [
      { size: '100mg', price: 30 }
    ]
  }
];