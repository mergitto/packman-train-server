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

  })
}
