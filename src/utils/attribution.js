const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "campaign_id",
  "adset_id",
  "ad_id",
];

export function readAttribution(search = window.location.search) {
  const params = new URLSearchParams(search);
  return attributionKeys.reduce((result, key) => {
    const value = params.get(key);
    if (value) result[key] = value;
    return result;
  }, {});
}
