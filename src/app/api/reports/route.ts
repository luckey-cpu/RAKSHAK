import { NextRequest, NextResponse } from 'next/server';
import { getAllReports, createIncidentReport } from '@/lib/db';
import { ReportType, ReportUrgency } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;

    const reports = getAllReports({ type, status, category });
    return NextResponse.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('API Reports GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate essential fields
    if (!body.title || !body.category || !body.description || !body.location?.address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, category, description, and location.address are mandatory.'
        },
        { status: 400 }
      );
    }

    const type: ReportType = body.type === 'accident' ? 'accident' : 'civic';
    const urgency: ReportUrgency = ['low', 'medium', 'high', 'critical'].includes(body.urgency)
      ? body.urgency
      : 'medium';

    const newReport = createIncidentReport({
      type,
      category: String(body.category).trim(),
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      location: {
        address: String(body.location.address).trim(),
        landmark: body.location.landmark ? String(body.location.landmark).trim() : undefined,
        city: body.location.city ? String(body.location.city).trim() : 'Jaipur',
        state: body.location.state ? String(body.location.state).trim() : 'Rajasthan',
        pincode: body.location.pincode ? String(body.location.pincode).trim() : undefined,
        lat: typeof body.location.lat === 'number' ? body.location.lat : undefined,
        lng: typeof body.location.lng === 'number' ? body.location.lng : undefined
      },
      urgency,
      photos: Array.isArray(body.photos) ? body.photos : [],
      reporterName: body.reporterName ? String(body.reporterName).trim() : 'Citizen Reporter',
      reporterPhone: body.reporterPhone ? String(body.reporterPhone).trim() : undefined,
      reporterEmail: body.reporterEmail ? String(body.reporterEmail).trim() : undefined,
      reportedFor: body.reportedFor
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Report created successfully on RAKSHAK secure repository',
        data: newReport
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Reports POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
