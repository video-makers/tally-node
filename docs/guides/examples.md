# 사용 예시

다양한 환경에서 TALLY NODE를 활용하는 실제 사례들을 소개합니다.

## 🎬 방송국 스튜디오

### 환경 구성
- **스위처**: ATEM Television Studio Pro 4K
- **카메라**: 4대 (고정 3대, 지미집 1대)
- **통신 거리**: 최대 100m
- **리시버**: 4개

### 설정
```json
{
  "switcher": {
    "type": "ATEM",
    "ip": "192.168.1.240",
    "me_selection": "ME1",
    "channels": 4
  },
  "lora": {
    "frequency": "915MHz",
    "tx_power": 15,
    "tx_interval": 150,
    "packet_header": 0x01
  }
}
```

### 배치도
```
스위처실              스튜디오 플로어
┌─────────────┐       ┌─────────────────┐
│ ATEM        │       │ 카메라1 [R1]    │
│ 마스터      │◄─────►│ 카메라2 [R2]    │
│ WiFi 라우터 │       │ 카메라3 [R3]    │
└─────────────┘       │ 지미집  [R4]    │
                      └─────────────────┘
```

### 운용 방식
1. **방송 시작 전**: 모든 리시버 배터리 확인
2. **방송 중**: 스위처실에서 웹 대시보드로 모니터링
3. **방송 후**: 배터리 충전 및 다음 방송 준비

## 🎭 연극/뮤지컬 공연

### 환경 구성  
- **스위처**: vMix 4K (노트북)
- **카메라**: 6대 (무대 양쪽 3대씩)
- **통신 거리**: 최대 200m (대형 공연장)
- **리시버**: 6개

### 설정 (장거리 최적화)
```json
{
  "switcher": {
    "type": "vMix",
    "ip": "192.168.10.100",
    "port": 8099,
    "channels": 6
  },
  "lora": {
    "frequency": "433MHz",
    "tx_power": 22,
    "tx_interval": 100,
    "packet_header": 0x42
  }
}
```

### 특별 고려사항
- **금속 트러스**: 안테나를 트러스 밖으로 배치
- **배터리 수명**: 공연 시간에 맞춰 충분한 용량 확보
- **백업**: 중요 카메라는 유선 백업 병행

## 📹 웨딩/이벤트 촬영

### 환경 구성
- **스위처**: ATEM Mini Pro
- **카메라**: 3대 (고정 2대, 로밍 1대)
- **통신 거리**: 최대 50m
- **리시버**: 3개

### 설정 (배터리 최적화)
```json
{
  "switcher": {
    "type": "ATEM",
    "ip": "192.168.1.241",
    "me_selection": "ME1",
    "channels": 3
  },
  "lora": {
    "frequency": "915MHz", 
    "tx_power": 10,
    "tx_interval": 300,
    "packet_header": 0x03
  }
}
```

### 운용 팁
- **이동성**: 로밍 카메라에는 클립형 마운트 사용
- **신중함**: 중요한 순간 전에 미리 배터리 확인
- **백업**: 추가 배터리팩 준비

## 🏫 교육/강의 녹화

### 환경 구성
- **스위처**: vMix Basic (PC)
- **카메라**: 2대 (강사용, 학생용)
- **통신 거리**: 최대 30m (강의실)
- **리시버**: 2개

### 자동화 설정
```json
{
  "switcher": {
    "type": "vMix",
    "ip": "192.168.1.100",
    "api_key": "auto-switch",
    "channels": 2
  },
  "automation": {
    "auto_switch": true,
    "switch_interval": 30000,
    "preview_delay": 5000
  }
}
```

### 교육용 최적화
- **간단 조작**: 버튼 하나로 전체 시스템 제어
- **안정성**: 유선 네트워크 + 무선 Tally 조합
- **경제성**: 최소 구성으로 최대 효과

## 🎪 실외 이벤트

### 환경 구성
- **스위처**: ATEM Mini Extreme (배터리 구동)
- **카메라**: 4대 (무대, 관객석, 로밍 2대)
- **통신 거리**: 최대 500m (장애물 없음)
- **리시버**: 4개

### 실외 환경 설정
```json
{
  "switcher": {
    "type": "ATEM",
    "ip": "192.168.43.1",
    "mobile_hotspot": true,
    "channels": 4
  },
  "lora": {
    "frequency": "915MHz",
    "tx_power": 22,
    "tx_interval": 200,
    "packet_header": 0x99
  },
  "protection": {
    "waterproof": true,
    "temperature_range": "-10~50C"
  }
}
```

### 실외용 특수 고려사항
- **방수**: IP65 케이스 사용
- **온도**: 직사광선 및 저온 대비
- **전력**: 대용량 배터리팩 또는 발전기
- **통신**: LTE 핫스팟으로 스위처 연결

## 🔧 다중 시스템 환경

### 환경 구성
- **스튜디오 A**: ATEM + TALLY NODE (Header: 0x01)
- **스튜디오 B**: vMix + TALLY NODE (Header: 0x02)
- **동일 건물 내**: 간섭 방지 필요

### 간섭 방지 설정

#### 스튜디오 A
```json
{
  "lora": {
    "frequency": "433MHz",
    "packet_header": 0x01,
    "tx_power": 15,
    "channel_offset": 0
  }
}
```

#### 스튜디오 B  
```json
{
  "lora": {
    "frequency": "433MHz", 
    "packet_header": 0x02,
    "tx_power": 15,
    "channel_offset": 500000
  }
}
```

### 관리 방안
- **패킷 헤더**: 각 시스템마다 고유 헤더 사용
- **주파수 분리**: 가능하면 433MHz/915MHz 분리
- **전력 조정**: 불필요한 고출력 사용 금지

## 📊 성능 최적화 사례

### 대규모 시스템 (리시버 20개)
```json
{
  "performance": {
    "tx_interval": 50,
    "tx_power": 22,
    "packet_compression": true,
    "channel_grouping": true
  },
  "monitoring": {
    "rssi_threshold": -85,
    "retry_count": 3,
    "battery_warning": 20
  }
}
```

### 배터리 수명 최적화 (12시간 운용)
```json
{
  "power_saving": {
    "oled_timeout": 30,
    "led_brightness": 50,
    "sleep_mode": "light",
    "tx_power": 12
  }
}
```

## 🛠️ 사용자 정의 개발

### API 활용 예시
```javascript
// 실시간 모니터링 대시보드
const ws = new WebSocket('ws://192.168.4.1/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'tally_update') {
    updateCameraStatus(data.channels);
  }
};

// 자동 스위칭 로직
async function autoSwitch() {
  const status = await fetch('/api/status').then(r => r.json());
  if (status.switcher.connected) {
    // 사용자 정의 스위칭 로직
    await fetch('/api/switcher/set_program', {
      method: 'POST',
      body: JSON.stringify({ channel: getNextCamera() })
    });
  }
}
```

### 통합 시스템 구축
```python
# Python을 이용한 중앙 제어 시스템
import asyncio
import websocket
import requests

class TallyController:
    def __init__(self, master_ip):
        self.master_ip = master_ip
        
    async def monitor_all_systems(self):
        # 모든 TALLY NODE 모니터링
        for system in self.systems:
            status = await self.get_status(system)
            if status['battery'] < 20:
                await self.send_alert(f"배터리 부족: {system}")
```

## 💡 Pro Tips

### 신호 강도 최적화
1. **안테나 배치**: 수직으로 세우고 금속에서 멀리
2. **높이**: 가능한 높은 곳에 배치
3. **방향**: 송신기와 수신기 안테나를 평행하게

### 배터리 관리
1. **순환 사용**: 여러 배터리를 번갈아 사용
2. **온도 관리**: 너무 뜨겁거나 차가운 환경 피하기
3. **저장**: 사용하지 않을 때는 50% 충전 상태로 보관

### 네트워크 안정성
1. **전용 네트워크**: 가능하면 TALLY 전용 WiFi 구축
2. **QoS 설정**: 라우터에서 TALLY 트래픽 우선순위 설정
3. **백업 연결**: 유선 연결 백업 준비

---

더 많은 사용 사례나 문의사항은 [GitHub Discussions](https://github.com/username/TALLY_NODE/discussions)에서 공유해주세요!