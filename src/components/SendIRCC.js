import React, { useState } from 'react';

const SendIRCC = () => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const sendIRCC = async () => {
    const url = 'http://192.168.11.2/sony/ircc'; // IPアドレスとパスを指定

    const body = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
          <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
            <IRCCCode>AAAAAQAAAAEAAAAVAw==</IRCCCode>
          </u:X_SendIRCC>
        </s:Body>
      </s:Envelope>
    `;

    const headers = {
      'Accept': '*/*',
      'Content-Type': 'text/xml; charset=UTF-8',
      'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
      'X-Auth-PSK': '1234',
      'Connection': 'Keep-Alive',
      'Content-Length': body.length.toString(),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();
      setStatus('Request Successful');
      console.log('Response:', text);
    } catch (err) {
      setError(`Request Failed: ${err.message}`);
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h1>Send IRCC Command to Sony TV</h1>
      <button onClick={sendIRCC}>Send Command</button>
      {status && <p>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SendIRCC;
