# TALLY-NODE 펌웨어 변경 이력

## v1.1.0 (2025-11-01)

### 새로운 기능
- **OBS Studio 스위처 지원**: OBS WebSocket 프로토콜 구현으로 OBS Studio 연동 지원
- **통합 Logger 시스템**: 3단계 로그 레벨(BASIC/DEBUG/VERBOSE) 및 모듈별 태그 지원

### 개선사항
- **웹 UI 레이아웃 개선**: Network 탭에서 WiFi/Ethernet/AP 설정을 한눈에 관리
- **스위처 설정 UI**: 스위처 타입별 동적 포트 및 비밀번호 필드 표시
- **Ethernet 자동 설정**: 스위처 IP 기반 Ethernet IP 자동 계산 기능

### 기술적 변경
- OBS WebSocket 프로토콜 모듈 추가 (포트 4455, 선택적 비밀번호)
- Logger 시스템: printf 스타일 포맷팅 및 타임스탬프 지원
- 웹 UI 3-컬럼 레이아웃으로 개선 (WiFi/Ethernet/AP)
- 문서 디렉토리 정리 (document/ → docs/)

---

## v1.0.1 (2025-10-29)

### 주요 변경사항
- Logger 시스템 구축 및 전체 코드베이스 마이그레이션
- 코드 모듈화: WebServer, ATEM, Ethernet, TestMode, vMix, Display 분리
- 펌웨어 버전 및 디버그 레벨 중앙 관리
- WiFi & Ethernet 듀얼 네트워크 지원
- 중복 코드 제거 및 메모리 최적화

---

## v1.0.0 (2025-10-23)

### 초기 릴리스
- TALLY-NODE 펌웨어 기본 기능 구현
