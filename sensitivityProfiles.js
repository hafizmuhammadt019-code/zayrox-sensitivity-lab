/*
  Base modifiers used by the Sensitivity Engine.
  All values are MULTIPLIERS applied on top of base sensitivity numbers.
*/
window.SENSITIVITY_BASE_DATA = {

  // Base values calibrated at DPI 480, mid-tier device (perf 70), 4GB RAM, balanced style
  base: {
    general: 100,
    redDot: 92,
    x2: 82,
    x4: 68,
    sniper: 42,
    freeLook: 108
  },

  playstyleModifiers: {
    balanced:      { general:1.00, redDot:1.00, x2:1.00, x4:1.00, sniper:1.00, freeLook:1.00 },
    aggressive:    { general:1.12, redDot:1.10, x2:1.05, x4:0.95, sniper:0.85, freeLook:1.15 },
    oneTap:        { general:0.95, redDot:0.92, x2:0.90, x4:0.88, sniper:0.90, freeLook:0.95 },
    dragHeadshot:  { general:1.05, redDot:1.15, x2:1.08, x4:0.95, sniper:0.90, freeLook:1.05 },
    closeRange:    { general:1.15, redDot:1.12, x2:0.95, x4:0.85, sniper:0.80, freeLook:1.18 },
    midRange:      { general:1.00, redDot:1.02, x2:1.05, x4:1.02, sniper:0.95, freeLook:1.00 },
    longRange:     { general:0.85, redDot:0.90, x2:0.95, x4:1.05, sniper:1.10, freeLook:0.85 },
    recoilControl: { general:0.88, redDot:0.90, x2:0.92, x4:0.95, sniper:0.95, freeLook:0.90 },
    movement:      { general:1.10, redDot:1.05, x2:1.00, x4:0.95, sniper:0.90, freeLook:1.20 },
    custom:        { general:1.00, redDot:1.00, x2:1.00, x4:1.00, sniper:1.00, freeLook:1.00 }
  },

  rangeModifiers: {
    balanced: { general:1.00, redDot:1.00, x2:1.00, x4:1.00, sniper:1.00, freeLook:1.00 },
    close:    { general:1.10, redDot:1.08, x2:0.95, x4:0.85, sniper:0.80, freeLook:1.10 },
    mid:      { general:1.00, redDot:1.00, x2:1.05, x4:1.00, sniper:0.95, freeLook:1.00 },
    long:     { general:0.90, redDot:0.92, x2:0.98, x4:1.08, sniper:1.12, freeLook:0.88 }
  },

  weaponModifiers: {
    AUG:        { general:1.00, redDot:0.98, x2:1.00, x4:1.00, sniper:1.00, note:"Moderate recoil. Slightly reduced Red Dot keeps burst tracking tighter." },
    SCAR:       { general:1.02, redDot:1.00, x2:1.00, x4:1.00, sniper:1.00, note:"Balanced recoil pattern, works well with generated defaults." },
    AK47:       { general:0.92, redDot:0.90, x2:0.95, x4:1.00, sniper:1.00, note:"High vertical recoil — lower Red Dot recommended to control climb." },
    PARAFAL:    { general:1.00, redDot:1.00, x2:1.02, x4:1.00, sniper:1.00, note:"Fast fire rate rewards slightly higher Red Dot for tap consistency." },
    Woodpecker: { general:1.00, redDot:1.00, x2:1.00, x4:1.00, sniper:0.95, note:"Semi-auto marksman rifle — Sniper scope sensitivity tuned down for precision." },
    AWM:        { general:1.00, redDot:1.00, x2:1.00, x4:1.00, sniper:0.90, note:"High damage bolt-action — lower Sniper sensitivity aids one-shot accuracy." },
    M82B:       { general:1.00, redDot:1.00, x2:1.00, x4:1.00, sniper:0.88, note:"Heavy recoil sniper — reduced Sniper sensitivity minimizes scope drift." },
    MP40:       { general:1.08, redDot:1.05, x2:1.00, x4:1.00, sniper:1.00, note:"Fast close-range SMG — slightly higher General/Red Dot for quick flicks." },
    UMP:        { general:1.05, redDot:1.04, x2:1.00, x4:1.00, sniper:1.00, note:"Balanced SMG recoil, minor boost to General for rushing playstyles." },
    MP5:        { general:1.06, redDot:1.05, x2:1.00, x4:1.00, sniper:1.00, note:"High fire-rate SMG benefits from increased Red Dot tracking speed." },
    M1887:      { general:1.15, redDot:1.00, x2:1.00, x4:1.00, sniper:1.00, note:"Shotgun — higher General sensitivity aids fast flick-shots at close range." },
    M1014:      { general:1.12, redDot:1.00, x2:1.00, x4:1.00, sniper:1.00, note:"Semi-auto shotgun — moderate General boost for repeated close engagements." }
  }
};