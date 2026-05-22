/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CosmeticItem {
  brand: string;
  name: string;
  shade: string;
  price: string;
  type: 'lip' | 'blush' | 'eyeshadow' | 'base' | 'mascara' | 'eyeliner';
  description: string;
}

export interface SeasonalRecommendations {
  roadshop: CosmeticItem[];
  luxury: CosmeticItem[];
}

export const cosmeticRecommendations: Record<string, SeasonalRecommendations> = {
  'Spring Warm Light': {
    roadshop: [
      {
        brand: '롬앤 (rom&nd)',
        name: '쥬시 래스팅 틴트',
        shade: '22 포멜로 스킨 (Pomelo Skin)',
        price: '13,000원',
        type: 'lip',
        description: '여리하고 투명한 살구빛 누드 코랄 컬러로 투명한 봄 웜 라이트 입술 광택에 찰떡입니다.'
      },
      {
        brand: '아임미미 (I\'M MEME)',
        name: '아임 하트 스탬프 블러셔',
        shade: '01 피치 (Peach)',
        price: '14,000원',
        type: 'blush',
        description: '보송보송 맑고 생기 넘치게 두 뺨을 물들이는 화사한 뉴트럴 코랄 피치 컬러입니다.'
      },
      {
        brand: '에뛰드 (Etude)',
        name: '플레이 컬러 아이즈',
        shade: '피치허니크림 (Peach Honey Cream)',
        price: '22,000원',
        type: 'eyeshadow',
        description: '부드러운 라떼와 잘 익은 복숭아가 섞여 텁텁함 없는 여린 무펄/쉬머 베이지 팔레트입니다.'
      },
      {
        brand: '에뛰드 (Etude)',
        name: '컬 픽스 마스카라',
        shade: '02 브라운 (Brown)',
        price: '15,000원',
        type: 'mascara',
        description: '눈매가 텁텁해 보이지 않도록 섬세하고 부드럽게 세팅되는 자연스런 데일리 코코아 브라운 마스카라입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '샤프 쏘 심플 워터프루프 펜슬 라이너',
        shade: '02 브라운 (Brown)',
        price: '10,000원',
        type: 'eyeliner',
        description: '여리한 눈가 음영을 해치지 않고 연하고 부드러운 눈매를 연출해 주는 초슬림 코랄 브라운 슬라이딩 펜슬입니다.'
      }
    ],
    luxury: [
      {
        brand: '입생로랑 (YSL Beauty)',
        name: '러브샤인 워터샤인 립스틱',
        shade: '201 로즈우드 블러쉬 (Rosewood Blush)',
        price: '55,000원',
        type: 'lip',
        description: '촉촉한 차오르는 보습과 투명한 뉴트럴 피치 로즈 코랄 립으로 아주 우아하고 싱그럽습니다.'
      },
      {
        brand: '나스 (NARS)',
        name: '블러쉬 컴팩트',
        shade: '섹스어필 (Sex Appeal)',
        price: '46,000원',
        type: 'blush',
        description: '대명사적인 살구 아프리콧 치크로, 맑은 흰기 섞인 소프트 복숭아 뺨을 연출합니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '백스테이지 아이 팔레트',
        shade: '007 코랄 (Coral Neutrals)',
        price: '78,000원',
        type: 'eyeshadow',
        description: '포근하고 따스한 골든 브론즈와 살구빛 코랄 밀착 텍스처로 우아한 입체감을 더해줍니다.'
      },
      {
        brand: '샤넬 (Chanel Beauty)',
        name: '이니미터블 마스카라 워터프루프',
        shade: '30 브룬 (Brun)',
        price: '48,000원',
        type: 'mascara',
        description: '선명하지만 인위적이지 않게 어우러지는 기품 넘치는 최고급 딥 카라멜 코코아 에디션 마스카라입니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 온 스테이지 리퀴드 라이너',
        shade: '781 매트 브라운 (Matte Brown)',
        price: '45,000원',
        type: 'eyeliner',
        description: '눈에 우아한 생기를 부여하고 미끄러지듯 유영하는 명품 매트 웜 브라운 리퀴드 아트 라이너입니다.'
      }
    ]
  },
  'Spring Warm Bright': {
    roadshop: [
      {
        brand: '롬앤 (rom&nd)',
        name: '글래스팅 워터 틴트',
        shade: '02 레드 드롭 (Red Drop)',
        price: '13,000원',
        type: 'lip',
        description: '선명하게 뿜어져 나오는 맑은 사과 다홍빛 레드로 얼굴의 형광등을 켜줍니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '에어 블러 휩 블러쉬',
        shade: '02 아임 파인 (I\'m Pine)',
        price: '19,000원',
        type: 'blush',
        description: '쿠션처럼 촉촉하고 보송하게 마무리되는 고채도의 상큼 발랄한 오렌지 피치 피그먼트입니다.'
      },
      {
        brand: '페리페라 (Peripera)',
        name: '올테이크 무드 팔레트',
        shade: '01 들숨에 음영 날숨에 그윽함',
        price: '21,000원',
        type: 'eyeshadow',
        description: '선명하고 또렷하지만 더티하지 않은 활기 넘치고 맑은 미디엄 브라운 골드 섀도우 라인입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '킬 래쉬 수퍼프루프 마스카라',
        shade: '02 볼륨 컬링 (Volume Curling)',
        price: '18,000원',
        type: 'mascara',
        description: '봄 브라이트의 활력 발랄한 마젠타/피치의 선명도를 아찔하게 고정하는 강력 익스트림 마스카라입니다.'
      },
      {
        brand: '릴리바이레드 (Lilybyred)',
        name: '서바이벌 펜 라이너 익스트림',
        shade: '02 매트 브라운 (Matte Brown)',
        price: '11,000원',
        type: 'eyeliner',
        description: '고채도 화사한 얼굴빛을 방해하지 않고 흐려짐 없는 완벽 정교 눈매를 보장하는 매트 라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '디올 (Dior)',
        name: '디올 어딕트 립스틱',
        shade: '744 디오라마 (Diorama)',
        price: '57,000원',
        type: 'lip',
        description: '생기 넘치는 토마토 오렌지 레드의 극치로 촉촉하고 선명한 피막 광택을 자랑합니다.'
      },
      {
        brand: '맥 (MAC)',
        name: '미네랄라이즈 블러쉬',
        shade: '웜 소울 (Warm Soul)',
        price: '45,000원',
        type: 'blush',
        description: '화려한 미세 골드 허니 펄이 덧입혀진 골드 피치 로즈 컬러로 화사하고 반짝입니다.'
      },
      {
        brand: '톰포드 (Tom Ford)',
        name: '아이 컬러 쿼드',
        shade: '03 바디히트 (Body Heat)',
        price: '125,000원',
        type: 'eyeshadow',
        description: '채도가 살며시 오른 따뜻하고 건강한 브론즈 쉬머 섀도우로 세련된 분위기를 안겨줍니다.'
      },
      {
        brand: '입생로랑 (YSL Beauty)',
        name: '마스카라 볼륨 에페 포 실 클래식',
        shade: '02 리치 브라운 (Rich Brown)',
        price: '46,000원',
        type: 'mascara',
        description: '그 어떤 고채도 광선 아래에서도 속눈썹 한 올 가닥을 풍부하고 실키하게 코팅하는 럭셔리 골드 브라운 마스카라입니다.'
      },
      {
        brand: '샤넬 (Chanel)',
        name: '스틸로 이으 워터프루프 에센셜',
        shade: '20 에스프레소 (Espresso)',
        price: '44,000원',
        type: 'eyeliner',
        description: '봄 웜의 열정과 우아를 가득 세우며 번짐 없이 깔끔하게 흘러가는 가을 에스프레소 초콜릿 라이너입니다.'
      }
    ]
  },
  'Spring Warm Warm': {
    roadshop: [
      {
        brand: '에스쁘아 (Espoir)',
        name: '꾸뛰르 립틴트 글레이즈',
        shade: '오드 코랄 (Odd Coral)',
        price: '20,000원',
        type: 'lip',
        description: '달콤하고 두꺼운 젤리 장막 코랄로 황금빛 피부 톤과 시럽처럼 잘 어우러집니다.'
      },
      {
        brand: '릴리바이레드',
        name: '러브빔 치크 [무드광]',
        shade: '02 청순빔 (Pure Salgu)',
        price: '12,000원',
        type: 'blush',
        description: '잔잔하고 온화한 골드 펄감이 들어있는 보드라운 햇살 오렌지 피치 빔 블러셔입니다.'
      },
      {
        brand: '데이지크 (Dasique)',
        name: '섀도우 팔레트',
        shade: '14 피치 스퀴즈 (Peach Squeeze)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '복숭아즙을 통째로 압축해 놓은 듯 화사한 피치 진저 따뜻한 9구 팔레트입니다.'
      },
      {
        brand: '홀리카홀리카 (Holika Holika)',
        name: '래쉬 고정 롱익스텐션 마스카라',
        shade: '02 로즈 브라운 (Rose Brown)',
        price: '12,500원',
        type: 'mascara',
        description: '따뜻한 가을 카라멜 무드를 전하며 번짐 없이 가뿐하게 롱앤컬을 완성하는 황금빛 브라운 마스카라입니다.'
      },
      {
        brand: '롬앤 (rom&nd)',
        name: '한올 샤프 브로우 펜슬 라이너',
        shade: '03 멜로우 브라운 (Mellow Brown)',
        price: '11,000원',
        type: 'eyeliner',
        description: '햇살 가득한 밀밭 색조 가을 웜 및 트루 웜 전용으로 나온 부드럽고 차분한 깊이의 매트 라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '샤넬 (Chanel Beauty)',
        name: '루쥬 코코 플래쉬',
        shade: '90 주르 (Jour)',
        price: '55,000원',
        type: 'lip',
        description: '부드러운 복숭아 살구빛 시럽 제형으로 영양감과 청초한 봄 트루의 기품을 한껏 강조해줍니다.'
      },
      {
        brand: '크리니크 (Clinique)',
        name: '치크팝 수채화 블러셔',
        shade: '08 피치팝 (Peach Pop)',
        price: '34,000원',
        type: 'blush',
        description: '맑은 발색으로 유명한 시그니처 오렌지 피치 치크로, 수레바퀴 광채로 화사해집니다.'
      },
      {
        brand: '샤넬 (Chanel)',
        name: '레 베쥬 헬시 글로우 내추럴 팔레트',
        shade: '웜 (Warm)',
        price: '94,000원',
        type: 'eyeshadow',
        description: '대지의 온기를 듬뿍 담은 골든 소프트 테라코타, 비스킷 베이지 베이스 팩입니다.'
      },
      {
        brand: '지방시 (Givenchy Beauty)',
        name: '볼륨 디스터비아 래쉬 코트',
        shade: '02 다크 브라운 (Dark Brown)',
        price: '45,000원',
        type: 'mascara',
        description: '그윽하고 따스한 가을의 풍요로움을 속눈썹에 한 올 얹기 적합한 극세사 볼륨 갈색 광택 코트입니다.'
      },
      {
        brand: '맥 (MAC)',
        name: '아이 콜 인텐시브 펜슬 라이너',
        shade: '테디 (Teddy)',
        price: '32,000원',
        type: 'eyeliner',
        description: '명불허전 가을 웜의 바이블로 알려져 있는, 깊고 따스한 코코아 브론즈빛 골든 펄 장막 젤라이너입니다.'
      }
    ]
  },
  'Summer Cool Light': {
    roadshop: [
      {
        brand: '롬앤 (rom&nd)',
        name: '듀이풀 워터 틴트',
        shade: '11 라일락 크림 (Lilac Cream)',
        price: '13,000원',
        type: 'lip',
        description: '투명하고 청명한 소프트 라벤더 보라빛 도는 쿨 체리 핑크 모브 틴트입니다.'
      },
      {
        brand: '페리페라 (Peripera)',
        name: '맑게 물든 선샤인 치크',
        shade: '06 아침요정 라벤더',
        price: '8,000원',
        type: 'blush',
        description: '볼의 붉은 홍조를 예쁘게 지우고 뽀얗고 청량하게 만들어주는 파우더 라벤더 퍼플입니다.'
      },
      {
        brand: '데이지크 (Dasique)',
        name: '섀도우 팔레트',
        shade: '18 베리 스무디 (Berry Smoothie)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '말랑한 블루베리와 맑은 딸기 우유가 믹스된 화사하게 얼려진 쿨 라이트 전용 섀도우입니다.'
      },
      {
        brand: '에뛰드 (Etude)',
        name: '컬 픽스 파워 마스카라',
        shade: '03 그레이 브라운 (Grey Brown)',
        price: '15,000원',
        type: 'mascara',
        description: '붉거나 노란 기가 완전히 배제된 아스팔트 회브라운 계열로 여름 라이트를 시원하게 보존합니다.'
      },
      {
        brand: '키스미 (Kissme)',
        name: '히로인 메이크 프라임 슬림 라이너',
        shade: '03 브라운 블랙 (Brown Black)',
        price: '14,000원',
        type: 'eyeliner',
        description: '푸른빛 쿨톤 화장 위에 한 줄의 이질감 없이 그윽한 부드러운 하이브리드 소프트 차콜 라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '디올 (Dior)',
        name: '디올 어딕트 립 글로우',
        shade: '007 라즈베리 (Raspberry)',
        price: '48,000원',
        type: 'lip',
        description: '입술 온도에 감응하여 여리고 맑은 고채도 체리 라즈베리 안색을 더해주는 립밤입니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '백스테이지 로지 글로우 블러셔',
        shade: '001 핑크 (Pink)',
        price: '62,000원',
        type: 'blush',
        description: '볼에 얹는 즉시 맑은 극강의 투명함을 선사하는 시원하고 차가운 딸기 우유빛 치크입니다.'
      },
      {
        brand: '입생로랑 (YSL Beauty)',
        name: '꾸뛰르 미니 클러치 섀도우',
        shade: '500 메디나 글로우 (Medina Glow)',
        price: '96,000원',
        type: 'eyeshadow',
        description: '차가운 안개 로즈 핑크와 맑디 맑은 모브 실버 오팔 펄의 영롱한 하모니 팔레트입니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 아이코닉 오버컬 마스카라',
        shade: '090 블랙 (Black)',
        price: '51,000원',
        type: 'mascara',
        description: '여름 쿨톤의 눈빛을 거울처럼 맑게 반사해 줄 칠흑 같은 탄소 프리미엄 마스카라입니다.'
      },
      {
        brand: '샤넬 (Chanel)',
        name: '스틸로 이으 워터프루프 라이너',
        shade: '88 누아르 앙텐스 (Noir Intense)',
        price: '44,000원',
        type: 'eyeliner',
        description: '번짐이나 뭉개짐 없이 눈가를 칼처럼 서늘하고 매력 있게 조율해 주는 명품 블랙 스무스 라이너입니다.'
      }
    ]
  },
  'Summer Cool Muted': {
    roadshop: [
      {
        brand: '에뛰드 (Etude)',
        name: '픽싱 틴트 매트 무드',
        shade: '05 모브 온 (Mauve On)',
        price: '12,000원',
        type: 'lip',
        description: '차분하게 한 김 다운된 회갈색빛 그레이 모브 핑크로 매트하게 입술에 픽싱됩니다.'
      },
      {
        brand: '롬앤 (rom&nd)',
        name: '베러 댄 치크 피스',
        shade: 'C02 블루베리 칩 (Blueberry Chip)',
        price: '12,000원',
        type: 'blush',
        description: '말린 모브 장미를 한 수저 갈아 넣은 듯 차분하고 우아한 드라이 쿨 핑크 치크입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '프로 아이 팔레트 에어',
        shade: '03 한남동 아뜰리에 (Hannam Atelier)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '여름 쿨 뮤트의 정석과도 같은 뮤티드 로즈 레이스, 타로 파우더 가득 차분한 팔레트입니다.'
      },
      {
        brand: '롬앤 (rom&nd)',
        name: '한올 올래쉬 실크 마스카라',
        shade: 'L03 애쉬 카카오 (Ash Cacao)',
        price: '13,000원',
        type: 'mascara',
        description: '여름 뮤트의 시그니처 맑은 회갈색 타로빛 눈매를 부드럽게 감쌀 차분한 애쉬 브라운 마스카라입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '샤프 쏘 심플 라이너 매트',
        shade: '05 애쉬 브라운 (Ash Brown)',
        price: '10,000원',
        type: 'eyeliner',
        description: '노란 성분을 한 방울도 섞지 않아 지적인 이슬비 같은 흐린 감성을 안겨주는 완벽 애쉬 그레이 라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '샤넬 (Chanel)',
        name: '루쥬 알뤼르 라끄 고발색 글로스',
        shade: '63 얼티메이트 (Ultimate)',
        price: '55,000원',
        type: 'lip',
        description: '유지력이 탁월한 로즈우드 카라멜 모브 핑크로 가을과 여름쿨 경계선의 우아함을 극대화합니다.'
      },
      {
        brand: '맥 (MAC)',
        name: '글로우 플레이 블러쉬',
        shade: '소 뷰티풀 (So Natural / 머지 로즈)',
        price: '46,000원',
        type: 'blush',
        description: '말랑하게 밀착되는 톤다운 모브 타로 퍼플 핑크로 가벼운 광택감과 시크함을 안겨줍니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 5 꿀뢰르 아이섀도우',
        shade: '669 소프트 캐시미어 (Soft Cashmere)',
        price: '98,000원',
        type: 'eyeshadow',
        description: '지적이고 도도한 가자미 그레이 카키와 모브 로즈 음영의 조화로운 우아함을 연출합니다.'
      },
      {
        brand: '톰포드 (Tom Ford)',
        name: '리치 바이올렛 메탈릭 마스카라',
        shade: '02 캐시미어 브라운 (Cashmere)',
        price: '72,000원',
        type: 'mascara',
        description: '풍요로우면서도 탁하고 매혹적인 회보라빛 머드를 한 장 두른 듯한 쿨 브라운 마스카라의 최정점입니다.'
      },
      {
        brand: '바비브라운 (Bobbi Brown)',
        name: '롱웨어 에센셜 젤 아이라이너',
        shade: '에스프레소 잉크 (Espresso Ink)',
        price: '46,000원',
        type: 'eyeliner',
        description: '보송 모브빛 섀도우 위 세련된 마감을 마치는 차갑고 묵직한 카키빛 감도는 딥에스프레소 젤입니다.'
      }
    ]
  },
  'Summer Cool Cool': {
    roadshop: [
      {
        brand: '릴리바이레드',
        name: '글래시 레이어 픽싱 틴트',
        shade: '08 핑크 타피오카 (Pink Tapioca)',
        price: '11,000원',
        type: 'lip',
        description: '차가운 수분 막 위에 비쳐 나오는 청량하게 터지는 진한 블루 계열 푸시아 핑크 마젠타입니다.'
      },
      {
        brand: '홀리카홀리카',
        name: '마이 페이브 피스 빔 블러쉬',
        shade: '06 쉘 온 핑크 (Shell On Pink)',
        price: '8,000원',
        type: 'blush',
        description: '눈처럼 하얗고 쿨하게 붉은 볼을 고르고 매끄러운 아이시 핑크로 정돈하는 슬릭 치크입니다.'
      },
      {
        brand: '에스쁘아 (Espoir)',
        name: '리얼 아이 핸디 섀도우',
        shade: '2호 뮤트 로즈 (Mute Rose)',
        price: '18,000원',
        type: 'eyeshadow',
        description: '이슬을 한 컵 머금은 쿨 블루 그레이 계열 로탈리아 로즈 4구 컴팩트입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '킬 래쉬 익스트림 컬링 마스카라',
        shade: '01 퓨어 블랙 (Pure Black)',
        price: '18,000원',
        type: 'mascara',
        description: '시린 밤하늘의 완벽 퓨어 블랙 안색 코팅을 위해 가벼우면서 아찔하게 속눈썹을 정합해 줍니다.'
      },
      {
        brand: '토니모리 (Tonymoly)',
        name: '이지터치 프로 젤 아이라이너',
        shade: '01 블랙 (Black)',
        price: '10,800원',
        type: 'eyeliner',
        description: '번짐이나 흐려짐을 전혀 타협치 않는 완벽 정밀 마감의 클래식 쿨 블랙 단독 라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '입생로랑 (YSL)',
        name: '베르니 아 레브르 립글라스 틴트',
        shade: '9호 로그 루쥬 (Rouge Laque / 쿨 마젠타)',
        price: '49,000원',
        type: 'lip',
        description: '한 치의 웜함도 타협하지 않는 블루톤 가득 청량한 스파클 쿨 레드의 최강자입니다.'
      },
      {
        brand: '지방시 (Givenchy Beauty)',
        name: '프리즘 리브르 멀티컬러 블러쉬',
        shade: '01 자르댕 무슬린 (Jardin Mousseline)',
        price: '78,000원',
        type: 'blush',
        description: '미세 극세사 고품격 입자의 네 가지 쿨 라벤더 핑크 파우더가 조화롭게 녹아들어 은은하게 시립니다.'
      },
      {
        brand: '로라메르시에 (Laura Mercier)',
        name: '매트 아이 컬러 섀도우',
        shade: '캐시미어 (Cashmere) & 구아바 (Guava)',
        price: '40,000원',
        type: 'eyeshadow',
        description: '따뜻함이 전혀 없는 독보적 한기를 가진 아이시 보랏빛 라벤더 허브 브라운 음영 베이스입니다.'
      },
      {
        brand: '로라메르시에 (Laura Mercier)',
        name: '캐비어 인텐스 익스트림 벨벳 마스카라',
        shade: '01 매트 블랙 (Matte Black)',
        price: '44,000원',
        type: 'mascara',
        description: '오차 없는 칠흑 광선을 뿜으며 뭉침 없이 인형 같은 선명함을 박제해 주는 울트라 벨벳 마스카라입니다.'
      },
      {
        brand: '지방시 (Givenchy Beauty)',
        name: '라이너 디스터비아 울트라 리퀴드',
        shade: '01 인텐스 블랙 (Intense Black)',
        price: '47,000원',
        type: 'eyeliner',
        description: '피부를 얼음 송곳처럼 차갑게 극대화 부각해 주는 고밀도 리퀴드 포뮬러 펜 라이너입니다.'
      }
    ]
  },
  'Autumn Warm Muted': {
    roadshop: [
      {
        brand: '롬앤 (rom&nd)',
        name: '제로 벨벳 매트 틴트',
        shade: '23 빈티지 토프 (Vintage Taupe)',
        price: '11,000원',
        type: 'lip',
        description: '차분하게 살짝 눌러 톤 다운된 카라멜 모카 코랄 베이지 브라운 컬러입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '에어 블러 휩 블러쉬',
        shade: '04 베이지 보틀 (Beige Bottle)',
        price: '19,000원',
        type: 'blush',
        description: '부드러운 티타임 밀크티 베이지와 가을 낙엽이 매치된 그윽하고 순수하며 차분한 베이지 치크입니다.'
      },
      {
        brand: '데이지크 (Dasique)',
        name: '섀도우 팔레트',
        shade: '11 초콜릿 퍼지 (Chocolate Fudge)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '벨벳 코코아와 차분한 아일랜드 브론즈빛 웜 무광 음영을 한 데 담은 보드라운 팔레트입니다.'
      },
      {
        brand: '키스미 (Kissme)',
        name: '히로인 메이크 헤비로테이션 마스카라',
        shade: '02 로즈 브라운 (Rose Brown)',
        price: '15,000원',
        type: 'mascara',
        description: '가을의 깊은 단풍잎에서 추출한 듯 고급스럽고 평온한 붉은빛 감도는 그윽한 로즈 브라운 마스카라입니다.'
      },
      {
        brand: '에스쁘아 (Espoir)',
        name: '브론즈 페인팅 워터프루프 젤 라이너',
        shade: '브룸 스트리트 (Broom Street)',
        price: '18,000원',
        type: 'eyeliner',
        description: '낙엽빛 카퍼 브론즈 미세 금펄이 들어있어 매끄럽고 포근하게 빛나는 가을 전용 드로잉 라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '맥 (MAC)',
        name: '파우더 키스 슬림 벨벳 스틱',
        shade: '멀 잇 오버 (Mull It Over)',
        price: '43,000원',
        type: 'lip',
        description: '전설적인 더스티 로즈 피치 베이지 컬러입니다. 피부에 부드럽게 감기어 가을의 고혹적인 수태 무드를 선사합니다.'
      },
      {
        brand: '나스 (NARS)',
        name: '블러쉬 컴팩트',
        shade: '지나 (Gina)',
        price: '46,000원',
        type: 'blush',
        description: '따스한 가을 단풍이 물드는 태양 아래 수줍은 듯 고급스러운 덜 오렌지 카라멜 컬러 블러셔입니다.'
      },
      {
        brand: '바비브라운 (Bobbi Brown)',
        name: '아이섀도우 클래식',
        shade: '토스트 (Toast) & 카멜 (Camel)',
        price: '44,000원',
        type: 'eyeshadow',
        description: '순도 높은 로스트 토스트 베이지와 차분하고 묵직한 가을 카멜 브라운 무카페인 무광 음영 정석입니다.'
      },
      {
        brand: '샤넬 (Chanel Beauty)',
        name: '느와르 알뤼르 워터프루프 컬링 마스카라',
        shade: '10 느와르 (Noir)',
        price: '59,000원',
        type: 'mascara',
        description: '대지의 온기를 우아하게 가두는 다층적 골든 블랙 속눈썹 연출력의 럭셔리 마커입니다.'
      },
      {
        brand: '나스 (NARS)',
        name: '무드 콜 펜슬 라이너 익스트림',
        shade: '비아 아피아 (Via Appia)',
        price: '34,000원',
        type: 'eyeliner',
        description: '소중하고 고급스러운 가을 웜의 고풍스러운 마감용으로 정교히 녹아드는 코코아 프레소 펄 라이너입니다.'
      }
    ]
  },
  'Autumn Warm Deep': {
    roadshop: [
      {
        brand: '페리페라 (Peripera)',
        name: '잉크 더 벨벳 가을 칠리',
        shade: '21 선선한브릭 (Snug Brown)',
        price: '9,000원',
        type: 'lip',
        description: '깊이가 느껴지는 묵직한 벽돌 단풍 칠리 브릭 레드로 딥 웜톤의 선명도를 살려줍니다.'
      },
      {
        brand: '3CE (쓰리씨이)',
        name: '무드 레시피 매트 치크',
        shade: '로즈 베이지 (Rose Beige)',
        price: '18,000원',
        type: 'blush',
        description: '우디하고 풍요로움이 믹스된 깊고 성숙한 느낌의 드라이 말린 가을 장미 베이지빛 치크입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '프로 아이 팔레트 매트',
        shade: '11 아늑한 골목길 (Cozy Alley)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '깊고 무거운 딥 가을 음영을 연출하기 위한 에스프레소 베이지, 브론즈 코코아 포멀 팔레트입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '킬래쉬 워터프루프 볼륨앤컬',
        shade: '03 매끈 볼륨 블랙 (Volume Black)',
        price: '18,000원',
        type: 'mascara',
        description: '속눈썹 한 가닥도 빠짐없이 짙고 무거운 어두운 초콜릿 블랙 음영을 선사하는 딥 마스카라입니다.'
      },
      {
        brand: '릴리바이레드 (Lilybyred)',
        name: '나인투나인 서바이벌 슬림 젤 라이너',
        shade: '03 월넛 브라운 (Walnut Brown)',
        price: '9,000원',
        type: 'eyeliner',
        description: '딥 가을 웜의 단단한 피부톤 위에 이질감 없이 단숨에 우디하게 고정되는 깊은 딥 브라운 젤라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '톰포드 (Tom Ford)',
        name: '울트라 샤인 글로우 립 컬러',
        shade: '03 누빌 (Nubile) / 04 아란 (Aran)',
        price: '86,000원',
        type: 'lip',
        description: '유리로 감싸 안은 듯 짙고 매혹적이며 농익은 초콜릿 피치 카라멜 딥 칠리 베어 립스틱입니다.'
      },
      {
        brand: '맥 (MAC)',
        name: '미네랄라이즈 마블 블러쉬',
        shade: '러브씽 (Love Thing)',
        price: '45,000원',
        type: 'blush',
        description: '농익은 딥 와인 플럼 버건디 골드 베일의 매직 샌드 블러셔로, 극도로 귀티 나는 딥 웜 페이스를 완성합니다.'
      },
      {
        brand: '아워글래스 (Hourglass)',
        name: '익스히비션 모노크롬 섀도우',
        shade: '모던 (Modern Amber)',
        price: '58,000원',
        type: 'eyeshadow',
        description: '차분하게 타오르는 가을 호박 엠버와 딥 마호가니를 고밀도로 응축하여 입체 윤곽을 강화합니다.'
      },
      {
        brand: '톰포드 (Tom Ford)',
        name: '울트라 실키 익스트림 볼륨 마스카라',
        shade: '01 인텐스 블랙 (Intense Black)',
        price: '75,000원',
        type: 'mascara',
        description: '가장 화려하면서도 깊고 밀도 있는 어두운 눈매를 박제하여 깊은 가을 딥 페이스를 극대화하는 명품 볼류마이저입니다.'
      },
      {
        brand: '샤넬 (Chanel)',
        name: '스틸로 이으 카본 워터프루프 라이너',
        shade: '88 에스프레소 느와르 (Espresso)',
        price: '44,000원',
        type: 'eyeliner',
        description: '고급스러운 매트 에스프레소와 칠흑 카본이 오묘히 대비 정돈되는 극비 명품 젤 펜슬입니다.'
      }
    ]
  },
  'Autumn Warm Warm': {
    roadshop: [
      {
        brand: '에스쁘아 (Espoir)',
        name: '노웨어 립스틱 바밍 글로우',
        shade: '05 버릴게 없는 코랄 (Keep Coral)',
        price: '22,000원',
        type: 'lip',
        description: '뜨거운 메이플 살구를 머금은 버터리 가을 웜 시럽 글로우로 트루 웜 톤의 생기를 가득 드높여줍니다.'
      },
      {
        brand: '무지개맨션 (MUZIGAE MANSION)',
        name: '피팅 매트 블러쉬',
        shade: '03 에코 (Eco)',
        price: '18,000원',
        type: 'blush',
        description: '진흙 진저 오렌지와 베이직한 누드 우디 브라운이 흘러내리는 맑고 감촉 좋은 무광 치크입니다.'
      },
      {
        brand: '데이지크 (Dasique)',
        name: '섀도우 팔레트 멀티무드',
        shade: '03 누드 포션 (Nude Potion)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '진저 토스트 무광 음영과 영롱하고 청초하게 정렬된 금빛 대지 햇살 펄들의 배합입니다.'
      },
      {
        brand: '투쿨포스쿨 (Too Cool For School)',
        name: '미야자키 브라운 래쉬 픽서 마스카라',
        shade: '02 카카오 브라운 (Kakao)',
        price: '16,000원',
        type: 'mascara',
        description: '가을의 깊은 오두막 감성을 표현하기 위해 부드러운 카카오 에센셜 오일로 코팅되는 브라운 마스카라입니다.'
      },
      {
        brand: '메리몽드 (Merrymonde)',
        name: '슈퍼트임 무드 워터프루프 라이너',
        shade: '02 캐롯 코랄 브라운 (Carrot)',
        price: '13,000원',
        type: 'eyeliner',
        description: '오렌지 단풍빛과 당근색 베이지가 감돌아 가을 트루 웜만의 화사한 밑트임을 완성하는 여린 펜라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '아르마니 뷰티 (Armani)',
        name: '립 마에스트로 사틴 리퀴드',
        shade: '02 피치 스포트라이트 (Peach Spotlight)',
        price: '54,000원',
        type: 'lip',
        description: '고급스러운 안색의 메이플 피치와 딥 살구빛이 새틴 블러링 처럼 밀착되어 벨벳 고급감을 배가합니다.'
      },
      {
        brand: '로라메르시에 (Laura Mercier)',
        name: '부와 디 로즈 치크 세컨드스킨',
        shade: '진저 (Ginger)',
        price: '46,000원',
        type: 'blush',
        description: '수채화 가을 웜의 바이블로 알려져 있는, 살구 베이지와 피치의 오묘한 경계에 있는 극명한 청아함 블러셔입니다.'
      },
      {
        brand: '샤넬 (Chanel Beauty)',
        name: '레 베쥬 헬시 글로우 팔레트',
        shade: '텐더 (Tender 로즈브라운)',
        price: '94,000원',
        type: 'eyeshadow',
        description: '조용한 우아함 속에서 가을 석양 노을빛 레드 브라운과 골드 쉬머를 다층적으로 빌딩해줍니다.'
      },
      {
        brand: '디올 (Dior)',
        name: '디올쇼 아이코닉 골든브라운 마스카라',
        shade: '694 브라운 (Brown)',
        price: '51,000원',
        type: 'mascara',
        description: '풍요로운 가을 영양 성분이 가득 담겨, 한 올씩 우아한 초콜릿빛 광선을 빚어내는 무자극 럭셔리 마스카라입니다.'
      },
      {
        brand: '에스티로더 (Estee Lauder)',
        name: '더블웨어 인피니트 롱웨어 라이너',
        shade: '02 에스프레소 (Espresso)',
        price: '42,000원',
        type: 'eyeliner',
        description: '아침부터 밤까지 가을 웜 특유의 그윽한 황금빛 단색 눈매를 한 치의 번짐 없이 완벽 방어하는 클래식 라이너입니다.'
      }
    ]
  },
  'Winter Cool Bright': {
    roadshop: [
      {
        brand: '롬앤 (rom&nd)',
        name: '글래스팅 워터 픽싱 틴트',
        shade: '05 로즈 스플래쉬 (Rose Splash)',
        price: '13,000원',
        type: 'lip',
        description: '가볍게 수분감이 넘치며 선명하고 쨍하게 비추는 마젠타 플럼 서리 쿨 로즈 컬러입니다.'
      },
      {
        brand: '아임미미 (I\'M MEME)',
        name: '아임 하트 스탬프 블러셔 쿨빔',
        shade: '03 체리 (Cherry)',
        price: '14,000원',
        type: 'blush',
        description: '형광등을 켠 듯 볼에 맑은 주스로 도화지를 채우는 선명하고 비비드한 체리 마젠타 컬러 치크입니다.'
      },
      {
        brand: '릴리바이레드',
        name: '무드 키보드 슬림 키트',
        shade: '04 쿨멤버가 되고싶어 (Cool Member)',
        price: '23,000원',
        type: 'eyeshadow',
        description: '아이시 화이트 베일과 또렷하고 영롱한 다크 그레이, 실버 글리터의 절대 대비를 품은 섀도우입니다.'
      },
      {
        brand: '에뛰드 (Etude)',
        name: '컬 픽스 익스트림 마스카라',
        shade: '01 오리지널 블랙 (Original Black)',
        price: '15,000원',
        type: 'mascara',
        description: '눈동자를 보석처럼 부각하고, 겨울 브라이트의 맑디 맑은 피부 대조를 칠흑 속눈썹으로 강조해 마감합니다.'
      },
      {
        brand: '프로에잇청담 (Pro 8 Cheongdam)',
        name: '리퀴드 디파인 아쿠아 라이너',
        shade: '01 딥 블랙 (Deep Black)',
        price: '23,000원',
        type: 'eyeliner',
        description: '단 한 줄만으로 극명의 서늘한 카리스마와 윤기 감도는 쿨 워터 레이어 눈빛을 세팅해 주는 전문가용 리퀴드입니다.'
      }
    ],
    luxury: [
      {
        brand: '디올 (Dior)',
        name: '디올 어딕트 립 맥시마이저 볼륨',
        shade: '006 베리 (Berry)',
        price: '48,000원',
        type: 'lip',
        description: '투명하고 매끄러우면서도 대담하게 팝한 차가운 라즈베리 마젠타 보랏빛 시럽 광택 밤입니다.'
      },
      {
        brand: '나스 (NARS)',
        name: '시그니처 파우더 블러쉬',
        shade: '디자이어 (Desire)',
        price: '46,000원',
        type: 'blush',
        description: '극명하게 선명한 쿨 베이비 체리 핫핑크 컬러로 겨울 브라이트 특유의 시원함을 완벽 극대화합니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 5 꿀뢰르 아이 스모키',
        shade: '159 플럼 튈르리 (Plum Tuileries)',
        price: '98,000원',
        type: 'eyeshadow',
        description: '메탈릭한 실버 그레이, 차가운 자두 플럼, 아이시 오팔 글리터가 매치되어 화려하고 도회적인 매력을 선사합니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 래쉬 오버볼륨 맥시마이저',
        shade: '090 리치 블랙 (Rich Black)',
        price: '51,000원',
        type: 'mascara',
        description: '겨울 쿨의 서늘하고 쨍한 블루 메이크업 위에 수분 정합 촉촉한 장막을 씌워줄 딥 블랙 카리스마 마스카라입니다.'
      },
      {
        brand: '샤넬 (Chanel)',
        name: '스틸로 이으 워터프루프 럭셔리',
        shade: '10 에벤 블랙 (Ebene)',
        price: '44,000원',
        type: 'eyeliner',
        description: '고고한 겨울빛 도회적 귀족 윤곽에 완벽 성형 효과를 주는 명품 시그니처 칠흑 리퀴드 펜슬입니다.'
      }
    ]
  },
  'Winter Cool Deep': {
    roadshop: [
      {
        brand: '페리페라 (Peripera)',
        name: '잉크 무드 글로이 무드락',
        shade: '06 플럼무어 (Plum Mute)',
        price: '11,000원',
        type: 'lip',
        description: '뱀파이어가 무덤에서 꺼내 마신 듯 깊고 그윽하고 신비로운 딥 버건디 와인의 촉촉한 시럽 립입니다.'
      },
      {
        brand: '롬앤 (rom&nd)',
        name: '베러 댄 치크 쿨톤',
        shade: '안개 장미 블루베리 칩',
        price: '12,000원',
        type: 'blush',
        description: '차가운 안개가 깔린 뒤 볼의 붉은 얼굴빛을 지우며 얹어지는 건포도 와인 톤다운 핑크입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '프로 아이 팔레트 에어',
        shade: '04 핑크 페어링 (Pink Pairing)',
        price: '34,000원',
        type: 'eyeshadow',
        description: '딥 모브 타로 퍼플 라벤더 빛과 다크 그레이 브라운 음영이 결합된 시크하고 어두운 쿨톤 전용 팔레트입니다.'
      },
      {
        brand: '롬앤 (rom&nd)',
        name: '한올 볼륨앤컬 블랙 마스카라',
        shade: 'L01 블랙 (Black)',
        price: '13,000원',
        type: 'mascara',
        description: '심해의 어둠처럼 깊이감을 극대화해 주는 뭉근하고 또렷이 차오르는 딥 블랙 볼륨 마스카라입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '샤프 쏘 심플 워터프루프 젤 라이너',
        shade: '01 블랙 (Black)',
        price: '10,000원',
        type: 'eyeliner',
        description: '버건디 모브 또는 다크 화장 위를 조각하듯 스치며 겨울 딥의 눈꼬리를 빈틈없이 메꾸는 무광 블랙 젤입니다.'
      }
    ],
    luxury: [
      {
        brand: '톰포드 (Tom Ford)',
        name: '립 컬러 클래식 새틴',
        shade: '80 임패션드 (Impassioned)',
        price: '79,000원',
        type: 'lip',
        description: '겨울 쿨 딥의 심해와 마주하는 독보적인 다크 초콜릿 버건디 로즈 뱀파이어 립으로, 고고한 아우라를 완성합니다.'
      },
      {
        brand: '나스 (NARS)',
        name: '시그니처 블러쉬 컴팩트',
        shade: '시덕션 (Seduction)',
        price: '46,000원',
        type: 'blush',
        description: '깊이가 아주 그윽한 덜 오디 자두 즙을 짜놓은 듯한 골드 베일 모브 버건디 브라운 블러셔입니다.'
      },
      {
        brand: '샤넬 (Chanel Beauty)',
        name: '레 4 옹브르 아이섀도우',
        shade: '228 티세 리볼리 (Tisse Rivoli)',
        price: '89,000원',
        type: 'eyeshadow',
        description: '시크함의 정점인 쿨한 다크 코코아 회그레이 브라운과 메탈릭 실버 글레이즈 섀도우입니다.'
      },
      {
        brand: '입생로랑 (YSL Beauty)',
        name: '마스카라 더 쇼크 익스트림 래쉬',
        shade: '01 아스팔트 블랙 (Asphalt Black)',
        price: '47,000원',
        type: 'mascara',
        description: '단단하고 엄숙히 차가운 아우라를 살려 단독 가시 속속 라인을 굳게 세워 주는 럭셔리 기어 마스카라입니다.'
      },
      {
        brand: '톰포드 (Tom Ford)',
        name: '아이 라이너 필러 엑스퍼트 붓펜',
        shade: '01 도미넌트 느와르 (Dominant Tokyo)',
        price: '82,000원',
        type: 'eyeliner',
        description: '완벽하게 서늘히 마감하며 영점을 맞추어 타격하는 명품 리퀴드 펜 포뮬러입니다.'
      }
    ]
  },
  'Winter Cool Cool': {
    roadshop: [
      {
        brand: '에뛰드 (Etude)',
        name: '디어 달링 워터젤 맑은 틴트',
        shade: '인플루언서 핑크 (Influener Pink)',
        price: '7,000원',
        type: 'lip',
        description: '즉시 입술 온도를 뚝 떨어뜨려 줄 시리디 차가운 오리지널 쿨 핑크 푸시아 잉크 틴트입니다.'
      },
      {
        brand: '릴리바이레드',
        name: '러브빔 하이빔 글로우',
        shade: '01 영롱빔 (Aurora Laser)',
        price: '12,000원',
        type: 'blush',
        description: '투명하고도 차가운 크리스탈 오로라 실버 하이라이터로, 쿨톤 특유의 유리알 이슬광 빔을 발산합니다.'
      },
      {
        brand: '홀리카홀리카',
        name: '피스 매칭 섀도우 4구 키트',
        shade: '05 루비 Velvet (Ruby Velvet)',
        price: '16,000원',
        type: 'eyeshadow',
        description: '차가운 안갯빛 화이트 핑크 베이스와 깊은 타로 퍼플 마젠타를 품은 4구 슬림 섀도우입니다.'
      },
      {
        brand: '키스미 (Kissme)',
        name: '히로인 메이크 롱앤컬 이지 익스트림',
        shade: '01 블랙 (Black)',
        price: '18,500원',
        type: 'mascara',
        description: '눈보라가 몰아쳐도 끄떡없이 쿨 메이크업의 블랙 정밀도를 유지시켜 주는 전설의 프루프 마스카라입니다.'
      },
      {
        brand: '클리오 (CLIO)',
        name: '수퍼프루프 롱웨어 브러쉬 펜 라이너',
        shade: '01 킬 블랙 (Kill Black)',
        price: '18,000원',
        type: 'eyeliner',
        description: '단 한 치의 번짐 오차도 용납하지 않는 겨울 트루 쿨톤 정합 사슬 전용 고유 펜라이너입니다.'
      }
    ],
    luxury: [
      {
        brand: '입생로랑 (YSL Beauty)',
        name: '따뚜아쥬 꾸튀르 매트 틴트',
        shade: '201 루쥬 따뚜아쥬 (Rouge Tatouage)',
        price: '49,000원',
        type: 'lip',
        description: '피부를 사막 한복판 겨울 눈밭처럼 환하게 비춰주는 오차 없는 시린 마젠타 체리 레드 립 무스입니다.'
      },
      {
        brand: '샤넬 (Chanel)',
        name: '쥬 꽁뜨라스트 파우더 블러쉬',
        shade: '로제 에크린 (Rose Ecrin)',
        price: '78,000원',
        type: 'blush',
        description: '달빛에 반사된 서리가 내린 쿨 소프트 매트 장미 핑크로 티없이 맑은 쿨 에너지를 보충합니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 5 꿀뢰르 아이 컴팩트',
        shade: '079 블랙 보우 (Black Bow)',
        price: '98,000원',
        type: 'eyeshadow',
        description: '한 치의 타협도 없는 아이시 스틸 그레이, 칠흑 차콜 블랙과 다이아몬드 영롱한 실버 펄의 향연입니다.'
      },
      {
        brand: '샤넬 (Chanel Beauty)',
        name: '이니미터블 익스트림 하이 앤 컬',
        shade: '10 퓨어 블랙 (Pure Black)',
        price: '49,000원',
        type: 'mascara',
        description: '매끄럽고 기품 흘러넘쳐, 도도하고 시크무쌍한 겨울 정석 실크 속눈썹을 코팅 마감해 주는 명품 장비입니다.'
      },
      {
        brand: '디올 (Dior Beauty)',
        name: '디올쇼 온스테이지 아쿠아 매트 라이너',
        shade: '090 매트 블랙 (Matte Black)',
        price: '45,000원',
        type: 'eyeliner',
        description: '겨족적이고 차갑고 서늘한 눈빛의 실루엣을 조각하는 무반사 스무스 카본 리퀴드 라이너입니다.'
      }
    ]
  }
};
