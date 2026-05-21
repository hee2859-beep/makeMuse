/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tutorial, SkinData, MakeupEvaluation } from "../types";

// Standard formula to transform raw vision metrics into an elegant, reliable 0-100 Barefoot Skin Prep Score 
export function calculatePrepScore(skinData: SkinData): number {
  // Texture: lower score is smoother skin. High texture is rough.
  // Negatively scales: rough skin decreases score. Max penalty of 35 pts.
  const texturePenalty = Math.min(35, skinData.textureScore * 0.45);
  
  // Redness: lower score is calmer skin. Optimal range is 10-25. 
  // Negatively scales above 20. Max penalty of 25 pts.
  const rednessPenalty = skinData.rednessScore > 20 
    ? Math.min(25, (skinData.rednessScore - 20) * 0.45) 
    : 0;

  // Moisture: higher score is a glowing bounce. Represents highlight luminance reflectance.
  // Positively scaled to a max contribution of 40 pts.
  const moistureReward = (skinData.moistureScore / 100) * 40;

  // Base score
  const baseScore = 60 - texturePenalty - rednessPenalty + moistureReward;
  
  return Math.min(100, Math.max(10, Math.floor(baseScore)));
}

// Calculate makeup perfection ratio (0-100 scale: high = perfect)
export function calculateMakeupPerfection(evalData: MakeupEvaluation): number {
  // Uniformity penalty (high baseUniformity means splotchy)
  const basePenalty = Math.min(40, evalData.baseUniformity * 0.45);

  // Eyeliner symmetry penalty: each pixel gap costs 5 points (maximum 35 point penalty)
  const symmetryPenalty = Math.min(35, evalData.eyelinerSymmetry * 5);

  // Lip overstep penalty
  const lipPenalty = Math.min(25, evalData.lipBorderOverstep * 0.3);

  const finalRatio = 100 - basePenalty - symmetryPenalty - lipPenalty;
  return Math.min(100, Math.max(0, Math.floor(finalRatio)));
}

// Interactive DB for the 10-Step Growth Beauty Tutorials (The Sea Map)
export const initialTutorials = (): Tutorial[] => [
  {
    id: 'tut_01',
    title: 'Ocean Dew Base',
    koreanTitle: '1단계: 해양 수분 밀물 베이스',
    level: 'Beginner',
    levelNum: 1,
    requiredPrepScore: 0,
    requiredColorUnlock: false,
    duration: '4분',
    description: '이마와 볼 중앙의 반사 영역을 촉촉하게 채워 쌩얼 수분 반사율을 극대화하는 기초 프렙.',
    unlocked: true,
    completed: false,
    steps: [
      '가볍고 투명한 해수 수딩 젤을 이마에서 코끝 방향으로 가볍게 밀쓸듯이 도포하세요.',
      '양 볼의 건조 구역에 수분 크림을 가볍게 두드려 흡수시키며 피부 윤기 반사율을 극대화합니다.',
      '피부 결 흐름에 맞춰 스펀지로 잔여 수분을 정돈하여 요철 엣지를 누릅니다.'
    ],
    arGuideLines: [
      {
        type: 'contour',
        color: '#7AD6D8',
        label: '이마 수분 스티플 구역',
        points: [{ x: 50, y: 18 }, { x: 42, y: 24 }, { x: 58, y: 24 }]
      },
      {
        type: 'contour',
        color: '#00E5FF',
        label: '양 볼 수분 안개 레이어',
        points: [{ x: 30, y: 56 }, { x: 38, y: 64 }, { x: 62, y: 64 }, { x: 70, y: 56 }]
      }
    ]
  },
  {
    id: 'tut_02',
    title: 'Sandy Calm Base Tone',
    koreanTitle: '2단계: 모래밭 홍조 진정 톤 정돈',
    level: 'Beginner',
    levelNum: 2,
    requiredPrepScore: 35,
    requiredColorUnlock: false,
    duration: '5분',
    description: 'LAB 색공간 a* 채널 수치를 무력화 시켜 홍조를 차분히 다독이는 보색 베이스 정교 기술.',
    unlocked: true,
    completed: false,
    steps: [
      '양 볼의 붉은 홍조 지수가 높은 원형 영역을 확인하세요.',
      '그린 톤 또는 박하 베일을 아주 엷게 취해 뺨 정중앙에 톡 찍어줍니다.',
      '수분을 가득 연출한 파도 연출용 퍼프로 바깥쪽으로 수채화처럼 맑게 번지듯 탭핑해 균일도를 확보합니다.'
    ],
    arGuideLines: [
      {
        type: 'contour',
        color: '#2ECC71',
        label: '민트 베일 홍조 중화 타겟 (좌/우)',
        points: [{ x: 35, y: 55 }, { x: 65, y: 55 }]
      }
    ]
  },
  {
    id: 'tut_03',
    title: 'Sea Glass Moist Lips',
    koreanTitle: '3단계: 조갯살 반사 투명 립 촉촉',
    level: 'Beginner',
    levelNum: 3,
    requiredPrepScore: 45,
    requiredColorUnlock: false,
    duration: '3분',
    description: '거칠어 보이는 보습 부족 각질 존(Lip Margin)을 진주빛 윤기로 봉인하는 초보 맞춤 루틴.',
    unlocked: true,
    completed: false,
    steps: [
      '고영양 세라마이드 마린 발삼을 취해 입술 안쪽부터 슬며시 스며들도록 퍼뜨립니다.',
      '구각(입술 구석 L/R)의 각도가 쳐지지 않도록 손끝으로 리프팅하듯 지그시 고정하세요.',
      '립 테두리 밖을 과도하게 침범하지 않도록 주의하여 면봉으로 경계를 정돈합니다.'
    ],
    arGuideLines: [
      {
        type: 'lips',
        color: '#FF80AB',
        label: '립 수분 장막 보존 라인',
        points: [{ x: 42, y: 78 }, { x: 50, y: 75 }, { x: 58, y: 78 }, { x: 50, y: 81 }]
      }
    ]
  },
  {
    id: 'tut_04',
    title: 'Coral Reef Blush',
    koreanTitle: '4단계: 산호초 입체 생기 치크',
    level: 'Intermediate',
    levelNum: 4,
    requiredPrepScore: 55,
    requiredColorUnlock: true,
    duration: '6분',
    description: '자신의 퍼스널 컬러 팔레트를 응용해 얼굴 면적에 생기가 뿜어지도록 설계하는 산호빛 플로우.',
    unlocked: false,
    completed: false,
    steps: [
      '나의 퍼스널 컬러에 부합하는 생기 복숭아/코랄 살구 혹은 모브 치크 컬러를 발굴하세요.',
      '광대뼈 외곽 사선 지점부터 눈썹 꼬리 바로 아래 연결선까지 물보라처럼 흩뿌리며 둥글게 터치합니다.',
      '가장자리를 스펀지 끝으로 여러 번 연출해 볼 부위 피부와의 경계를 블렌딩해 균일성을 배가시킵니다.'
    ],
    arGuideLines: [
      {
        type: 'blush',
        color: '#FFA07A',
        label: '산호빛 치크 가이드 존',
        points: [{ x: 30, y: 58 }, { x: 38, y: 52 }, { x: 62, y: 52 }, { x: 70, y: 58 }]
      }
    ]
  },
  {
    id: 'tut_05',
    title: 'Siren Eyeshadow Depth',
    koreanTitle: '5단계: 사이렌의 깊은 해음 음영',
    level: 'Intermediate',
    levelNum: 5,
    requiredPrepScore: 60,
    requiredColorUnlock: false,
    duration: '8분',
    description: '눈가 주변의 어두운 그늘(L* 편차)을 바다 깊은 심연의 세련된 조각 음영으로 조율하는 코스.',
    unlocked: false,
    completed: false,
    steps: [
      '매트 베이지 톤의 샌드 섀도우를 브러쉬에 고루 부하한 뒤 아이홀 전체에 가볍게 누르며 펼칩니다.',
      '언더 라인 삼각 존 부근에 초콜릿 모카 사전을 얹어 깊은 바다 눈망울의 음형을 조각조각 세웁니다.',
      '눈 정중앙 노드 위에는 가볍게 씨스타 샌드 글리터로 윤기 반사율을 더하세요.'
    ],
    arGuideLines: [
      {
        type: 'contour',
        color: '#CD7F32',
        label: '아이홀 깊은 바다 사구선',
        points: [{ x: 26, y: 40 }, { x: 34, y: 40 }, { x: 66, y: 40 }, { x: 74, y: 40 }]
      }
    ]
  },
  {
    id: 'tut_06',
    title: 'Seaweed Sleek Eyeliner',
    koreanTitle: '6단계: 대칭 설계 미역 아이라인',
    level: 'Intermediate',
    levelNum: 6,
    requiredPrepScore: 68,
    requiredColorUnlock: false,
    duration: '7분',
    description: '좌우 눈꺼풀 외곽 각도 차이(Symmetry Error)를 정교하게 비교 교정하는 대칭 아이라인 제법.',
    unlocked: false,
    completed: false,
    steps: [
      '양쪽 고정 거울 중심선에 코를 정밀하게 수직으로 일치시키고 지시된 좌표 비율을 파악합니다.',
      '오른쪽 눈꼬리에서 관자놀이 쪽으로 약 15도 경사각을 유지하며 붓끝으로 수평 비상의 선을 뺍니다.',
      '왼쪽 눈꼬리 끝 역시 평행 가이드라인 가상 기준선과 정확히 한 호흡 차이 높이로 인출해 대칭을 유도합니다.'
    ],
    arGuideLines: [
      {
        type: 'eyeliner',
        color: '#FF007F',
        label: '좌우 15도 비상의 평행 지침선',
        points: [{ x: 24, y: 44 }, { x: 28, y: 44 }, { x: 72, y: 44 }, { x: 76, y: 44 }]
      }
    ]
  },
  {
    id: 'tut_07',
    title: 'Pearl Highlighting Beam',
    koreanTitle: '7단계: 심해 진주알 수분 피크 빔',
    level: 'Intermediate',
    levelNum: 7,
    requiredPrepScore: 74,
    requiredColorUnlock: false,
    duration: '5분',
    description: '이마, 콧망울 4개 소, 양 광대뼈 정점에 미세 진주빔을 쏘아 3차원 반사체로 승화하는 가이드.',
    unlocked: false,
    completed: false,
    steps: [
      '진주빛 액상 쉬머를 약지 손끝에 살짝 취해 체온으로 무장시킵니다.',
      '콧대 시작 중심부와 인중 바로 위 콧망울 중앙 노드에 가벼운 압으로 누릅니다.',
      '광대 중심점(양 뺨 하이라이트)에 수평 원반을 굴리듯 블렌딩하여 대칭 발광을 형성하세요.'
    ],
    arGuideLines: [
      {
        type: 'contour',
        color: '#FFFFFF',
        label: '진주빛 하이 볼륨 리바운드 포인터',
        points: [{ x: 50, y: 26 }, { x: 50, y: 52 }, { x: 33, y: 50 }, { x: 67, y: 50 }]
      }
    ]
  },
  {
    id: 'tut_08',
    title: 'Mermaid Coral Sunrise',
    koreanTitle: '8단계: 마스터 인어의 태양 오버핏 립',
    level: 'Master',
    levelNum: 8,
    requiredPrepScore: 78,
    requiredColorUnlock: true,
    duration: '9분',
    description: '립 경계 영역을 정교하게 흐트려 오버 볼륨감을 극대화하면서도 이탈도를 영으로 잡는 고급 립 기술.',
    unlocked: false,
    completed: false,
    steps: [
      '피치 로즈 틴트로 아랫입술 중심 원통을 채워 진하게 뿜어내는 수분 중심핵을 심습니다.',
      '브러쉬로 입술 경계를 산호 거품 터지듯 스머징 처리하되, 지시된 립 마진 외부 빨간 가이드선 밖을 절대로 침범하지 마세요.',
      '입가의 음영 코너를 연피 베이지로 차단하여 입술의 생동 중심축을 입안쪽으로 모아 입체감을 높입니다.'
    ],
    arGuideLines: [
      {
        type: 'lips',
        color: '#E0115F',
        label: '정밀 볼륨 그라데이션 경계선',
        points: [{ x: 41, y: 77 }, { x: 50, y: 72 }, { x: 59, y: 77 }, { x: 50, y: 83 }]
      }
    ]
  },
  {
    id: 'tut_09',
    title: 'Deep Abyss Contrast',
    koreanTitle: '9단계: 무광 심해 버건디 정점의 조화',
    level: 'Master',
    levelNum: 9,
    requiredPrepScore: 84,
    requiredColorUnlock: false,
    duration: '10분',
    description: '결점 없는 고대칭 베이스(Uniformity) 위에 깊게 대비되는 장엄한 아우라의 마스터 뷰티 연출.',
    unlocked: false,
    completed: false,
    steps: [
      '피부 결 엣지가 없음을 확인한 최고의 세미 매트 캔버스에 딥 포도주 혹은 초콜릿 쉬머 버건디 베이스를 도포합니다.',
      '언더라인 뒤트임 노드에서 바깥으로 2mm 공간을 띄워 시원하게 눈가 전장을 수직 연출합니다.',
      '립 외각선 6곳의 좌표 정합성을 맞춘 후 최고조의 고딕 매트 버건디를 채워 화려함을 폭발시키세요.'
    ],
    arGuideLines: [
      {
        type: 'contour',
        color: '#800020',
        label: '심해 광막 대칭 코너',
        points: [{ x: 26, y: 46 }, { x: 74, y: 46 }, { x: 32, y: 65 }, { x: 68, y: 65 }]
      }
    ]
  },
  {
    id: 'tut_10',
    title: 'Chrono-oceanic Sculpt Finish',
    koreanTitle: '10단계: 파도의 조수간만 윤곽 셰이딩',
    level: 'Master',
    levelNum: 10,
    requiredPrepScore: 90,
    requiredColorUnlock: false,
    duration: '11분',
    description: '빛과 그림자의 비율을 재배치하여, 얼굴 가로 폭을 정해진 수평비로 축소 조각하는 최종 마스터 셰이더.',
    unlocked: false,
    completed: false,
    steps: [
      '광대 골짜기 귀밑 턱선에서 앞으로 썰물이 나가듯 파도 셰이드 브러시질을 시작합니다.',
      '콧대가 콧볼 4지점 안으로 좁아져 보이도록 아주 가느다란 콧가 사선을 섀도 코브로 연결합니다.',
      '헤어 이마 외곽선을 꼼꼼하게 메워 얼굴이 파도의 유려한 타원 실루엣으로 정제되게 완성합니다.'
    ],
    arGuideLines: [
      {
        type: 'contour',
        color: '#5D4037',
        label: '파도의 조수 그림자 가이드 라인 (사선)',
        points: [{ x: 20, y: 55 }, { x: 32, y: 74 }, { x: 80, y: 55 }, { x: 68, y: 74 }]
      }
    ]
  }
];

// Resolves unlock state for each tutorial dynamically depending on current diagnostic statistics
export function resolveTutorialUnlockStates(
  tutorials: Tutorial[],
  skinPrepScore: number,
  makeupScore: number,
  personalColorSeason: string
): Tutorial[] {
  return tutorials.map(tut => {
    // 1. Beginner levels are permanently unlocked (Levels 1-3)
    let isUnlocked = tut.levelNum <= 3;

    // 2. Intermediate levels require a certified barefoot skin prep score >= 45/50/55/etc depending on difficulty
    if (tut.level === 'Intermediate') {
      isUnlocked = skinPrepScore >= tut.requiredPrepScore;
    }

    // 3. Master levels are locked until both skinPrep and prior makeup perfection averages hit specified ranges
    if (tut.level === 'Master') {
      isUnlocked = (skinPrepScore >= tut.requiredPrepScore) && (makeupScore >= 60 || tut.levelNum === 8);
    }

    // Special match reward flag: If it aligns with their diagnosed personal color category
    const containsCategoryLabel = (season: string, cat: string) => {
      if (cat === 'Spring' && season.startsWith('Spring')) return true;
      if (cat === 'Summer' && season.startsWith('Summer')) return true;
      if (cat === 'Autumn' && season.startsWith('Autumn')) return true;
      if (cat === 'Winter' && season.startsWith('Winter')) return true;
      return false;
    };

    let colorRewardMatch = false;
    if (tut.requiredColorUnlock && personalColorSeason) {
      if (tut.id === 'tut_04' && containsCategoryLabel(personalColorSeason, 'Spring')) colorRewardMatch = true; 
      if (tut.id === 'tut_08' && (containsCategoryLabel(personalColorSeason, 'Summer') || containsCategoryLabel(personalColorSeason, 'Winter') || containsCategoryLabel(personalColorSeason, 'Spring') || containsCategoryLabel(personalColorSeason, 'Autumn'))) {
        colorRewardMatch = true; // matches seasonal lipstick expertise
      }
    }

    return {
      ...tut,
      unlocked: isUnlocked,
      requiredColorUnlock: colorRewardMatch
    };
  });
}
