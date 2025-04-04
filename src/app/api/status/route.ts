import { NextResponse } from 'next/server';
import { checkAllServices } from '@/lib/monitor';

export async function GET() {
  try {
    // Get current status
    const services = await checkAllServices();
    
    return NextResponse.json({
      services
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 