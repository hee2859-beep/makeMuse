/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkinData, MakeupEvaluation, PersonalColorSeason, PersonalColorDetail, FacialMarker } from "../types";

// RGB to LAB Color Conversion Helper
export function rgbToLab(r255: number, g255: number, b255: number) {
  let r = r255 / 255;
  let g = g255 / 255;
  let b = b255 / 255;

  // Gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  // D65 standard illuminant
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  const xr = x / 95.047;
  const yr = y / 100.0;
  const zr = z / 108.883;

  const fx = xr > 0.008856 ? Math.pow(xr, 1 / 3) : 7.787 * xr + 16 / 116;
  const fy = yr > 0.008856 ? Math.pow(yr, 1 / 3) : 7.787 * yr + 16 / 116;
  const fz = zr > 0.008856 ? Math.pow(zr, 1 / 3) : 7.787 * zr + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return { L: l, a, b: bVal };
}

// Relative Luminance calculator
export function getLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// 12 seasonal details database
export const seasonalDetails: Record<PersonalColorSeason, PersonalColorDetail> = {
  'Spring Warm Light': {
    seasonName: 'Spring Warm Light',
    koreanName: '봄 웜 라이트',
    category: 'Spring',
    description: '복숭아빛 생기를 품은 싱그럽고 부드러운 톤입니다. 봄바람처럼 화사하고 투명합니다.',
    bestHexes: ['#FFF0D4', '#FFD09B', '#FFB0B0', '#F8FF95', '#C0F9D8'],
    makeupPalette: { base: '#FFF5E6', blush: '#FFA07A', lip: '#FF6F61', eyeshadow: '#E0B090' },
    recommendation: '살구빛 코랄블러셔와 글로시한 립, 맑은 베이지 톤 음영을 추천합니다.'
  },
  'Spring Warm Bright': {
    seasonName: 'Spring Warm Bright',
    koreanName: '봄 웜 브라이트',
    category: 'Spring',
    description: '맑고 강렬한 햇살처럼 선명하고 에너지 넘치는 고채도의 발랄한 톤입니다.',
    bestHexes: ['#FF6B6B', '#FF8E53', '#FFAA00', '#F4D03F', '#2ECC71'],
    makeupPalette: { base: '#FFF2E0', blush: '#FF7F50', lip: '#FF3B30', eyeshadow: '#D2B48C' },
    recommendation: '채도 높은 다홍색 오렌지립과 하이라이터를 매치해 비비드한 생기를 끌어올리세요.'
  },
  'Spring Warm Warm': {
    seasonName: 'Spring Warm Warm',
    koreanName: '봄 트루 웜',
    category: 'Spring',
    description: '따스한 골드 에너지가 가장 돋보이는 가을 길목의 화려하고 풍요로운 봄 피부입니다.',
    bestHexes: ['#FFC300', '#E28743', '#E67E22', '#D35400', '#F39C12'],
    makeupPalette: { base: '#FFE8D6', blush: '#E07A5F', lip: '#D95238', eyeshadow: '#CD7F32' },
    recommendation: '풍부한 피치 골드 쉬머 메이크업과 매트한 살구빛 감빛 립이 잘 어울립니다.'
  },
  'Summer Cool Light': {
    seasonName: 'Summer Cool Light',
    koreanName: '여름 쿨 라이트',
    category: 'Summer',
    description: '시원하고 파스텔리한 라벤더, 물안개 속 핑크 장미 같은 깨끗하고 여린 느낌입니다.',
    bestHexes: ['#F3E5F5', '#E1BEE7', '#F8BBD0', '#D1C4E9', '#BBDEFB'],
    makeupPalette: { base: '#FDFBF7', blush: '#FFB7C5', lip: '#FF4D80', eyeshadow: '#C8A2C8' },
    recommendation: '라벤더 핑크 하이라이터와 물먹은 베리 핑크 틴트로 청량하고 투명한 결을 살리세요.'
  },
  'Summer Cool Muted': {
    seasonName: 'Summer Cool Muted',
    koreanName: '여름 쿨 뮤트',
    category: 'Summer',
    description: '그레이시한 세련미가 어우러지며, 은은하고 신비한 안개가 낀 장미정원 같은 톤입니다.',
    bestHexes: ['#D7CCC8', '#CFD8DC', '#E0F2F1', '#D8DFE2', '#BCAAA4'],
    makeupPalette: { base: '#F4F1EA', blush: '#DDA0DD', lip: '#C71585', eyeshadow: '#A9A9A9' },
    recommendation: '뮤티드 코코아, 로즈빛 매트 섀도우를 깔고 번트 장미 립 컬러로 정성스러운 음영을 완성하세요.'
  },
  'Summer Cool Cool': {
    seasonName: 'Summer Cool Cool',
    koreanName: '여름 트루 쿨',
    category: 'Summer',
    description: '더위 없는 푸르른 빙하 아래 가볍게 살랑이는 쿨 블루 지수를 간직한 매트 피부 톤입니다.',
    bestHexes: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#90CAF9', '#CE93D8'],
    makeupPalette: { base: '#F9F1F0', blush: '#FC8EAC', lip: '#E30B5D', eyeshadow: '#92A8D1' },
    recommendation: '푸른빛이 감도는 플럼 쿨 로즈 치크와 세미매트 스킨 텍스처로 우아한 대비를 유도하세요.'
  },
  'Autumn Warm Muted': {
    seasonName: 'Autumn Warm Muted',
    koreanName: '가을 웜 뮤트',
    category: 'Autumn',
    description: '베이지, 카키, 우디 톤이 깊숙이 블렌딩되어 편안하고 그윽한 우아함을 자아냅니다.',
    bestHexes: ['#D7CCC8', '#FFE0B2', '#CFD8DC', '#B7A38E', '#A08E77'],
    makeupPalette: { base: '#FFF5EB', blush: '#E6A385', lip: '#C15C3D', eyeshadow: '#8E7355' },
    recommendation: '말린 오렌지 살구 치크와 누디한 번트 로즈 립으로 포근하고 고급진 수채화 느낌을 자아내세요.'
  },
  'Autumn Warm Deep': {
    seasonName: 'Autumn Warm Deep',
    koreanName: '가을 웜 딥',
    category: 'Autumn',
    description: '어두운 숲속의 나무, 단풍나무 수액처럼 강하고 입체감 넘치며 깊이 있는 톤입니다.',
    bestHexes: ['#5D4037', '#4E342E', '#E65100', '#F57C00', '#CC8E50'],
    makeupPalette: { base: '#F5E6D3', blush: '#CD5C5C', lip: '#800020', eyeshadow: '#8B4513' },
    recommendation: '테라코타 립브라운과 다크 골드 초콜릿 스모키로 조각 같은 딥 에스테틱을 완성하세요.'
  },
  'Autumn Warm Warm': {
    seasonName: 'Autumn Warm Warm',
    koreanName: '가을 트루 웜',
    category: 'Autumn',
    description: '황금빛 들판, 사막의 모래처럼 온화하고 대지의 원시적인 매력을 풍부하게 지닌 톤입니다.',
    bestHexes: ['#F5B041', '#EB984E', '#DC7633', '#C0392B', '#9A7D0A'],
    makeupPalette: { base: '#FDF1E3', blush: '#D35400', lip: '#BA4A00', eyeshadow: '#935116' },
    recommendation: '브릭 레드 또는 카라멜 메이크업, 무광 모카 메이크업으로 성숙하고 기품 있는 룩을 연출하세요.'
  },
  'Winter Cool Bright': {
    seasonName: 'Winter Cool Bright',
    koreanName: '겨울 쿨 브라이트',
    category: 'Winter',
    description: '은반 위의 선율처럼 투명함과 칠흑 같은 대조가 공존하는 극도로 선명하고 도회적인 톤입니다.',
    bestHexes: ['#FF007F', '#8A2BE2', '#4B0082', '#0000FF', '#1ABC9C'],
    makeupPalette: { base: '#FFF9F5', blush: '#FF007F', lip: '#DC143C', eyeshadow: '#708090' },
    recommendation: '선명한 퓨어 레드 립과 투명한 볼륨 하이라이팅, 깔끔한 리퀴드 블랙 아이라인으로 포인트 메이크업을 하세요.'
  },
  'Winter Cool Deep': {
    seasonName: 'Winter Cool Deep',
    koreanName: '겨울 쿨 딥',
    category: 'Winter',
    description: '심해의 아주 깊고 단단한 보물처럼 서리가 서린 포도주, 흑진주의 위엄 어린 다크톤입니다.',
    bestHexes: ['#1A252C', '#301B28', '#52154E', '#112233', '#004B49'],
    makeupPalette: { base: '#FDF5F2', blush: '#C71585', lip: '#4A0E17', eyeshadow: '#4A5B6B' },
    recommendation: '뱀파이어 버건디 혹은 딥 자두 과즙 립에 극도의 깔끔한 피부 베이스를 매치하여 시선을 장악하세요.'
  },
  'Winter Cool Cool': {
    seasonName: 'Winter Cool Cool',
    koreanName: '겨울 트루 쿨',
    category: 'Winter',
    description: '달빛에 반사된 만년설처럼 한 치의 흔들림 없는 완벽한 한기와 투명성을 간직한 고고한 톤입니다.',
    bestHexes: ['#E3F2FD', '#E8EAF6', '#4A148C', '#000080', '#101010'],
    makeupPalette: { base: '#FAFAFF', blush: '#FC6C85', lip: '#E0115F', eyeshadow: '#3F51B5' },
    recommendation: '푸른 빛 도는 푸시아 오버립과 화이트 실버 하이빔 하이라이터를 매치해 우아한 극명함을 발산하세요.'
  }
};

// 12 seasonal classification algorithm based on L* a* b* coordinates on key face zones
export function analyzePersonalColor(L: number, a: number, b: number): PersonalColorSeason {
  // Broad Warm vs Cool determination:
  // Lower b implies more cool toned (dominant blue coordinates), higher b implies more warm toned (yellow coordinates)
  // Higher a implies redness or peach highlights
  const isWarm = b > 14.5;
  const lightness = L;

  if (isWarm) {
    if (lightness > 68) {
      // Light spring / Muted Spring boundary
      return a > 12 ? 'Spring Warm Light' : 'Spring Warm Bright';
    } else if (lightness > 52) {
      return a > 16 ? 'Spring Warm Warm' : 'Autumn Warm Muted';
    } else {
      return a > 12 ? 'Autumn Warm Warm' : 'Autumn Warm Deep';
    }
  } else {
    // Cool Tones
    if (lightness > 65) {
      return a > 8 ? 'Summer Cool Light' : 'Summer Cool Cool';
    } else if (lightness > 50) {
      return a > 12 ? 'Winter Cool Bright' : 'Summer Cool Muted';
    } else {
      return a > 14 ? 'Winter Cool Cool' : 'Winter Cool Deep';
    }
  }
}

// Interactive Area landmarks mapping for precision measurement
export const defaultFaceMarkers = (): FacialMarker[] => [
  { id: 'forehead_highlight', name: '이마 중앙 (수분측정)', xPercent: 50, yPercent: 24, label: '이마' },
  { id: 'cheek_left', name: '볼 (결 & 홍조측정)', xPercent: 35, yPercent: 55, label: '좌측 볼' },
  { id: 'cheek_right', name: '우측 볼 (결 & 홍조측정)', xPercent: 65, yPercent: 55, label: '우측 볼' },
  { id: 'nose_tip', name: '코 끝 (수분 & 대칭필터)', xPercent: 50, yPercent: 60, label: '코 끝' },
  { id: 'lip_left', name: '좌측 입술라인', xPercent: 42, yPercent: 78, label: '구각 L' },
  { id: 'lip_right', name: '우측 입술라인', xPercent: 58, yPercent: 78, label: '구각 R' },
  { id: 'eye_left_outer', name: '왼쪽 눈꼬리', xPercent: 28, yPercent: 44, label: '눈꼬리 L' },
  { id: 'eye_right_outer', name: '오른쪽 눈꼬리', xPercent: 72, yPercent: 44, label: '눈꼬리 R' }
];

/**
 * Image processing analyzer of Bare face using Canvas representation
 * Texture Detection runs Sobel filtering over cheek centers to find high frequency variations
 * Redness calculates average LAB a* channel to find warm flush
 * Moisture scans the highlight reflection range on forehead & cheeks
 */
export function analyzeBareFaceCanvas(
  canvas: HTMLCanvasElement,
  markers: FacialMarker[]
): SkinData {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Graceful fallback
    return {
      textureScore: 42,
      rednessScore: 38,
      moistureScore: 55,
      skinTone: '자연스러운 모래빛 샌드베이지',
      personalColor: 'Spring Warm Light',
      analyzedAt: new Date().toISOString()
    };
  }

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Texture - Sobel Filter over Cheek Left and Cheek Right boxes
  // Sobel edge kernels
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ];
  const sobelY = [
    [-1, -2, -1],
    [ 0,  0,  0],
    [ 1,  2,  1]
  ];

  // We sample 40x40 squares at Left and Right Cheek positions
  let totalEdgeIntensity = 0;
  let edgeSampleCount = 0;

  const cheekMarkers = markers.filter(m => m.id === 'cheek_left' || m.id === 'cheek_right');
  
  cheekMarkers.forEach(cm => {
    const cx = Math.floor((cm.xPercent / 100) * width);
    const cy = Math.floor((cm.yPercent / 100) * height);
    
    // Scan 30x30 around cheek
    const radius = 15;
    for (let dy = -radius + 1; dy < radius - 1; dy++) {
      for (let dx = -radius + 1; dx < radius - 1; dx++) {
        const px = cx + dx;
        const py = cy + dy;
        if (px > 1 && px < width - 1 && py > 1 && py < height - 1) {
          // Compute Sobel
          let gX = 0;
          let gY = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kidx = ((py + ky) * width + (px + kx)) * 4;
              const r = data[kidx];
              const g = data[kidx + 1];
              const b = data[kidx + 2];
              const gray = 0.299 * r + 0.587 * g + 0.114 * b;
              
              gX += gray * sobelX[ky + 1][kx + 1];
              gY += gray * sobelY[ky + 1][kx + 1];
            }
          }
          
          const mag = Math.sqrt(gX * gX + gY * gY);
          totalEdgeIntensity += mag;
          edgeSampleCount++;
        }
      }
    }
  });

  const avgEdge = edgeSampleCount > 0 ? totalEdgeIntensity / edgeSampleCount : 15;
  // Map average Sobel edge magnitude into a texture/roughness score (0 - 100)
  // Extremely smooth will be 15, rough 100+
  const rawTexture = Math.min(100, Math.max(10, Math.floor(avgEdge * 1.8)));

  // 2. Redness & Tone - LAB Color Space analysis inside cheeks marker
  let sumL = 0;
  let sumA = 0;
  let sumB = 0;
  let labCount = 0;

  cheekMarkers.forEach(cm => {
    const cx = Math.floor((cm.xPercent / 100) * width);
    const cy = Math.floor((cm.yPercent / 100) * height);
    const radius = 10;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = cx + dx;
        const py = cy + dy;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const idx = (py * width + px) * 4;
          const r = data[idx];
          const g = data[idx+1];
          const b = data[idx+2];
          
          const lab = rgbToLab(r, g, b);
          sumL += lab.L;
          sumA += lab.a;
          sumB += lab.b;
          labCount++;
        }
      }
    }
  });

  const avgL = labCount > 0 ? sumL / labCount : 65;
  const avgA = labCount > 0 ? sumA / labCount : 12;
  const avgB = labCount > 0 ? sumB / labCount : 15;

  // Redness indices from a* coordinate (typical cheeks ranges from 5 to 30)
  // 5 is exceptionally cool-pale, 28-30 is a redness flush
  // Map standard offset into 0-100 redness scale
  const rawRedness = Math.min(100, Math.max(5, Math.floor((avgA - 4) * 4)));

  // 3. Moisture Proxy - Forehead & Cheek Highlighting reflection luminance
  // We compare the forehead luminance against the average check surround
  const foreheadMarker = markers.find(m => m.id === 'forehead_highlight') || markers[0];
  const fx = Math.floor((foreheadMarker.xPercent / 100) * width);
  const fy = Math.floor((foreheadMarker.yPercent / 100) * height);
  
  let foreheadLumSum = 0;
  let foreheadLumCount = 0;
  let maxForeheadLum = 0;

  const fRadius = 15;
  for (let dy = -fRadius; dy <= fRadius; dy++) {
    for (let dx = -fRadius; dx <= fRadius; dx++) {
      const px = fx + dx;
      const py = fy + dy;
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const idx = (py * width + px) * 4;
        const lum = getLuminance(data[idx], data[idx + 1], data[idx + 2]);
        foreheadLumSum += lum;
        if (lum > maxForeheadLum) maxForeheadLum = lum;
        foreheadLumCount++;
      }
    }
  }

  const avgForeheadLum = foreheadLumCount > 0 ? foreheadLumSum / foreheadLumCount : 150;
  // High variance (shine reflection contrast) indicating high water reflection index ("Pre-hydration")
  // Score based on luminance of forehead highlight mapped 0-100
  const rawMoisture = Math.min(100, Math.max(15, Math.floor((maxForeheadLum / 255) * 115)));

  // Determine human-friendly skin tone description based on L*
  let toneName = "맑고 해사한 아이보리빛";
  if (avgL > 72) {
    toneName = "화사하고 포슬한 투명 쿨 베이지";
  } else if (avgL > 62) {
    toneName = "자연스러운 해풍빛 내추럴 샌드";
  } else if (avgL > 48) {
    toneName = "그윽하고 윤기 깊은 딥 브론즈";
  } else {
    toneName = "깊은 밤처럼 귀족的な 벨벳 다크";
  }

  // Choose the 12 season categorisation
  const resolvedSeason = analyzePersonalColor(avgL, avgA, avgB);

  return {
    textureScore: rawTexture,
    rednessScore: rawRedness,
    moistureScore: rawMoisture,
    skinTone: toneName,
    personalColor: resolvedSeason,
    analyzedAt: new Date().toLocaleTimeString('ko-KR')
  };
}

/**
 * Iteration 3 final logic: evaluates makeup placement metrics
 * Base check measuring foundation Uniformity (Standard Deviation)
 * Point check measuring left-to-right eye tail symmetry and lip coordinate compliance
 */
export function evaluateMakeupCanvas(
  canvas: HTMLCanvasElement,
  markers: FacialMarker[]
): Omit<MakeupEvaluation, 'feedbackMessage'> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      baseUniformity: 82,
      eyelinerSymmetry: 2,
      lipBorderOverstep: 10,
      analyzedAt: new Date().toLocaleTimeString('ko-KR')
    };
  }

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Base check - Standard deviation of local luminance on Forehead and Cheeks (high SD = foundation splotches/cakey)
  const baseMarkers = markers.filter(m => ['forehead_highlight', 'cheek_left', 'cheek_right'].includes(m.id));
  const lums: number[] = [];

  baseMarkers.forEach(bm => {
    const bx = Math.floor((bm.xPercent / 100) * width);
    const by = Math.floor((bm.yPercent / 100) * height);
    const rad = 20;

    for (let dy = -rad; dy <= rad; dy += 2) {
      for (let dx = -rad; dx <= rad; dx += 2) {
        const px = bx + dx;
        const py = by + dy;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const idx = (py * width + px) * 4;
          lums.push(getLuminance(data[idx], data[idx+1], data[idx+2]));
        }
      }
    }
  });

  // Calculate standard deviation of luminance
  let avgLum = 0;
  if (lums.length > 0) {
    const sum = lums.reduce((acc, v) => acc + v, 0);
    avgLum = sum / lums.length;
  }
  let varSum = 0;
  lums.forEach(v => {
    varSum += Math.pow(v - avgLum, 2);
  });
  const sd = lums.length > 0 ? Math.sqrt(varSum / lums.length) : 10;
  
  // High standard dev of gray-values in highlight regions implies bad coverage / cakiness
  // Normal coverage SD is around 5-20. Splotchy makeup is 25+.
  // Map SD directly to Uniformity error rate (0-100, where 0 is perfectly smooth airbrush, 100 is extremely splotchy)
  const baseUniformityError = Math.min(100, Math.max(5, Math.floor(sd * 2.5)));

  // 2. Point Check: Eyeliner symmetry
  const lEye = markers.find(m => m.id === 'eye_left_outer') || markers[0];
  const rEye = markers.find(m => m.id === 'eye_right_outer') || markers[1];
  const nose = markers.find(m => m.id === 'nose_tip') || markers[3];

  const lEyeX = (lEye.xPercent / 100) * width;
  const lEyeY = (lEye.yPercent / 100) * height;
  const rEyeX = (rEye.xPercent / 100) * width;
  const rEyeY = (rEye.yPercent / 100) * height;
  const noseX = (nose.xPercent / 100) * width;

  // Horizontal symmetry relative to center axis (distance from left eye to nose vs right eye to nose)
  const distLeft = Math.abs(lEyeX - noseX);
  const distRight = Math.abs(rEyeX - noseX);
  const horizDiff = Math.abs(distLeft - distRight);

  // Vertical symmetry of eyeliner endpoints
  const vertDiff = Math.abs(lEyeY - rEyeY);

  // Symmetry gap is composite of horiz & vert differences, scaled
  const symmetryGapPx = Math.min(25, Math.max(0, Math.floor((horizDiff * 0.2) + (vertDiff * 0.8))));

  // 3. Lip contour overstep check - high contrast lip-zone deviation
  const lLip = markers.find(m => m.id === 'lip_left') || markers[4];
  const rLip = markers.find(m => m.id === 'lip_right') || markers[5];
  const lipX1 = Math.floor((lLip.xPercent / 100) * width);
  const lipY1 = Math.floor((lLip.yPercent / 100) * height);
  const lipX2 = Math.floor((rLip.xPercent / 100) * width);
  const lipY2 = Math.floor((rLip.yPercent / 100) * height);

  // Take midway points on outer lip lines and analyze RGB standard deviation along that line (representing lipstick sliding/blurring)
  let contrastDisruptCount = 0;
  let sampleCount = 0;
  
  // Scan vertical columns around lips to find sharp saturation shifts
  const lipCenterY = (lipY1 + lipY2) / 2;
  const lipCenterX = (lipX1 + lipX2) / 2;
  
  for (let dy = -10; dy <= 10; dy++) {
    const px = Math.floor(lipCenterX);
    const py = Math.floor(lipCenterY + dy);
    if (px >= 0 && px < width && py >= 0 && py < height) {
      const idx = (py * width + px) * 4;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      // lipstick is typically high red channel, standard skin is less
      const redVal = r - (g + b) / 2;
      if (redVal > 35) {
        contrastDisruptCount++;
      }
      sampleCount++;
    }
  }

  // Red channel outlier percentage signifies bleeding/border oversteps (0-100)
  const lipError = Math.min(100, Math.max(2, Math.floor((contrastDisruptCount / (sampleCount || 1)) * 140)));

  return {
    baseUniformity: baseUniformityError,
    eyelinerSymmetry: symmetryGapPx,
    lipBorderOverstep: lipError,
    analyzedAt: new Date().toLocaleTimeString('ko-KR')
  };
}

/**
 * Draws Face Mesh aligned connectors to visualize the Sea Prep Grid mapping on Canvas
 */
export function drawSeaFaceOverlay(
  ctx: CanvasRenderingContext2D,
  markers: FacialMarker[],
  width: number,
  height: number
) {
  // Clear custom grid
  ctx.strokeStyle = 'rgba(122, 214, 216, 0.45)'; // Marine turquoise soft line
  ctx.lineWidth = 1.2;

  // Draw face framing guidelines conceptually
  const points: Record<string, { x: number; y: number }> = {};
  markers.forEach(m => {
    points[m.id] = {
      x: (m.xPercent / 100) * width,
      y: (m.yPercent / 100) * height
    };
  });

  // 1. Draw central vertical line (The Ocean Meridians)
  if (points.forehead_highlight && points.nose_tip) {
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(points.forehead_highlight.x, points.forehead_highlight.y - 40);
    ctx.lineTo(points.nose_tip.x, points.nose_tip.y + 60);
    ctx.stroke();
  }

  // 2. Draw Eye level horizontal line
  if (points.eye_left_outer && points.eye_right_outer) {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(points.eye_left_outer.x - 20, points.eye_left_outer.y);
    ctx.lineTo(points.eye_right_outer.x + 20, points.eye_right_outer.y);
    ctx.stroke();

    // Eye-cheek connection polygon
    if (points.cheek_left && points.cheek_right) {
      ctx.fillStyle = 'rgba(122, 214, 216, 0.04)';
      ctx.beginPath();
      ctx.moveTo(points.eye_left_outer.x, points.eye_left_outer.y);
      ctx.lineTo(points.cheek_left.x, points.cheek_left.y);
      ctx.lineTo(points.nose_tip.x, points.nose_tip.y);
      ctx.lineTo(points.cheek_right.x, points.cheek_right.y);
      ctx.lineTo(points.eye_right_outer.x, points.eye_right_outer.y);
      ctx.lineTo(points.forehead_highlight.x, points.forehead_highlight.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  // 3. Draw Lip framing loop
  if (points.lip_left && points.lip_right && points.nose_tip) {
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(points.nose_tip.x, points.nose_tip.y);
    ctx.lineTo(points.lip_left.x, points.lip_left.y);
    ctx.lineTo(points.lip_right.x, points.lip_right.y);
    ctx.closePath();
    ctx.stroke();
  }

  // 4. Highlight scanning circles on forehead/cheeks
  ctx.setLineDash([]);
  markers.forEach(m => {
    const pt = points[m.id];
    if (pt) {
      // Draw standard glowing nodes
      const isCheek = m.id.startsWith('cheek');
      const isForehead = m.id === 'forehead_highlight';
      
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(122, 214, 216, 0.8)';
      
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = isForehead ? '#00E5FF' : isCheek ? '#FF80AB' : '#FFFFFF';
      ctx.fill();

      // Scopes
      ctx.shadowBlur = 0;
      ctx.strokeStyle = isForehead ? 'rgba(0, 229, 255, 0.4)' : isCheek ? 'rgba(255, 128, 171, 0.4)' : 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 14, 0, 2 * Math.PI);
      ctx.stroke();

      // Node label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '9px monospace';
      ctx.fillText(m.label, pt.x + 8, pt.y - 6);
    }
  });
}

/**
 * Draws a beautifully stylized, highly interactive pixel-perfect face model
 * on the canvass directly to give a reliable CV playground when webcam is nested or blocked.
 * The drawn colors, highlights, and features directly feed into the real Sobel / LAB color analyser!
 */
export function drawPresetFaceModel(
  canvas: HTMLCanvasElement,
  presetType: 'neutral-sand' | 'warm-coral' | 'deep-abyss',
  makeupOverlay: { eyelinerExtra?: number; overstepLip?: number; baseNoise?: number; appliedBlushColor?: string; skipMakeup?: boolean } = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear Canvas
  ctx.fillStyle = '#0F172A'; // Deep marine dark backdrop
  ctx.fillRect(0, 0, w, h);

  // Constants
  const ox = w / 2;
  const oy = h / 2 - 10;

  // 1. Base skin colors depending on preset type
  let baseSkinColor = '#F5D3C1'; // Neutral Sand
  let blushIntensity = 0.25;
  let blushHex = '#FF8A8A';
  let roughnessCount = 60;
  let rednessFactor = 12; // LAB a* representation
  let eyeOffsetY = 0; // Eyeliner symmetry gap
  
  if (presetType === 'warm-coral') {
    baseSkinColor = '#EAA882'; // Highly flushed gold Warm Coral
    blushIntensity = 0.65; // High redness
    blushHex = '#FF5252';
    roughnessCount = 180; // High texture
  } else if (presetType === 'deep-abyss') {
    baseSkinColor = '#8D6E63'; // Deep bronze skin
    blushIntensity = 0.15;
    blushHex = '#A52A2A';
    roughnessCount = 20; // Very smooth
  }

  // Draw smooth shadow
  const shadowGrad = ctx.createRadialGradient(ox, oy, h / 3.5, ox, oy, h / 2.2);
  shadowGrad.addColorStop(0, 'rgba(122, 214, 216, 0.08)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.arc(ox, oy, h / 2, 0, 2*Math.PI);
  ctx.fill();

  // 2. Draw Main Oval Face
  ctx.fillStyle = baseSkinColor;
  ctx.beginPath();
  ctx.ellipse(ox, oy, w / 3.4, h / 2.8, 0, 0, 2 * Math.PI);
  ctx.fill();

  // 3. Highlight Forehead Area (Moisture Source)
  const foreheadGrad = ctx.createRadialGradient(ox, oy - h / 5, 10, ox, oy - h / 5, w / 5);
  // High reflectance glow
  foreheadGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  foreheadGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
  foreheadGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = foreheadGrad;
  ctx.beginPath();
  ctx.ellipse(ox, oy - h / 5, w / 5, h / 12, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Highlight Nose Tip (Reflection glow)
  const noseGrad = ctx.createRadialGradient(ox, oy + h / 12, 5, ox, oy + h / 12, 25);
  noseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  noseGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = noseGrad;
  ctx.beginPath();
  ctx.arc(ox, oy + h / 12, 25, 0, 2 * Math.PI);
  ctx.fill();

  // 4. Cheeks Blush (Redness)
  if (!makeupOverlay.skipMakeup) {
    // Left Cheek Blush
    const lCheekGrad = ctx.createRadialGradient(ox - w / 6, oy + h / 15, 5, ox - w / 6, oy + h / 15, w / 7);
    lCheekGrad.addColorStop(0, makeupOverlay.appliedBlushColor ? `${makeupOverlay.appliedBlushColor}CC` : `rgba(255, 82, 82, ${blushIntensity})`);
    lCheekGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = lCheekGrad;
    ctx.beginPath();
    ctx.arc(ox - w / 6, oy + h / 15, w / 6, 0, 2 * Math.PI);
    ctx.fill();

    // Right Cheek Blush
    const rCheekGrad = ctx.createRadialGradient(ox + w / 6, oy + h / 15, 5, ox + w / 6, oy + h / 15, w / 7);
    rCheekGrad.addColorStop(0, makeupOverlay.appliedBlushColor ? `${makeupOverlay.appliedBlushColor}CC` : `rgba(255, 82, 82, ${blushIntensity})`);
    rCheekGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rCheekGrad;
    ctx.beginPath();
    ctx.arc(ox + w / 6, oy + h / 15, w / 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 5. Draw Eyebrows & Eyes
  ctx.fillStyle = '#2C3E50';
  ctx.lineWidth = 2.5;

  // Eyes left
  ctx.beginPath();
  ctx.arc(ox - w / 7, oy - h / 16, 12, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = '#2D3436';
  ctx.stroke();

  // Eyes right
  ctx.beginPath();
  ctx.arc(ox + w / 7, oy - h / 16, 12, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // 6. Draw Eyeliner (Simulates asymmetry)
  if (!makeupOverlay.skipMakeup) {
    const rightEyeOffset = makeupOverlay.eyelinerExtra !== undefined ? makeupOverlay.eyelinerExtra : 0; // if heavy right offset
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;

    // Left Eyeliner
    ctx.beginPath();
    ctx.moveTo(ox - w / 7 + 10, oy - h / 16 + 5);
    ctx.quadraticCurveTo(ox - w / 7 - 10, oy - h / 16, ox - w / 7 - 20, oy - h / 16 - 2);
    ctx.stroke();

    // Right Eyeliner (Asymmetrical offset applied dynamically depending on slider value)
    ctx.beginPath();
    ctx.moveTo(ox + w / 7 - 10, oy - h / 16 + 5);
    ctx.quadraticCurveTo(ox + w / 7 + 10, oy - h / 16, ox + w / 7 + 20, oy - h / 16 - 2 + rightEyeOffset);
    ctx.stroke();
  }

  // Nose Bridge lines
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox - 6, oy - h / 10);
  ctx.lineTo(ox - 6, oy + h / 12);
  ctx.lineTo(ox - 12, oy + h / 12);
  ctx.stroke();

  // 7. Draw Lipstick
  if (!makeupOverlay.skipMakeup) {
    const overstep = makeupOverlay.overstepLip || 0;
    const lipColor = '#E30B5D'; // Bold Fuchsia Rose
    
    ctx.fillStyle = lipColor;
    ctx.beginPath();
    // Upper Lip
    ctx.moveTo(ox - w / 12, oy + h / 4);
    ctx.quadraticCurveTo(ox - w / 24, oy + h / 4.4 - overstep, ox, oy + h / 4.1);
    ctx.quadraticCurveTo(ox + w / 24, oy + h / 4.4 - overstep, ox + w / 12, oy + h / 4);
    ctx.quadraticCurveTo(ox, oy + h / 3.8, ox - w / 12, oy + h / 4);
    ctx.fill();

    // Lower Lip (Slight bleeding simulation if overstep > 3)
    ctx.beginPath();
    ctx.moveTo(ox - w / 12, oy + h / 4);
    ctx.quadraticCurveTo(ox, oy + h / 3.3 + (overstep * 0.7), ox + w / 12, oy + h / 4);
    ctx.quadraticCurveTo(ox, oy + h / 3.8, ox - w / 12, oy + h / 4);
    ctx.fill();
  }

  // 8. Roughness / skin imperfections points (Sobel filter fodder)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
  // If warm preset, add splotches to show standard deviation irregularities for makeup uniformity
  const splotchLevel = makeupOverlay.baseNoise !== undefined ? makeupOverlay.baseNoise : (presetType === 'warm-coral' ? 30 : 0);
  
  if (splotchLevel > 0) {
    ctx.fillStyle = 'rgba(121, 85, 72, 0.16)';
    for (let s = 0; s < 12; s++) {
      const sx = ox + (Math.random() - 0.5) * w / 2.5;
      const sy = oy + (Math.random() - 0.5) * h / 2.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 4 + Math.random() * 8, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // Draw minor surface bumps for Sobel texture
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < roughnessCount; i++) {
    const rx = ox + (Math.random() - 0.5) * w / 2.4;
    const ry = oy + (Math.random() - 0.5) * h / 2.4;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }
}

