/*
  ZAYROX LAB — AI Assistant (LAB AI)
  Provider abstraction: if an external secure endpoint is configured, it will
  be used first. Otherwise falls back to a local knowledge base — meaning the
  assistant works fully offline on GitHub Pages with NO exposed API keys.
*/
window.LabAI = (function () {

  // Set this to a secure serverless/backend endpoint URL when ready.
  // NEVER put a raw API key here — this file is public on GitHub Pages.
  const CONFIG = {
    remoteEndpoint: null // e.g. "https://your-backend.example.com/api/lab-ai"
  };

  const KNOWLEDGE_BASE = [
    { keywords:["sensitivity","use","best","recommend"], answer:"Your best sensitivity depends on your device performance and playstyle. Use the Sensitivity Generator above — enter your device, pick a playstyle, and it calculates values based on your specific hardware rather than a generic preset." },
    { keywords:["body shot","body shots","hitting body"], answer:"Body shots usually mean your General/Red Dot sensitivity is a bit too low to flick up to head level, or your crosshair placement is naturally at chest height. Try the Training Mode → 'Body Shots' calibration for a small General sensitivity increase." },
    { keywords:["ak","ak47","recoil"], answer:"AK47 has strong vertical recoil. Lower Red Dot/2X sensitivity slightly and select 'AK47' in the Weapon Optimization dropdown — the engine reduces Red Dot to improve vertical recoil control." },
    { keywords:["long range","long-range","sniper accuracy"], answer:"For better long-range headshots, lower your 4X and Sniper sensitivity slightly for finer control, and select the 'Long Range' playstyle in the generator — it automatically retunes 4X/Sniper values." },
    { keywords:["above head","aim above","overshoot head"], answer:"If your aim rises above the head after a few shots, it's usually recoil + high vertical scope sensitivity. Try lowering 2X/4X by 5-8 points, or select 'Recoil Control' playstyle." },
    { keywords:["close range","rushing","aggressive"], answer:"For close-range combat, higher General and Red Dot sensitivity helps you react faster. Select 'Close Range' or 'Aggressive' playstyle in the generator." },
    { keywords:["drag","drag shot","dragshot"], answer:"Drag headshots depend heavily on Red Dot/2X sensitivity. Too low = slow drag (undershoot), too high = overshoot past the head. Use 'Drag Headshot' playstyle for a balanced starting point, then fine-tune with Training Mode." },
    { keywords:["dpi"], answer:"This lab is calibrated around DPI 480 by default for consistency. You can enable Experimental Custom DPI Mode in the generator, but the main optimized profile assumes DPI 480." },
    { keywords:["fire button","button size"], answer:"Fire Button size is calculated based on your device's performance tier — lower performance devices get a larger button to reduce missed taps, higher performance devices get a smaller, more precise button." },
    { keywords:["moving target","track","tracking"], answer:"Poor tracking on moving enemies is usually a Free Look sensitivity issue. Increase Free Look by 5-10 points or select the 'Movement' playstyle." },
    { keywords:["device","phone","which phone"], answer:"Enter your exact device name in the Device Input section. If it's in our starter database, we use real approximate specs; otherwise we estimate based on your RAM/storage and clearly mark it as estimated." },
    { keywords:["headshot","percentage","guarantee"], answer:"We never guarantee a specific headshot percentage or 'aimlock' — that's not how sensitivity settings work. We provide Headshot Optimization scoring based on calculated aim stability and recoil control." },
    { keywords:["update","ob54","version"], answer:"Check the Game Version section for the currently active calibration profile and revision. It's manually maintained — see the README for how new OB updates get incorporated." }
  ];

  function localAnswer(question) {
    const q = question.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    KNOWLEDGE_BASE.forEach(entry => {
      let score = 0;
      entry.keywords.forEach(kw => { if (q.includes(kw)) score++; });
      if (score > bestScore) { bestScore = score; bestMatch = entry; }
    });

    if (bestMatch && bestScore > 0) return bestMatch.answer;

    return "I don't have a specific answer for that yet. Try asking about sensitivity values, recoil, drag headshots, long range, close range, or fire button sizing — or check the Diagnostics section for common issues.";
  }

  async function ask(question, context = {}) {
    if (CONFIG.remoteEndpoint) {
      try {
        const res = await fetch(CONFIG.remoteEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, context })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.answer) return data.answer;
        }
      } catch (e) {
        // fall through to local fallback silently
      }
    }
    return localAnswer(question);
  }

  return { ask, localAnswer, CONFIG };
})();