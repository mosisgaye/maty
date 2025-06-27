
// ------------------------------------------------
// 📄 FICHIER: /src/app/api/analytics/vitals/route.ts
// ------------------------------------------------
// Endpoint pour collecter les Core Web Vitals

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    
    // Logger les métriques (vous pouvez les envoyer à votre service d'analytics)
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    });
    
    // Optionnel : Sauvegarder en base de données
    // await saveMetricToDatabase(metric);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging web vital:', error);
    return NextResponse.json(
      { error: 'Failed to log metric' },
      { status: 500 }
    );
  }
}
