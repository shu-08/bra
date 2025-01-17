import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import netflixIcon from '../icon/netflixIcon.svg';
import youtubeIcon from '../icon/youtubeIcon.svg';
import axios from 'axios';

// Sony IRCC APIに送信する関数
const sendIRCC = async (irccCode, setStatus, setError) => {
  const url = 'http://192.168.11.2/sony/ircc/'; // IPアドレスを指定

  const body = `
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <s:Body>
        <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
          <IRCCCode>${irccCode}</IRCCCode>
        </u:X_SendIRCC>
      </s:Body>
    </s:Envelope>
  `;

  const headers = {
    'Accept': '*/*',
    'Content-Type': 'text/xml; charset=UTF-8',
    'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
    'X-Auth-PSK': '0808',  // ここでPSKを指定
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('IRCC Command Success:', response.data);
    setStatus('送信成功');
    setError('');
  } catch (err) {
    console.error('Error sending IRCC command:', err);
    setStatus('');
    setError('送信失敗');
  }
};

export default function ButtonComponent() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // アイコンがクリックされた時にログを出力するハンドラ
  const activateApp = async (uri, setStatus, setError) => {
    const url = 'http://192.168.11.2/sony/appControl/';  // Sony TVのIPアドレス
  
    const body = {
      method: 'setActiveApp',
      id: 601,
      params: [
        {
          uri: uri,  // 動的に渡されたuriを使う
        },
      ],
      version: '1.0',
    };
  
    const headers = {
      'X-Auth-PSK': '0808',  // PSKの指定
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.post(url, body, { headers });
      console.log('App activated:', response.data);
      setStatus('アプリ起動成功');
      setError('');
    } catch (error) {
      console.error('Error activating app:', error);
      setStatus('');
      setError('アプリ起動失敗');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',  // ロゴとボタンを縦に並べる
      }}
    >
      {/* ステータス表示を上部に移動 */}
      <Box sx={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center' }}>
        {status && <Typography variant="body2" color="success.main">{status}</Typography>}
        {error && <Typography variant="body2" color="error.main">{error}</Typography>}
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: 200,
          height: 300,  // 高さを少し広げる
        }}
      >
        {/* アイコンを横並びにする */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
          <img
            src={netflixIcon}
            alt="netflix"
            style={{ width: '100px', height: '50px', marginRight: '10px' }}
            onClick={() => activateApp('com.sony.dtv.com.netflix.ninja.com.netflix.ninja.MainActivity', setStatus, setError)}  // Netflix URIを渡す
          />
          <img
            src={youtubeIcon}
            alt="youtube"
            style={{ width: '100px', height: '50px' }}
            onClick={() => activateApp('com.sony.dtv.com.google.android.youtube.tv.com.google.android.apps.youtube.tv.activity.ShellActivity', setStatus, setError)}  // YouTube URIを渡す
          />
        </Box>

        {/* 上ボタン */}
        <Button
          onClick={() => sendIRCC("AAAAAQAAAAEAAAB0Aw==", setStatus, setError)} // 上方向のIRCCコード
          variant="outlined"
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%) translateY(90px)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ArrowCircleUpRoundedIcon />
        </Button>

        {/* 左ボタン */}
        <Button
          onClick={() => sendIRCC("AAAAAQAAAAEAAAA0Aw==", setStatus, setError)} // 左方向のIRCCコード
          variant="outlined"
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translateX(-5px) translateY(-50%)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ArrowCircleLeftRoundedIcon />
        </Button>

        {/* 右ボタン */}
        <Button
          onClick={() => sendIRCC("AAAAAQAAAAEAAAAzAw==", setStatus, setError)} // 右方向のIRCCコード
          variant="outlined"
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateX(5px) translateY(-50%)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ArrowCircleRightRoundedIcon />
        </Button>

        {/* 下ボタン */}
        <Button
          onClick={() => sendIRCC("AAAAAQAAAAEAAAB1Aw==", setStatus, setError)} // 下方向のIRCCコード
          variant="outlined"
          sx={{
            position: 'absolute',
            bottom: '50px', // 下ボタンと戻るボタンが重ならないように調整
            left: '50%',
            transform: 'translateX(-50%) translateY(-40px)',
            transition: 'transform 0.3s ease',
          }}
        >
          <ArrowCircleDownRoundedIcon />
        </Button>

        {/* 戻るボタン */}
        <Button
          onClick={() => sendIRCC("AAAAAgAAAJcAAAAjAw==", setStatus, setError)} // 戻るボタンのIRCCコード
          variant="outlined"
          sx={{
            width: 200,            // 幅を指定
            height: 40,            // 高さを指定
            fontSize: '1.5rem',    // フォントサイズを指定
            position: 'absolute',
            bottom: 0, // 下ボタンの下に配置
            left: '50%',
            transform: 'translateX(-50%) translateY(-20px)',
            transition: 'transform 0.3s ease',
          }}
        >
          戻る  
        </Button>

        {/* 決定ボタン */}
        <Button
          onClick={() => sendIRCC("AAAAAQAAAAEAAABlAw==", setStatus, setError)} // 決定ボタンのIRCCコード
          variant="contained"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1976d2',
            color: 'white',
            zIndex: 1,
          }}
        >
          決定
        </Button>
      </Box>
    </Box>
  );
}
