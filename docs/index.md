# TALLY NODE

**ESP32-S3 기반 무선 Tally 시스템**

![TALLY NODE Logo](assets/images/logo.png){ width="200" }

TALLY NODE는 ESP32-S3 기반의 마스터-리시버 구조 무선 Tally 시스템입니다. ATEM과 vMix 스위처와 연동하여 실시간 Tally 정보를 LoRa 무선 통신으로 전송하고, 리시버에서 LED와 OLED 디스플레이로 표시합니다.

## ✨ 주요 특징

<div class="grid cards" markdown>

-   :material-radio: **무선 통신**

    ---

    LoRa 433MHz/915MHz 통신을 통한 장거리 무선 통신  
    마스터-리시버 구조로 실시간 동기화

-   :material-monitor-dashboard: **스위처 연동**

    ---

    ATEM 및 vMix 스위처 완전 지원  
    멀티 ME 지원 및 자동 재연결

-   :material-led-strip: **시각적 표시**

    ---

    OLED 디스플레이와 RGB LED를 통한  
    직관적인 Tally 상태 표시

-   :material-battery: **배터리 관리**

    ---

    실시간 배터리 모니터링 및  
    효율적인 전력 관리 시스템

</div>

## 🚀 빠른 시작

1. **하드웨어 준비** - [하드웨어 개요](hardware/overview.md) 참조
2. **펌웨어 설치** - [설치 가이드](firmware/installation.md) 또는 [웹 업로드](firmware/upload.md) 이용
3. **초기 설정** - [설정 가이드](firmware/configuration.md) 참조
4. **서버 구축** (옵션) - [서버 설정](server/setup.md) 참조

## 📱 웹 기반 펌웨어 업로드

별도의 개발 환경 없이 웹 브라우저에서 직접 펌웨어를 업로드할 수 있습니다.

[펌웨어 업로드 :material-upload:](firmware/upload.md){ .md-button .md-button--primary }

## 🛠️ 시스템 구성

### 마스터 (송신기)
- ATEM/vMix 스위처와 연동
- WiFi를 통한 네트워크 통신
- LoRa를 통한 무선 데이터 전송
- 웹 대시보드를 통한 실시간 모니터링

### 리시버 (수신기)  
- LoRa를 통한 데이터 수신
- OLED 디스플레이로 상태 표시
- RGB LED로 Tally 상태 표시
- 배터리 구동 및 실시간 모니터링

## 📋 기술 사양

| 항목 | 사양 |
|------|------|
| **MCU** | ESP32-S3 (240MHz, 4MB Flash, 2MB PSRAM) |
| **무선** | SX1268 LoRa 모듈 (433MHz/915MHz) |
| **디스플레이** | SSD1306 OLED (128x64, I2C) |
| **LED** | WS2812B RGB LED |
| **전원** | LiPo 배터리 (ADC 모니터링) |
| **인터페이스** | WiFi, USB-C, 푸시 버튼 |

## 🌟 고급 기능

- **실시간 웹 대시보드**: WebSocket을 통한 실시간 모니터링
- **RESTful API**: 프로그래밍 방식 제어 가능
- **배터리 테스트**: 라이센스 기반 배터리 수명 테스트
- **멀티 페이지 OLED**: 다양한 정보를 페이지별로 표시
- **자동 재연결**: 네트워크 연결 실패 시 자동 복구

## 📚 문서 구성

이 문서는 다음과 같이 구성되어 있습니다:

- **[하드웨어](hardware/overview.md)**: 보드 사양, 핀 정의, 조립 가이드
- **[펌웨어](firmware/installation.md)**: 설치, 설정, API 문서
- **[서버](server/setup.md)**: 라이센스 서버 구축 및 API
- **[가이드](guides/quickstart.md)**: 빠른 시작 및 문제 해결

## 💬 커뮤니티 & 지원

- **GitHub**: [이슈 및 기여](https://github.com/username/TALLY_NODE)
- **문제 해결**: [트러블슈팅 가이드](guides/troubleshooting.md)
- **예제**: [사용 예시](guides/examples.md)

---

**TALLY NODE**는 방송 현장에서 요구되는 전문적인 무선 Tally 솔루션을 제공합니다. 🎬