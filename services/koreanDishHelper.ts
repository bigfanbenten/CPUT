/**
 * KOREAN DISH HELPER & LOCALIZATION
 * Hỗ trợ bản địa hóa dữ liệu thực đơn cho giao diện K-Food Cute Edition
 */

export interface KoreanCategoryInfo {
  id: string;
  categoryKey: string;
  nameKr: string;
  descKr: string;
  iconSrc: string;
}

export const KOREAN_CATEGORIES: KoreanCategoryInfo[] = [
  {
    id: 'all',
    categoryKey: 'Tất Cả',
    nameKr: '메뉴 전체',
    descKr: '모든 메뉴 보기',
    iconSrc: '/assets/kr/cat-all.png',
  },
  {
    id: 'main',
    categoryKey: 'Món Chính',
    nameKr: '메인 요리',
    descKr: '맛있는 메인 메뉴',
    iconSrc: '/assets/kr/cat-main.png',
  },
  {
    id: 'soup',
    categoryKey: 'Món Canh',
    nameKr: '국 요리',
    descKr: '뜨끈하고 시원한 국',
    iconSrc: '/assets/kr/cat-soup.png',
  },
  {
    id: 'stirfry',
    categoryKey: 'Món Xào',
    nameKr: '볶음 요리',
    descKr: '신선한 볶음 요리',
    iconSrc: '/assets/kr/cat-stirfry.png',
  },
  {
    id: 'vegetable',
    categoryKey: 'Món Rau',
    nameKr: '채소 요리',
    descKr: '건강한 반찬',
    iconSrc: '/assets/kr/cat-veg.png',
  },
  {
    id: 'drink',
    categoryKey: 'Nước Uống',
    nameKr: '음료',
    descKr: '시원한 음료',
    iconSrc: '/assets/kr/cat-drink.png',
  },
];

export interface KoreanDishDisplay {
  id: string;
  originalName: string;
  koreanName: string;
  koreanDesc: string;
  badge?: {
    text: string;
    type: 'popular' | 'recommended' | 'signature';
  };
  priceDisplay: string;
  numericPrice: number;
  image: string;
  category: string;
  rawDish: any;
}

interface DishDictionaryItem {
  koreanName: string;
  koreanDesc: string;
  badgeType: 'popular' | 'recommended' | 'signature';
  badgeText: string;
  fallbackImage?: string;
}

const DISH_DICTIONARY: Record<string, DishDictionaryItem> = {
  // --- 닭고기 (Chicken) ---
  'đùi gà rô ti': {
    koreanName: '로티 치킨 다리',
    koreanDesc: '부드럽고 촉촉한 닭다리, 특제 향신료 소스의 깊은 맛',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-chicken.png',
  },
  'đùi gà chiên sốt': {
    koreanName: '특제 소스 닭다리 튀김',
    koreanDesc: '겉은 바삭하고 속은 촉촉한 닭다리에 감칠맛 나는 마늘 간장 소스 코팅',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-chicken.png',
  },
  'cánh gà chiên sốt': {
    koreanName: '달콤 짭조름 닭날개 튀김',
    koreanDesc: '바삭하게 튀겨낸 닭날개에 매콤달콤한 마늘 소스를 입힌 인기 메뉴',
    badgeType: 'popular',
    fallbackImage: '/assets/kr/dish-chicken.png',
  },

  // --- 소고기 (Beef) ---
  'bò lúc lắc': {
    koreanName: '베트남식 찹스테이크 (소고기 볶음)',
    koreanDesc: '육즙 가득한 소고기 큐브와 신선한 파프리카, 양파의 고소한 웍 볶음',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
    fallbackImage: '/assets/kr/dish-beef.png',
  },
  'bò xào chua ngọt': {
    koreanName: '소고기 새콤달콤 야채볶음',
    koreanDesc: '파인애플과 토마토의 상큼한 과즙과 부드러운 소고기가 어우러진 볶음',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
    fallbackImage: '/assets/kr/dish-beef.png',
  },
  'mì xào bò': {
    koreanName: '베트남식 소고기 볶음면',
    koreanDesc: '쫄깃한 에그누들에 부드러운 소고기와 신선한 청경채를 볶아낸 든든한 한 끼',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-beef.png',
  },

  // --- 돼지고기 (Pork) ---
  'sườn ram mặn': {
    koreanName: '단짠 돼지갈비 조림',
    koreanDesc: '특제 캐러멜 간장 소스에 푹 졸여내 밥도둑으로 손꼽히는 돼지갈비',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
  },
  'sườn ram': {
    koreanName: '돼지갈비 조림',
    koreanDesc: '달콤 짭조름하게 조려낸 인기 밥도둑 반찬',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'sườn chiên': {
    koreanName: '골든 돼지갈비 구이/튀김',
    koreanDesc: '특제 양념에 재워 겉은 바삭하고 속은 부드러운 돼지갈비 커틀릿',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'sườn cốt lết': {
    koreanName: '베트남식 돈마호크 포크찹',
    koreanDesc: '특제 양념에 숙성해 노릇노릇 고소하게 구워낸 뼈 있는 돼지등심',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'ba rọi kho tiêu': {
    koreanName: '통후추 삼겹살 조림',
    koreanDesc: '도톰한 삼겹살을 베트남 전통 뚝배기에 알싸한 통후추와 함께 졸여낸 맛',
    badgeType: 'signature',
    badgeText: '시그니처',
  },
  'ba rọi chiên muối sả': {
    koreanName: '레몬글라스 소금 삼겹살 바삭구이',
    koreanDesc: '향긋한 레몬글라스와 천일염으로 밑간해 껍질은 바삭하고 육즙 가득한 삼겹살',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'ba rọi mắm ruốc': {
    koreanName: '레몬글라스 새우젓 삼겹살 볶음',
    koreanDesc: '메콩 델타 전통 새우발효장과 레몬글라스를 볶아 감칠맛이 폭발하는 삼겹살',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
  },
  'thịt kho tiêu': {
    koreanName: '후추 돼지고기 조림',
    koreanDesc: '알싸한 통후추와 함께 볶아낸 고소한 돼지고기',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
  },
  'thịt kho tàu': {
    koreanName: '코코넛 워터 삼겹살 달걀 장조림',
    koreanDesc: '신선한 코코넛 워터에 삼겹살과 삶은 달걀을 부드럽게 졸인 전통 요리',
    badgeType: 'signature',
    badgeText: '시그니처',
  },
  'mắm chưng thịt bằm': {
    koreanName: '다진 돼지고기 발효생선 계란찜',
    koreanDesc: '생선 젓갈과 다진 돼지고기를 계란 노른자와 부드럽게 쪄낸 베트남 남부 별미',
    badgeType: 'signature',
    badgeText: '시그니처',
  },
  'trứng chiên thịt bằm': {
    koreanName: '다진 고기 야채 계란말이/전',
    koreanDesc: '고소한 다진 돼지고기와 쪽파를 듬뿍 넣어 노릇하게 부쳐낸 달걀 요리',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'xúc xích lạp xưởng': {
    koreanName: '베트남 소시지 & 랍성 구이',
    koreanDesc: '달콤 짭조름한 전통 훈제 랍성 소시지와 프랑크 소시지 구이',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },

  // --- 해산물 (Seafood) ---
  'tôm rim': {
    koreanName: '통후추 새우 조림',
    koreanDesc: '탱글탱글한 새우에 달콤 짭조름한 캐러멜 간장 소스를 윤기 나게 졸여낸 요리',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-shrimp.png',
  },
  'tôm xào chua ngọt': {
    koreanName: '새우 파인애플 탕수 볶음',
    koreanDesc: '신선한 새우와 파인애플, 파프리카를 상큼달콤한 칠리소스에 볶아낸 요리',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
    fallbackImage: '/assets/kr/dish-shrimp.png',
  },
  'canh chua cá ba sa': {
    koreanName: '바사 생선 카인지우아 (새콤 생선국)',
    koreanDesc: '파인애플, 토마토, 타마린드로 우려낸 시원하고 새콤한 메콩 대표 생선탕',
    badgeType: 'signature',
    badgeText: '시그니처',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'ba sa kho tiêu': {
    koreanName: '바사 생선 뚝배기 후추 조림',
    koreanDesc: '부드러운 바사 피쉬 토막을 뚝배기에 검은 통후추와 함께 자작하게 졸인 요리',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'mắm kho ba sa': {
    koreanName: '바사 생선 젓갈 뚝배기 전골',
    koreanDesc: '진한 맘(어간장 발효액) 육수에 바사 생선과 가지를 넣고 끓인 전통 별미',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'cá điêu hồng sốt cà': {
    koreanName: '붉은 틸라피아 토마토 조림',
    koreanDesc: '바삭하게 튀긴 틸라피아에 신선한 생토마토 특제 소스를 얹어낸 요리',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'canh chua cá điêu hồng': {
    koreanName: '틸라피아 카인지우아 (새콤 생선국)',
    koreanDesc: '파인애플과 토마토, 허브를 듬뿍 넣고 끓여 새콤하고 시원한 베트남식 생선탕',
    badgeType: 'signature',
    badgeText: '시그니처',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'canh chua cá lóc': {
    koreanName: '자연산 가물치 카인지우아 (새콤 생선국)',
    koreanDesc: '쫄깃한 가물치 생선살과 메콩 델타의 신선한 야채가 어우러진 최고급 전통탕',
    badgeType: 'signature',
    badgeText: '시그니처',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'cá lóc kho tộ': {
    koreanName: '가물치 뚝배기 간장 조림',
    koreanDesc: '담백한 가물치를 전통 토기 뚝배기에 달콤 짭조름하게 조린 국민 밥도둑',
    badgeType: 'signature',
    badgeText: '시그니처',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'cá hú kho tộ': {
    koreanName: '메콩 메기 뚝배기 조림',
    koreanDesc: '기름진 메콩강 메기를 통후추와 칠리를 얹어 매콤달콤하게 졸인 보양식',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'cá chim đen': {
    koreanName: '병어 통마리 바삭 튀김',
    koreanDesc: '신선한 흑병어를 통째로 바삭하게 튀겨 칠리 피시소스와 함께 즐기는 생선구이',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
    fallbackImage: '/assets/kr/dish-soup.png',
  },
  'mực chiên sốt': {
    koreanName: '특제 칠리 오징어 튀김',
    koreanDesc: '바삭하게 튀겨낸 쫄깃한 오징어 링에 매콤달콤한 마늘 소스 글레이징',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'mực xào chua ngọt': {
    koreanName: '오징어 새콤달콤 야채볶음',
    koreanDesc: '신선한 오징어와 오이, 토마토, 파인애플을 상큼하게 볶아낸 감칠맛 요리',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
  },

  // --- 개구리 요리 & 특선 (Specialties) ---
  'ếch xào sả ớt': {
    koreanName: '레몬글라스 칠리 개구리 볶음',
    koreanDesc: '닭고기처럼 담백한 개구리 다리살을 향긋한 레몬글라스와 매콤한 고추로 볶은 요리',
    badgeType: 'recommended',
    badgeText: '추천 메뉴',
  },
  'ếch chiên nước mắm': {
    koreanName: '느억맘(피시소스) 개구리 튀김',
    koreanDesc: '바삭하게 튀긴 개구리 고기에 달콤 짭조름한 마늘 피시소스를 버무린 별미',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },

  // --- 국 & 찌개 (Soups) ---
  'canh rong biển': {
    koreanName: '두부 미역 맑은 장국',
    koreanDesc: '고소한 참기름과 부드러운 두부, 미역이 어우러진 속 편한 영양 미역국',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'canh khoai ngọt': {
    koreanName: '자색 고구마 베트남식 수프',
    koreanDesc: '보랏빛 자색 고구마를 부드럽게 끓여 허브를 얹은 은은하고 달콤한 전통 국',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'canh khổ qua nhồi thịt': {
    koreanName: '고기 채운 여주 맑은 국',
    koreanDesc: '기름기를 싹 잡아주는 담백하고 시원한 보양 국',
    badgeType: 'signature',
    badgeText: '시그니처',
  },
  'canh khổ qua dồn thịt': {
    koreanName: '고기 채운 여주 맑은 국',
    koreanDesc: '기름기를 싹 잡아주는 담백하고 시원한 보양 국',
    badgeType: 'signature',
    badgeText: '시그니처',
  },

  // --- 채소 & 계란 (Vegetables & Eggs) ---
  'cải ngọt xào tỏi': {
    koreanName: '초이삼(청경채류) 마늘 볶음',
    koreanDesc: '아삭한 식감의 초이삼 채소를 황금빛 마늘과 함께 센 불에서 재빨리 볶은 요리',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'khổ qua xào trứng': {
    koreanName: '여주 계란 스크램블 볶음',
    koreanDesc: '얇게 썬 여주의 산뜻한 쌉싸름함과 고소한 달걀이 부드럽게 어우러진 건강 반찬',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'rau xào': {
    koreanName: '모둠 계절 채소 마늘 볶음',
    koreanDesc: '신선한 계절 채소들을 향긋한 마늘 기름에 가볍게 볶아낸 깔끔한 채소 요리',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },
  'rau muống xào tỏi': {
    koreanName: '모닝글로리 마늘 볶음',
    koreanDesc: '아삭아삭한 식감과 은은한 마늘 향이 일품인 채소 반찬',
    badgeType: 'popular',
    badgeText: '인기 메뉴',
  },

  // --- 음료 (Drinks) ---
  'cà phê sữa đá': {
    koreanName: '베트남 연유 아이스 커피 (카페 쓰아다)',
    koreanDesc: '진한 로부스타 원두 드립 커피에 달콤한 연유와 얼음을 띄운 베트남 명물 커피',
    badgeType: 'signature',
    badgeText: '시그니처',
  },
  'cơm phần đặc biệt': {
    koreanName: '웃트찐 스페셜 도시락',
    koreanDesc: '정성껏 지은 밥과 푸짐한 메인 요리 3종 세트',
    badgeType: 'signature',
    badgeText: '시그니처',
    fallbackImage: '/assets/kr/dish-chicken.png',
  },
};

export function parsePriceNumber(priceVal: any): number {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 0;
  const cleaned = String(priceVal).replace(/[^\d]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPriceVnd(priceVal: any): string {
  const num = parsePriceNumber(priceVal);
  if (num > 0) {
    return num.toLocaleString('vi-VN') + ' VND';
  }
  return '40.000 VND';
}

function normalizeKey(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ');
}

export function localizeDishForKorean(dish: any, index = 0): KoreanDishDisplay {
  const origName = String(dish.name || 'Món Ngon Út Trinh').trim();
  const normalizedKey = normalizeKey(origName);

  let matchedDict: DishDictionaryItem | undefined = DISH_DICTIONARY[normalizedKey];

  // Longest substring match (key contains dictKey, descending length)
  if (!matchedDict) {
    const sortedKeys = Object.keys(DISH_DICTIONARY).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      if (normalizedKey.includes(key)) {
        matchedDict = DISH_DICTIONARY[key];
        break;
      }
    }
  }

  // Nếu không khớp từ điển chính xác, tạo bản địa hóa chuẩn mực
  const koreanName = matchedDict?.koreanName || origName;
  const koreanDesc = matchedDict?.koreanDesc || dish.description || '정성을 담아 조리한 베트남 전통 가정식 요리입니다.';

  const badgeTypes: Array<'popular' | 'recommended' | 'signature'> = ['popular', 'recommended', 'signature'];
  const badgeTexts: Record<string, string> = {
    popular: '인기 메뉴',
    recommended: '추천 메뉴',
    signature: '시그니처',
  };

  const defaultBadgeType = badgeTypes[index % 3];
  const badge = matchedDict ? {
    text: matchedDict.badgeText,
    type: matchedDict.badgeType,
  } : {
    text: badgeTexts[defaultBadgeType],
    type: defaultBadgeType,
  };

  const numericPrice = parsePriceNumber(dish.price);
  const priceDisplay = formatPriceVnd(dish.price);

  const fallbackImages = [
    '/assets/kr/dish-chicken.png',
    '/assets/kr/dish-beef.png',
    '/assets/kr/dish-soup.png',
    '/assets/kr/dish-shrimp.png',
  ];

  const image = (dish.image_url && dish.image_url.trim()) 
    ? dish.image_url 
    : (matchedDict?.fallbackImage || fallbackImages[index % fallbackImages.length]);

  return {
    id: dish.id || String(index),
    originalName: origName,
    koreanName,
    koreanDesc,
    badge,
    priceDisplay,
    numericPrice,
    image,
    category: dish.category || 'Món Chính',
    rawDish: dish,
  };
}

import { DELIVERY_LINKS as CENTRAL_DELIVERY_LINKS } from '../deliveryLinks';

export const DELIVERY_LINKS = {
  ...CENTRAL_DELIVERY_LINKS,
  hours: 'AM 10:00 - PM 6:00 (매일 운영)',
};

