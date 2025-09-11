# API 문서

라이센스 관리 서버의 REST API 문서입니다.

## 🔐 인증

모든 API 요청에는 `X-API-Key` 헤더가 필요합니다.

```http
X-API-Key: your-api-secret-key
```

## 📋 라이센스 관리 API

### POST /api/validate-license
라이센스 키와 MAC 주소를 검증합니다.

#### 요청
```http
POST /api/validate-license
Content-Type: application/json
X-API-Key: your-api-key

{
  "license_key": "ABC123-DEF456-GHI789",
  "mac_address": "00:11:22:33:44:55"
}
```

#### 성공 응답 (200)
```json
{
  "success": true,
  "message": "라이센스 검증 성공",
  "license": {
    "id": 1,
    "license_key": "ABC123-DEF456-GHI789",
    "mac_address": "00:11:22:33:44:55",
    "device_limit": 5,
    "is_active": true
  }
}
```

#### 오류 응답 (400)
```json
{
  "success": false,
  "error": "유효하지 않은 라이센스입니다."
}
```

### POST /api/register-license
새 라이센스를 등록합니다. (관리자용)

#### 요청
```http
POST /api/register-license
Content-Type: application/json
X-API-Key: your-api-key

{
  "license_key": "XYZ789-ABC123-DEF456",
  "name": "홍길동",
  "phone": "010-1234-5678", 
  "email": "hong@example.com",
  "device_limit": 10
}
```

#### 성공 응답 (201)
```json
{
  "success": true,
  "message": "라이센스가 성공적으로 등록되었습니다.",
  "license_id": 2
}
```

## 📊 상태 확인 API

### GET /api/status
서버 상태를 확인합니다. (인증 불필요)

#### 요청
```http
GET /api/status
```

#### 응답
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:34:56.789Z",
  "message": "API가 정상적으로 작동 중입니다.",
  "version": "1.0.0",
  "uptime": 3600
}
```

## 🛠️ 관리자 API

### POST /admin/login
관리자 로그인을 수행합니다.

#### 요청
```http
POST /admin/login
Content-Type: application/json

{
  "password": "admin-password"
}
```

#### 성공 응답 (200)
```json
{
  "success": true,
  "message": "로그인 성공",
  "session_id": "sess_abc123def456"
}
```

### GET /admin/licenses
모든 라이센스를 조회합니다. (로그인 필요)

#### 요청
```http
GET /admin/licenses
Cookie: session_id=sess_abc123def456
```

#### 응답
```json
{
  "success": true,
  "licenses": [
    {
      "id": 1,
      "license_key": "ABC123-DEF456-GHI789",
      "name": "홍길동",
      "phone": "010-1234-5678",
      "email": "hong@example.com",
      "mac_address": "00:11:22:33:44:55",
      "device_limit": 5,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-15T12:34:56.789Z"
    }
  ],
  "total": 1
}
```

### POST /admin/delete-license
라이센스를 삭제합니다. (로그인 필요)

#### 요청
```http
POST /admin/delete-license
Content-Type: application/json
Cookie: session_id=sess_abc123def456

{
  "id": 1,
  "license_key": "ABC123-DEF456-GHI789"
}
```

#### 성공 응답 (200)
```json
{
  "success": true,
  "message": "라이센스가 삭제되었습니다."
}
```

## 💻 사용 예시

### JavaScript/Node.js
```javascript
const axios = require('axios');

const API_BASE = 'https://tally-node.gobongs.com';
const API_KEY = 'tally-node-api-2025';

// 라이센스 검증
async function validateLicense(licenseKey, macAddress) {
  try {
    const response = await axios.post(`${API_BASE}/api/validate-license`, {
      license_key: licenseKey,
      mac_address: macAddress
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('라이센스 검증 실패:', error.response?.data);
    throw error;
  }
}

// 사용 예시
validateLicense('ABC123-DEF456-GHI789', '00:11:22:33:44:55')
  .then(result => {
    if (result.success) {
      console.log('라이센스 유효:', result.license);
    }
  })
  .catch(error => {
    console.error('검증 실패:', error);
  });
```

### Python
```python
import requests
import json

API_BASE = 'https://tally-node.gobongs.com'
API_KEY = 'tally-node-api-2025'

def validate_license(license_key, mac_address):
    """라이센스 검증 함수"""
    url = f'{API_BASE}/api/validate-license'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
    data = {
        'license_key': license_key,
        'mac_address': mac_address
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'라이센스 검증 실패: {e}')
        raise

# 사용 예시
try:
    result = validate_license('ABC123-DEF456-GHI789', '00:11:22:33:44:55')
    if result['success']:
        print(f"라이센스 유효: {result['license']}")
    else:
        print(f"라이센스 무효: {result['error']}")
except Exception as e:
    print(f"검증 오류: {e}")
```

### cURL
```bash
# 라이센스 검증
curl -X POST https://tally-node.gobongs.com/api/validate-license \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tally-node-api-2025" \
  -d '{
    "license_key": "ABC123-DEF456-GHI789",
    "mac_address": "00:11:22:33:44:55"
  }'

# 서버 상태 확인
curl https://tally-node.gobongs.com/api/status

# 관리자 로그인
curl -X POST https://tally-node.gobongs.com/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin-password"}' \
  -c cookies.txt

# 라이센스 목록 조회 (로그인 후)
curl https://tally-node.gobongs.com/admin/licenses \
  -b cookies.txt
```

## 🚨 오류 코드

| HTTP 코드 | 설명 | 예시 |
|-----------|------|------|
| **200** | 성공 | 정상 처리 완료 |
| **201** | 생성 성공 | 라이센스 등록 완료 |
| **400** | 잘못된 요청 | 필수 필드 누락, 형식 오류 |
| **401** | 인증 실패 | API 키 없음, 잘못된 키 |
| **403** | 권한 없음 | 관리자 권한 필요 |
| **404** | 찾을 수 없음 | 존재하지 않는 라이센스 |
| **409** | 충돌 | 중복된 라이센스 키 |
| **500** | 서버 오류 | 데이터베이스 연결 실패 |

### 오류 응답 형식
```json
{
  "success": false,
  "error": "상세 오류 메시지",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T12:34:56.789Z"
}
```

## 📝 API 제한사항

### Rate Limiting
- **일반 API**: 분당 60회 요청
- **관리자 API**: 분당 30회 요청
- **상태 확인**: 제한 없음

### 데이터 제한
- **라이센스 키**: 최대 50자
- **MAC 주소**: 표준 형식만 허용 (XX:XX:XX:XX:XX:XX)
- **이름/이메일**: 최대 255자
- **전화번호**: 최대 20자

### 보안 정책
- 모든 API는 HTTPS 필수
- API 키는 환경 변수로 관리
- 세션 타임아웃: 1시간
- 로그인 시도 제한: 5회/10분

## 🔄 버전 관리

### API 버전
현재 버전: `v1`

### 업데이트 정책
- **Major**: 호환성이 깨지는 변경 (v1 → v2)
- **Minor**: 새 기능 추가 (v1.0 → v1.1)  
- **Patch**: 버그 수정 (v1.0.0 → v1.0.1)

### 지원 종료 정책
- 새 Major 버전 출시 후 1년간 이전 버전 지원
- 6개월 전 사전 공지

---

추가 문의사항은 [GitHub Issues](https://github.com/username/TALLY_NODE/issues)를 이용해주세요.