/* ZAYROX LAB — Sensitivity Diagnostics */
window.Diagnostics = (function () {

  const PROBLEM_DB = {
    overshoot:            { title:"Overshoot", cause:"General/Red Dot sensitivity is too high relative to your device performance, causing your aim to pass the target.", adjustment:"Reduce General by 5–10 points and Red Dot by 3–7 points." },
    undershoot:           { title:"Undershoot", cause:"Sensitivity is too low for your current DPI/device combination — aim falls short of the target.", adjustment:"Increase General by 5–8 points and Red Dot by 3–6 points." },
    highRecoil:           { title:"High Recoil", cause:"Weapon recoil compensation is not matched with your current sensitivity curve.", adjustment:"Lower Red Dot and 2X sensitivity by 5–8% and practice pull-down compensation." },
    lowRecoilControl:     { title:"Low Recoil Control", cause:"Sensitivity is too reactive, causing overcorrection during spray fire.", adjustment:"Reduce General and Red Dot slightly, or switch to the Recoil Control playstyle." },
    slowDrag:             { title:"Slow Drag", cause:"Red Dot/2X sensitivity is too low for smooth drag headshots.", adjustment:"Increase Red Dot by 5–10 points." },
    excessiveDrag:        { title:"Excessive Drag", cause:"Red Dot/2X sensitivity is too high, causing the drag to overshoot the head.", adjustment:"Decrease Red Dot by 5–10 points." },
    aimAboveHead:         { title:"Aim Going Above Head", cause:"Vertical sensitivity combined with recoil is causing your aim to rise above the target after the first few shots.", adjustment:"Reduce 2X/4X by 5–8 points and select the Recoil Control playstyle." },
    aimStickingBody:      { title:"Aim Sticking to Body", cause:"Sensitivity is too low to flick up from body tracking to head level.", adjustment:"Increase General/Red Dot slightly and practice flick calibration in Training Mode." },
    poorMovingTracking:   { title:"Poor Moving-Target Tracking", cause:"Free Look/General sensitivity isn't optimized for tracking lateral enemy movement.", adjustment:"Increase Free Look by 5–10 points and select the Movement playstyle." },
    longRangeInstability: { title:"Long-Range Instability", cause:"4X/Sniper sensitivity is too high for fine long-range adjustments.", adjustment:"Reduce 4X and Sniper by 5–8 points and select the Long Range playstyle." },
    closeRangeInstability:{ title:"Close-Range Instability", cause:"General/Red Dot sensitivity is too low for fast close-range reactions.", adjustment:"Increase General and Red Dot, or select the Close Range playstyle." },
    scopeInstability:     { title:"Scope Instability", cause:"Scope sensitivities are not proportioned relative to General sensitivity.", adjustment:"Regenerate the profile with updated device data, or adjust 2X/4X/Sniper individually in small increments." }
  };

  const TRAINING_DB = {
    bodyShots:     { field:'general', label:'General', adjustment:+3, tip:"Slightly increasing General sensitivity helps you flick up to head level more consistently." },
    overshoot:     { field:'general', label:'General', adjustment:-4, tip:"Lowering General sensitivity reduces overshooting past the target." },
    undershoot:    { field:'general', label:'General', adjustment:+4, tip:"Raising General sensitivity helps you reach targets faster." },
    recoil:        { field:'redDot',  label:'Red Dot',  adjustment:-3, tip:"Lowering Red Dot sensitivity improves recoil control during spray." },
    movingTargets: { field:'freeLook',label:'Free Look',adjustment:+5, tip:"Increasing Free Look sensitivity helps you track moving enemies more smoothly." },
    longRange:     { field:'x4',      label:'4X Scope', adjustment:-3, tip:"Lowering 4X sensitivity allows finer long-range aim adjustments." },
    closeRange:    { field:'redDot',  label:'Red Dot',  adjustment:+3, tip:"Increasing Red Dot sensitivity improves close-range reaction speed." }
  };

  function runDiagnostics(selectedProblems) {
    return selectedProblems
      .filter(p => PROBLEM_DB[p])
      .map(p => ({ key: p, ...PROBLEM_DB[p] }));
  }

  function getTrainingAdjustment(problemKey) {
    return TRAINING_DB[problemKey] || null;
  }

  return { runDiagnostics, getTrainingAdjustment, PROBLEM_DB, TRAINING_DB };
})();
