/* ZAYROX LAB — Device Analyzer
   Matches user input against the starter device database. If not found,
   estimates a profile using RAM/storage heuristics and clearly flags it. */
window.DeviceAnalyzer = (function () {

  function findDeviceInDatabase(name) {
    const query = name.trim().toLowerCase();
    if (!query) return null;
    const db = window.DEVICE_DATABASE || {};
    // exact key match first
    if (db[query]) return { key: query, ...db[query] };
    // fuzzy substring match (either direction)
    for (const key in db) {
      if (query.includes(key) || key.includes(query)) {
        return { key, ...db[key] };
      }
    }
    return null;
  }

  // Heuristic estimation when device is unknown
  function estimateFromSpecs(ram, storage) {
    let tier = "ENTRY";
    let baseScore = 30;

    if (ram <= 3) { tier = "ENTRY"; baseScore = 32; }
    else if (ram === 4) { tier = "BALANCED"; baseScore = 52; }
    else if (ram === 6) { tier = "BALANCED"; baseScore = 64; }
    else if (ram === 8) { tier = "HIGH"; baseScore = 76; }
    else if (ram >= 12) { tier = "FLAGSHIP"; baseScore = 90; }

    // storage gives a small nudge (larger storage often correlates with better tier device)
    if (storage >= 256) baseScore += 4;
    else if (storage >= 128) baseScore += 2;

    baseScore = Utils.clamp(baseScore, 0, 100);

    return {
      chipset: "Unknown (Estimated)",
      gpu: "Unknown (Estimated)",
      android: "Estimated — varies by device",
      screen: "Unknown",
      refreshRate: "60Hz (assumed)",
      tier,
      baseScore
    };
  }

  function analyze(deviceName, ram, storage) {
    ram = Number(ram);
    storage = Number(storage);
    const found = findDeviceInDatabase(deviceName);

    let result;
    let verified = false;

    if (found) {
      verified = true;
      // Adjust base score slightly if user RAM differs from the DB's typical RAM
      let scoreAdjust = 0;
      if (found.typicalRam && ram !== found.typicalRam) {
        scoreAdjust = (ram - found.typicalRam) * 2; // +/- small nudge per GB difference
      }
      result = {
        model: deviceName.trim() || found.key,
        chipset: found.chipset,
        gpu: found.gpu,
        android: found.android,
        screen: found.screen,
        refreshRate: found.refreshRate,
        tier: found.tier,
        performanceScore: Utils.clamp(Math.round(found.baseScore + scoreAdjust), 0, 100)
      };
    } else {
      const estimated = estimateFromSpecs(ram, storage);
      result = {
        model: deviceName.trim() || "Unknown Device",
        chipset: estimated.chipset,
        gpu: estimated.gpu,
        android: estimated.android,
        screen: estimated.screen,
        refreshRate: estimated.refreshRate,
        tier: estimated.tier,
        performanceScore: estimated.baseScore
      };
    }

    result.ram = ram;
    result.storage = storage;
    result.verified = verified;

    return result;
  }

  return { analyze, findDeviceInDatabase };
})();