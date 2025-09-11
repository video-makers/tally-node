// TALLY NODE 커스텀 자바스크립트

// 펌웨어 업로드 페이지 기능
document.addEventListener('DOMContentLoaded', function() {
    // 펌웨어 업로드 페이지인지 확인
    if (document.querySelector('.firmware-upload-container')) {
        initializeFirmwareUpload();
    }
});

// 펌웨어 업로드 페이지 초기화
function initializeFirmwareUpload() {
    console.log('펌웨어 업로드 페이지 초기화');
    
    // 초기 펌웨어 정보 설정
    updateFirmwareInfo();
    
    // 라디오 버튼 이벤트 리스너 추가
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const freqRadios = document.querySelectorAll('input[name="frequency"]');
    
    modeRadios.forEach(radio => {
        radio.addEventListener('change', updateFirmwareInfo);
    });
    
    freqRadios.forEach(radio => {
        radio.addEventListener('change', updateFirmwareInfo);
    });
}

// 선택된 펌웨어 정보 업데이트
function updateFirmwareInfo() {
    const selectedModeElement = document.querySelector('input[name="mode"]:checked');
    const selectedFreqElement = document.querySelector('input[name="frequency"]:checked');
    
    if (!selectedModeElement || !selectedFreqElement) {
        console.warn('모드 또는 주파수가 선택되지 않음');
        return;
    }
    
    const selectedMode = selectedModeElement.value;
    const selectedFreq = selectedFreqElement.value;
    
    console.log('모드 변경:', selectedMode, '주파수:', selectedFreq);
    
    // 선택된 모드와 주파수에 따라 manifest 파일 경로 설정
    updateManifest(selectedMode, selectedFreq);
}

// manifest 파일 경로 업데이트
function updateManifest(mode, frequency) {
    // 상대 경로를 사용하여 manifest 파일 참조
    const manifestPath = `../manifest_${mode}_${frequency}.json`;
    
    // esp-web-install-button의 manifest 속성 업데이트
    const installButton = document.querySelector('esp-web-install-button');
    if (installButton) {
        installButton.setAttribute('manifest', manifestPath);
        console.log('Manifest 업데이트됨:', manifestPath);
    } else {
        console.warn('esp-web-install-button을 찾을 수 없음');
    }
}

// ESP Web Tools가 로드된 후 실행
window.addEventListener('load', function() {
    // ESP Web Tools 이벤트 리스너 추가
    const installButton = document.querySelector('esp-web-install-button');
    
    if (installButton) {
        installButton.addEventListener('state-changed', function(ev) {
            console.log('설치 상태 변경:', ev.detail);
        });
        
        installButton.addEventListener('error', function(ev) {
            console.error('설치 오류:', ev.detail);
        });
    }
});

// 유틸리티 함수들
const TallyNodeUtils = {
    // 버전 정보 표시
    showVersion: function() {
        console.log('TALLY NODE Documentation v1.0.0');
    },
    
    // 브라우저 호환성 확인
    checkBrowserCompatibility: function() {
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isEdge = /Edge/.test(navigator.userAgent);
        const isOpera = /Opera/.test(navigator.userAgent) || /OPR/.test(navigator.userAgent);
        
        const isSupported = isChrome || isEdge || isOpera;
        
        if (!isSupported) {
            console.warn('이 브라우저는 ESP Web Tools를 지원하지 않을 수 있습니다.');
            console.warn('Chrome, Edge, 또는 Opera 브라우저 사용을 권장합니다.');
        }
        
        return isSupported;
    },
    
    // 로컬 스토리지에 설정 저장
    saveSettings: function(settings) {
        try {
            localStorage.setItem('tally-node-settings', JSON.stringify(settings));
            console.log('설정이 저장되었습니다:', settings);
        } catch (error) {
            console.error('설정 저장 실패:', error);
        }
    },
    
    // 로컬 스토리지에서 설정 로드
    loadSettings: function() {
        try {
            const settings = localStorage.getItem('tally-node-settings');
            return settings ? JSON.parse(settings) : null;
        } catch (error) {
            console.error('설정 로드 실패:', error);
            return null;
        }
    }
};

// 전역 스코프에 유틸리티 노출
window.TallyNodeUtils = TallyNodeUtils;

// 초기화 시 유틸리티 실행
TallyNodeUtils.showVersion();
TallyNodeUtils.checkBrowserCompatibility();