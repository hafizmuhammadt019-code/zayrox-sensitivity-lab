/* ZAYROX LAB — Sensitivity Engine
   A deterministic, weighted calculation engine. No random values.
   All outputs clamped between 0–200 (Free Fire's sensitivity scale). */
window.SensitivityEngine = (function () {

  function computeValue(baseValue, perfFactor, ramFactor, playstyleMult, rangeMult, weaponMult, dpiFactor) {
    const raw = baseValue * perfFactor * ramFactor * playstyleMult * rangeMult * weaponMult * dpiFactor;
    return Utils.clamp(Math.round(raw), 1, 200);
  }

  function generate(deviceProfile, options) {
    const data = window.SENSITIVITY_BASE_DATA;
    const playstyle = options.playstyle || 'balanced';
    const range = options.range || 'balanced';
    const weapon = options.weapon || null;
    const dpi = options.dpiMode === 'experimental'
      ? Utils.clamp(Number(options.customDpi) || 480, 100, 1200)
      : 480;

    const perfScore = deviceProfile.performanceScore || 50;
    const ram = deviceProfile.ram || 4;

    // Performance factor: 0.82 (weak devices, lower sens for stability) to 1.18 (flagship, can push higher)
    const perfFactor = 0.82 + (perfScore / 100) * 0.36;

    // RAM factor: more RAM -> more multitasking/game stability -> slight upward tuning allowance
    const ramFactor = Utils.clamp(0.92 + (ram / 50), 0.92, 1.08);

    // DPI compensation: engine is calibrated at 480 DPI; scale inversely if DPI changes
    const dpiFactor = 480 / dpi;

    const playstyleMods = data.playstyleModifiers[playstyle] || data.playstyleModifiers.balanced;
    const rangeMods = data.rangeModifiers[range] || data.rangeModifiers.balanced;
    const weaponMods = (weapon && data.weaponModifiers[weapon]) || { general:1, redDot:1, x2:1, x4:1, sniper:1, note:"" };

    const profile = {
      dpi,
      general: computeValue(data.base.general, perfFactor, ramFactor, playstyleMods.general, rangeMods.general, weaponMods.general, dpiFactor),
      redDot:  computeValue(data.base.redDot,  perfFactor, ramFactor, playstyleMods.redDot,  rangeMods.redDot,  weaponMods.redDot,  dpiFactor),
      x2:      computeValue(data.base.x2,      perfFactor, ramFactor, playstyleMods.x2,      rangeMods.x2,      weaponMods.x2,      dpiFactor),
      x4:      computeValue(data.base.x4,      perfFactor, ramFactor, playstyleMods.x4,      rangeMods.x4,      weaponMods.x4,      dpiFactor),
      sniper:  computeValue(data.base.sniper,  perfFactor, ramFactor, playstyleMods.sniper,  rangeMods.sniper,  weaponMods.sniper,  dpiFactor),
      freeLook:computeValue(data.base.freeLook,perfFactor, ramFactor, playstyleMods.freeLook,rangeMods.freeLook,1,                  dpiFactor)
    };

    // Fire button: weaker devices get a larger, easier-to-hit button; stronger devices allow a more precise smaller button
    let fireButton = 68 - Math.round(perfScore / 8);
    fireButton = Utils.clamp(fireButton, 45, 75);
    profile.fireButton = fireButton;
    profile.fireButtonReason = perfScore >= 70
      ? "Smaller button chosen — your device performance supports precise, quick-reaction taps without accidental misses."
      : "Larger button chosen — compensates for lower device responsiveness, reducing the chance of missed taps.";

    profile.weaponNote = weaponMods.note || "";
    profile.scores = computeScores(profile, deviceProfile, { playstyle, range, weapon });
    profile.playstyle = playstyle;
    profile.range = range;
    profile.weapon = weapon;

    return profile;
  }

  function computeScores(profile, deviceProfile, options) {
    const perfScore = deviceProfile.performanceScore || 50;
    const ram = deviceProfile.ram || 4;

    // Aim stability: driven mainly by device performance + RAM headroom
    const aimStability = Utils.clamp(Math.round(perfScore * 0.7 + Math.min(ram, 8) * 2.5), 0, 100);

    // Recoil control: penalize if Red Dot/General are pushed very high relative to base (risk of overcorrection)
    const redDotDeviation = Math.abs(profile.redDot - 92) / 92;
    const recoilControl = Utils.clamp(Math.round(90 - redDotDeviation * 60 + (perfScore * 0.15)), 0, 100);

    // Headshot control: blended from stability + recoil + how tuned general/red dot is
    const headshotControl = Utils.clamp(Math.round((aimStability * 0.5) + (recoilControl * 0.5)), 0, 100);

    // Movement: driven by Free Look tuning + device performance
    const freeLookDeviation = Math.abs(profile.freeLook - 108) / 108;
    const movement = Utils.clamp(Math.round(85 - freeLookDeviation * 40 + (perfScore * 0.15)), 0, 100);

    // Range scores: how well-suited current values are to each range band
    const closeRange = Utils.clamp(Math.round((profile.general / 130) * 50 + (profile.redDot / 110) * 50), 0, 100);
    const midRange = Utils.clamp(Math.round((profile.x2 / 95) * 50 + (perfScore * 0.4)), 0, 100);
    const longRange = Utils.clamp(Math.round((100 - Math.abs(profile.x4 - 68)) * 0.5 + (100 - Math.abs(profile.sniper - 42)) * 0.5), 0, 100);

    const overall = Utils.clamp(
      Math.round(
        headshotControl * 0.25 +
        recoilControl * 0.2 +
        movement * 0.15 +
        aimStability * 0.15 +
        closeRange * 0.08 +
        midRange * 0.08 +
        longRange * 0.09
      ), 0, 100
    );

    return { overall, headshotControl, recoilControl, movement, aimStability, closeRange, midRange, longRange };
  }

  return { generate };
})();