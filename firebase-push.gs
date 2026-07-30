/**
 * FSG Portal — Firebase REST Push Functions
 *
 * These Google Apps Script functions push data to Firestore via the Firebase REST API.
 * Use them in your Master Spec Sheet scripts after reading/calculating brand data.
 *
 * Setup:
 * 1. Copy this file into your Apps Script project (script.google.com)
 * 2. Set the FIREBASE_API_KEY and PROJECT_ID constants below
 * 3. Obtain a Firebase ID token via signInWithPassword or service account (see getFirebaseToken below)
 */

var FIREBASE_API_KEY = 'AIzaSyAET8-_V4kvkyXjqpEWEZYMCmki-ITMZlM';
var PROJECT_ID = 'fsg-portal-c4da6';
var FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents';

// ---------------------------------------------------------------------------
// Auth helper — sign in with a service account email/password
// (or replace with OAuth2 service-account flow for production use)
// ---------------------------------------------------------------------------
function getFirebaseToken(email, password) {
  var url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FIREBASE_API_KEY;
  var payload = JSON.stringify({ email: email, password: password, returnSecureToken: true });
  var response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true,
  });
  var result = JSON.parse(response.getContentText());
  if (!result.idToken) throw new Error('Auth failed: ' + response.getContentText());
  return result.idToken;
}

// ---------------------------------------------------------------------------
// Firestore REST helpers
// ---------------------------------------------------------------------------
function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'string') return { stringValue: val };
  if (val instanceof Date) return { timestampValue: val.toISOString() };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    var fields = {};
    Object.keys(val).forEach(function(k) { fields[k] = toFirestoreValue(val[k]); });
    return { mapValue: { fields: fields } };
  }
  return { stringValue: String(val) };
}

function toFirestoreDocument(data) {
  var fields = {};
  Object.keys(data).forEach(function(k) { fields[k] = toFirestoreValue(data[k]); });
  return { fields: fields };
}

function firestorePatch(path, data, idToken) {
  var url = FIRESTORE_BASE + '/' + path;
  var body = JSON.stringify(toFirestoreDocument(data));
  var response = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + idToken },
    payload: body,
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() >= 400) {
    throw new Error('Firestore error ' + response.getResponseCode() + ': ' + response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

// ---------------------------------------------------------------------------
// pushWeeklyDataToFirebase
//
// Pushes a full week's data for a brand to:
//   /brands/{brandSlug}/weekly/{weekLabel}
//
// @param {string} brandSlug  e.g. "supermush"
// @param {string} weekLabel  e.g. "WK31"
// @param {object} data       Weekly data object (see Firestore schema in README)
// @param {string} idToken    Firebase ID token from getFirebaseToken()
// ---------------------------------------------------------------------------
function pushWeeklyDataToFirebase(brandSlug, weekLabel, data, idToken) {
  var path = 'brands/' + brandSlug + '/weekly/' + weekLabel;
  data.updatedAt = new Date();
  var result = firestorePatch(path, data, idToken);

  // Also update brand's lastUpdated
  firestorePatch('brands/' + brandSlug, {
    name: data.brandName || brandSlug,
    slug: brandSlug,
    lastUpdated: new Date(),
  }, idToken);

  Logger.log('✅ Weekly data pushed for ' + brandSlug + ' / ' + weekLabel);
  return result;
}

// ---------------------------------------------------------------------------
// pushDailyDataToFirebase
//
// Pushes a single day's data for a brand to:
//   /brands/{brandSlug}/daily/{date}
//
// @param {string} brandSlug  e.g. "supermush"
// @param {string} date       ISO date string e.g. "2026-07-28"
// @param {object} data       Daily data object
// @param {string} idToken    Firebase ID token
// ---------------------------------------------------------------------------
function pushDailyDataToFirebase(brandSlug, date, data, idToken) {
  var path = 'brands/' + brandSlug + '/daily/' + date;
  var result = firestorePatch(path, data, idToken);
  Logger.log('✅ Daily data pushed for ' + brandSlug + ' / ' + date);
  return result;
}

// ---------------------------------------------------------------------------
// pushInventoryDataToFirebase
//
// Pushes an inventory snapshot for a brand to:
//   /brands/{brandSlug}/inventory/{dateLabel}
//
// @param {string} brandSlug  e.g. "supermush"
// @param {string} dateLabel  e.g. "2026-07-28" or "WK31-2026-07-28"
// @param {object} data       Inventory data object (must include products array)
// @param {string} idToken    Firebase ID token
// ---------------------------------------------------------------------------
function pushInventoryDataToFirebase(brandSlug, dateLabel, data, idToken) {
  var path = 'brands/' + brandSlug + '/inventory/' + dateLabel;
  data.updatedAt = new Date();
  var result = firestorePatch(path, data, idToken);
  Logger.log('✅ Inventory data pushed for ' + brandSlug + ' / ' + dateLabel);
  return result;
}

// ---------------------------------------------------------------------------
// Example usage — call this from your Master Spec Sheet trigger
// ---------------------------------------------------------------------------
function examplePushAll() {
  var token = getFirebaseToken('your-service@flagshipgrowth.com', 'your-password');

  // Weekly example
  pushWeeklyDataToFirebase('supermush', 'WK31', {
    weekLabel: 'WK31',
    dateRange: 'Jul 28 – Aug 3, 2026',
    weekStart: '2026-07-28',
    weekEnd: '2026-08-03',
    sales: 42850,
    prevSales: 38200,
    adSales: 18400,
    prevAdSales: 16100,
    spend: 5200,
    prevSpend: 4800,
    roas: 3.54,
    prevRoas: 3.35,
    tacos: 12.1,
    acos: 28.3,
    units: 1240,
    clicks: 8900,
    orders: 1240,
    ntb: 312,
    impressions: 245000,
    cvr: 13.9,
    ctr: 3.6,
    organicSales: 24450,
    dailyTotals: {
      '2026-07-28': 5800,
      '2026-07-29': 6200,
      '2026-07-30': 6400,
      '2026-07-31': 6100,
      '2026-08-01': 6500,
      '2026-08-02': 6900,
      '2026-08-03': 4950,
    },
    topProducts: [
      { name: 'SuperMush Daily 10', asin: 'B0EXAMPLE1', sales: 12400, units: 360, sessions: 2100, cvr: 17.1, wow: 8.2 },
      { name: 'SuperMush Focus', asin: 'B0EXAMPLE2', sales: 9800, units: 290, sessions: 1800, cvr: 16.1, wow: -3.4 },
    ],
    insights: '► Sales grew 12% WoW driven by Lion\'s Mane SKU.\n► TACoS at 12.1% is within target range.\n► Recommend increasing bid on Focus keyword cluster.',
    brandName: 'SuperMush',
  }, token);

  // Daily example
  pushDailyDataToFirebase('supermush', '2026-07-28', {
    date: '2026-07-28',
    dayLabel: 'Mon Jul 28',
    sales: 5800,
    adSales: 2400,
    spend: 680,
    roas: 3.53,
    acos: 28.3,
    tacos: 11.7,
    units: 168,
    clicks: 1200,
    orders: 168,
    impressions: 33000,
    cvr: 14.0,
    ctr: 3.6,
  }, token);

  // Inventory example
  pushInventoryDataToFirebase('supermush', '2026-07-28', {
    dateLabel: '2026-07-28',
    weekLabel: 'WK31',
    products: [
      {
        sku: 'SM-DAILY-10-60CT',
        atFba: 2400,
        available: 1800,
        inbound: 600,
        fcTransfer: 0,
        reserve: 0,
        weeklyAvg: 360,
        l30Sold: 1440,
        weeksLeft: 5,
        recToShip: 1800,
      },
    ],
    insights: '► SM-DAILY-10-60CT has 5 weeks of supply — place PO immediately.\n► Recommend shipping 1800 units to maintain 9-week buffer.',
  }, token);
}
