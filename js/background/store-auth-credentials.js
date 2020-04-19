async function storeAuthCredentials(details) {
  console.log("storeAuthCredentials", details);
  const params = Object.keys(details.requestBody.formData).reduce(
    (accum, key) => {
      accum[key] = details.requestBody.formData[key][0];

      return accum;
    },
    {}
  );
  await setStorageValue({
    [STORAGE_KEYS.refreshTokenUrl]: details.url,
    [STORAGE_KEYS.refreshTokenParams]: params,
  });
  return { cancel: false };
}

async function requestRefreshToken() {
  chrome.webRequest.onBeforeRequest.removeListener(storeAuthCredentials);
  const { refreshTokenUrl, refreshTokenParams } = await getStorageValues([
    STORAGE_KEYS.refreshTokenParams,
    STORAGE_KEYS.refreshTokenUrl,
  ]);
  const response = await fetch(refreshTokenUrl, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(refreshTokenParams),
  });

  const responseJson = await response.json();
  console.log("refreshTokenResponse", responseJson);
  chrome.webRequest.onBeforeRequest.addListener(
    storeAuthCredentials,
    { urls: [AUTH_URL_PATTERN] },
    ["requestBody"]
  );
  return responseJson;
}

async function replaceAuthHeader(newAuthHeader) {
  const { headers } = await getStorageValues(["headers"]);
  console.log("replaceAuthHeader", headers, {
    ...headers,
    Authorization: newAuthHeader,
  });
  await setStorageValue({
    headers: { ...headers, Authorization: newAuthHeader },
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  storeAuthCredentials,
  { urls: [AUTH_URL_PATTERN] },
  ["requestBody"]
);
