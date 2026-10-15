import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  language?: 'en' | 'hi' | 'hinglish';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const userMsg = (body.message || '').trim();

    if (!userMsg) {
      return NextResponse.json(
        { success: false, error: 'Empty message' },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      // Connect to Gemini API if key is present
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are RAKSHAK AI, the official assistant for India's public assistance & emergency platform RAKSHAK (Tagline: "Har Mushkil Mein, Aapke Saath").
Respond concisely in the user's language (English, Hindi, or Hinglish).
If the situation involves severe injury, life threat, fire, or active crime, immediately advise dialing 112.
If the user describes a civic problem (pothole, broken streetlight, garbage, water leak, exposed wire), suggest the right category and offer to help file the complaint.
Never claim emergency responders have been dispatched.
User message: "${userMsg}"`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const replyText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'How can RAKSHAK help you today? In urgent situations, dial 112.';
          return NextResponse.json({
            success: true,
            reply: replyText,
            isScriptedDemo: false
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API request failed, falling back to scripted engine:', geminiErr);
      }
    }

    // Intelligent Scripted Engine (No external API key required)
    const lower = userMsg.toLowerCase();

    // 1. Emergency: Accident / Life threat / Severe Trauma
    if (
      lower.includes('accident') ||
      lower.includes('road accident') ||
      lower.includes('takkar') ||
      lower.includes('injured') ||
      lower.includes('ghayal') ||
      lower.includes('khoon') ||
      lower.includes('bleeding')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🚨 Agar koi vyakti ghayal hai ya immediate danger hai, please pehle 112 dial karein! Humne turant 112 button provide kiya hai. Agar scene safe hai, aap accident report file kar sakte hain.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'call112',
          label: 'Call 112 (National Emergency)',
          url: '/accident-report'
        }
      });
    }

    // 2. Fire emergency
    if (
      lower.includes('fire') ||
      lower.includes('aag') ||
      lower.includes('dhuwan') ||
      lower.includes('smoke') ||
      lower.includes('cylinder')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🔥 Aag ya gas leak ki sthiti mein turant surakshit sthan par jayein aur Fire Emergency 101 ya 112 par call karein. Kripya dhuen se door rahein.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'call112',
          label: 'Call 112 / 101 Fire Rescue',
          url: '/fire'
        }
      });
    }

    // 3. Ambulance / Hospital inquiry
    if (
      lower.includes('ambulance') ||
      lower.includes('hospital') ||
      lower.includes('aspataal') ||
      lower.includes('doctor') ||
      lower.includes('medical')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🚑 National Ambulance Helpline 108 aur 112 24x7 active hain. Aap hamare Hospital Finder se najdeeki verified government emergency trauma centers bhi dhoondh sakte hain.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'navigate',
          label: 'Find Nearest Hospitals & Ambulances',
          url: '/medical'
        }
      });
    }

    // 4. Civic Issue: Pothole / Road damage
    if (
      lower.includes('pothole') ||
      lower.includes('gaddha') ||
      lower.includes('road') ||
      lower.includes('sadak') ||
      lower.includes('tooti')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🛣️ Sadak par gaddha ya road damage report karne ke liye category "Potholes & Damaged Roads" chuni gayi hai. Kya aap iska location aur photo attach karna chahte hain?',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'prefill',
          label: 'Open Complaint Form (Prefilled: Pothole)',
          url: '/civic-report?category=Potholes+%26+Damaged+Roads&description=' + encodeURIComponent(userMsg)
        }
      });
    }

    // 5. Civic Issue: Streetlight
    if (
      lower.includes('streetlight') ||
      lower.includes('light') ||
      lower.includes('batti') ||
      lower.includes('andhera') ||
      lower.includes('street light')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '💡 Kharab streetlight ki shikayat ke liye category "Broken Streetlights" select ho gayi hai. Isse municipal electrical wing ko forward kiya jayega.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'prefill',
          label: 'File Streetlight Report',
          url: '/civic-report?category=Broken+Streetlights&description=' + encodeURIComponent(userMsg)
        }
      });
    }

    // 6. Civic Issue: Garbage / Sanitation
    if (
      lower.includes('garbage') ||
      lower.includes('kachra') ||
      lower.includes('dustbin') ||
      lower.includes('safai') ||
      lower.includes('sanitation')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🧹 Kachra jama hone ya overflowing bin ki report "Garbage Accumulation & Waste Management" mein darj ki ja sakti hai. Photo upload karne se jald karwai hoti hai.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'prefill',
          label: 'Report Garbage Problem',
          url: '/civic-report?category=Garbage+Accumulation+%26+Waste+Management&description=' + encodeURIComponent(userMsg)
        }
      });
    }

    // 7. Civic Issue: Electricity / Exposed wires
    if (
      lower.includes('electric') ||
      lower.includes('wire') ||
      lower.includes('tar') ||
      lower.includes('bijli') ||
      lower.includes('spark') ||
      lower.includes('transformer')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '⚡ Dangling wires ya transformer sparking ek critical hazard hai! Kripya taar se kam se kam 15 feet door rahein aur turant 1912 Electricity Helpline par suchit karein.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'prefill',
          label: 'Urgent Electricity Hazard Report',
          url: '/civic-report?category=Electricity+Faults+%26+Dangling+Wires&urgency=critical&description=' + encodeURIComponent(userMsg)
        }
      });
    }

    // 8. Traffic Signal
    if (
      lower.includes('traffic') ||
      lower.includes('signal') ||
      lower.includes('jam') ||
      lower.includes('red light')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🚦 Traffic signal kharab hone par road safety risk badh jata hai. Traffic Police Helpline 1095 / 1033 hai. Aap yahan par bhi location ke sath report darj kar sakte hain.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'prefill',
          label: 'Report Traffic Signal Issue',
          url: '/civic-report?category=Broken+Traffic+Lights+%26+Road+Hazards&description=' + encodeURIComponent(userMsg)
        }
      });
    }

    // 9. Complaint status tracking
    if (
      lower.includes('status') ||
      lower.includes('track') ||
      lower.includes('complaint') ||
      lower.includes('shikayat') ||
      lower.includes('rak-2026')
    ) {
      return NextResponse.json({
        success: true,
        reply:
          '🔍 Aap apna reference ID (jaise RAK-2026-84920) enter karke live status, officer notes aur Before/After resolution photos dekh sakte hain.',
        isScriptedDemo: true,
        suggestedAction: {
          type: 'navigate',
          label: 'Open Complaint Tracker',
          url: '/track'
        }
      });
    }

    // 10. General Assistance
    return NextResponse.json({
      success: true,
      reply:
        'Namaste! Main RAKSHAK AI Assistant hoon. Main emergency help (Call 112), gaddhe ya civic shikayat darj karne, accident report karne, ya status track karne mein aapki sahayata kar sakta hoon. Aap kis vishay mein jaankari chahte hain?',
      isScriptedDemo: true,
      suggestedAction: {
        type: 'navigate',
        label: 'View Emergency Directory',
        url: '/directory'
      }
    });
  } catch (error) {
    console.error('API Chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Chat processing error' },
      { status: 500 }
    );
  }
}
