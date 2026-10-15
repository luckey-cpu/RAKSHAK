import { NextResponse } from 'next/server';
import { getAllReports, getAuditLogs } from '@/lib/db';

export async function GET() {
  try {
    const allReports = getAllReports();
    const auditLogs = getAuditLogs();

    const total = allReports.length;
    const submitted = allReports.filter(r => r.status === 'Submitted').length;
    const underReview = allReports.filter(r => r.status === 'Under Review').length;
    const assigned = allReports.filter(r => r.status === 'Assigned').length;
    const inProgress = allReports.filter(r => r.status === 'In Progress').length;
    const resolved = allReports.filter(r => r.status === 'Resolved').length;
    const critical = allReports.filter(r => r.urgency === 'critical').length;
    const accidents = allReports.filter(r => r.type === 'accident').length;

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    for (const rep of allReports) {
      categoryCounts[rep.category] = (categoryCounts[rep.category] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      stats: {
        total,
        submitted,
        underReview,
        assigned,
        inProgress,
        resolved,
        critical,
        accidents,
        categoryCounts
      },
      auditLogs
    });
  } catch (error) {
    console.error('API Admin Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin stats' },
      { status: 500 }
    );
  }
}
