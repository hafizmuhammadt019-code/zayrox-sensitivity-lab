/*
  Update this file whenever a new Free Fire OB version releases.
  This drives the "Game Version" section and can shift the calibrationFactor
  slightly if a new update changes recoil/aim mechanics.
*/
window.GAME_VERSION_DATA = {
  currentVersion: "OB54",
  lastUpdated: "2025-01-15",
  profileRevision: "1.0.0",
  calibrationFactor: 1.0, // multiply into engine if a patch requires global tuning
  versionNotes: "Baseline calibration profile. Update this note after verifying new OB update's recoil/aim behavior changes."
};
