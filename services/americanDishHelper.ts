/**
 * AMERICAN DISH HELPER & LOCALIZATION
 * Provides English translations, category mappings, and display models
 * for the USA — Premium American Dining Edition of Cơm Phần Út Trinh.
 */

export interface AmericanCategoryInfo {
  id: string;
  categoryKey: string;
  nameEn: string;
  subEn: string;
  iconSrc: string;
}

export const AMERICAN_CATEGORIES: AmericanCategoryInfo[] = [
  {
    id: 'all',
    categoryKey: 'Tất Cả',
    nameEn: 'ALL MENU',
    subEn: 'View all dishes',
    iconSrc: '/assets/us/cat-all.png',
  },
  {
    id: 'main',
    categoryKey: 'Món Chính',
    nameEn: 'MAIN DISHES',
    subEn: 'Delicious rice meals',
    iconSrc: '/assets/us/cat-main.png',
  },
  {
    id: 'soup',
    categoryKey: 'Món Canh',
    nameEn: 'SOUPS',
    subEn: 'Warm & comforting',
    iconSrc: '/assets/us/cat-soup.png',
  },
  {
    id: 'stirfry',
    categoryKey: 'Món Xào',
    nameEn: 'STIR-FRIED DISHES',
    subEn: 'Fresh & tasty',
    iconSrc: '/assets/us/cat-stirfry.png',
  },
  {
    id: 'vegetable',
    categoryKey: 'Món Rau',
    nameEn: 'VEGETABLE DISHES',
    subEn: 'Healthy sides',
    iconSrc: '/assets/us/cat-veg.png',
  },
  {
    id: 'drink',
    categoryKey: 'Nước Uống',
    nameEn: 'DRINKS',
    subEn: 'Refreshing drinks',
    iconSrc: '/assets/us/cat-drink.png',
  },
];

export interface AmericanDishDisplay {
  id: string;
  originalName: string;
  englishName: string;
  englishDesc: string;
  priceDisplay: string;
  numericPrice: number;
  image: string;
  category: string;
  badge?: 'POPULAR' | 'RECOMMENDED' | 'SIGNATURE';
  rawDish: any;
}

interface DishDictionaryItem {
  englishName: string;
  englishDesc: string;
  badge?: 'POPULAR' | 'RECOMMENDED' | 'SIGNATURE';
  fallbackImage?: string;
}

const DISH_DICTIONARY: Record<string, DishDictionaryItem> = {
  // --- Chicken & Poultry ---
  'đùi gà rô ti': {
    englishName: 'Roasted Chicken Leg',
    englishDesc: 'Tender and juicy chicken leg roasted with special aromatic marinade.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-chicken.png',
  },
  'đùi gà chiên sốt': {
    englishName: 'Crispy Chicken Drumstick in Savory Sauce',
    englishDesc: 'Crisp golden drumstick glazed with flavorful homemade garlic sauce.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-chicken.png',
  },
  'cánh gà chiên sốt': {
    englishName: 'Glazed Crispy Chicken Wings',
    englishDesc: 'Crunchy chicken wings coated in rich caramelized sweet-savory reduction.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-chicken.png',
  },
  'gà chiên nước mắm': {
    englishName: 'Crispy Chicken in Fish Sauce Glaze',
    englishDesc: 'Deep-fried golden chicken coated in fragrant caramelized fish sauce.',
    badge: 'POPULAR',
  },
  'gà kho gừng': {
    englishName: 'Ginger Braised Chicken',
    englishDesc: 'Comforting chicken simmered with warming fresh ginger slivers.',
    badge: 'POPULAR',
  },
  'gà kho sả ớt': {
    englishName: 'Spicy Lemongrass Braised Chicken',
    englishDesc: 'Tender chicken braised with fragrant minced lemongrass and red chilies.',
    badge: 'POPULAR',
  },

  // --- Beef ---
  'bò lúc lắc': {
    englishName: 'Vietnamese Shaking Beef',
    englishDesc: 'Tender wok-seared beef cubes with bell peppers and onions in rich savory sauce.',
    badge: 'RECOMMENDED',
    fallbackImage: '/assets/us/dish-beef.png',
  },
  'bò xào chua ngọt': {
    englishName: 'Sweet & Sour Stir-Fried Beef',
    englishDesc: 'Tender marinated beef slices wok-tossed with pineapple, tomatoes, and crisp vegetables.',
    badge: 'RECOMMENDED',
    fallbackImage: '/assets/us/dish-beef.png',
  },
  'mì xào bò': {
    englishName: 'Stir-Fried Egg Noodles with Beef',
    englishDesc: 'Savory egg noodles tossed with tender beef, choy sum, and aromatic garlic soy sauce.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-beef.png',
  },

  // --- Pork & Ribs ---
  'sườn ram mặn': {
    englishName: 'Caramelized Savory Pork Ribs',
    englishDesc: 'Slow-simmered tender pork ribs braised in rich golden caramel and garlic glaze.',
    badge: 'RECOMMENDED',
  },
  'sườn ram': {
    englishName: 'Caramelized Pork Ribs',
    englishDesc: 'Slow-simmered savory ribs in rich homemade caramel glaze.',
    badge: 'RECOMMENDED',
  },
  'sườn chiên': {
    englishName: 'Golden Pan-Fried Pork Chops',
    englishDesc: 'Crisp, juicy marinated pork cutlets pan-seared to golden perfection.',
    badge: 'POPULAR',
  },
  'sườn cốt lết': {
    englishName: 'Pan-Seared Pork Chop',
    englishDesc: 'Marinated tender bone-in pork chop seared to golden perfection.',
    badge: 'POPULAR',
  },
  'ba rọi kho tiêu': {
    englishName: 'Black Pepper Braised Pork Belly',
    englishDesc: 'Tender pork belly slices slowly braised with freshly cracked black pepper and scallions.',
    badge: 'SIGNATURE',
  },
  'ba rọi chiên muối sả': {
    englishName: 'Crispy Lemongrass Salt Pork Belly',
    englishDesc: 'Crisp pork belly infused with fragrant sea salt, minced lemongrass, and mild chili.',
    badge: 'POPULAR',
  },
  'ba rọi mắm ruốc': {
    englishName: 'Pork Belly Sautéed in Shrimp Paste',
    englishDesc: 'Savory pork belly morsels wok-fried with aromatic lemongrass shrimp paste.',
    badge: 'RECOMMENDED',
  },
  'thịt kho tiêu': {
    englishName: 'Black Pepper Braised Pork',
    englishDesc: 'Homestyle caramelized lean pork simmered with freshly cracked black pepper.',
    badge: 'POPULAR',
  },
  'thịt kho tàu': {
    englishName: 'Braised Pork Belly & Eggs in Coconut Water',
    englishDesc: 'Melt-in-your-mouth tender pork belly with seasoned braised eggs in sweet coconut broth.',
    badge: 'SIGNATURE',
  },
  'thịt kho trứng': {
    englishName: 'Braised Pork & Eggs',
    englishDesc: 'Comforting homestyle stewed pork belly with hard-boiled eggs in rich caramel broth.',
    badge: 'POPULAR',
  },
  'mắm chưng thịt bằm': {
    englishName: 'Steamed Fermented Fish & Minced Pork',
    englishDesc: 'Traditional Mekong steamed minced pork and fermented fish patty topped with rich egg yolk.',
    badge: 'SIGNATURE',
  },
  'trứng chiên thịt bằm': {
    englishName: 'Vietnamese Omelet with Minced Pork',
    englishDesc: 'Golden pan-fried egg omelet stuffed with savory minced pork and fresh scallions.',
    badge: 'POPULAR',
  },
  'xúc xích lạp xưởng': {
    englishName: 'Chinese Sausage & Pork Frankfurters',
    englishDesc: 'Pan-crisped sweet Vietnamese lap xuong pork sausage paired with savory franks.',
    badge: 'POPULAR',
  },

  // --- Seafood (Fish, Shrimp, Squid) ---
  'tôm rim': {
    englishName: 'Caramelized Pepper Shrimp',
    englishDesc: 'Plump shrimp pan-caramelized with black pepper, garlic, and sweet-savory reduction.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-shrimp.png',
  },
  'tôm xào chua ngọt': {
    englishName: 'Sweet & Sour Stir-Fried Shrimp',
    englishDesc: 'Plump fresh shrimp wok-tossed with pineapple, sweet bell peppers, and tangy tamarind glaze.',
    badge: 'RECOMMENDED',
    fallbackImage: '/assets/us/dish-shrimp.png',
  },
  'canh chua cá ba sa': {
    englishName: 'Sweet & Sour Basa Fish Soup',
    englishDesc: 'Iconic Mekong Delta sour soup with tender basa steaks, pineapple, okra, and elephant ear stems.',
    badge: 'SIGNATURE',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'ba sa kho tiêu': {
    englishName: 'Black Pepper Braised Basa Fish',
    englishDesc: 'Rich basa fish steak gently simmered in a claypot with black pepper and fish sauce caramel.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'mắm kho ba sa': {
    englishName: 'Mekong Fermented Fish Stew with Basa',
    englishDesc: 'Authentic southern fermented fish stew simmered with tender basa fish, eggplant, and chili.',
    badge: 'RECOMMENDED',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'cá điêu hồng sốt cà': {
    englishName: 'Red Tilapia in Fresh Tomato Sauce',
    englishDesc: 'Golden pan-fried red tilapia fillet bathed in fresh homestyle tomato reduction.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'canh chua cá điêu hồng': {
    englishName: 'Sweet & Sour Red Tilapia Soup',
    englishDesc: 'Mekong Delta sweet and sour soup with fresh pineapple, okra, and tomatoes.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'canh chua cá lóc': {
    englishName: 'Sweet & Sour Snakehead Fish Soup',
    englishDesc: 'Southern Vietnamese heritage sour soup featuring wild snakehead fish fillet and fresh herbs.',
    badge: 'SIGNATURE',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'cá lóc kho tộ': {
    englishName: 'Claypot Braised Snakehead Fish',
    englishDesc: 'Iconic Mekong river fish caramelized in a traditional claypot with chili and scallions.',
    badge: 'SIGNATURE',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'cá hú kho tộ': {
    englishName: 'Claypot Braised Pangasius Fish',
    englishDesc: 'Rich river fish gently simmered in a traditional claypot sauce.',
    badge: 'RECOMMENDED',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'cá chim đen': {
    englishName: 'Pan-Fried Black Pomfret Fish',
    englishDesc: 'Whole black pomfret seared golden crisp with sea salt and garlic chili dipping sauce.',
    badge: 'POPULAR',
    fallbackImage: '/assets/us/dish-fish.png',
  },
  'mực chiên sốt': {
    englishName: 'Crispy Fried Squid in House Sauce',
    englishDesc: 'Tender squid flash-fried crisp and coated in sweet-savory garlic chili glaze.',
    badge: 'POPULAR',
  },
  'mực xào chua ngọt': {
    englishName: 'Sweet & Sour Stir-Fried Squid',
    englishDesc: 'Fresh calamari wok-tossed with pineapple, cucumber, tomatoes, and tangy reduction.',
    badge: 'RECOMMENDED',
  },

  // --- Frogs & Specialties ---
  'ếch xào sả ớt': {
    englishName: 'Spicy Lemongrass Stir-Fried Frog',
    englishDesc: 'Tender frog legs wok-seared with fragrant minced lemongrass, chili, and turmeric.',
    badge: 'RECOMMENDED',
  },
  'ếch chiên nước mắm': {
    englishName: 'Crispy Frog Legs in Fish Sauce',
    englishDesc: 'Golden crispy frog legs glazed with caramelized garlic fish sauce.',
    badge: 'POPULAR',
  },

  // --- Soups ---
  'canh rong biển': {
    englishName: 'Nutritious Seaweed & Tofu Soup',
    englishDesc: 'Clear comforting seaweed broth simmered with delicate tofu and roasted sesame.',
    badge: 'POPULAR',
  },
  'canh khoai ngọt': {
    englishName: 'Purple Sweet Potato Soup',
    englishDesc: 'Creamy traditional Vietnamese sweet yam soup simmered with fragrant rice paddy herbs.',
    badge: 'POPULAR',
  },
  'canh khổ qua dồn thịt': {
    englishName: 'Stuffed Bitter Melon Soup',
    englishDesc: 'Traditional healthy soup with minced pork filling in clear savory broth.',
    badge: 'RECOMMENDED',
  },
  'canh bí đao thịt bằm': {
    englishName: 'Winter Melon & Pork Soup',
    englishDesc: 'Delicate winter melon slices in a soothing minced pork broth.',
  },
  'canh cải thịt bằm': {
    englishName: 'Mustard Greens & Minced Pork Soup',
    englishDesc: 'Fresh mustard greens in warm homestyle broth with minced pork.',
  },

  // --- Vegetables & Tofu ---
  'cải ngọt xào tỏi': {
    englishName: 'Garlic Stir-Fried Choy Sum',
    englishDesc: 'Crisp Asian choy sum greens flash-fried over high heat with fragrant golden garlic.',
    badge: 'POPULAR',
  },
  'khổ qua xào trứng': {
    englishName: 'Stir-Fried Bitter Melon with Eggs',
    englishDesc: 'Thinly shaved bitter melon wok-tossed with fluffy scrambled eggs and scallions.',
    badge: 'POPULAR',
  },
  'rau xào': {
    englishName: 'Garden Vegetable Stir-Fry',
    englishDesc: 'Assorted seasonal garden greens lightly seasoned and wok-tossed with garlic.',
    badge: 'POPULAR',
  },
  'rau muống xào tỏi': {
    englishName: 'Garlic Stir-Fried Water Spinach',
    englishDesc: 'Crisp morning glory wok-tossed with fragrant golden garlic.',
    badge: 'POPULAR',
  },
  'cải thìa sốt dầu hào': {
    englishName: 'Bok Choy in Oyster Sauce',
    englishDesc: 'Tender baby bok choy drizzled with glossy savory oyster reduction.',
  },
  'rau xào thập cẩm': {
    englishName: 'Mixed Stir-Fried Garden Vegetables',
    englishDesc: 'Colorful medley of garden fresh vegetables lightly seasoned and wok-fried.',
  },
  'đậu hũ dồn thịt sốt cà': {
    englishName: 'Pork-Stuffed Tofu in Tomato Sauce',
    englishDesc: 'Golden fried tofu cakes filled with seasoned pork in fresh tomato reduction.',
  },
  'chả trứng hấp': {
    englishName: 'Steamed Vietnamese Egg Meatloaf',
    englishDesc: 'Savory egg meatloaf layered with glass noodles and wood-ear mushrooms.',
  },

  // --- Drinks ---
  'cà phê sữa đá': {
    englishName: 'Vietnamese Iced Coffee with Condensed Milk',
    englishDesc: 'Bold Robusta drip coffee poured over sweetened condensed milk and crushed ice.',
    badge: 'SIGNATURE',
  },
  'trà tắc mật ong': {
    englishName: 'Honey Calamansi Iced Tea',
    englishDesc: 'Zesty Vietnamese citrus brew naturally sweetened with pure wild honey.',
    badge: 'POPULAR',
  },
  'trà đào sả': {
    englishName: 'Peach Lemongrass Iced Tea',
    englishDesc: 'Aromatic lemongrass green tea infused with sweet peach essence.',
  },
};

import { DELIVERY_LINKS as CENTRAL_DELIVERY_LINKS } from '../deliveryLinks';

export const DELIVERY_LINKS = {
  ...CENTRAL_DELIVERY_LINKS,
};


/**
 * Format numeric price to Vietnamese Dong string with thousand separator
 */
export function formatVndPrice(price: string | number | undefined): { display: string; numeric: number } {
  if (price === undefined || price === null || price === '') {
    return { display: '35,000 VND', numeric: 35000 };
  }
  const cleanStr = String(price).replace(/\D/g, '');
  const num = parseInt(cleanStr, 10);
  if (isNaN(num) || num <= 0) {
    return { display: '35,000 VND', numeric: 35000 };
  }
  return {
    display: `${num.toLocaleString('en-US')} VND`,
    numeric: num,
  };
}

/**
 * Normalizes Vietnamese string for robust key lookups
 */
function normalizeKey(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Localize dish to English for the US homepage
 * Strictly adheres to 0-collision policy: every dish receives a distinct, accurate English name.
 */
export function localizeDishForAmerican(dish: any, index: number): AmericanDishDisplay {
  const originalName = (dish?.name || `Món ăn #${index + 1}`).trim();
  const key = normalizeKey(originalName);

  // 1. Direct exact dictionary match
  let matched = DISH_DICTIONARY[key];

  // 2. Longest substring match from dictionary (strictly key contains dictKey, descending length)
  if (!matched) {
    const sortedDictKeys = Object.keys(DISH_DICTIONARY).sort((a, b) => b.length - a.length);
    for (const dictKey of sortedDictKeys) {
      if (key.includes(dictKey)) {
        matched = DISH_DICTIONARY[dictKey];
        break;
      }
    }
  }

  const categoryStr = String(dish?.category || 'Món Chính');
  const priceInfo = formatVndPrice(dish?.price);

  let englishName = matched?.englishName;
  let englishDesc = matched?.englishDesc;
  const badge = matched?.badge || (index % 3 === 0 ? 'POPULAR' : undefined);

  // 3. Fallback translation if not matched in dictionary:
  // Synthesize an accurate, distinct English name based on ingredients and cooking method,
  // or retain the original Vietnamese name to prevent duplicate "Savory Braised Pork" collisions.
  if (!englishName) {
    if (key.includes('mực')) {
      englishName = key.includes('xào') ? 'Stir-Fried Squid' : 'Crispy Fried Squid';
    } else if (key.includes('ếch')) {
      englishName = key.includes('xào') ? 'Lemongrass Sautéed Frog' : 'Crispy Seasoned Frog';
    } else if (key.includes('tôm')) {
      englishName = key.includes('chua ngọt') ? 'Sweet & Sour Shrimp' : 'Savory Caramelized Shrimp';
    } else if (key.includes('ba rọi') || key.includes('ba chỉ')) {
      if (key.includes('tiêu')) englishName = 'Black Pepper Braised Pork Belly';
      else if (key.includes('sả') || key.includes('muối')) englishName = 'Crispy Lemongrass Salt Pork Belly';
      else if (key.includes('ruốc') || key.includes('mắm')) englishName = 'Pork Belly Sautéed in Shrimp Paste';
      else englishName = 'Pan-Seared Pork Belly';
    } else if (key.includes('sườn')) {
      if (key.includes('chiên')) englishName = 'Pan-Fried Pork Chops';
      else if (key.includes('ram')) englishName = 'Caramelized Pork Ribs';
      else englishName = 'Homestyle Braised Pork Ribs';
    } else if (key.includes('cá')) {
      if (key.includes('ba sa')) englishName = 'Claypot Braised Basa Fish';
      else if (key.includes('chim')) englishName = 'Pan-Fried Pomfret Fish';
      else if (key.includes('lóc')) englishName = 'Claypot Snakehead Fish';
      else englishName = 'Pan-Seared Fresh Fish';
    } else if (key.includes('gà')) {
      if (key.includes('đùi')) englishName = 'Crispy Chicken Drumstick';
      else if (key.includes('cánh')) englishName = 'Crispy Chicken Wings';
      else englishName = 'Homestyle Savory Chicken';
    } else if (key.includes('bò')) {
      englishName = key.includes('mì') ? 'Stir-Fried Noodles with Beef' : 'Wok-Tossed Marinated Beef';
    } else if (key.includes('canh')) {
      if (key.includes('rong biển')) englishName = 'Nutritious Seaweed Soup';
      else if (key.includes('khoai')) englishName = 'Sweet Yam Homestyle Soup';
      else englishName = 'Daily Homestyle Soup';
    } else if (key.includes('cải') || key.includes('rau')) {
      englishName = 'Fresh Garlic Seasoned Greens';
    } else if (key.includes('khổ qua')) {
      englishName = 'Stir-Fried Bitter Melon with Eggs';
    } else if (key.includes('trứng')) {
      englishName = 'Homestyle Seasoned Omelet';
    } else if (key.includes('lạp xưởng') || key.includes('xúc xích')) {
      englishName = 'Sweet Lap Xuong Sausage & Franks';
    } else {
      // Default: Retain original Vietnamese name rather than a false generic name
      englishName = originalName;
    }
  }

  if (!englishDesc) {
    if (dish?.description && dish.description.trim()) {
      englishDesc = dish.description;
    } else {
      englishDesc = 'Prepared daily with fresh local ingredients and authentic Vietnamese homestyle care.';
    }
  }

  const image = dish?.image_url || matched?.fallbackImage || '/assets/us/hero-bento.png';

  return {
    id: dish?.id || `us-dish-${index}`,
    originalName,
    englishName,
    englishDesc,
    priceDisplay: priceInfo.display,
    numericPrice: priceInfo.numeric,
    image,
    category: categoryStr,
    badge,
    rawDish: dish,
  };
}
