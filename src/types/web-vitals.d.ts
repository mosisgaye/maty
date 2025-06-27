// ================================================
// FICHIER: /src/types/web-vitals.d.ts
// ================================================
// Types pour web-vitals (si non inclus automatiquement)

declare module 'web-vitals' {
    export interface Metric {
      name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
      value: number;
      rating: 'good' | 'needs-improvement' | 'poor';
      delta: number;
      id: string;
      entries: PerformanceEntry[];
      navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender';
    }
  
    export type ReportHandler = (metric: Metric) => void;
  
    export function onCLS(onReport: ReportHandler): void;
    export function onFCP(onReport: ReportHandler): void;
    export function onFID(onReport: ReportHandler): void;
    export function onLCP(onReport: ReportHandler): void;
    export function onTTFB(onReport: ReportHandler): void;
    export function onINP(onReport: ReportHandler): void;
    
    export function getCLS(onReport: ReportHandler): void;
    export function getFCP(onReport: ReportHandler): void;
    export function getFID(onReport: ReportHandler): void;
    export function getLCP(onReport: ReportHandler): void;
    export function getTTFB(onReport: ReportHandler): void;
    export function getINP(onReport: ReportHandler): void;
  }