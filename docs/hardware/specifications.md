# 기술 사양 및 핀 정의

## 📊 상세 기술 사양

### ESP32-S3 MCU
| 항목 | 사양 |
|------|------|
| **아키텍처** | Xtensa® dual-core 32-bit LX7 |
| **동작 주파수** | 최대 240MHz |
| **Flash 메모리** | 4MB |
| **PSRAM** | 2MB |
| **SRAM** | 512KB |
| **GPIO** | 45개 (사용 가능: 36개) |
| **ADC** | 12-bit, 20채널 |
| **WiFi** | 802.11 b/g/n, 2.4GHz |
| **Bluetooth** | Bluetooth 5, BLE |

### SX1268 LoRa 모듈
| 항목 | 사양 |
|------|------|
| **주파수 대역** | 433MHz / 915MHz |
| **전송 출력** | +22dBm 최대 |
| **수신 감도** | -148dBm @ SF12, BW=125kHz |
| **통신 거리** | 최대 15km (LOS) |
| **인터페이스** | SPI |
| **변조 방식** | LoRa, (G)FSK |

### SSD1306 OLED 디스플레이
| 항목 | 사양 |
|------|------|
| **해상도** | 128 x 64 픽셀 |
| **크기** | 0.96인치 |
| **색상** | 단색 (흰색/파란색) |
| **인터페이스** | I2C |
| **전력 소비** | ~20mA (활성화 시) |
| **시야각** | >160° |

### WS2812B RGB LED
| 항목 | 사양 |
|------|------|
| **색상** | RGB (각 8비트, 총 24비트) |
| **개수** | 1개 (확장 가능) |
| **제어 방식** | 단일 데이터 라인 |
| **전압** | 5V (3.3V 호환) |
| **전력** | 최대 60mA |

## 🔌 핀 정의 및 연결

### I2C (OLED 디스플레이)
```cpp
#define I2C_SDA 18    // 데이터 라인
#define I2C_SCL 17    // 클럭 라인
```

### SPI (LoRa 라디오)
```cpp
#define RADIO_SCLK_PIN  5    // SPI 클럭
#define RADIO_MISO_PIN  3    // SPI MISO
#define RADIO_MOSI_PIN  6    // SPI MOSI
#define RADIO_CS_PIN    7    // 칩 셀렉트
#define RADIO_DIO1_PIN  33   // 인터럽트 핀
#define RADIO_BUSY_PIN  34   // 비지 상태 핀
#define RADIO_RST_PIN   8    // 리셋 핀
```

### 사용자 인터페이스
```cpp
#define BUTTON_PIN      0    // 사용자 버튼
#define BOARD_LED       37   // 보드 상태 LED
#define WS2812B_PIN     45   // RGB LED 데이터 핀
```

### 배터리 모니터링
```cpp
#define BAT_ADC_PIN     1    // 배터리 전압 측정
```

### SD 카드 (SPI, 미사용)
```cpp
#define SDCARD_MOSI     11   // SPI MOSI
#define SDCARD_MISO     2    // SPI MISO  
#define SDCARD_SCLK     14   // SPI 클럭
#define SDCARD_CS       13   // 칩 셀렉트
```

## 🔧 하드웨어 설정

### I2C 설정
```cpp
// OLED 디스플레이 초기화
Wire.begin(I2C_SDA, I2C_SCL);
display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS);
```

### SPI 설정 (LoRa)
```cpp
// LoRa 모듈 초기화
SPI.begin(RADIO_SCLK_PIN, RADIO_MISO_PIN, RADIO_MOSI_PIN, RADIO_CS_PIN);
radio.begin();
```

### ADC 설정 (배터리)
```cpp
// 배터리 전압 측정 설정
analogReadResolution(12);  // 12비트 해상도
analogSetAttenuation(ADC_11db);  // 0-3.3V 범위
```

## 📐 PCB 레이아웃

### 보드 크기
- **크기**: 50mm x 30mm
- **두께**: 1.6mm (표준 PCB)
- **레이어**: 4레이어 (전원, 신호, 그라운드)

### 컴포넌트 배치
```
    ┌─────────────────────────────┐
    │  [USB-C]              [ANT] │
    │                             │
    │  [ESP32-S3]    [SX1268]     │
    │                             │
    │  [OLED]        [LED]        │
    │                             │
    │  [BTN]         [PWR]        │
    └─────────────────────────────┘
```

### 신호 무결성
- **임피던스 매칭**: 안테나 및 고속 신호
- **그라운드 플레인**: 노이즈 최소화
- **전원 분리**: 디지털/아날로그 전원 분리
- **EMI 차폐**: 적절한 그라운드 비아 배치

## ⚙️ 환경 사양

### 동작 환경
| 항목 | 범위 |
|------|------|
| **동작 온도** | -20°C ~ +70°C |
| **보관 온도** | -40°C ~ +85°C |
| **습도** | 5% ~ 95% (비응축) |
| **고도** | 최대 2000m |

### 기계적 사양
| 항목 | 값 |
|------|------|
| **무게** | 약 25g |
| **외형** | 50 x 30 x 10mm |
| **케이스** | 3D 프린팅 플라스틱 |
| **방수 등급** | IP54 (케이스 포함) |

### 전기적 사양
| 항목 | 값 |
|------|------|
| **입력 전압** | 3.3V ~ 5.5V |
| **동작 전압** | 3.3V |
| **최대 전류** | 500mA |
| **대기 전류** | < 10mA |

## 🔍 테스트 및 검증

### 기능 테스트
- [x] WiFi 연결 테스트
- [x] LoRa 통신 테스트  
- [x] OLED 디스플레이 테스트
- [x] LED 동작 테스트
- [x] 버튼 입력 테스트
- [x] 배터리 모니터링 테스트

### 성능 테스트
- [x] 통신 거리 테스트 (최대 5km 확인)
- [x] 배터리 수명 테스트 (리시버 8시간)
- [x] 온도 테스트 (-10°C ~ +60°C)
- [x] 진동 테스트 (방송 장비 이동)

### 인증
- **CE 마킹**: 유럽 적합성 선언
- **FCC Part 15**: 미국 무선 기기 승인
- **IC**: 캐나다 산업부 승인
- **KC**: 한국 전파 인증

---

다음: [조립 가이드](assembly.md)