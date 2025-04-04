import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IncidentStatus, Impact } from '@prisma/client';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        service: true,
        updates: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, serviceId, status, impact } = body;

    if (!title || !description || !serviceId || 
        !status || !Object.values(IncidentStatus).includes(status) ||
        !impact || !Object.values(Impact).includes(impact)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        serviceId,
        status: status as IncidentStatus,
        impact: impact as Impact,
        updates: {
          create: {
            message: description,
            status: status as IncidentStatus
          }
        }
      },
      include: {
        updates: true,
        service: true
      }
    });

    // Update service status based on incident impact
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        status: impact === 'CRITICAL' ? 'MAJOR_OUTAGE' :
               impact === 'MAJOR' ? 'PARTIAL_OUTAGE' :
               impact === 'MINOR' ? 'DEGRADED_PERFORMANCE' : 'OPERATIONAL'
      }
    });

    return NextResponse.json({ incident });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 