import { InternetBox, ConnectionType, SortOption } from '@/types/internet';

export function filterInternetBoxes(
  boxes: InternetBox[],
  filters: {
    speedRange: number[];
    priceRange: number[];
    connectionType: ConnectionType;
    selectedOperators: string[];
    selectedWifiTypes: string[];
  }
): InternetBox[] {
  return boxes.filter(box => {
    // Price filter
    const price = parseFloat(box.price);
    if (price > filters.priceRange[0]) return false;

    // Speed filter (simplified for downloadSpeed)
    const speed = parseFloat(box.downloadSpeed);
    if (speed < filters.speedRange[0]) return false;

    // Operator filter
    if (filters.selectedOperators.length > 0 && !filters.selectedOperators.includes(box.operator)) {
      return false;
    }

    // WiFi type filter
    if (filters.selectedWifiTypes.length > 0 && !filters.selectedWifiTypes.includes(box.wifiType)) {
      return false;
    }

    return true;
  });
}

export function extractOperators(boxes: InternetBox[]): string[] {
  return Array.from(new Set(boxes.map(box => box.operator)));
}

export function extractWifiTypes(boxes: InternetBox[]): string[] {
  return Array.from(new Set(boxes.map(box => box.wifiType)));
}

export function sortInternetBoxes(boxes: InternetBox[], sortOption: SortOption): InternetBox[] {
  const sortedBoxes = [...boxes];
  
  switch (sortOption) {
    case 'price-asc':
      return sortedBoxes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case 'price-desc':
      return sortedBoxes.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case 'speed-asc':
      return sortedBoxes.sort((a, b) => parseFloat(a.downloadSpeed) - parseFloat(b.downloadSpeed));
    case 'speed-desc':
      return sortedBoxes.sort((a, b) => parseFloat(b.downloadSpeed) - parseFloat(a.downloadSpeed));
    default:
      return sortedBoxes;
  }
}