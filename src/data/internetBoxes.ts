import { InternetBox } from '@/types/internet';

export const internetBoxes: InternetBox[] = [
  { 
    id: 1, 
    name: "Fibre Power", 
    operator: "Orange", 
    price: "23.99", 
    downloadSpeed: "1 Gb/s", 
    uploadSpeed: "400 Mb/s",
    wifiType: "WiFi 6",
    features: ["Fibre optique", "TV incluse", "Appels illimités"]
  },
  { 
    id: 2, 
    name: "Box Ultra", 
    operator: "SFR", 
    price: "25.99", 
    downloadSpeed: "2 Gb/s", 
    uploadSpeed: "700 Mb/s",
    wifiType: "WiFi 6E",
    features: ["Très haut débit", "Netflix inclus", "Appels illimités"]
  },
  { 
    id: 3, 
    name: "Bbox Smart", 
    operator: "Bouygues", 
    price: "21.99", 
    downloadSpeed: "400 Mb/s", 
    uploadSpeed: "400 Mb/s",
    wifiType: "WiFi 5",
    features: ["Fibre", "TV Bouygues", "Appels fixes"]
  }
];
