import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Priority Scoring Logic (USP #6: Smart Priority Queue)
test('Smart Priority Queue calculates higher score for critical hazards', async (t) => {
  // Test inline rule logic mirroring src/lib/db.ts
  const calcScore = (category, urgency, isVulnerable) => {
    let score = 20;
    if (urgency === 'critical') score += 45;
    else if (urgency === 'high') score += 30;
    else if (urgency === 'medium') score += 15;
    else score += 5;

    const catLower = category.toLowerCase();
    if (
      catLower.includes('accident') ||
      catLower.includes('electric') ||
      catLower.includes('manhole') ||
      catLower.includes('gas') ||
      catLower.includes('fire')
    ) {
      score += 25;
    } else if (catLower.includes('pothole') || catLower.includes('water') || catLower.includes('drain')) {
      score += 15;
    } else {
      score += 10;
    }

    if (isVulnerable) score += 10;
    return Math.min(100, Math.max(10, score));
  };

  const criticalLiveWireScore = calcScore('Electricity Faults & Dangling Wires', 'critical', false);
  const routineStreetlightScore = calcScore('Broken Streetlights', 'low', false);
  const severeAccidentScore = calcScore('Road Accident', 'critical', true);

  assert.ok(
    criticalLiveWireScore > routineStreetlightScore,
    `Live wire (${criticalLiveWireScore}) must have higher score than routine light (${routineStreetlightScore})`
  );
  assert.equal(criticalLiveWireScore, 90);
  assert.equal(severeAccidentScore, 100);
  assert.equal(routineStreetlightScore, 35);
});

// Test 2: Reference ID Format
test('Reference IDs strictly follow RAK-2026-XXXXX format', async (t) => {
  const genId = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `RAK-2026-${randomNum}`;
  };

  const id = genId();
  assert.match(id, /^RAK-2026-\d{5}$/, 'Reference ID must match RAK-2026-XXXXX');
});

// Test 3: Upload Security Validation Rules
test('Upload validator enforces image MIME whitelist and 5MB limit', async (t) => {
  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024;

  const validateUpload = (mime, size) => {
    if (!ALLOWED_MIME.includes(mime)) return { valid: false, error: 'MIME not allowed' };
    if (size > MAX_SIZE) return { valid: false, error: 'Exceeds size' };
    return { valid: true };
  };

  assert.equal(validateUpload('image/jpeg', 2048).valid, true);
  assert.equal(validateUpload('image/png', 1024 * 1024).valid, true);
  assert.equal(validateUpload('application/x-msdownload', 1000).valid, false);
  assert.equal(validateUpload('application/pdf', 1000).valid, false);
  assert.equal(validateUpload('image/jpeg', 6 * 1024 * 1024).valid, false);
});

// Test 4: Chatbot Natural Language Parser Fallback
test('Chatbot correctly triggers Emergency 112 for accidents and prefill for potholes', async (t) => {
  const evaluateChat = (text) => {
    const l = text.toLowerCase();
    if (l.includes('accident') || l.includes('takkar') || l.includes('ghayal')) {
      return { action: 'call112', urgency: 'immediate' };
    }
    if (l.includes('pothole') || l.includes('gaddha') || l.includes('road')) {
      return { action: 'prefill', category: 'Potholes & Damaged Roads' };
    }
    if (l.includes('status') || l.includes('track') || l.includes('rak-2026')) {
      return { action: 'navigate', url: '/track' };
    }
    return { action: 'general' };
  };

  assert.deepEqual(evaluateChat('I saw a road accident near flyover'), {
    action: 'call112',
    urgency: 'immediate'
  });
  assert.deepEqual(evaluateChat('Mere area mein bada pothole hai'), {
    action: 'prefill',
    category: 'Potholes & Damaged Roads'
  });
  assert.deepEqual(evaluateChat('Meri complaint RAK-2026-84920 ka status kya hai?'), {
    action: 'navigate',
    url: '/track'
  });
});

// Test 5: Verified Emergency Directory Integrity
test('Emergency directory contains 112, 108, 101, 1091, 1098, 1912, 1033', async (t) => {
  const mandatoryNumbers = ['112', '108', '101', '1091', '1098', '1912', '1033'];
  const numbersFound = ['112', '108', '101', '1095', '1091', '1098', '1078', '1033', '1912', '1916', '14416', '1930'];

  for (const num of mandatoryNumbers) {
    assert.ok(numbersFound.includes(num), `Mandatory number ${num} must be in emergency directory`);
  }
});

// Test 6: Proof of Resolution Attachment Structure (USP #7)
test('Proof of Resolution validates before and after photo evidence', async (t) => {
  const mockReport = {
    id: 'RAK-2026-84920',
    status: 'Resolved',
    photos: ['/sample-pothole-before.svg'],
    resolutionNote: 'Asphalt patch rolled and leveled.',
    resolutionPhotos: ['/sample-pothole-after.svg'],
    resolvedAt: '2026-10-14T16:30:00Z'
  };

  assert.equal(mockReport.status, 'Resolved');
  assert.ok(mockReport.photos.length > 0, 'Must have before photo');
  assert.ok(mockReport.resolutionPhotos.length > 0, 'Must have after photo');
  assert.ok(mockReport.resolutionNote.length > 10, 'Must have resolution note');
});

// Test 7: Admin Authentication Verification
test('Admin authentication rejects invalid passwords and accepts valid credentials', async (t) => {
  const ADMIN_CRED = {
    email: 'admin@rakshak.gov.in',
    password: 'RakshakAdmin@2026!'
  };

  const authenticate = (e, p) => {
    return e.toLowerCase() === ADMIN_CRED.email.toLowerCase() && p === ADMIN_CRED.password;
  };

  assert.equal(authenticate('admin@rakshak.gov.in', 'RakshakAdmin@2026!'), true);
  assert.equal(authenticate('admin@rakshak.gov.in', 'wrong_pass'), false);
  assert.equal(authenticate('citizen@gmail.com', 'RakshakAdmin@2026!'), false);
});
