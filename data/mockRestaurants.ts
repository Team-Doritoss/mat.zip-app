import { Restaurant } from '@/types/restaurant';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: '카페 도그런',
    category: '브런치 카페',
    rating: 4.7,
    address: '서울 강남구 신사동 123-45',
    phone: '02-1234-5678',
    hours: '09:00-22:00 (브런치 ~15:00)',
    latitude: 37.5172,
    longitude: 127.0473,
    images: [
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
    ],
    features: ['애견동반', '테라스석', '발렛파킹', '예약가능'],
    summary: '반려견 친화적인 브런치 전문점. 에그베네딕트와 수제 팬케이크가 유명하며 야외 테라스에 애견 전용 공간이 있어 안심하고 방문 가능.',
    reviewCount: 342,
    priceRange: '15,000원~25,000원',
  },
  {
    id: '2',
    name: '파스타 아모레',
    category: '이탈리안 레스토랑',
    rating: 4.5,
    address: '서울 강남구 청담동 456-78',
    phone: '02-2345-6789',
    hours: '11:30-22:00 (브레이크타임 15:00-17:00)',
    latitude: 37.5244,
    longitude: 127.0479,
    images: [
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
    ],
    features: ['주차가능', '단체석', '키즈존', '무선인터넷'],
    summary: '수제 파스타와 정통 이탈리안 요리 전문점. 특히 트러플 크림 파스타와 해산물 리조또가 시그니처 메뉴. 분위기 좋아 데이트나 모임에 적합.',
    reviewCount: 528,
    priceRange: '20,000원~35,000원',
  },
  {
    id: '3',
    name: '한옥골 설렁탕',
    category: '한식',
    rating: 4.6,
    address: '서울 강남구 역삼동 789-12',
    phone: '02-3456-7890',
    hours: '00:00-24:00 (연중무휴)',
    latitude: 37.5009,
    longitude: 127.0374,
    images: [
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
    ],
    features: ['24시간', '포장가능', '배달가능', '주차가능'],
    summary: '40년 전통의 설렁탕 전문점. 진한 사골 육수가 일품이며, 비오는 날이나 속이 안 좋을 때 방문하기 좋은 곳. 24시간 운영으로 언제든 방문 가능.',
    reviewCount: 1245,
    priceRange: '9,000원~12,000원',
  },
  {
    id: '4',
    name: '스시 오마카세',
    category: '일식/초밥',
    rating: 4.8,
    address: '서울 강남구 논현동 234-56',
    phone: '02-4567-8901',
    hours: '12:00-15:00, 18:00-22:00',
    latitude: 37.5106,
    longitude: 127.0227,
    images: [
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
    ],
    features: ['예약필수', '카운터석', '주차가능', '프라이빗룸'],
    summary: '신선한 제철 해산물을 사용한 오마카세 전문점. 셰프의 정성스러운 설명과 함께 15가지 코스 요리 제공. 특별한 날 방문하기 좋은 곳.',
    reviewCount: 189,
    priceRange: '100,000원~150,000원',
  },
  {
    id: '5',
    name: '베이커리 앤 카페',
    category: '베이커리/카페',
    rating: 4.4,
    address: '서울 강남구 삼성동 567-89',
    phone: '02-5678-9012',
    hours: '08:00-22:00',
    latitude: 37.5140,
    longitude: 127.0635,
    images: [
      'https://placehold.co/600x400',
      'https://placehold.co/600x400',
    ],
    features: ['테이크아웃', '무선인터넷', '노키즈존', '아기의자'],
    summary: '매일 새벽에 굽는 신선한 빵과 디저트가 일품. 크루아상과 바게트가 시그니처 메뉴. 조용한 분위기에서 작업하거나 독서하기 좋은 카페.',
    reviewCount: 678,
    priceRange: '5,000원~15,000원',
  },
];

export const searchRestaurants = (query: string): Restaurant[] => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('애견') || lowerQuery.includes('반려') || lowerQuery.includes('강아지')) {
    return mockRestaurants.filter(r => r.features.includes('애견동반'));
  }

  if (lowerQuery.includes('브런치')) {
    return mockRestaurants.filter(r => r.category.includes('브런치'));
  }

  if (lowerQuery.includes('비') || lowerQuery.includes('국물') || lowerQuery.includes('따뜻')) {
    return mockRestaurants.filter(r => r.category.includes('한식'));
  }

  if (lowerQuery.includes('데이트') || lowerQuery.includes('분위기')) {
    return mockRestaurants.filter(r => r.rating >= 4.5);
  }

  if (lowerQuery.includes('24시간') || lowerQuery.includes('야식')) {
    return mockRestaurants.filter(r => r.features.includes('24시간'));
  }

  if (lowerQuery.includes('파스타') || lowerQuery.includes('이탈리안')) {
    return mockRestaurants.filter(r => r.category.includes('이탈리안'));
  }

  if (lowerQuery.includes('초밥') || lowerQuery.includes('스시') || lowerQuery.includes('일식')) {
    return mockRestaurants.filter(r => r.category.includes('일식'));
  }

  return mockRestaurants.slice().sort((a, b) => b.rating - a.rating).slice(0, 3);
};

export const generateAIResponse = (query: string, restaurants: Restaurant[]): string => {
  if (restaurants.length === 0) {
    return '죄송합니다. 조건에 맞는 맛집을 찾지 못했습니다. 다른 조건으로 검색해보시겠어요?';
  }

  const count = restaurants.length;
  const category = restaurants[0].category;

  return `${query}에 딱 맞는 맛집 ${count}곳을 찾았어요! 각 장소마다 특색이 있으니 자세히 살펴보세요.`;
};
