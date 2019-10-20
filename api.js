const request = require('request');

export async function getLastLocation(socket_id) {
  const url = encodeURI(`https://packman.cybozu.com/k/v1/records.json?app=5&query=socket_id=${socket_id}`);
  let params = {
    url: url,
    method: 'GET',
    json: true,
    // 本当はtokenを乗せてはいけない
    headers: {
      'X-Cybozu-API-Token': 'LPjpRT5Ekix06RdzJK78cwLpg0VlY2vrdYqA8zGi',
    },
  };

  return await requestApi(params);
};

export async function createLocation(socket_id, lat, lon) {
  let obj = {
    app: 5,
    record: {
      socket_id: {
        value: socket_id
      },
      lat: {
        value: lat
      },
      lon: {
        value: lon
      }
    }
  };

  let params = {
    url: 'https://packman.cybozu.com/k/v1/record.json',
    method: 'POST',
    json: true,
    headers: {
      'X-Cybozu-API-Token': 'LPjpRT5Ekix06RdzJK78cwLpg0VlY2vrdYqA8zGi',
      'Content-Type': 'application/json',
    },
    body: obj,
  };

  return await requestApi(params);
}

function requestApi(params) {
  return new Promise((resolve, reject) => {
    request(params, (err, response, body) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(body);
    });
  });
}
