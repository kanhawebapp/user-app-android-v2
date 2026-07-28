import { PujaItemConfig } from "../../types";

// All available puja items (excluding mala, sankh, aarti for thali)
export const ALL_POOJA_ITEMS: PujaItemConfig[] = [
  {
    id: 'flower',
    name: 'Flower',
    nameHindi: 'फूल',
    iconName: 'flower',
    color: '#E91E63',
  },
  {
    id: 'diya',
    name: 'Diya',
    nameHindi: 'दीया',
    iconName: 'fire',
    color: '#FF9800',
  },
  {
    id: 'camara',
    name: 'Dhoop',
    nameHindi: 'धूप',
    iconName: 'cloud',
    color: '#8D6E63',
  },
  {
    id: 'kalash',
    name: 'Kalash',
    nameHindi: 'कलश',
    iconName: 'cup',
    color: '#4CAF50',
  },
  {
    id: 'coconut',
    name: 'Coconut',
    nameHindi: 'नारियल',
    iconName: 'fruit',
    color: '#795548',
  },
  {
    id: 'laddu',
    name: 'Laddu',
    nameHindi: 'लड्डू',
    iconName: 'cookie',
    color: '#FF9800',
  },
];