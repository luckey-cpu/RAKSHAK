import { NextRequest, NextResponse } from 'next/server';
import { getReportById, updateReportStatus } from '@/lib/db';
import { ReportStatus, OfficialGovStatus } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const report = getReportById(id);

    if (!report) {
      return NextResponse.json(
        { success: false, error: `Report with ID "${id}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('API Report GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching report' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const actor = body.actor || 'Authorized Admin';
    const updates: {
      status?: ReportStatus;
      officialGovStatus?: OfficialGovStatus;
      assignedDepartment?: string;
      assignedOfficer?: string;
      resolutionNote?: string;
      resolutionPhotos?: string[];
    } = {};

    if (body.status) updates.status = body.status;
    if (body.officialGovStatus) updates.officialGovStatus = body.officialGovStatus;
    if (body.assignedDepartment) updates.assignedDepartment = body.assignedDepartment;
    if (body.assignedOfficer) updates.assignedOfficer = body.assignedOfficer;
    if (body.resolutionNote) updates.resolutionNote = body.resolutionNote;
    if (Array.isArray(body.resolutionPhotos)) updates.resolutionPhotos = body.resolutionPhotos;

    const updated = updateReportStatus(id, updates, actor);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Report with ID "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Report ${id} updated successfully`,
      data: updated
    });
  } catch (error) {
    console.error('API Report PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
