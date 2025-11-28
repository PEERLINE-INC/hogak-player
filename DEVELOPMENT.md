# Hogak Player 개발 가이드

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [개발 환경 설정](#개발-환경-설정)
- [빌드 및 배포](#빌드-및-배포)
- [컴포넌트 구조](#컴포넌트-구조)
- [상태 관리](#상태-관리)
- [개발 가이드라인](#개발-가이드라인)
- [테스트](#테스트)
- [스토리북](#스토리북)

## 프로젝트 개요

Hogak Player는 호각 OTT 영상 재생을 위한 React 기반의 비디오 플레이어 라이브러리입니다. Video.js를 기반으로 하여 HLS 스트리밍, 라이브 방송, 광고 재생, 멀티뷰, 클립 기능 등을 지원합니다.

### 주요 기능
- **HLS 스트리밍 지원** - Video.js 기반의 안정적인 영상 재생
- **반응형 디자인** - 다양한 화면 크기에 대응
- **라이브 방송 지원** - 실시간 스트리밍 및 라이브 트래킹
- **멀티뷰** - 여러 영상을 동시에 볼 수 있는 기능
- **태그 시스템** - 영상에 마커와 태그 추가
- **클립 기능** - 영상 구간 선택 및 저장
- **Chromecast 지원** - TV로 영상 전송
- **AirPlay 지원** - iOS 기기에서 AirPlay 사용
- **광고 재생** - IMA 및 URL 기반 광고 지원
- **PIP (Picture-in-Picture)** - 화면 속 화면 기능
- **다국어 지원** - i18next 기반 국제화

## 기술 스택

### 핵심 기술
- **React 18.3.1** - UI 라이브러리
- **TypeScript 5.4.5** - 타입 안정성
- **Video.js 8.21.0** - 비디오 플레이어 엔진
- **Zustand 5.0.1** - 상태 관리
- **Styled Components 6.1.13** - CSS-in-JS 스타일링

### 빌드 도구
- **Vite 5.2.8** - 번들러 및 개발 서버
- **PostCSS** - CSS 후처리
- **Autoprefixer** - CSS 벤더 프리픽스 자동 추가

### 개발 도구
- **Storybook 8.0.8** - 컴포넌트 문서화 및 개발
- **Vitest 1.5.0** - 테스트 프레임워크
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Stylelint** - CSS 코드 품질 관리

### 의존성
- **@radix-ui/react-popover** - 팝오버 컴포넌트
- **@radix-ui/react-slider** - 슬라이더 컴포넌트
- **react-full-screen** - 전체화면 기능
- **react-hotkeys-hook** - 키보드 단축키
- **i18next** - 국제화
- **axios** - HTTP 클라이언트

## 프로젝트 구조

```
hogak-player/
├── src/
│   ├── components/           # React 컴포넌트들
│   │   ├── HogakPlayer/     # 메인 플레이어 컴포넌트
│   │   ├── Controls/        # 플레이어 컨트롤 UI
│   │   ├── MultiViewPopover/ # 멀티뷰 팝오버
│   │   ├── TagViewPopover/  # 태그 뷰 팝오버
│   │   ├── ClipViewPopover/ # 클립 뷰 팝오버
│   │   └── ...              # 기타 UI 컴포넌트들
│   ├── store/               # Zustand 상태 관리
│   │   ├── playerStore.ts   # 플레이어 상태
│   │   ├── multiViewStore.ts # 멀티뷰 상태
│   │   ├── tagViewStore.ts  # 태그 상태
│   │   ├── clipViewStore.ts # 클립 상태
│   │   ├── adStore.ts       # 광고 상태
│   │   ├── liveStore.ts     # 라이브 상태
│   │   └── qualityStore.ts  # 화질 상태
│   ├── hooks/               # 커스텀 훅
│   ├── util/                # 유틸리티 함수
│   ├── assets/              # 정적 자산
│   │   ├── icons/           # SVG 아이콘들
│   │   └── locales/         # 다국어 파일
│   └── main.tsx             # 진입점
├── patches/                 # 패치 파일들
├── umd/                     # UMD 빌드 결과물
├── dist/                    # ES 모듈 빌드 결과물
├── package.json
├── vite.config.ts           # ES 모듈 빌드 설정
├── vite.config.umd.ts       # UMD 빌드 설정
└── tsconfig.json
```

## 개발 환경 설정

### 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd hogak-player
npm install
```

### 개발 서버 실행

```bash
# Storybook 개발 서버 실행
npm run storybook

# 테스트 실행
npm run test

# 테스트 커버리지 생성
npm run coverage
```

### npm 배포
```bash
# npm 레포지토리에 배포
npm publish
```

### 코드 품질 도구

```bash
# ESLint 검사
npm run lint

# ESLint 자동 수정
npm run lint:fix

# Prettier 포맷 검사
npm run format

# Prettier 자동 포맷
npm run format:fix

# Stylelint 검사
npm run stylelint

# Stylelint 자동 수정
npm run stylelint:fix
```

## 빌드 및 배포

### ES 모듈 빌드 (기본)

```bash
npm run build
```

- **출력**: `dist/` 디렉토리
- **형식**: ES 모듈
- **타입 정의**: TypeScript 선언 파일 포함
- **용도**: npm 패키지로 배포

### UMD 빌드

```bash
npm run build:umd
```

- **출력**: `umd/` 디렉토리
- **형식**: UMD (Universal Module Definition)
- **전역 변수**: `window.GlobalHogakPlayer`
- **용도**: CDN 또는 직접 스크립트 로드

### 빌드 설정

#### ES 모듈 빌드 (`vite.config.ts`)
- **진입점**: `src/main.tsx`
- **외부 의존성**: React, React-DOM
- **출력**: ES 모듈 형식
- **소스맵**: 포함
- **CSS**: 자동 주입

#### UMD 빌드 (`vite.config.umd.ts`)
- **진입점**: `src/main.tsx`
- **외부 의존성**: React, React-DOM
- **출력**: UMD 형식
- **인라인**: 동적 임포트 인라인화

### 배포 전 체크리스트

```bash
# 테스트 실행
npm run test

# 린트 검사
npm run lint

# 포맷 검사
npm run format

# 스타일 검사
npm run stylelint

# 빌드 실행
npm run build
npm run build:umd

# Storybook 빌드 (선택사항)
npm run build-storybook
```

## 컴포넌트 구조

### 메인 컴포넌트

#### HogakPlayer
- **위치**: `src/components/HogakPlayer/index.tsx`
- **역할**: 메인 플레이어 컴포넌트
- **기능**: Video.js 통합, 상태 관리, 이벤트 처리
- **Props**: `HogakPlayerProps` 인터페이스 정의

#### Controls
- **위치**: `src/components/Controls/index.tsx`
- **역할**: 플레이어 컨트롤 UI
- **기능**: 재생/일시정지, 볼륨, 전체화면, 멀티뷰 등

### 팝오버 컴포넌트

#### MultiViewPopover
- **기능**: 멀티뷰 선택 및 전환
- **상태**: `multiViewStore` 사용

#### TagViewPopover
- **기능**: 태그 표시 및 관리
- **상태**: `tagViewStore` 사용

#### ClipViewPopover
- **기능**: 클립 구간 선택 및 저장
- **상태**: `clipViewStore` 사용

### 유틸리티 컴포넌트

- **PlayTime**: 재생 시간 표시
- **RangeSlider**: 범위 슬라이더
- **Slider**: 일반 슬라이더
- **Dropdown**: 드롭다운 메뉴
- **ToastPopup**: 토스트 알림
- **SkipAdButton**: 광고 건너뛰기 버튼

## 상태 관리

### Zustand 스토어 구조

#### playerStore
- **역할**: 플레이어의 핵심 상태 관리
- **상태**: URL, 재생 상태, 볼륨, 전체화면, UI 표시 여부 등
- **특징**: 인스턴스별 독립적인 상태 관리

#### multiViewStore
- **역할**: 멀티뷰 관련 상태
- **상태**: 멀티뷰 소스, 대기 중인 시크 등

#### tagViewStore
- **역할**: 태그 관련 상태
- **상태**: 태그 목록, 태그 메뉴 등

#### clipViewStore
- **역할**: 클립 관련 상태
- **상태**: 현재 시간, 클립 API 호스트 등

#### adStore
- **역할**: 광고 관련 상태
- **상태**: 광고 재생 여부, 광고 타입, 광고 URL 등

#### liveStore
- **역할**: 라이브 방송 관련 상태
- **상태**: 라이브 엣지 상태 등

#### qualityStore
- **역할**: 화질 관련 상태
- **상태**: 화질 레벨, 현재 화질 등

### 상태 관리 패턴

```typescript
// 스토어 생성
const usePlayerStore = create<PlayerState>((set) => ({
  // 상태
  isPlay: false,
  // 액션
  setIsPlay: (isPlay: boolean) => set({ isPlay }),
  // 리셋
  resetPlayerStore: () => set(initialState),
}));

// 컴포넌트에서 사용
const isPlay = usePlayerStore((state) => state.isPlay);
const setIsPlay = usePlayerStore((state) => state.setIsPlay);
```

## 개발 가이드라인

### 컴포넌트 개발

#### 컴포넌트 구조
```typescript
// 인터페이스 정의
interface ComponentProps {
  // props 타입 정의
}

// 컴포넌트 구현
export function Component(props: ComponentProps) {
  // 상태 및 훅 사용
  const [state, setState] = useState();
  
  // 이벤트 핸들러
  const handleEvent = useCallback(() => {
    // 이벤트 처리
  }, []);
  
  // 렌더링
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### 스타일링
- Styled Components 사용
- CSS-in-JS 활용
- 반응형 디자인 고려
- 테마 일관성 유지

### 상태 관리

#### 스토어 설계 원칙
- 단일 책임: 각 스토어는 하나의 도메인만 담당
- 불변성: 상태 업데이트 시 새로운 객체 생성
- 타입 안정성: TypeScript 인터페이스 정의

#### 상태 업데이트 패턴
```typescript
// 올바른 상태 업데이트
setState((prev) => ({ ...prev, newValue }));

// 잘못된 상태 업데이트 (직접 변경)
state.newValue = newValue;
```

### 이벤트 처리

#### Video.js 이벤트
```typescript
// 이벤트 리스너 등록
player.on('play', handleOnPlay);
player.on('timeupdate', handleOnTimeUpdate);

// 이벤트 리스너 제거
player.off('play', handleOnPlay);
```

#### React 이벤트
```typescript
// 이벤트 핸들러 정의
const handleClick = useCallback((event: MouseEvent) => {
  // 이벤트 처리
}, [dependencies]);

// JSX에서 사용
<button onClick={handleClick}>Click</button>
```

### 에러 처리

#### Video.js 에러
```typescript
player.on('error', (error) => {
  console.error('Player error:', error);
  // 에러 상태 업데이트
  setIsShowErrorView(true);
});
```

## 테스트

### 테스트 설정

#### Vitest 설정
- 환경: jsdom
- 설정 파일: `src/test/setup.ts`
- 커버리지: v8 엔진 사용

#### 테스트 실행
```bash
# 테스트 실행 (UI 포함)
npm run test

# 커버리지 생성
npm run coverage
```

### 테스트 작성 가이드

#### 컴포넌트 테스트
```typescript
import { render, screen } from '@testing-library/react';
import { HogakPlayer } from './HogakPlayer';

describe('HogakPlayer', () => {
  it('renders correctly', () => {
    render(<HogakPlayer url="test-url" />);
    expect(screen.getByRole('video')).toBeInTheDocument();
  });
});
```

#### 훅 테스트
```typescript
import { renderHook } from '@testing-library/react';
import { usePlayerStore } from './playerStore';

describe('usePlayerStore', () => {
  it('updates state correctly', () => {
    const { result } = renderHook(() => usePlayerStore());
    
    act(() => {
      result.current.setIsPlay(true);
    });
    
    expect(result.current.isPlay).toBe(true);
  });
});
```

## 스토리북

### 스토리북 설정

#### 실행
```bash
# 개발 서버 실행
npm run storybook

# 빌드
npm run build-storybook
```