# 데이터베이스 스키마

TALLY NODE 라이센스 서버의 데이터베이스 구조와 관리 방법을 설명합니다.

## 🗄️ 데이터베이스 개요

### 기본 정보
- **데이터베이스 엔진**: MariaDB 10.5+
- **문자 인코딩**: UTF-8 (utf8mb4)
- **콜레이션**: utf8mb4_unicode_ci
- **엔진**: InnoDB

### 데이터베이스 생성
```sql
CREATE DATABASE `TALLY-NODE` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## 📋 테이블 구조

### license 테이블
라이센스 정보를 저장하는 메인 테이블입니다.

```sql
CREATE TABLE license (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '고유 ID',
  license_key VARCHAR(255) NOT NULL UNIQUE COMMENT '라이센스 키',
  name VARCHAR(100) COMMENT '사용자 이름',
  phone VARCHAR(20) COMMENT '전화번호',
  email VARCHAR(255) COMMENT '이메일 주소',
  mac_address VARCHAR(255) COMMENT '할당된 MAC 주소',
  device_limit INT DEFAULT 1 COMMENT '연결 가능한 리시버 수',
  is_active BOOLEAN DEFAULT FALSE COMMENT '활성화 상태',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  
  INDEX idx_license_key (license_key),
  INDEX idx_mac_address (mac_address),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='라이센스 정보 테이블';
```

### 필드 설명

| 필드명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | 라이센스 고유 식별자 |
| `license_key` | VARCHAR(255) | NOT NULL, UNIQUE | 라이센스 키 (형식: ABC123-DEF456-GHI789) |
| `name` | VARCHAR(100) | NULL | 라이센스 소유자 이름 |
| `phone` | VARCHAR(20) | NULL | 연락처 (형식: 010-1234-5678) |
| `email` | VARCHAR(255) | NULL | 이메일 주소 |
| `mac_address` | VARCHAR(255) | NULL | 할당된 디바이스 MAC 주소 |
| `device_limit` | INT | DEFAULT 1 | 연결 가능한 최대 리시버 수 |
| `is_active` | BOOLEAN | DEFAULT FALSE | 라이센스 활성화 여부 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 레코드 생성 일시 |
| `updated_at` | TIMESTAMP | DEFAULT ... ON UPDATE ... | 마지막 수정 일시 |

## 🔍 인덱스 전략

### 주요 인덱스
```sql
-- 라이센스 키 조회 최적화
CREATE INDEX idx_license_key ON license(license_key);

-- MAC 주소 조회 최적화  
CREATE INDEX idx_mac_address ON license(mac_address);

-- 활성화 상태 필터링 최적화
CREATE INDEX idx_is_active ON license(is_active);

-- 생성일 기준 정렬 최적화
CREATE INDEX idx_created_at ON license(created_at);

-- 복합 인덱스 (자주 사용되는 조합)
CREATE INDEX idx_active_created ON license(is_active, created_at);
```

### 인덱스 사용 패턴
```sql
-- 빠른 라이센스 검증 (idx_license_key 사용)
SELECT * FROM license WHERE license_key = 'ABC123-DEF456-GHI789';

-- MAC 주소로 디바이스 검색 (idx_mac_address 사용)  
SELECT * FROM license WHERE mac_address = '00:11:22:33:44:55';

-- 활성화된 라이센스만 조회 (idx_is_active 사용)
SELECT * FROM license WHERE is_active = TRUE;

-- 최근 생성된 라이센스 조회 (idx_created_at 사용)
SELECT * FROM license ORDER BY created_at DESC LIMIT 10;
```

## 📊 데이터 타입 및 제약조건

### 라이센스 키 형식
```regex
패턴: ^[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$
예시: ABC123-DEF456-GHI789
```

### MAC 주소 형식
```regex
패턴: ^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$
예시: 00:11:22:33:44:55
```

### 이메일 형식
```regex
패턴: ^[^\s@]+@[^\s@]+\.[^\s@]+$
예시: user@example.com
```

### 전화번호 형식 (한국)
```regex
패턴: ^010-\d{4}-\d{4}$
예시: 010-1234-5678
```

## 🛠️ 데이터베이스 운영

### 초기 데이터 삽입
```sql
-- 테스트 라이센스 생성
INSERT INTO license (
  license_key, 
  name, 
  phone, 
  email, 
  device_limit, 
  is_active
) VALUES (
  'TEST01-TEST02-TEST03',
  '테스트 사용자',
  '010-1234-5678',
  'test@example.com',
  5,
  TRUE
);
```

### 일반적인 쿼리 패턴

#### 라이센스 검증
```sql
-- 라이센스 존재 및 활성화 확인
SELECT id, license_key, mac_address, device_limit, is_active 
FROM license 
WHERE license_key = ? AND is_active = TRUE;
```

#### 디바이스 할당
```sql
-- 새 디바이스에 라이센스 할당
UPDATE license 
SET mac_address = ?, updated_at = CURRENT_TIMESTAMP 
WHERE license_key = ? AND is_active = TRUE;
```

#### 라이센스 활성화
```sql
-- 라이센스 활성화
UPDATE license 
SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
WHERE license_key = ?;
```

#### 통계 조회
```sql
-- 활성화된 라이센스 수
SELECT COUNT(*) as active_licenses 
FROM license 
WHERE is_active = TRUE;

-- 월별 라이센스 생성 통계
SELECT 
  DATE_FORMAT(created_at, '%Y-%m') as month,
  COUNT(*) as licenses_created
FROM license 
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;
```

## 🔧 유지보수 쿼리

### 데이터 정리
```sql
-- 비활성화된 라이센스 정리 (30일 이상 된 것)
DELETE FROM license 
WHERE is_active = FALSE 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 중복 MAC 주소 확인
SELECT mac_address, COUNT(*) 
FROM license 
WHERE mac_address IS NOT NULL 
GROUP BY mac_address 
HAVING COUNT(*) > 1;
```

### 인덱스 최적화
```sql
-- 인덱스 사용률 확인
SHOW INDEX FROM license;

-- 테이블 통계 업데이트
ANALYZE TABLE license;

-- 인덱스 재구성 (필요시)
OPTIMIZE TABLE license;
```

## 📈 성능 최적화

### 쿼리 성능 분석
```sql
-- 느린 쿼리 확인
EXPLAIN SELECT * FROM license WHERE license_key = 'ABC123-DEF456-GHI789';

-- 실행 계획 분석
EXPLAIN EXTENDED 
SELECT * FROM license 
WHERE is_active = TRUE 
ORDER BY created_at DESC 
LIMIT 10;
```

### 파티셔닝 (대용량 데이터용)
```sql
-- 생성일 기준 월별 파티셔닝 (필요시)
ALTER TABLE license
PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
  PARTITION p202401 VALUES LESS THAN (202402),
  PARTITION p202402 VALUES LESS THAN (202403),
  PARTITION p202403 VALUES LESS THAN (202404)
);
```

## 🔒 보안 고려사항

### 사용자 권한 관리
```sql
-- 애플리케이션 전용 사용자 생성
CREATE USER 'tally_app'@'localhost' IDENTIFIED BY 'strong_password';

-- 최소 권한 부여
GRANT SELECT, INSERT, UPDATE ON `TALLY-NODE`.license TO 'tally_app'@'localhost';

-- 관리자 사용자 (읽기 전용)
CREATE USER 'tally_readonly'@'localhost' IDENTIFIED BY 'readonly_password';
GRANT SELECT ON `TALLY-NODE`.* TO 'tally_readonly'@'localhost';
```

### 데이터 암호화
```sql
-- 민감한 데이터 암호화 (필요시)
ALTER TABLE license ADD COLUMN encrypted_email VARCHAR(500);

-- 암호화 함수 사용
UPDATE license SET encrypted_email = AES_ENCRYPT(email, 'encryption_key');
```

## 💾 백업 및 복구

### 백업 스크립트
```bash
#!/bin/bash
# daily_backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/tally-node"
DB_NAME="TALLY-NODE"

# 디렉토리 생성
mkdir -p $BACKUP_DIR

# 데이터베이스 덤프
mysqldump -u root -p$MYSQL_ROOT_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/tally_backup_$DATE.sql

# 압축
gzip $BACKUP_DIR/tally_backup_$DATE.sql

# 7일 이상 된 백업 파일 삭제
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "백업 완료: tally_backup_$DATE.sql.gz"
```

### 복구 방법
```bash
# 백업 파일 압축 해제
gunzip /var/backups/tally-node/tally_backup_20240115_120000.sql.gz

# 데이터베이스 복구
mysql -u root -p TALLY-NODE < /var/backups/tally-node/tally_backup_20240115_120000.sql
```

## 📊 모니터링

### 테이블 상태 확인
```sql
-- 테이블 크기 및 행 수 확인
SELECT 
  TABLE_NAME,
  TABLE_ROWS,
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS 'SIZE_MB'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'TALLY-NODE'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
```

### 연결 상태 모니터링
```sql
-- 현재 연결 수 확인
SHOW STATUS LIKE 'Threads_connected';

-- 최대 연결 수 확인
SHOW VARIABLES LIKE 'max_connections';
```

---

데이터베이스 관리와 관련된 추가 문의사항은 [GitHub Issues](https://github.com/username/TALLY_NODE/issues)를 이용해주세요.