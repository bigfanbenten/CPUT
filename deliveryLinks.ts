/**
 * OFFICIAL DELIVERY PLATFORM LINKS
 * Cơm Phần Út Trinh — 158A Trần Vĩnh Kiết, Cần Thơ
 * 
 * Ba đường link chính thức do chủ website cung cấp:
 * 1. GRABFOOD: https://app.grab.com/s/huWJfqgO
 * 2. SHOPEEFOOD: https://shopeefood.vn/can-tho/com-phan-ut-trinh
 * 3. XANH SM: https://xanhsmngon.onelink.me/14WJ/1hrgdcwo
 */

export const DELIVERY_LINKS = {
  // Official URLs provided by restaurant owner
  grabFood: 'https://app.grab.com/s/huWJfqgO',
  grab: 'https://app.grab.com/s/huWJfqgO',
  shopeeFood: 'https://shopeefood.vn/can-tho/com-phan-ut-trinh',
  shopee: 'https://shopeefood.vn/can-tho/com-phan-ut-trinh',
  xanhSM: 'https://xanhsmngon.onelink.me/14WJ/1hrgdcwo',
  xanhsm: 'https://xanhsmngon.onelink.me/14WJ/1hrgdcwo',

  // Shared restaurant contact & location info
  hotline: 'tel:0939709020',
  hotlineDisplay: '0939.709.020',
  phone: '0939.709.020',
  phoneTel: 'tel:0939709020',
  address: '158A Trần Vĩnh Kiết, An Bình, Cần Thơ, Vietnam',
  googleMap: 'https://www.google.com/maps?cid=4432329112330468584',
  googleMaps: 'https://www.google.com/maps?cid=4432329112330468584',
  website: 'https://www.comphanuttrinh.online',
} as const;

export type DeliveryPlatformKey = 'grabFood' | 'shopeeFood' | 'xanhSM';
