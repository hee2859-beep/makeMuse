/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CosmeticItem {
  brand: string;
  name: string;
  shade: string;
  price: string;
  type: 'lip' | 'blush' | 'eyeshadow' | 'base';
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
        name: '부와 드 로즈 치크 세컨드스킨',
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
        shade: '05 루비 벨벳 (Ruby Velvet)',
        price: '16,000원',
        type: 'eyeshadow',
        description: '차가운 안갯빛 화이트 핑크 베이스와 깊은 타로 퍼플 마젠타를 품은 4구 슬림 섀도우입니다.'
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
      }
    ]
  }
};
