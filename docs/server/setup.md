# 서버 설정

TALLY NODE 라이센스 관리 서버 설치 및 설정 가이드입니다.

## 📋 개요

라이센스 서버는 TALLY NODE의 배터리 테스트 및 사용자 인증 기능을 제공합니다.

### 주요 기능
- 라이센스 키 검증 및 관리
- MAC 주소 기반 디바이스 할당
- 리시버 디바이스 수 제한 관리
- 웹 기반 관리자 인터페이스

## 🛠️ 시스템 요구사항

### 최소 사양
- **OS**: Ubuntu 20.04 LTS 이상
- **Node.js**: 16.x 이상
- **데이터베이스**: MariaDB 10.5 이상
- **메모리**: 1GB RAM
- **저장공간**: 10GB

### 권장 사양
- **OS**: Ubuntu 22.04 LTS
- **Node.js**: 18.x LTS
- **데이터베이스**: MariaDB 10.8
- **메모리**: 2GB RAM
- **저장공간**: 20GB SSD

## 🚀 설치 과정

### 1단계: 시스템 준비
```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
sudo apt install -y curl wget git build-essential
```

### 2단계: Node.js 설치
```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 설치
sudo apt install -y nodejs

# 버전 확인
node --version  # v18.x.x
npm --version   # 9.x.x
```

### 3단계: MariaDB 설치
```bash
# MariaDB 서버 설치
sudo apt install -y mariadb-server mariadb-client

# 보안 설정
sudo mysql_secure_installation
```

### 4단계: 데이터베이스 설정
```sql
-- MariaDB 접속
sudo mysql -u root -p

-- 데이터베이스 생성
CREATE DATABASE `TALLY-NODE` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 및 권한 부여
CREATE USER 'tally_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON `TALLY-NODE`.* TO 'tally_user'@'localhost';
FLUSH PRIVILEGES;

-- 테이블 생성
USE `TALLY-NODE`;
CREATE TABLE license (
  id INT AUTO_INCREMENT PRIMARY KEY,
  license_key VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  mac_address VARCHAR(255),
  device_limit INT DEFAULT 1,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5단계: 서버 소스코드 설치
```bash
# 프로젝트 클론
git clone https://github.com/username/TALLY_NODE.git
cd TALLY_NODE/server

# 의존성 설치
npm install
```

### 6단계: 환경 설정
```bash
# 환경 변수 파일 생성
cp .env.example .env
nano .env
```

`.env` 파일 내용:
```env
# 서버 설정
PORT=3000
NODE_ENV=production

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USER=tally_user
DB_PASSWORD=secure_password
DB_NAME=TALLY-NODE
DB_CONNECTION_LIMIT=10

# 보안 설정
API_SECRET_KEY=your-super-secure-api-key-here
SESSION_SECRET=your-session-secret-here
ADMIN_PASSWORD=your-admin-password-here
```

## 🔧 서버 실행

### 개발 모드
```bash
# 개발 모드 실행
npm run dev

# 로그 확인
tail -f logs/app.log
```

### 프로덕션 모드
```bash
# PM2 글로벌 설치
sudo npm install -g pm2

# 서버 시작
pm2 start app.js --name "tally-server"

# PM2 설정 저장
pm2 save

# 부팅 시 자동 시작 설정
pm2 startup
```

### 서비스 확인
```bash
# 서버 상태 확인
curl http://localhost:3000/api/status

# PM2 상태 확인
pm2 status

# 로그 확인
pm2 logs tally-server
```

## 🌐 웹 서버 설정 (Nginx)

### Nginx 설치
```bash
sudo apt install -y nginx
```

### 설정 파일 생성
```nginx
# /etc/nginx/sites-available/tally-node
server {
    listen 80;
    server_name tally-node.your-domain.com;

    # HTTP to HTTPS 리다이렉트
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tally-node.your-domain.com;

    # SSL 인증서 설정 (Let's Encrypt 권장)
    ssl_certificate /etc/letsencrypt/live/tally-node.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tally-node.your-domain.com/privkey.pem;

    # 보안 헤더
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # 프록시 설정
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 로그 설정
    access_log /var/log/nginx/tally-node.access.log;
    error_log /var/log/nginx/tally-node.error.log;
}
```

### Nginx 활성화
```bash
# 설정 파일 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/tally-node /etc/nginx/sites-enabled/

# 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx

# 부팅 시 자동 시작 설정
sudo systemctl enable nginx
```

## 🔒 SSL 인증서 설정 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d tally-node.your-domain.com

# 자동 갱신 테스트
sudo certbot renew --dry-run

# Cron 작업 추가 (자동 갱신)
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 🔧 방화벽 설정

```bash
# UFW 활성화
sudo ufw enable

# 필요한 포트 허용
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MariaDB (로컬만)

# 상태 확인
sudo ufw status verbose
```

## 📊 모니터링 설정

### 로그 로테이션
```bash
# /etc/logrotate.d/tally-node
/home/ubuntu/TALLY_NODE/server/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 시스템 모니터링
```bash
# PM2 모니터링 도구
pm2 install pm2-logrotate

# 시스템 리소스 모니터링
sudo apt install -y htop iotop nethogs
```

## 🔐 보안 강화

### 1. API 키 관리
```javascript
// 강력한 API 키 생성
const crypto = require('crypto');
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('API Key:', apiKey);
```

### 2. 데이터베이스 보안
```sql
-- 불필요한 권한 제거
REVOKE ALL PRIVILEGES ON *.* FROM 'tally_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON `TALLY-NODE`.* TO 'tally_user'@'localhost';

-- 원격 접속 차단
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
```

### 3. 시스템 보안
```bash
# 자동 보안 업데이트 활성화
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# fail2ban 설치 (브루트 포스 공격 방지)
sudo apt install -y fail2ban

# SSH 보안 강화
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no (키 기반 인증만 허용)
```

## ✅ 설치 완료 확인

### 기능 테스트
```bash
# API 상태 확인
curl https://tally-node.your-domain.com/api/status

# 라이센스 검증 테스트
curl -X POST https://tally-node.your-domain.com/api/validate-license \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"license_key":"TEST-KEY","mac_address":"00:11:22:33:44:55"}'
```

### 관리자 페이지 접속
1. 브라우저에서 `https://tally-node.your-domain.com/admin-whatumong` 접속
2. 관리자 비밀번호로 로그인
3. 라이센스 관리 기능 확인

---

서버 설치가 완료되었습니다. [API 문서](api-reference.md)에서 상세한 API 사용법을 확인하세요.