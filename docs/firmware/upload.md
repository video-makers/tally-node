# 웹 기반 펌웨어 업로드

웹 브라우저를 통해 TALLY NODE 펌웨어를 직접 업로드할 수 있습니다.

!!! info "지원 브라우저"
    - ✅ **Chrome** (88 이상)
    - ✅ **Edge** (88 이상)  
    - ✅ **Opera** (74 이상)
    - ❌ Firefox (지원 예정)
    - ❌ Safari (지원 예정)

## 🚀 펌웨어 업로드

<div class="firmware-upload-container">
    <div class="firmware-upload-header">
        <h1>ESP32-S3 TALLY NODE</h1>
        <div class="firmware-upload-subtitle">펌웨어 업로드 도구</div>
    </div>
    
    <div class="firmware-upload-content">
        <div class="firmware-form-section">
            <h2>디바이스 모드 선택</h2>
            <div class="firmware-radio-group">
                <div class="firmware-radio-option">
                    <input type="radio" id="master" name="mode" value="master" checked>
                    <label for="master">마스터 (송신기)</label>
                </div>
                <div class="firmware-radio-option">
                    <input type="radio" id="receiver" name="mode" value="receiver">
                    <label for="receiver">리시버 (수신기)</label>
                </div>
            </div>
        </div>

        <div class="firmware-form-section">
            <h2>주파수 선택</h2>
            <div class="firmware-radio-group">
                <div class="firmware-radio-option">
                    <input type="radio" id="freq400" name="frequency" value="400">
                    <label for="freq400">400MHz</label>
                </div>
                <div class="firmware-radio-option">
                    <input type="radio" id="freq900" name="frequency" value="900" checked>
                    <label for="freq900">900MHz</label>
                </div>
            </div>
        </div>
        
        <div class="firmware-install-section">
            <esp-web-install-button manifest="../manifest_master_900.json">
                <button slot="activate">펌웨어 설치하기</button>
                <span slot="unsupported">이 브라우저는 지원되지 않습니다. Chrome을 사용하세요.</span>
                <span slot="not-allowed">시리얼 포트 권한이 필요합니다.</span>
            </esp-web-install-button>
            
            <div class="firmware-info-box">
                <h3>설치 전 준비사항</h3>
                <p>• Chrome, Edge, Opera 브라우저 사용</p>
                <p>• ESP32-S3를 USB로 연결</p>
                <p>• 부트 모드 진입: BOOT 버튼 누른 상태로 RESET 버튼 누르기</p>
            </div>
        </div>
    </div>
</div>

## 📋 설치 단계별 가이드

### 1단계: 하드웨어 준비
1. **USB 연결**
   - USB-C 케이블로 TALLY NODE를 컴퓨터에 연결
   - 데이터 전송을 지원하는 케이블 사용 (충전 전용 X)

2. **부트 모드 진입**
   - 대부분의 경우 자동으로 부트 모드 진입
   - 필요시 수동 진입: BOOT 버튼 누른 상태로 RESET 버튼 누르기

### 2단계: 펌웨어 선택
1. **디바이스 모드 선택**
   - **마스터**: 스위처와 연결되어 Tally 정보를 송신
   - **리시버**: Tally 정보를 수신하여 LED로 표시

2. **주파수 대역 선택**
   - **400MHz**: 433MHz 대역 (일반적)
   - **900MHz**: 915MHz 대역 (북미/일본)

!!! warning "주파수 대역 주의"
    마스터와 리시버는 동일한 주파수 대역을 사용해야 합니다.
    지역별 규정을 확인하여 적법한 주파수를 선택하세요.

### 3단계: 펌웨어 업로드
1. **"펌웨어 설치하기" 버튼 클릭**
2. **시리얼 포트 선택**
   - 브라우저에서 포트 선택 대화상자가 나타남
   - ESP32-S3 또는 USB Serial 포트 선택
3. **설치 진행**
   - 자동으로 펌웨어 다운로드 및 설치 진행
   - 진행률 표시바 확인

### 4단계: 설치 완료
1. **자동 재부팅**
   - 설치 완료 후 자동으로 재부팅
   - OLED 디스플레이에 부팅 화면 표시

2. **동작 확인**
   - 디스플레이에 버전 정보 표시 확인
   - 기본 설정 화면 진입

## ⚠️ 문제 해결

### 포트가 인식되지 않음
1. **드라이버 확인**
   - Windows: ESP32-S3 USB 드라이버 설치 필요
   - macOS/Linux: 일반적으로 자동 인식

2. **케이블 확인**
   - 데이터 전송 지원 USB-C 케이블 사용
   - 다른 케이블로 교체 시도

3. **다른 USB 포트 사용**
   - USB 3.0 포트 대신 USB 2.0 포트 시도
   - 허브 사용 시 직접 연결로 변경

### 업로드가 실패함
1. **부트 모드 재시도**
   - 수동 부트 모드 진입 시도
   - BOOT + RESET 버튼 조작

2. **브라우저 재시작**
   - 브라우저 완전 종료 후 재시작
   - 시크릿/프라이빗 모드에서 시도

3. **권한 확인**
   - 시리얼 포트 접근 권한 허용
   - 보안 소프트웨어에서 차단하지 않는지 확인

### 설치 후 부팅되지 않음
1. **전원 확인**
   - 배터리가 충분히 충전되어 있는지 확인
   - USB 전원으로 테스트

2. **하드웨어 점검**
   - OLED 디스플레이 연결 상태 확인
   - 납땜 불량이나 단선 확인

## 🔄 펌웨어 업데이트

### 새 버전 출시 시
1. **이 페이지 새로고침**
   - 최신 펌웨어가 자동으로 반영됨
   - 캐시 클리어 (Ctrl+F5)

2. **설정 백업 권장**
   - 기존 설정을 미리 백업
   - 웹 인터페이스에서 설정 내보내기

### OTA 업데이트 (마스터 모드)
마스터 모드에서는 웹 인터페이스를 통한 무선 업데이트도 가능합니다:

1. WiFi AP 연결: `TALLY_NODE_AP`
2. 웹 브라우저에서 `192.168.4.1` 접속  
3. "설정" → "펌웨어 업데이트" 메뉴 사용

## 📊 지원되는 펌웨어 종류

| 모드 | 주파수 | 용도 | 특징 |
|------|--------|------|------|
| **Master 400** | 433MHz | 송신기 | ATEM/vMix 연동, WiFi, 웹서버 |
| **Master 900** | 915MHz | 송신기 | ATEM/vMix 연동, WiFi, 웹서버 |
| **Receiver 400** | 433MHz | 수신기 | 배터리 최적화, LED 표시 |
| **Receiver 900** | 915MHz | 수신기 | 배터리 최적화, LED 표시 |

!!! tip "지역별 주파수 선택"
    - **433MHz**: 유럽, 아시아, 호주 (ISM 밴드)
    - **915MHz**: 북미, 남미 (ISM 밴드)
    - 사용 지역의 전파 법규를 확인하여 적법한 주파수를 선택하세요.

---

설치가 완료되면 [펌웨어 설정](configuration.md)을 진행하세요.