import { NextRequest, NextResponse } from 'next/server';
import { getCommunityIssues, upvoteCommunityIssue } from '@/lib/db';

export async function GET() {
  try {
    const issues = getCommunityIssues();
    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error('API Community GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community issues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId } = body;

    if (!issueId) {
      return NextResponse.json(
        { success: false, error: 'issueId is required' },
        { status: 400 }
      );
    }

    const updated = upvoteCommunityIssue(issueId);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Upvote recorded successfully',
      data: updated
    });
  } catch (error) {
    console.error('API Community POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record upvote' },
      { status: 500 }
    );
  }
}
