# API 문서

TALLY NODE 마스터 모드에서 제공하는 REST API 및 WebSocket API 문서입니다.

## 🌐 REST API

### 기본 정보
- **베이스 URL**: `http://192.168.4.1` (AP 모드) 또는 설정된 IP
- **포트**: 80 (HTTP)
- **데이터 형식**: JSON

### 상태 조회 API

#### GET /api/status
시스템 전체 상태를 조회합니다.

**응답 예시:**
```json
{
  "system": {
    "uptime": 3600,
    "free_heap": 234567,
    "cpu_temp": 45.6,
    "battery": {
      "voltage": 3.85,
      "percentage": 75,
      "charging": false
    }
  },
  "network": {
    "wifi_connected": true,
    "ip": "192.168.1.100",
    "rssi": -45
  },
  "switcher": {
    "connected": true,
    "type": "ATEM",
    "ip": "192.168.1.200",
    "channels": 8
  },
  "lora": {
    "frequency": "915MHz",
    "tx_power": 20,
    "packet_header": 0x42
  }
}
```

#### GET /api/config
현재 설정을 조회합니다.

**응답 예시:**
```json
{
  "wifi": {
    "ssid": "Studio_WiFi",
    "dhcp": true
  },
  "switcher": {
    "type": "ATEM",
    "ip": "192.168.1.200",
    "me_selection": "ME1",
    "channels": 8
  },
  "lora": {
    "packet_header": 66,
    "tx_interval": 200,
    "tx_power": 20
  }
}
```

### 제어 API

#### POST /api/switcher/connect
스위처에 연결합니다.

**요청 본문:**
```json
{
  "ip": "192.168.1.200",
  "type": "ATEM"
}
```

**응답:**
```json
{
  "success": true,
  "message": "ATEM 스위처에 연결되었습니다"
}
```

#### POST /api/switcher/disconnect
스위처 연결을 해제합니다.

**응답:**
```json
{
  "success": true,
  "message": "스위처 연결이 해제되었습니다"
}
```

#### POST /api/lora/sync
LoRa 동기화 코드를 전송합니다.

**요청 본문:**
```json
{
  "sync_code": 0xFF
}
```

### 설정 API

#### POST /api/config/wifi
WiFi 설정을 변경합니다.

**요청 본문:**
```json
{
  "ssid": "New_WiFi",
  "password": "new_password",
  "dhcp": true
}
```

#### POST /api/config/switcher
스위처 설정을 변경합니다.

**요청 본문:**
```json
{
  "type": "vMix",
  "ip": "192.168.1.201",
  "port": 8099,
  "me_selection": "ME1",
  "channels": 16
}
```

## 🔌 WebSocket API

### 연결 정보
- **엔드포인트**: `ws://192.168.4.1/ws`
- **프로토콜**: WebSocket (RFC 6455)

### 실시간 데이터 스트림

#### Tally 상태 브로드캐스트
```json
{
  "type": "tally_update",
  "timestamp": 1640995200,
  "channels": [
    {
      "id": 1,
      "program": true,
      "preview": false
    },
    {
      "id": 2,
      "program": false,
      "preview": true
    }
  ]
}
```

#### 시스템 상태 브로드캐스트
```json
{
  "type": "system_status",
  "timestamp": 1640995200,
  "data": {
    "battery": 75,
    "temperature": 45.6,
    "free_heap": 234567,
    "connected_receivers": 5
  }
}
```

#### 로그 메시지
```json
{
  "type": "log",
  "level": "info",
  "timestamp": 1640995200,
  "message": "ATEM 스위처에 연결되었습니다"
}
```

### 클라이언트 명령

#### 설정 요청
```json
{
  "type": "get_config",
  "category": "switcher"
}
```

#### 재부팅 명령
```json
{
  "type": "reboot"
}
```

## 🔐 인증 및 보안

### 기본 인증
현재 버전은 기본 인증을 사용하지 않습니다. WiFi AP 비밀번호가 첫 번째 보안 단계입니다.

### CORS 정책
- 모든 도메인에서 접근 허용
- Preflight 요청 지원

## 📝 사용 예시

### JavaScript (Fetch API)
```javascript
// 상태 조회
const status = await fetch('/api/status').then(r => r.json());
console.log('배터리 레벨:', status.system.battery.percentage);

// 스위처 연결
const response = await fetch('/api/switcher/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ip: '192.168.1.200',
    type: 'ATEM'
  })
});
```

### WebSocket 연결
```javascript
const ws = new WebSocket('ws://192.168.4.1/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'tally_update') {
    updateTallyDisplay(data.channels);
  }
};

// 설정 요청
ws.send(JSON.stringify({
  type: 'get_config',
  category: 'switcher'
}));
```

### Python
```python
import requests
import websocket

# REST API 사용
response = requests.get('http://192.168.4.1/api/status')
status = response.json()
print(f"배터리: {status['system']['battery']['percentage']}%")

# WebSocket 사용
def on_message(ws, message):
    data = json.loads(message)
    if data['type'] == 'tally_update':
        print(f"채널 {data['channels'][0]['id']} 상태 업데이트")

ws = websocket.WebSocketApp("ws://192.168.4.1/ws", on_message=on_message)
ws.run_forever()
```

## 🚨 오류 처리

### HTTP 오류 코드
- **400 Bad Request**: 잘못된 요청 형식
- **404 Not Found**: 존재하지 않는 엔드포인트
- **500 Internal Server Error**: 서버 내부 오류

### 오류 응답 형식
```json
{
  "success": false,
  "error": "Invalid IP address format",
  "code": "INVALID_IP"
}
```

### WebSocket 오류
```json
{
  "type": "error",
  "message": "Invalid command format",
  "code": "INVALID_COMMAND"
}
```

---

다음: [서버 설정](../server/setup.md)