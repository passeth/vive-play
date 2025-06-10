import OpenAI from 'openai';
import { createLogger } from '../utils/logger';

const logger = createLogger('ai-service');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export interface ProjectInput {
  productType: string;
  targetCustomer: string;
  keywords: string[];
  concept: string;
  trends?: Array<{
    title: string;
    description: string;
    tags: string[];
  }>;
}

export interface AISuggestion {
  productName: string;
  concept: string;
  ingredients: Array<{
    name: string;
    percentage?: string;
    purpose: string;
  }>;
  design: {
    packaging: string;
    color: string;
    size: string;
    style: string;
  };
  targetPrice: string;
  features: string[];
  marketingPoints: string[];
}

export const generateCosmetics = async (input: ProjectInput): Promise<AISuggestion> => {
  try {
    // If no OpenAI key is provided, return demo data
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      logger.info('Using demo AI response (no OpenAI key configured)');
      return generateDemoResponse(input);
    }

    const prompt = createPrompt(input);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert cosmetics formulator and product development specialist. Generate detailed, realistic cosmetics product suggestions in Korean. Focus on current trends, safe ingredients, and market viability."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = response.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse AI response (expecting JSON format)
    try {
      const suggestion = JSON.parse(aiResponse) as AISuggestion;
      logger.info('AI suggestion generated successfully');
      return suggestion;
    } catch (parseError) {
      logger.warn('Failed to parse AI response as JSON, falling back to demo');
      return generateDemoResponse(input);
    }

  } catch (error) {
    logger.error('AI generation error:', error);
    // Fallback to demo response
    return generateDemoResponse(input);
  }
};

const createPrompt = (input: ProjectInput): string => {
  const trendsText = input.trends?.map(trend => 
    `- ${trend.title}: ${trend.description} (태그: ${trend.tags.join(', ')})`
  ).join('\n') || '';

  const systemMessage = `당신은 전문적인 화장품 제품 개발 컨설턴트입니다. 
현재 한국 화장품 시장의 트렌드를 잘 파악하고 있으며, 실제 제조 가능하고 시장성 있는 제품을 제안합니다.
K-뷰티, 클린 뷰티, 지속가능성 등 최신 트렌드를 반영하여 제안하세요.`;

  return `${systemMessage}

**제품 기획 요청 정보:**
- 제품 카테고리: ${input.productType}
- 주요 타겟층: ${input.targetCustomer}
- 핵심 키워드: ${input.keywords.join(', ')}
- 개발 컨셉: ${input.concept}

**최신 트렌드 참고사항:**
${trendsText || '참고할 트렌드 없음'}

**제품 제안 요구사항:**
1. 실제 제조 가능한 성분 조합 제시
2. 한국 화장품법 규정 준수
3. 타겟 연령층에 적합한 가격대 설정
4. 차별화된 마케팅 포인트 제시
5. 실용적이고 매력적인 패키징 제안

다음 JSON 형식으로 정확히 응답해주세요 (다른 텍스트 없이 JSON만 응답):

{
  "productName": "혁신적이고 기억에 남는 제품명",
  "concept": "제품의 핵심 가치와 차별점을 담은 2-3문장 설명",
  "ingredients": [
    {
      "name": "주요 성분명",
      "percentage": "함량 (예: 10%, 필수는 아님)",
      "purpose": "해당 성분의 효능과 역할"
    }
  ],
  "design": {
    "packaging": "용기 형태와 특징 (예: 에어레스 펌프 병)",
    "color": "패키지 컬러 컨셉 (예: 매트 화이트 + 로즈골드 포인트)",
    "size": "용량 (예: 30ml, 50g)",
    "style": "전체적인 디자인 방향성"
  },
  "targetPrice": "현실적인 예상 소비자가격 (원 단위)",
  "features": ["실제 효능 중심의 핵심 기능들"],
  "marketingPoints": ["타겟층에게 어필할 수 있는 마케팅 메시지"]
}`;
};

const generateDemoResponse = (input: ProjectInput): AISuggestion => {
  // Generate contextual demo response based on input and keywords
  const hasKeyword = (keyword: string) => 
    input.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
    input.concept.toLowerCase().includes(keyword.toLowerCase());

  // Base responses by product type
  const baseResponses: Record<string, AISuggestion> = {
    '스킨케어': {
      productName: hasKeyword('글로우') ? "래디언스 글로우 세럼" : 
                   hasKeyword('수분') ? "하이드라 플러스 에센스" :
                   hasKeyword('안티에이징') ? "리뉴얼 타임 세럼" : "글로우 비타민 세럼",
      concept: hasKeyword('자연') ? "자연 유래 성분으로 만든 순한 세럼으로, 민감한 피부도 안심하고 사용할 수 있습니다. 지속가능한 패키징과 비건 포뮬레이션으로 환경까지 생각한 제품입니다." :
               "첨단 성분과 검증된 효능을 결합한 프리미엄 세럼입니다. 즉각적인 효과와 장기적인 피부 개선을 동시에 제공하여 건강하고 빛나는 피부로 가꿔줍니다.",
      ingredients: hasKeyword('비타민') ? [
        { name: "비타민 C", percentage: "15%", purpose: "브라이트닝 및 항산화" },
        { name: "비타민 E", purpose: "항산화 시너지" },
        { name: "히알루론산", purpose: "집중 보습" },
        { name: "나이아신아마이드", percentage: "3%", purpose: "모공 케어" }
      ] : [
        { name: "히알루론산", percentage: "2%", purpose: "집중 보습" },
        { name: "펩타이드 복합체", purpose: "탄력 증진" },
        { name: "세라마이드", purpose: "피부 장벽 강화" },
        { name: "식물성 스쿠알란", purpose: "부드러운 보습" }
      ],
      design: {
        packaging: hasKeyword('지속') ? "재활용 가능한 글래스 병" : "프리미엄 에어레스 펌프",
        color: hasKeyword('자연') ? "머드 브라운 + 골드 포인트" : "매트 화이트 + 로즈골드",
        size: "30ml",
        style: hasKeyword('미니멀') ? "미니멀 심플" : "모던 럭셔리"
      },
      targetPrice: input.targetCustomer === "10대" ? "28,000원" : 
                   input.targetCustomer === "20대" ? "35,000원" : "48,000원",
      features: hasKeyword('민감') ? ["민감성 피부 적합", "자극 없는 포뮬레이션", "진정 효과", "24시간 보습"] :
                ["즉각적인 수분 공급", "브라이트닝 효과", "안티에이징", "모공 개선"],
      marketingPoints: hasKeyword('자연') ? ["100% 비건 제품", "지속가능한 뷰티", "자연 유래 성분"] :
                       ["K-뷰티 글로우", "임상 테스트 완료", "24시간 지속 효과"]
    },
    '메이크업': {
      productName: hasKeyword('자연') ? "내추럴 글로우 틴트" : 
                   hasKeyword('오래') ? "올데이 픽스 틴트" : "멀티 케어 틴트",
      concept: "바쁜 현대인을 위한 올인원 컬러 제품으로, 입술과 볼에 모두 사용 가능합니다. 보습 성분이 풍부하여 메이크업과 동시에 케어 효과까지 제공하는 스마트한 제품입니다.",
      ingredients: [
        { name: "시어버터", purpose: "깊은 보습과 영양" },
        { name: "호호바 오일", purpose: "부드러운 발림성" },
        { name: "천연 왁스", purpose: "자연스러운 고정력" },
        { name: "비타민 E", purpose: "항산화 및 보호" }
      ],
      design: {
        packaging: "슬림 스틱형 + 투명 캡",
        color: input.targetCustomer === "10대" ? "파스텔 핑크 케이스" : "로즈골드 메탈릭",
        size: "3.5g",
        style: "포터블 시크"
      },
      targetPrice: input.targetCustomer === "10대" ? "12,000원" : "18,000원",
      features: ["멀티 사용 (입술+볼)", "8시간 지속", "보습 효과", "자연 발색"],
      marketingPoints: ["원터치 뷰티", "시간 절약", "자연스러운 혈색"]
    },
    '바디케어': {
      productName: hasKeyword('향수') ? "퍼퓸 바디 로션" : 
                   hasKeyword('민감') ? "센서티브 케어 로션" : "딥 모이스처 바디 크림",
      concept: "전신 피부를 위한 집중 케어 제품으로, 하루 종일 촉촉함을 유지합니다. 빠른 흡수력과 끈적이지 않는 텍스처로 바쁜 일상에서도 편리하게 사용할 수 있습니다.",
      ingredients: [
        { name: "세라마이드 복합체", purpose: "피부 장벽 강화" },
        { name: "판테놀", purpose: "진정 및 보습" },
        { name: "시어버터", purpose: "깊은 영양 공급" },
        { name: "글리세린", purpose: "수분 유지" }
      ],
      design: {
        packaging: "대용량 펌프 디스펜서",
        color: "화이트 + 소프트 블루 포인트",
        size: "400ml",
        style: "패밀리 프렌들리"
      },
      targetPrice: "22,000원",
      features: ["24시간 보습", "빠른 흡수", "끈적임 없음", "전 가족 사용"],
      marketingPoints: ["데일리 필수템", "성분 안전성", "경제적 대용량"]
    }
  };

  return baseResponses[input.productType] || baseResponses['스킨케어'];
};

export default {
  generateCosmetics
};