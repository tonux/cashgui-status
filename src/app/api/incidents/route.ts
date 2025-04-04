import { NextResponse } from 'next/server';
import { findManyIncidents, createIncident, updateService, createStatusHistory, IncidentStatus, Impact, Status } from '@/lib/db';

export async function GET() {
  try {
    const incidents = await findManyIncidents();
    return NextResponse.json({ incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, serviceId, impact } = body;

    if (!title || !description || !serviceId || !impact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const incident = await createIncident({
      title,
      description,
      status: 'INVESTIGATING' as IncidentStatus,
      impact: impact as Impact,
      serviceId
    });

    // Update service status based on incident impact
    let newStatus: Status = 'OPERATIONAL';
    switch (impact) {
      case 'CRITICAL':
        newStatus = 'MAJOR_OUTAGE';
        break;
      case 'MAJOR':
        newStatus = 'PARTIAL_OUTAGE';
        break;
      case 'MINOR':
        newStatus = 'DEGRADED_PERFORMANCE';
        break;
    }

    await updateService(serviceId, { status: newStatus });
    await createStatusHistory({
      status: newStatus,
      serviceId
    });

    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
} 