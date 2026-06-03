import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `You are G.L.O.R.Y. AI, a hyper-competent, elite hacker AI operating the terminal interface for GloryX Digital Agency. 
Your tone is technical, edgy, cyber-styled, confident, and professional. 
You help potential clients realize how they can 'rewrite the code of the market' and 'dominate the matrix' using GloryX's capabilities. 
Do NOT talk like a generic friendly assistant; speak like a system operator who cuts through the noise. 
Keep responses concise (under 120 words) and formatted for a monospace CRT screen (using uppercase headers, bullet lists, short code snippets where relevant). 
Mention agency services: Digital Marketing, CRM & Business Automation, SEO engineering, and Video Production. 
If the user asks about starting a project, instruct them to type 'heist' or navigate to the Heist Planner.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey.includes('PLACEHOLDER');

    if (isPlaceholder) {
      return NextResponse.json({ text: getOfflineResponse(message) });
    }

    // Call Gemini API via fetch (Gemini 2.5 Flash)
    // Structure contents with history for chat experience
    const contents = [];
    
    // Map history to Gemini API format
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: 'user' | 'model'; text: string }) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API response error, falling back to offline dialogue.');
      return NextResponse.json({ text: getOfflineResponse(message) });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ text: getOfflineResponse(message) });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ text: "ERROR: LINK TEMPORARILY INTERRUPTED. SYSTEM RUNNING IN SAFE MOD." });
  }
}

// Rule-based offline chatbot responses
function getOfflineResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('help') || msg.includes('command')) {
    return `GLORYX SYSTEMS DIRECTORY:
[SERVICES] - List our digital weapons
[HEIST]    - Launch the project planner
[ABOUT]    - View agency manifesto
[CONTACT]  - Establish communication channel
[CLEAR]    - Wipe terminal screen

Type a command above or talk to G.L.O.R.Y. AI directly.`;
  }

  if (msg.includes('services') || msg.includes('what do you do') || msg.includes('inventory')) {
    return `AVAILABLE INVENTORY:
1. DIGITAL MARKETING - Data campaigns that strike hard.
2. BUSINESS AUTOMATION - Automate lead flow and CRM operations.
3. SEO CONQUEST - Dominate first-page search positions.
4. MOTION & VIDEO - High-concept, cinematic storytelling.

Ready to gear up? Type 'heist' to begin.`;
  }

  if (msg.includes('heist') || msg.includes('start') || msg.includes('planner') || msg.includes('project')) {
    return `HEIST SEQUENCE READY.
Redirect link active. To customize your heist targets and lock in your project budget, navigate to the [HEIST PLANNER] page. 
Or write a message describing your target and our crew will dispatch.`;
  }

  if (msg.includes('about') || msg.includes('manifesto') || msg.includes('ethos')) {
    return `GLORYX ETHOS:
We don't follow trends. We set the trajectory. 
From core business automation to custom front-end development, we build systems designed for maximum digital dominance. 
We rewrite the code so you dominate the matrix.`;
  }

  if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('crew')) {
    return `ESTABLISHING COMMS:
SECURE EMAIL: contact@gloryx.com
MATRIX COMM: @GloryXAgency
CREW DISPATCH: Type 'heist' to submit a mission brief. Our squad responds in under 24 hours.`;
  }

  // Smart fallback dialogue simulating a cyber AI
  const cyberReplies = [
    `ENCRYPTED INTERFACE ESTABLISHED. G.L.O.R.Y. AI online. 
Your queries regarding marketing conquest and CRM automation are noted. 
How do you want to rewrite your brand's code?`,
    
    `SCANNING USER ENCRYPTION KEY... MATCH SECURED. 
We specialize in business autopilot and SEO dominance. 
What is the target system you need automated?`,
    
    `LOG: Connection stable. 
To initiate a custom quote, I recommend booting up the 'HEIST PLANNER'. 
What other digital operations can I walk you through?`,
    
    `ALERT: Dynamic AI connection operating in localized sandbox. 
We can secure massive ROI on your ad budgets and automate your client acquisition. 
What is your main business bottleneck?`
  ];

  const randomIndex = Math.floor(Math.random() * cyberReplies.length);
  return cyberReplies[randomIndex] + "\n\n(Local terminal interface active - configure GEMINI_API_KEY in .env.local for full live AI chat).";
}
