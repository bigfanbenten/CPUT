/**
 * JAPANESE DISH HELPER & LOCALIZATION
 * Hỗ trợ bản địa hóa dữ liệu thực đơn cho giao diện Japan - Modern Washoku Edition
 */

export interface JapaneseCategoryInfo {
  id: string;
  categoryKey: string;
  nameJp: string;
  subVn: string;
  iconSrc: string;
}

export const JAPANESE_CATEGORIES: JapaneseCategoryInfo[] = [
  {
    id: 'all',
    categoryKey: 'Tất Cả',
    nameJp: 'すべてのメニュー',
    subVn: 'Tất cả',
    iconSrc: '/assets/jp/cat-all.png',
  },
  {
    id: 'main',
    categoryKey: 'Món Chính',
    nameJp: 'メイン料理',
    subVn: 'Món chính',
    iconSrc: '/assets/jp/cat-main.png',
  },
  {
    id: 'soup',
    categoryKey: 'Món Canh',
    nameJp: 'スープ料理',
    subVn: 'Món canh',
    iconSrc: '/assets/jp/cat-soup.png',
  },
  {
    id: 'stirfry',
    categoryKey: 'Món Xào',
    nameJp: '炒め料理',
    subVn: 'Món xào',
    iconSrc: '/assets/jp/cat-stirfry.png',
  },
  {
    id: 'vegetable',
    categoryKey: 'Món Rau',
    nameJp: '野菜料理',
    subVn: 'Món rau',
    iconSrc: '/assets/jp/cat-veg.png',
  },
  {
    id: 'drink',
    categoryKey: 'Nước Uống',
    nameJp: 'ドリンク',
    subVn: 'Nước uống',
    iconSrc: '/assets/jp/cat-drink.png',
  },
];

export interface JapaneseDishDisplay {
  id: string;
  originalName: string;
  japaneseName: string;
  japaneseDesc: string;
  priceDisplay: string;
  numericPrice: number;
  image: string;
  category: string;
  rawDish: any;
}

interface DishDictionaryItem {
  japaneseName: string;
  japaneseDesc: string;
  fallbackImage?: string;
}

const DISH_DICTIONARY: Record<string, DishDictionaryItem> = {
  // --- 鶏肉 (Chicken) ---
  'đùi gà rô ti': {
    japaneseName: 'ロティチキンレッグ',
    japaneseDesc: 'やわらかくジューシーな鶏もも肉 特製スパイスで香ばしく焼き上げた一品',
    fallbackImage: '/assets/jp/dish-chicken.png',
  },
  'đùi gà chiên sốt': {
    japaneseName: '特製タレ骨付き鶏もも肉の唐揚げ',
    japaneseDesc: 'サクサクに揚げた鶏もも肉に甘辛い自家製ダレを絡めた人気メニュー',
    fallbackImage: '/assets/jp/dish-chicken.png',
  },
  'cánh gà chiên sốt': {
    japaneseName: '手羽先の甘辛タレ揚げ',
    japaneseDesc: '外はカリッと中はジューシー 香ばしいニンニク醤油タレが食欲をそそる',
    fallbackImage: '/assets/jp/dish-chicken.png',
  },

  // --- 牛肉 (Beef) ---
  'bò lúc lắc': {
    japaneseName: '牛肉のサイコロステーキ炒め',
    japaneseDesc: 'やわらかな角切り牛肉とパプリカ・玉ねぎを強火で香ばしく炒めた名物料理',
    fallbackImage: '/assets/jp/dish-beef.png',
  },
  'bò xào chua ngọt': {
    japaneseName: '牛肉と彩り野菜の甘酸っぱ炒め',
    japaneseDesc: '牛肉とパイナップル、トマトの酸味が絶妙に調和したフルーティーな炒め物',
    fallbackImage: '/assets/jp/dish-beef.png',
  },
  'mì xào bò': {
    japaneseName: '牛肉と青菜のベトナム風焼きそば',
    japaneseDesc: '中華麺に旨みたっぷりの牛肉と新鮮な野菜を炒め合わせた定番麺料理',
    fallbackImage: '/assets/jp/dish-beef.png',
  },

  // --- 豚肉 (Pork) ---
  'sườn ram mặn': {
    japaneseName: '豚スペアリブの甘辛キャラメル煮込み',
    japaneseDesc: '伝統のカラメルソースでじっくり煮込んだ柔らかく濃厚なスペアリブ',
  },
  'sườn ram': {
    japaneseName: '豚スペアリブの甘辛煮込み',
    japaneseDesc: 'ご飯が何杯でも進む、ベトナム家庭料理の定番おかず',
  },
  'sườn chiên': {
    japaneseName: '豚スペアリブの香ばし揚げ',
    japaneseDesc: '下味をしっかり染み込ませてカリッとジューシーに揚げた人気豚リブ',
  },
  'sườn cốt lết': {
    japaneseName: '豚ロースチョップのグリル',
    japaneseDesc: '秘伝のタレに漬け込み香ばしく焼き上げたジューシーな骨付きポーク',
  },
  'ba rọi kho tiêu': {
    japaneseName: '豚バラ肉の粗挽き黒胡椒煮込み',
    japaneseDesc: 'とろけるような豚バラ肉を風味豊かな黒胡椒ダレで煮込んだ絶品ご飯のお供',
  },
  'ba rọi chiên muối sả': {
    japaneseName: '豚バラ肉のレモングラス塩揚げ',
    japaneseDesc: 'レモングラスの爽やかな香りとカリカリの皮目がたまらない揚げ豚バラ肉',
  },
  'ba rọi mắm ruốc': {
    japaneseName: '豚バラ肉のエビ味噌レモングラス炒め',
    japaneseDesc: 'コク深い発酵エビ味噌と刻みレモングラスで炒めたメコン地方の伝統味',
  },
  'thịt kho tiêu': {
    japaneseName: '豚肉の黒胡椒煮込み',
    japaneseDesc: 'ピリッと効いた胡椒のアクセントがたまらない家庭の味',
  },
  'thịt kho tàu': {
    japaneseName: '豚の角煮と煮卵のココナッツ煮',
    japaneseDesc: 'ココナッツジュースでじっくりとろとろになるまで煮込んだベトナム伝統角煮',
  },
  'mắm chưng thịt bằm': {
    japaneseName: '発酵魚と豚ひき肉の蒸しパテ（卵黄のせ）',
    japaneseDesc: '旨みたっぷりの発酵魚と豚ひき肉をふんわり蒸し上げたまろやかな逸品',
  },
  'trứng chiên thịt bằm': {
    japaneseName: '豚ひき肉とネギのベトナム風オムレツ',
    japaneseDesc: '豚ひき肉と刻みネギを巻き込んで香ばしく焼き上げたふんわり玉子焼き',
  },
  'xúc xích lạp xưởng': {
    japaneseName: 'ベトナム伝統中華ソーセージ＆フランク',
    japaneseDesc: 'ほんのり甘みのある伝統の腸詰とソーセージの香ばしグリル',
  },

  // --- 魚介類 (Seafood) ---
  'tôm rim': {
    japaneseName: '海老の甘辛胡椒キャラメル煮',
    japaneseDesc: 'プリプリの海老に黒胡椒と甘辛い特製タレがしっかり絡んだご飯が進む一品',
    fallbackImage: '/assets/jp/dish-shrimp.png',
  },
  'tôm xào chua ngọt': {
    japaneseName: '海老と野菜の甘酸っぱ炒め',
    japaneseDesc: '新鮮な海老とパイナップル、パプリカをフルーティーな甘酢ソースで炒めた料理',
    fallbackImage: '/assets/jp/dish-shrimp.png',
  },
  'canh chua cá ba sa': {
    japaneseName: 'バサ魚のベトナム風甘酸っぱいスープ（カインチュア）',
    japaneseDesc: 'パイナップル、トマト、オクラの酸味と脂の乗ったバサ魚が調和した南部名物スープ',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'ba sa kho tiêu': {
    japaneseName: 'バサ魚の黒胡椒土鍋煮込み',
    japaneseDesc: 'メコン川特産のバサ魚を土鍋でじっくり煮込んだコク深い黒胡椒仕立て',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'mắm kho ba sa': {
    japaneseName: 'バサ魚とメコン発酵魚の煮込み鍋',
    japaneseDesc: '濃厚な魚醤出汁にナスとバサ魚を合わせた本格メコンデルタの味わい',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'cá điêu hồng sốt cà': {
    japaneseName: 'ティラピアのフレッシュトマトソース煮',
    japaneseDesc: '香ばしく揚げたティラピアに自家製完熟トマトソースをたっぷりかけた料理',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'canh chua cá điêu hồng': {
    japaneseName: 'ティラピアのベトナム風甘酸っぱいスープ',
    japaneseDesc: 'ティラピアとハーブ、パイナップルが爽やかなメコン伝統の酸味スープ',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'canh chua cá lóc': {
    japaneseName: '雷魚のベトナム風甘酸っぱいスープ',
    japaneseDesc: '天然雷魚の引き締まった身と甘酸っぱいタマリンド出汁が絶品の伝統カインチュア',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'cá lóc kho tộ': {
    japaneseName: '雷魚の土鍋キャラメル醤油煮込み',
    japaneseDesc: '土鍋でじっくり煮込み、魚の旨味を凝縮させたベトナムを代表する魚料理',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'cá hú kho tộ': {
    japaneseName: 'カオフー魚の土鍋煮込み',
    japaneseDesc: '脂がのった川魚を黒胡椒と唐辛子を効かせた甘辛醤油で煮込んだ逸品',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'cá chim đen': {
    japaneseName: 'マナガツオの香ばし一本揚げ',
    japaneseDesc: '新鮮なクロマナガツオを丸ごとカリッと揚げ、特製タレで味わう一品',
    fallbackImage: '/assets/jp/dish-soup.png',
  },
  'mực chiên sốt': {
    japaneseName: 'イカのカリカリ揚げ 特製タレ絡め',
    japaneseDesc: '外側はサクサク、中は柔らかいイカに旨辛タレを絡めた人気のおかず',
  },
  'mực xào chua ngọt': {
    japaneseName: 'イカと彩り野菜の甘酸っぱ炒め',
    japaneseDesc: '新鮮なイカとパイナップル、キュウリ、トマトを爽やかに炒め合わせた一品',
  },

  // --- カエル＆郷土料理 (Specialties) ---
  'ếch xào sả ớt': {
    japaneseName: '食用カエルのレモングラス唐辛子炒め',
    japaneseDesc: '鶏肉のように淡白でやわらかなカエル肉を爽やかなレモングラスと辛味で炒めた料理',
  },
  'ếch chiên nước mắm': {
    japaneseName: '食用カエルの魚醤ガーリック揚げ',
    japaneseDesc: 'サクサクに揚げたカエル肉を香ばしいニンニク魚醤ダレでキャラメリゼした逸品',
  },

  // --- スープ (Soups) ---
  'canh rong biển': {
    japaneseName: '豆腐と海藻のヘルシースープ',
    japaneseDesc: 'ごま油の香りと海藻のミネラルが身体に優しいすっきり澄ましスープ',
  },
  'canh khoai ngọt': {
    japaneseName: '紅芋とハーブのベトナム風とろみスープ',
    japaneseDesc: '鮮やかな紫色とほのかな甘みが特徴のメコン地方伝統の芋スープ',
  },
  'canh khổ qua nhồi thịt': {
    japaneseName: '肉詰めゴーヤの澄ましスープ',
    japaneseDesc: 'ほろ苦さと肉の旨みが溶け合うヘルシーな伝統スープ',
  },
  'canh khổ qua dồn thịt': {
    japaneseName: '肉詰めゴーヤの澄ましスープ',
    japaneseDesc: 'ほろ苦さと肉の旨みが溶け合うヘルシーな伝統スープ',
  },

  // --- 野菜・卵 (Vegetables & Eggs) ---
  'cải ngọt xào tỏi': {
    japaneseName: 'チョイサム（青菜）のニンニク強火炒め',
    japaneseDesc: '新鮮な青菜のシャキシャキ感と香ばしいニンニクが食欲をそそる定番副菜',
  },
  'khổ qua xào trứng': {
    japaneseName: 'ゴーヤと卵のベトナム風チャンプルー',
    japaneseDesc: '薄切りゴーヤの爽やかな苦味とふんわり甘い卵が絶妙に調和した人気家庭料理',
  },
  'rau xào': {
    japaneseName: '季節の温野菜ガーリック炒め',
    japaneseDesc: '旬の新鮮野菜をたっぷり使い、香り高いニンニクで炒め合わせたヘルシーな一皿',
  },
  'rau muống xào tỏi': {
    japaneseName: '空心菜のガーリック炒め',
    japaneseDesc: 'シャキシャキの歯ごたえと香ばしいニンニクの風味が食欲をそそる',
  },

  // --- ドリンク (Drinks) ---
  'cà phê sữa đá': {
    japaneseName: 'ベトナム練乳アイスコーヒー',
    japaneseDesc: '深煎りロブスタ豆の濃厚なコクと練乳の甘みが氷と溶け合う本場の味',
  },
  'cơm phần đặc biệt': {
    japaneseName: 'ウット チン特製お弁当',
    japaneseDesc: '炊きたてご飯と自慢のおかずを取り揃えた贅沢な日替わりセット',
    fallbackImage: '/assets/jp/dish-chicken.png',
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

export function localizeDishForJapanese(dish: any, index = 0): JapaneseDishDisplay {
  const origName = String(dish.name || 'Món Ngon Út Trinh').trim();
  const normalizedKey = normalizeKey(origName);

  // 1. Exact match
  let matchedDict: DishDictionaryItem | undefined = DISH_DICTIONARY[normalizedKey];

  // 2. Longest substring match (key contains dictKey, descending length)
  if (!matchedDict) {
    const sortedKeys = Object.keys(DISH_DICTIONARY).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      if (normalizedKey.includes(key)) {
        matchedDict = DISH_DICTIONARY[key];
        break;
      }
    }
  }

  const japaneseName = matchedDict?.japaneseName || origName;
  const japaneseDesc = matchedDict?.japaneseDesc || dish.description || '厳選素材で丁寧に仕上げた、ベトナム伝統家庭料理の逸品です。';

  const numericPrice = parsePriceNumber(dish.price);
  const priceDisplay = formatPriceVnd(dish.price);

  const fallbackImages = [
    '/assets/jp/dish-chicken.png',
    '/assets/jp/dish-beef.png',
    '/assets/jp/dish-soup.png',
    '/assets/jp/dish-shrimp.png',
  ];

  const image = (dish.image_url && dish.image_url.trim()) 
    ? dish.image_url 
    : (matchedDict?.fallbackImage || fallbackImages[index % fallbackImages.length]);

  return {
    id: dish.id || String(index),
    originalName: origName,
    japaneseName,
    japaneseDesc,
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
  hours: '10:00 - 18:00 (毎日営業)',
};

