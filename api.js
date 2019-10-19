const request = require('request');

export function getLastLocation(socket_id) {
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

  request(params, function (err, resp, body) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(body);
  });
};
