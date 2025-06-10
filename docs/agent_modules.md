# 화장품 기획 시스템 에이전트 모듈 설계

## 0. 오케스트레이터 에이전트

### 0.1 기능 정의

오케스트레이터 에이전트는 전체 화장품 개발 프로세스를 조율하고 관리하는 메타 에이전트입니다. 사용자의 초기 입력을 분석하여 필요한 리서치 영역을 파악하고, 각 전문 에이전트에게 세부 작업을 할당하며, 중간 결과를 모니터링하고 필요시 추가 조사나 분석을 지시합니다. 최종적으로 각 에이전트의 결과를 종합하여 일관되고 통합된 제품 기획안을 생성합니다.

### 0.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "project_name": "string",
  "initial_brief": {
    "product_category": "string",  // 예: "스킨케어", "메이크업", "헤어케어"
    "target_market": "string",  // 예: "한국", "글로벌", "동남아시아"
    "key_objectives": ["string"],  // 예: ["차별화된 컨셉 개발", "트렌디한 성분 활용"]
    "constraints": ["string"],  // 예: ["저비용", "친환경 패키징 필수"]
    "timeline": "string"  // 예: "6개월 내 출시"
  },
  "depth_level": "number",  // 1-5 척도 (리서치 깊이 수준)
  "focus_areas": ["string"]  // 예: ["성분 트렌드", "패키징 혁신", "타겟 소비자 분석"]
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "orchestration_plan": {
    "research_phases": [
      {
        "phase_name": "string",
        "assigned_agents": ["string"],
        "key_questions": ["string"],
        "expected_outputs": ["string"],
        "estimated_time": "string"
      }
    ],
    "dependencies": [
      {
        "output": "string",
        "dependent_phase": "string",
        "critical_path": "boolean"
      }
    ],
    "decision_points": [
      {
        "checkpoint": "string",
        "evaluation_criteria": ["string"],
        "contingency_plans": ["string"]
      }
    ]
  },
  "research_summary": {
    "market_insights": "string",
    "consumer_insights": "string",
    "competitive_landscape": "string",
    "opportunity_areas": ["string"]
  },
  "strategic_recommendations": {
    "primary_direction": "string",
    "alternative_approaches": ["string"],
    "risk_assessment": "string",
    "success_metrics": ["string"]
  },
  "integration_directives": {
    "consistency_guidelines": "string",
    "cross_reference_map": "object",
    "priority_elements": ["string"]
  },
  "execution_roadmap": {
    "phases": ["string"],
    "key_milestones": ["string"],
    "resource_allocation": "string"
  }
}
```

### 0.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 개발 프로젝트의 오케스트레이터입니다. 복잡한 제품 개발 과정을 효율적으로 조율하고, 
깊이 있는 시장 리서치를 통해 전략적 방향을 수립하는 역할을 합니다. 마치 심층 연구를 수행하는 
연구자처럼 모든 관련 영역을 철저히 조사하고, 다양한 전문 에이전트들의 작업을 조정하여 
일관성 있는 최종 결과물을 만들어내야 합니다.

사용자 프롬프트:
다음 프로젝트 정보를 바탕으로 화장품 개발 오케스트레이션 계획을 수립하고 실행해주세요:
- 프로젝트명: {{project_name}}
- 제품 카테고리: {{product_category}}
- 타겟 시장: {{target_market}}
- 핵심 목표: {{key_objectives}}
- 제약 사항: {{constraints}}
- 일정: {{timeline}}
- 리서치 깊이 수준: {{depth_level}}
- 중점 영역: {{focus_areas}}

다음 내용을 포함한 오케스트레이션 계획을 수립해주세요:
1. 필요한 리서치 영역 및 단계별 계획
2. 각 전문 에이전트 할당 및 질의 내용
3. 주요 의사결정 포인트 및 평가 기준
4. 통합 방법론 및 일관성 확보 전략

리서치를 진행하면서 다음과 같은 접근법을 취해주세요:
1. 초기 넓은 범위 탐색 후 점진적 심화
2. 상충되는 정보 발견 시 추가 검증 실행
3. 불확실한 영역은 다양한 관점에서 접근
4. 시장 트렌드와 소비자 니즈 간 균형 유지
5. 혁신적 기회 영역 지속적 탐색
```

### 0.4 지식 베이스

- 화장품 개발 프로세스 프레임워크
- 프로젝트 관리 방법론 및 도구
- 다양한 리서치 방법론 및 적용 사례
- 의사결정 트리 및 평가 매트릭스
- 화장품 시장 트렌드 데이터베이스
- 통합 품질 관리 기준
- 리스크 관리 및 완화 전략

### 0.5 워크플로우 로직

1. **초기 프로젝트 분석**
   - 사용자 입력 분석 및 필요 리서치 영역 식별
   - 리서치 깊이 수준에 따른 단계별 계획 수립
   - 각 전문 에이전트 역할 정의

2. **적응형 리서치 조율**
   - 전문 에이전트 병렬/순차 실행 계획 수립
   - 중간 결과 검토 및 분석 심화 여부 결정
   - 충돌하는 정보 해결을 위한 추가 조사 지시
   - 지식 격차 자동 감지 및 추가 연구 지시

3. **크로스 레퍼런싱**
   - 각 에이전트 결과 간 일관성 검증
   - 상호보완적 인사이트 식별 및 강화
   - 핵심 주제에 대한 다각적 검증
   - 불일치 해결을 위한 중재 로직 적용

4. **통합 및 최적화**
   - 모든 에이전트 결과의 전략적 통합
   - 시장 기회와 실행 가능성 균형 조율
   - 최종 권장사항 우선순위화
   - 지식 베이스 업데이트 및 학습 피드백 생성

## 1. 제형 분석 에이전트

### 1.1 기능 정의

제형 분석 에이전트는 고객이 선택한 제형(크림, 세럼, 마스크팩 등)에 대한 트렌드 분석과 최적화된 제형 제안을 제공합니다.

### 1.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "formulation_type": "string",  // 예: "크림", "세럼", "마스크팩"
  "preferences": ["string"],  // 예: ["가벼운 텍스처", "보습력 강화"]
  "target_audience": "string",  // 브랜드 컨셉에서 전달받은 타겟 고객층
  "research_focus": "string",   // 오케스트레이터의 지시에 따른 심화 연구 영역
  "market_context": "string"    // 타겟 시장의 특수성 (예: "한국 시장 특화")
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "trend_analysis": {
    "current_trends": [
      {
        "trend_name": "string",
        "description": "string",
        "popularity_score": "number",  // 0-10 척도
        "market_examples": ["string"],
        "regional_variations": {
          "region": "string",
          "adaptation": "string"
        },
        "forecast_trajectory": "string"  // 상승/하강/안정
      }
    ],
    "future_predictions": "string"
  },
  "recommended_formulations": [
    {
      "type": "string",
      "base_composition": "string",
      "texture_description": "string",
      "sensory_characteristics": ["string"],
      "benefits": ["string"],
      "technical_considerations": "string",
      "trend_relevance": "string",
      "suitable_skin_types": ["string"],
      "innovation_potential": "string"
    }
  ],
  "technical_specifications": {
    "viscosity_range": "string",
    "pH_range": "string",
    "stability_considerations": ["string"],
    "packaging_compatibility": ["string"],
    "manufacturing_complexity": "number",  // 1-10 척도
    "scale_up_considerations": "string"
  },
  "competitive_analysis": [
    {
      "brand_name": "string",
      "product_name": "string",
      "formulation_highlights": "string",
      "market_positioning": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "differentiation_opportunities": "string"
    }
  ],
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "market_specific_adaptations": "string",
    "consumer_testing_recommendations": ["string"],
    "additional_research_needed": ["string"]
  }
}
```

### 1.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 제형 분석 전문가입니다. 고객이 선택한 제형과 선호 특성을 바탕으로 최신 트렌드를 분석하고, 최적화된 제형을 제안해야 합니다. 
마치 심층 연구를 수행하는 과학자처럼 다양한 각도에서 제형을 분석하고, 기술적 구현 가능성, 감각적 특성, 적합한 피부 타입, 시장 특수성 등을 
종합적으로 고려하여 전문적인 제형 분석을 제공하세요.

사용자 프롬프트:
다음 정보를 바탕으로 제형 분석을 수행해주세요:
- 제형 타입: {{formulation_type}}
- 선호 특성: {{preferences}}
- 타겟 고객층: {{target_audience}}
- 심화 연구 영역: {{research_focus}}
- 시장 맥락: {{market_context}}

분석에 포함해야 할 내용:
1. 현재 {{formulation_type}} 제형의 전반적 시장 트렌드와 {{market_context}}의 특수성
2. {{preferences}}를 고려한 최적의 제형 구성과 대안 옵션
3. {{target_audience}}에게 적합한 감각적 특성 및 사용감 최적화 방안
4. {{research_focus}}에 대한 심층 분석 및 혁신 기회
5. 주요 경쟁 제품 벤치마킹 및 차별화 전략
6. 기술적 구현 시 고려사항 및 제조 복잡성 평가
7. 제형 안정성 및 호환성에 대한 과학적 분석
8. 추가 연구가 필요한 영역 식별

데이터에 근거한 분석과 실질적인 제안을 제공하되, 불확실성이 있는 부분은 정직하게 표시하고 검증 방법을 제안하세요.
```

### 1.4 지식 베이스

- 제형 타입별 기본 특성 및 구성 요소 데이터베이스
- 최신 제형 트렌드 및 혁신 사례 컬렉션
- 제형-성분 호환성 매트릭스
- 피부 타입별 적합한 제형 가이드라인
- 주요 경쟁사 제품 분석 데이터
- 국가/지역별 제형 선호도 차이 데이터
- 제조 복잡성 및 스케일업 고려사항 가이드
- 제형 안정성 테스트 프로토콜 및 결과 해석 가이드

## 2. 성분 연구 에이전트

### 2.1 기능 정의

성분 연구 에이전트는 주요 성분의 효능을 분석하고, 최신 연구 자료를 기반으로 최적의 성분 조합과 농도를 제안합니다. 깊이 있는 과학적 연구와 규제 분석을 통해 안전하고 효과적인 성분 전략을 수립합니다.

### 2.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "main_ingredients": ["string"],  // 예: ["히알루론산", "나이아신아마이드"]
  "ingredient_preferences": ["string"],  // 예: ["무알콜", "저자극성"]
  "formulation_type": "string",  // 제형 분석에서 전달받은 추천 제형
  "target_benefits": ["string"],  // 예: ["수분공급", "미백"]
  "target_markets": ["string"],   // 판매 예정 국가/지역
  "research_focus": "string",     // 오케스트레이터의 지시에 따른 심화 연구 영역
  "regulatory_requirements": ["string"]  // 특정 인증 요구사항 (예: "비건", "EWG 그린")
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "main_ingredients_analysis": [
    {
      "name": "string",
      "inci_name": "string",
      "benefits": ["string"],
      "mechanism_of_action": "string",
      "optimal_concentration": "string",
      "research_summary": "string",
      "stability_considerations": "string",
      "compatibility_notes": "string",
      "scientific_evidence_level": "string",  // "강함", "중간", "제한적"
      "sourcing_options": ["string"],
      "sustainability_profile": "string",
      "cost_implications": "string",
      "regional_regulatory_status": [
        {
          "region": "string",
          "status": "string",
          "restrictions": "string"
        }
      ]
    }
  ],
  "supporting_ingredients": [
    {
      "name": "string",
      "inci_name": "string",
      "purpose": "string",  // 예: "보존제", "pH 조절제", "점도 조절제"
      "recommended_concentration": "string",
      "synergy_with_main": "string",
      "justification": "string",
      "alternatives": ["string"]
    }
  ],
  "ingredient_combinations": [
    {
      "combination_name": "string",
      "ingredients": ["string"],
      "synergistic_effects": "string",
      "scientific_backing": "string",
      "formulation_challenges": "string",
      "cost_efficiency_ratio": "number"
    }
  ],
  "trend_alignment": {
    "current_trends": ["string"],
    "innovative_aspect": "string",
    "market_differentiation": "string",
    "future_trajectory": "string"
  },
  "safety_profile": {
    "potential_irritants": ["string"],
    "allergen_considerations": "string",
    "sensitive_skin_suitability": "string",
    "long_term_safety_data": "string",
    "toxicological_assessment": "string"
  },
  "regulatory_compliance": {
    "certification_pathways": ["string"],
    "prohibited_substances_avoided": "boolean",
    "required_documentation": ["string"],
    "testing_requirements": ["string"],
    "market_specific_requirements": [
      {
        "market": "string",
        "requirements": ["string"],
        "compliance_status": "string"
      }
    ]
  },
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "emerging_research": "string",
    "clinical_efficacy": "string",
    "further_research_recommendations": ["string"]
  }
}
```

### 2.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 성분 연구 전문가입니다. 주요 성분과 보조 성분의 효능, 안전성, 규제 상태, 지속가능성 등을
과학적 근거를 바탕으로 철저히 분석해야 합니다. 마치 학술 연구를 수행하는 과학자처럼 깊이 있는 조사와
비판적 평가를 통해 근거 기반의 성분 전략을 제시하세요.

사용자 프롬프트:
다음 정보를 바탕으로 성분 분석 및 제안을 수행해주세요:
- 주요 성분: {{main_ingredients}}
- 성분 선호도: {{ingredient_preferences}}
- 제형 타입: {{formulation_type}}
- 목표 효능: {{target_benefits}}
- 타겟 시장: {{target_markets}}
- 심화 연구 영역: {{research_focus}}
- 규제 요구사항: {{regulatory_requirements}}

분석에 포함해야 할 내용:
1. 각 주요 성분의 상세 효능, 작용 메커니즘 및 과학적 근거 수준
2. {{formulation_type}}에 적합한 최적 농도 범위 및 안정성 고려사항
3. {{main_ingredients}}와 시너지 효과를 발휘할 보조 성분 제안
4. {{target_markets}}의 규제 환경을 고려한 성분 선택 및 문서화 요구사항
5. {{regulatory_requirements}}를 충족하기 위한 인증 경로 및 필요 조치
6. {{research_focus}}에 대한 심화 분석 및 혁신 기회
7. 성분 조합의 비용 효율성 및 소싱 전략
8. 안전성 프로필 및 알레르기 고려사항 상세 분석

모든 주장은 과학적 연구나 신뢰할 수 있는 출처를 기반으로 해야 하며, 불확실한 영역은 명확히 표시하고
추가 연구나 테스트 방안을 제시하세요.
```

### 2.4 지식 베이스

- 화장품 원료 INCI 데이터베이스
- 성분별 효능 및 작용 메커니즘 연구 자료
- 성분 간 호환성 및 시너지 매트릭스
- 국가/지역별 화장품 규제 데이터베이스
- EWG, COSMOS, ECOCERT 등 인증 기준 및 프로세스
- 임상 연구 결과 데이터베이스
- 성분 안전성 및 독성 데이터
- 지속가능 소싱 및 윤리적 고려사항 가이드
- 알레르기 유발 성분 및 민감성 데이터베이스

## 3. 브랜드 컨설팅 에이전트

### 3.1 기능 정의

브랜드 컨설팅 에이전트는 고객이 제시한 컨셉을 바탕으로 브랜드 아이덴티티 요소를 개발하고, 차별화된 브랜딩 전략을 제안합니다. 시장 분석과 소비자 인사이트를 통해 독특하고 공감을 불러일으키는 브랜드 스토리를 구축합니다.

### 3.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "concept_keywords": ["string"],  // 예: ["미니멀", "자연주의", "고급스러움"]
  "target_audience": "string",  // 예: "30대 도시 직장인 여성"
  "mood": "string",  // 예: "편안하고 세련된"
  "market_positioning": "string",  // 예: "프리미엄", "매스티지"
  "competitors": ["string"],  // 주요 경쟁 브랜드 목록
  "research_focus": "string",  // 오케스트레이터의 지시에 따른 심화 연구 영역
  "cultural_context": "string"  // 타겟 시장의 문화적 배경
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "brand_identity": {
    "brand_names": [
      {
        "name": "string",
        "rationale": "string",
        "uniqueness_score": "number",  // 0-10 척도
        "cultural_relevance": "string",
        "linguistic_analysis": "string",
        "trademark_potential": "string"
      }
    ],
    "slogans": [
      {
        "text": "string",
        "rationale": "string",
        "emotional_appeal": "string"
      }
    ],
    "brand_story": "string",
    "brand_values": ["string"],
    "brand_essence": "string",  // 브랜드의 핵심 아이덴티티 한 문장
    "brand_personality_traits": ["string"],
    "target_audience_personas": [
      {
        "name": "string",
        "age": "string",
        "occupation": "string",
        "demographics": "string",
        "psychographics": "string",
        "pain_points": ["string"],
        "aspirations": ["string"],
        "purchasing_behavior": "string",
        "day_in_the_life": "string",
        "decision_drivers": ["string"]
      }
    ]
  },
  "verbal_identity": {
    "tone_of_voice": "string",
    "key_messaging": ["string"],
    "language_style_guide": "string",
    "terminology_preferences": ["string"],
    "storytelling_approach": "string"
  },
  "brand_positioning": {
    "value_proposition": "string",
    "differentiation_points": ["string"],
    "competitive_landscape": [
      {
        "competitor": "string",
        "positioning": "string",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities_vs_competitor": ["string"]
      }
    ],
    "positioning_statement": "string",
    "perceptual_mapping": {
      "axes": ["string", "string"],
      "position_description": "string"
    }
  },
  "brand_experience": {
    "customer_journey_touchpoints": ["string"],
    "emotional_connections": ["string"],
    "sensory_branding_elements": ["string"],
    "signature_elements": ["string"],
    "brand_rituals": ["string"]
  },
  "brand_growth_strategy": {
    "brand_architecture": "string",
    "line_extension_potential": ["string"],
    "brand_evolution_roadmap": "string",
    "equity_building_tactics": ["string"]
  },
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "cultural_adaptations": "string",
    "consumer_sentiment_analysis": "string",
    "trend_alignment_assessment": "string"
  }
}
```

### 3.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 브랜드 전략 전문 컨설턴트입니다. 고객이 제시한 컨셉 키워드와 타겟 고객층을 바탕으로 
차별화된 브랜드 아이덴티티를 개발해야 합니다. 마치 심층적인 브랜드 리서치 프로젝트를 수행하는
전략가처럼 시장과 소비자 인사이트에 기반한 독특하고 공감을 불러일으키는 브랜드 전략을 제안하세요.

사용자 프롬프트:
다음 정보를 바탕으로 브랜드 컨설팅을 제공해주세요:
- 컨셉 키워드: {{concept_keywords}}
- 타겟 고객층: {{target_audience}}
- 분위기: {{mood}}
- 시장 포지셔닝: {{market_positioning}}
- 주요 경쟁사: {{competitors}}
- 심화 연구 영역: {{research_focus}}
- 문화적 맥락: {{cultural_context}}

컨설팅에 포함해야 할 내용:
1. 5개 이상의 브랜드명 후보와 각각의 문화적/언어적 적합성 분석
2. {{target_audience}}의 상세 페르소나 개발 (2-3개 이상)
3. {{concept_keywords}}와 {{mood}}를 반영한 차별화된 브랜드 스토리
4. {{competitors}}와의 명확한 차별화 전략 및 포지셔닝 맵
5. {{market_positioning}}에 부합하는 브랜드 가치와 개성 정의
6. {{cultural_context}}를 고려한 브랜드 경험 및 터치포인트 설계
7. {{research_focus}}에 대한 심층 분석 및 전략적 시사점
8. 브랜드 성장 로드맵 및 확장 가능성 제시

소비자 심리와 시장 동향에 대한 깊은 이해를 바탕으로 분석하되, 창의성과 차별성을 중시하세요.
모든 제안은 실행 가능성과 시장 적합성을 균형 있게 고려해야 합니다.
```

### 3.4 지식 베이스

- 화장품 브랜드 네이밍 트렌드 및 사례 분석
- 소비자 심리학 및 구매 의사결정 모델
- 국가별 문화적 선호도 및 금기사항 데이터
- 브랜드 아이덴티티 구성 요소 템플릿
- 경쟁사 브랜딩 분석 데이터베이스
- 성공적인 브랜드 스토리텔링 사례 컬렉션
- 포지셔닝 전략 및 방법론 가이드
- 브랜드 확장 및 성장 전략 프레임워크
- 소비자 페르소나 개발 도구 및 방법론

## 4. 제품명 기획 에이전트

### 4.1 기능 정의

제품명 기획 에이전트는 브랜드 컨셉과 제품 특성을 고려하여 기억하기 쉽고 마케팅에 효과적인 제품명을 제안합니다. 언어학적 분석과 시장 적합성 검토를 통해 문화적으로도 적절한 제품명을 개발합니다.

### 4.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "brand_name": "string",  // 브랜드 컨설팅에서 선택된 브랜드명
  "concept_keywords": ["string"],
  "main_ingredients": ["string"],
  "formulation_type": "string",
  "target_benefits": ["string"],
  "target_audience": "string",
  "target_markets": ["string"],  // 판매 예정 국가/지역
  "research_focus": "string",   // 오케스트레이터의 지시에 따른 심화 연구 영역
  "competitor_products": ["string"]  // 유사 경쟁 제품명
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "product_names": [
    {
      "name": "string",
      "full_name_with_description": "string",  // 예: "아쿠아 플럼프 하이드레이팅 세럼"
      "rationale": "string",
      "keyword_alignment": "string",
      "memorability_score": "number",  // 0-10 척도
      "marketability": "string",
      "cultural_considerations": [
        {
          "market": "string",
          "appropriateness": "string",
          "potential_issues": "string"
        }
      ],
      "trademark_status": "string",  // "가능", "요검토", "충돌 가능성"
      "pronunciation_guide": "string",
      "name_architecture": {
        "prefix": "string",
        "main_element": "string",
        "suffix": "string",
        "description": "string"
      }
    }
  ],
  "naming_strategy": {
    "approach": "string",  // 예: "감각적", "기능적", "감성적"
    "language_considerations": "string",
    "cultural_relevance": "string",
    "multilingual_adaptability": "string"
  },
  "descriptive_elements": {
    "recommended_descriptors": ["string"],
    "benefit_statements": ["string"],
    "taglines": ["string"],
    "callout_phrases": ["string"]
  },
  "market_differentiation": {
    "competitive_analysis": [
      {
        "competitor_name": "string",
        "product_name": "string",
        "name_type": "string",
        "differentiation_score": "number"
      }
    ],
    "naming_landscape_map": "string",
    "uniqueness_factors": "string",
    "ownable_territory": "string"
  },
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "linguistic_analysis": "string",
    "consumer_reception_prediction": "string",
    "search_optimization_potential": "string"
  }
}
```

### 4.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 제품명 개발 전문가입니다. 브랜드명과 제품 특성을 고려하여 매력적이고 기억하기 쉬운 제품명을 
개발해야 합니다. 언어학자의 깊이와 마케팅 전략가의 통찰력을 결합하여, 다양한 문화와 언어적 맥락에서도 
효과적으로 작동하는 제품명을 개발하세요.

사용자 프롬프트:
다음 정보를 바탕으로 제품명을 개발해주세요:
- 브랜드명: {{brand_name}}
- 컨셉 키워드: {{concept_keywords}}
- 주요 성분: {{main_ingredients}}
- 제형 타입: {{formulation_type}}
- 핵심 효능: {{target_benefits}}
- 타겟 고객층: {{target_audience}}
- 타겟 시장: {{target_markets}}
- 심화 연구 영역: {{research_focus}}
- 경쟁 제품: {{competitor_products}}

제안에 포함해야 할 내용:
1. 7개 이상의 제품명 옵션과 각 옵션별 완전한 제품명 표기안
2. 각 제품명에 대한 언어학적 분석 (발음 용이성, 의미 연상, 기억성)
3. 각 타겟 시장별 문화적 적합성 및 잠재적 문제점
4. 경쟁 제품과의 차별화 전략 및 네이밍 맵
5. {{research_focus}}에 대한 심층 분석 결과를 반영한 제안
6. 상표권 관점에서의 초기 평가
7. 제품명 구조 분석 및 시스템화 방안
8. 마케팅 커뮤니케이션에 활용 가능한 관련 설명구와 태그라인

각 제품명은 {{brand_name}}과 자연스럽게 어울리고, {{concept_keywords}}의 핵심을 표현하며,
{{target_benefits}}을 암시할 수 있어야 합니다. 독창성과 실용성의 균형을 고려하세요.
```

### 4.4 지식 베이스

- 화장품 카테고리별 네이밍 트렌드 데이터
- 효과적인 제품명 구성 요소 분석
- 국가/언어별 네이밍 선호도 데이터
- 언어학적 분석 도구 및 방법론
- 상표권 데이터베이스 및 검색 방법
- 국제적 네이밍 실패 사례 및 교훈
- 네이밍 시스템 구축 프레임워크
- 심리언어학 연구 결과 및 적용 사례

## 5. 디자인 제안 에이전트

### 5.1 기능 정의

디자인 제안 에이전트는 브랜드 컨셉과 패키지 타입을 바탕으로 시각적 무드보드를 생성하고, 패키지 디자인 방향을 제안합니다. 실질적인 제조 가능성과 브랜드 일관성을 고려한 차별화된 디자인을 개발합니다.

### 5.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "brand_name": "string",
  "concept_keywords": ["string"],
  "package_type": "string",  // 예: "튜브", "펌프", "앰플"
  "material_preference": ["string"],
  "target_audience": "string",
  "brand_mood": "string",
  "formulation_type": "string",
  "competitive_landscape": ["string"],  // 경쟁 제품 디자인 참고사항
  "research_focus": "string",  // 오케스트레이터의 지시에 따른 심화 연구 영역
  "sustainability_requirements": "string"  // 지속가능성 요구사항
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "mood_board": {
    "color_palette": [
      {
        "hex_code": "string",
        "color_name": "string",
        "usage": "string",  // 예: "주요 색상", "강조 색상"
        "psychological_effect": "string",
        "trend_alignment": "string",
        "seasonal_relevance": "string"
      }
    ],
    "typography": {
      "primary_font": {
        "font_family": "string",
        "style_description": "string",
        "usage_guidance": "string"
      },
      "secondary_font": {
        "font_family": "string",
        "style_description": "string",
        "usage_guidance": "string"
      },
      "hierarchy_guidelines": "string"
    },
    "texture_keywords": ["string"],
    "visual_references": ["string"],  // 이미지 URL 또는 설명
    "mood_description": "string",
    "style_elements": ["string"],
    "inspirational_sources": ["string"]
  },
  "package_design": {
    "primary_packaging": {
      "concept_description": "string",
      "form_factor": "string",
      "material_recommendation": "string",
      "finish_type": "string",  // 예: "매트", "글로시"
      "decoration_techniques": ["string"],  // 예: "호일 스탬핑", "인몰드 라벨"
      "closure_system": "string",
      "functional_features": ["string"],
      "tactile_elements": "string"
    },
    "label_design": {
      "layout_concept": "string",
      "key_visual_elements": ["string"],
      "information_hierarchy": "string",
      "iconography_system": "string",
      "typographic_treatment": "string"
    },
    "secondary_packaging": {
      "type": "string",  // 예: "박스", "파우치"
      "design_concept": "string",
      "unboxing_experience": "string",
      "structural_features": "string",
      "additional_elements": ["string"]
    }
  },
  "design_variations": [
    {
      "variation_name": "string",
      "description": "string",
      "key_differences": "string",
      "target_scenario": "string"
    }
  ],
  "design_rationale": {
    "concept_alignment": "string",
    "target_audience_appeal": "string",
    "differentiation_strategy": "string",
    "brand_consistency_elements": "string",
    "psychological_triggers": ["string"]
  },
  "technical_considerations": {
    "production_notes": "string",
    "cost_implications": "string",
    "sustainability_aspects": {
      "materials_impact": "string",
      "end_of_life_considerations": "string",
      "certifications_potential": ["string"]
    },
    "manufacturing_complexity": "string",
    "supply_chain_implications": "string",
    "scalability_assessment": "string"
  },
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "consumer_testing_recommendations": "string",
    "design_trend_analysis": "string",
    "category_conventions_assessment": "string",
    "innovation_opportunities": ["string"]
  }
}
```

### 5.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 패키지 디자인 전문가입니다. 브랜드 컨셉과 제품 특성을 바탕으로 차별화된 디자인 방향과
시각적 아이덴티티를 개발해야 합니다. 마치 디자인 리서치 프로젝트를 수행하는 전문가처럼 트렌드 분석,
소비자 심리, 기술적 실현 가능성, 지속가능성 등 다양한 측면을 고려한 종합적인 디자인 솔루션을 제안하세요.

사용자 프롬프트:
다음 정보를 바탕으로 디자인 제안을 수행해주세요:
- 브랜드명: {{brand_name}}
- 컨셉 키워드: {{concept_keywords}}
- 패키지 타입: {{package_type}}
- 소재 선호도: {{material_preference}}
- 타겟 고객층: {{target_audience}}
- 브랜드 분위기: {{brand_mood}}
- 제형 타입: {{formulation_type}}
- 경쟁 제품 현황: {{competitive_landscape}}
- 심화 연구 영역: {{research_focus}}
- 지속가능성 요구사항: {{sustainability_requirements}}

제안에 포함해야 할 내용:
1. 브랜드 컨셉에 부합하는 상세 컬러 팔레트와 심리적 효과 분석
2. 타이포그래피 시스템 및 계층 구조 가이드라인
3. {{package_type}}에 적합한 다양한 디자인 방향과 변형 옵션
4. 1차 및 2차 패키징 구조와 소재에 대한 상세 제안
5. {{target_audience}}의 감성을 자극할 시각적/촉각적 요소
6. {{competitive_landscape}}와 차별화되는 디자인 전략
7. {{sustainability_requirements}}를 충족하는 친환경 솔루션
8. {{research_focus}}에 대한 심층 분석 결과를 반영한 혁신적 요소
9. 제조 복잡성, 비용 영향, 스케일러빌리티 등 기술적 고려사항

디자인 철학과 실용성의 균형을 유지하면서, 시장에서 눈에 띄고 브랜드 가치를 효과적으로
전달할 수 있는 차별화된 솔루션을 제안하세요.
```

### 5.4 지식 베이스

- 패키지 타입별 디자인 사례 및 트렌드 분석
- 컬러 심리학 및 타겟 고객별 선호 컬러 데이터
- 소재별 특성, 지속가능성 프로필 및 적합한 사용 사례
- 타이포그래피 시스템 및 브랜드 일관성 가이드라인
- 패키징 제조 기술 및 장식 기법 데이터베이스
- 지속가능한 패키지 디자인 솔루션 및 인증 정보
- 언패키징 경험 및 소비자 상호작용 디자인 원칙
- 패키지 디자인 심리학 및 소비자 행동 연구 결과
- 국가/지역별 디자인 선호도 및 문화적 고려사항

## 6. 시장 분석 에이전트

### 6.1 기능 정의

시장 분석 에이전트는 타겟 시장의 규모, 경쟁 환경, 소비자 트렌드, 유통 채널 등을 심층적으로 분석하여 제품의 시장 기회와 최적의 포지셔닝 전략을 도출합니다. 데이터 기반의 접근으로 비즈니스 성공 가능성을 평가하고, 오케스트레이터의 지시에 따라 특정 시장 세그먼트에 대한 깊이 있는 분석을 수행합니다.

### 6.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "product_category": "string",  // 예: "스킨케어", "메이크업"
  "target_markets": ["string"],  // 국가/지역 목록
  "target_audience": "string",
  "price_positioning": "string",  // 예: "대중적", "프리미엄"
  "brand_concept": "string",
  "unique_selling_points": ["string"],
  "research_focus": "string",  // 오케스트레이터의 지시에 따른 심화 연구 영역
  "distribution_channels": ["string"]  // 예상 유통 채널
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "market_overview": {
    "global_market_size": {
      "current_value": "string",
      "growth_rate": "string",
      "forecast": "string"
    },
    "regional_analysis": [
      {
        "region": "string",
        "market_size": "string",
        "growth_rate": "string",
        "market_maturity": "string",
        "key_trends": ["string"],
        "entry_barriers": ["string"]
      }
    ],
    "category_performance": "string",
    "seasonality_factors": "string",
    "macroeconomic_influences": "string"
  },
  "competitive_landscape": {
    "key_players": [
      {
        "company_name": "string",
        "market_share": "string",
        "product_offerings": ["string"],
        "positioning": "string",
        "pricing_strategy": "string",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "recent_moves": "string"
      }
    ],
    "market_concentration": "string",
    "competitive_intensity": "string",
    "white_space_opportunities": ["string"],
    "threat_of_new_entrants": "string",
    "substitute_products": ["string"]
  },
  "consumer_insights": {
    "purchase_drivers": ["string"],
    "usage_patterns": "string",
    "unmet_needs": ["string"],
    "purchase_journey": "string",
    "loyalty_factors": ["string"],
    "price_sensitivity": "string",
    "generational_differences": "string",
    "emerging_consumer_segments": ["string"]
  },
  "channel_strategy": {
    "channel_assessment": [
      {
        "channel": "string",
        "market_penetration": "string",
        "growth_trend": "string",
        "consumer_profile": "string",
        "margin_structure": "string",
        "operational_requirements": "string"
      }
    ],
    "optimal_channel_mix": "string",
    "digital_presence_strategy": "string",
    "retail_partnership_opportunities": ["string"],
    "direct_to_consumer_potential": "string"
  },
  "pricing_analysis": {
    "competitive_price_benchmarking": "string",
    "price_elasticity_estimate": "string",
    "optimal_price_range": "string",
    "pricing_strategy_recommendations": "string",
    "promotion_strategy": "string"
  },
  "market_entry_strategy": {
    "recommended_approach": "string",
    "phasing_plan": "string",
    "key_success_factors": ["string"],
    "risk_mitigation_plan": "string",
    "resource_requirements": "string"
  },
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "data_limitations": "string",
    "further_research_recommendations": ["string"],
    "alternative_scenario_analysis": "string"
  }
}
```

### 6.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 산업 시장 분석 전문가입니다. 타겟 시장의 규모, 경쟁 환경, 소비자 행동, 
유통 채널 등을 철저히 분석하여 데이터에 기반한 시장 진입 전략을 수립해야 합니다.
마치 시장 조사 기관의 선임 애널리스트처럼 다양한 데이터 소스를 활용하여 심층적인
인사이트를 도출하고, 실행 가능한 비즈니스 전략을 제안하세요.

사용자 프롬프트:
다음 정보를 바탕으로 시장 분석을 수행해주세요:
- 제품 카테고리: {{product_category}}
- 타겟 시장: {{target_markets}}
- 타겟 고객층: {{target_audience}}
- 가격 포지셔닝: {{price_positioning}}
- 브랜드 컨셉: {{brand_concept}}
- 차별화 요소: {{unique_selling_points}}
- 심화 연구 영역: {{research_focus}}
- 유통 채널: {{distribution_channels}}

분석에 포함해야 할 내용:
1. {{product_category}}의 글로벌 및 {{target_markets}} 시장 현황 및 전망
2. 각 {{target_markets}}별 소비자 특성 및 구매 동인 분석
3. {{price_positioning}}에 부합하는 가격 전략 및 벤치마킹
4. {{unique_selling_points}}를 기반으로 한 경쟁 차별화 기회
5. {{target_audience}}의 구매 여정 및 결정 요인 심층 분석
6. {{distribution_channels}}별 진입 전략 및 최적 채널 믹스
7. {{research_focus}}에 대한 심층 데이터 분석 및 전략적 시사점
8. 리스크 요인 식별 및 대응 방안

모든 분석은 최신 산업 데이터와 소비자 트렌드를 반영해야 하며, 주장에 대한 근거를
명확히 제시하세요. 불확실한 영역은 명시하고 추가 연구 방향을 제안하세요.
```

### 6.4 지식 베이스

- 글로벌 및 지역별 화장품 시장 규모 및 성장률 데이터
- 국가별 화장품 소비 행태 및 선호도 연구
- 경쟁사 분석 및 포지셔닝 맵
- 화장품 유통 채널 트렌드 및 마진 구조
- 가격 탄력성 및 최적 가격 전략 모델
- 소비자 구매 의사결정 프로세스 연구
- 디지털 마케팅 효과성 및 ROI 데이터
- 신제품 출시 성공/실패 사례 분석
- 시장 진입 전략 프레임워크 및 베스트 프랙티스

## 7. 제조 가이드 에이전트

### 7.1 기능 정의

제조 가이드 에이전트는 제품의 실제 생산과 관련된 모든 측면을 분석하고 최적의 제조 전략, 비용 구조, 품질 관리 방안, 제조사 추천 등 실행 가능한 제조 로드맵을 제공합니다. 오케스트레이터의 지시에 따라 특정 제조 접근법에 대한 심층적인 분석을 수행하고, 품질 및 비용 효율성을 최적화하기 위한 제안을 제공합니다.

### 7.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "formulation_type": "string",
  "ingredient_list": ["string"],
  "packaging_specifications": "object",  // 디자인 에이전트의 패키징 제안
  "production_volume": "string",  // 예상 생산량
  "budget_constraints": "string",
  "timeline_requirements": "string",
  "quality_standards": ["string"],  // 예: "CGMP", "ISO 22716"
  "certification_needs": ["string"],  // 예: "유기농", "비건"
  "research_focus": "string"  // 오케스트레이터의 지시에 따른 심화 연구 영역
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "manufacturing_strategy": {
    "recommended_approach": "string",  // 예: "ODM", "OEM", "자체 제조"
    "rationale": "string",
    "alternative_approaches": ["string"],
    "advantages_disadvantages": "string"
  },
  "manufacturer_recommendations": [
    {
      "type": "string",  // 예: "ODM", "OEM"
      "geographic_regions": ["string"],
      "specialization": "string",
      "capacity_range": "string",
      "quality_certifications": ["string"],
      "typical_lead_times": "string",
      "estimated_price_range": "string",
      "selection_criteria": "string"
    }
  ],
  "production_planning": {
    "estimated_timeline": {
      "development_phase": "string",
      "stability_testing": "string",
      "pilot_production": "string",
      "full_scale_production": "string",
      "total_lead_time": "string"
    },
    "minimum_order_quantities": "string",
    "scale_up_considerations": "string",
    "seasonal_planning_factors": "string"
  },
  "cost_structure": {
    "ingredient_costs": "string",
    "packaging_costs": "string",
    "manufacturing_costs": "string",
    "testing_costs": "string",
    "certification_costs": "string",
    "logistics_costs": "string",
    "estimated_unit_cost": "string",
    "cost_optimization_opportunities": ["string"]
  },
  "quality_assurance": {
    "critical_quality_attributes": ["string"],
    "recommended_testing": ["string"],
    "quality_control_checkpoints": ["string"],
    "stability_testing_protocol": "string",
    "documentation_requirements": ["string"]
  },
  "regulatory_compliance": {
    "manufacturing_compliance_requirements": ["string"],
    "documentation_needs": ["string"],
    "testing_requirements": "string",
    "certification_process": "string"
  },
  "supply_chain_considerations": {
    "raw_material_sourcing": "string",
    "packaging_component_sourcing": "string",
    "logistics_planning": "string",
    "inventory_management": "string",
    "contingency_planning": "string"
  },
  "research_findings": {
    "focus_area_insights": "string",  // 심화 연구 결과
    "manufacturing_innovations": "string",
    "technology_adoption_opportunities": "string",
    "sustainability_improvements": "string"
  }
}
```

### 7.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 제조 및 생산 전문가입니다. 제품 개발부터 상업적 생산까지 전체 제조 프로세스를 
계획하고 최적화해야 합니다. 마치 제조 컨설턴트가 심층적인 생산 타당성 조사를 수행하듯이
품질, 비용, 시간, 규제 요건 등 다양한 요소를 종합적으로 고려하여 실행 가능한 제조 전략을 제안하세요.

사용자 프롬프트:
다음 정보를 바탕으로 제조 가이드를 개발해주세요:
- 제형 타입: {{formulation_type}}
- 성분 목록: {{ingredient_list}}
- 패키징 사양: {{packaging_specifications}}
- 예상 생산량: {{production_volume}}
- 예산 제약: {{budget_constraints}}
- 일정 요건: {{timeline_requirements}}
- 품질 기준: {{quality_standards}}
- 인증 필요사항: {{certification_needs}}
- 심화 연구 영역: {{research_focus}}

제조 가이드에 포함해야 할 내용:
1. {{formulation_type}}에 적합한 제조 접근법 제안 (ODM, OEM, 자체 제조 등)
2. {{production_volume}}에 최적화된 생산 계획 및 일정
3. {{ingredient_list}}와 {{packaging_specifications}}에 기반한 비용 구조 분석
4. {{quality_standards}}를 충족하기 위한 품질 관리 계획
5. {{certification_needs}}를 위한 규제 준수 전략
6. {{budget_constraints}}를 고려한 비용 최적화 기회
7. 추천 제조업체 유형 및 선정 기준
8. {{research_focus}}에 대한 심층 분석 및 혁신 기회

실질적이고 실행 가능한 권장사항을 제공하되, 모든 제안에는 예상되는 장단점을 명확히 
제시하세요. 또한 현실적인 타임라인과 리스크 관리 방안을 포함해야 합니다.
```

### 7.4 지식 베이스

- 글로벌 화장품 제조업체 데이터베이스 (유형, 지역, 전문성 등)
- 화장품 제형별 제조 프로세스 및 장비 요건
- 제조 비용 구조 및 견적 모델
- 품질 관리 표준 및 테스트 프로토콜
- CGMP 및 ISO 22716 등 품질 기준 요구사항
- 규제 인증 프로세스 및 요구 문서
- 원재료 및 패키징 소싱 데이터베이스
- 생산 일정 계획 및 최적화 도구
- 제조업체 평가 및 선정 기준
- 지속가능한 제조 관행 및 기술 혁신 동향

## 8. 통합 레포트 에이전트

### 8.1 기능 정의

통합 레포트 에이전트는 모든 전문 에이전트의 결과물을 종합하여 일관성 있는 최종 제품 개발 기획 레포트와 프레젠테이션을 생성합니다. 오케스트레이터의 지시에 따라 전략적 중요도에 따른 우선순위화와 균형 잡힌 최종 권고안을 제시합니다. 또한 각 에이전트 결과에 대한 품질 평가를 수행하고, 모순되거나 불완전한 정보를 식별하여 조정합니다. 시스템 성능을 개선하기 위한 피드백을 생성하여 지식 베이스 업데이트에 기여합니다.

### 8.2 입력 및 출력 데이터

**입력 데이터:**
```json
{
  "project_id": "string",
  "project_name": "string",
  "orchestration_directives": {
    "strategic_priorities": ["string"],
    "key_decision_points": ["string"],
    "integration_focus": "string"
  },
  "formulation_analysis": { /* 제형 분석 결과 */ },
  "ingredient_analysis": { /* 성분 분석 결과 */ },
  "brand_consulting": { /* 브랜드 컨설팅 결과 */ },
  "product_naming": { /* 제품명 기획 결과 */ },
  "design_proposal": { /* 디자인 제안 결과 */ },
  "market_analysis": { /* 시장 분석 결과 */ },
  "manufacturing_guide": { /* 제조 가이드 결과 */ }
}
```

**출력 데이터:**
```json
{
  "project_id": "string",
  "project_name": "string",
  "executive_summary": {
    "product_concept": "string",
    "key_differentiators": ["string"],
    "target_market": "string",
    "value_proposition": "string",
    "business_opportunity": "string",
    "strategic_fit": "string"
  },
  "product_specification": {
    "product_name": "string",
    "formulation_type": "string",
    "key_ingredients": ["string"],
    "claims": ["string"],
    "packaging_description": "string",
    "usp_statement": "string",
    "product_positioning": "string"
  },
  "product_development_strategy": {
    "brand_identity_summary": {
      "name": "string",
      "values": ["string"],
      "voice": "string",
      "personality": "string"
    },
    "formulation_strategy": {
      "core_approach": "string",
      "ingredient_synergies": "string",
      "technical_innovations": "string"
    },
    "design_strategy": {
      "visual_identity": "string",
      "packaging_system": "string",
      "consumer_experience": "string"
    }
  },
  "market_strategy": {
    "market_opportunity_assessment": "string",
    "competitive_advantage": "string",
    "target_audience_insights": "string",
    "pricing_strategy": "string",
    "channel_strategy": "string",
    "geographic_expansion_plan": "string",
    "market_risks_and_mitigations": "string"
  },
  "implementation_plan": {
    "development_timeline": {
      "phases": [
        {
          "phase_name": "string",
          "duration": "string",
          "key_activities": ["string"],
          "deliverables": ["string"],
          "dependencies": ["string"]
        }
      ],
      "critical_path": "string",
      "total_time_to_market": "string"
    },
    "resource_requirements": {
      "expertise_needed": ["string"],
      "technology_requirements": ["string"],
      "partner_relationships": ["string"]
    },
    "budget_overview": {
      "development_costs": "string",
      "manufacturing_costs": "string",
      "marketing_investment": "string",
      "total_investment": "string",
      "roi_projection": "string"
    }
  },
  "risk_assessment": {
    "development_risks": ["string"],
    "market_risks": ["string"],
    "operational_risks": ["string"],
    "financial_risks": ["string"],
    "mitigation_strategies": "string",
    "contingency_plans": "string"
  },
  "success_metrics": {
    "kpis": ["string"],
    "measurement_methodology": "string",
    "benchmark_targets": "string",
    "evaluation_timeline": "string"
  },
  "strategic_recommendations": {
    "priority_actions": ["string"],
    "critical_success_factors": ["string"],
    "long_term_vision": "string",
    "innovation_roadmap": "string"
  },
  "appendices": {
    "detailed_research_findings": "string",
    "technical_specifications": "string",
    "regulatory_documentation": "string",
    "market_data": "string"
  },
  "presentation_structure": [
    {
      "section_title": "string",
      "slides": [
        {
          "slide_title": "string",
          "slide_content": "string",
          "key_visuals": "string",
          "speaking_notes": "string"
        }
      ]
    }
  ]
}
```

### 8.3 프롬프트 설계

```
시스템 프롬프트:
당신은 화장품 제품 개발 전략 통합 전문가입니다. 다양한 전문 영역의 분석 결과를 종합하여
전략적으로 일관된 최종 제품 개발 기획을 완성해야 합니다. 마치 컨설팅 프로젝트의 최종 보고서를
작성하는 수석 컨설턴트처럼 모든 정보를 비판적으로 평가하고, 핵심 인사이트를 추출하여
실행 가능한 통합 전략을 개발하세요.

사용자 프롬프트:
다음 전문 에이전트의 분석 결과와 오케스트레이션 지시사항을 바탕으로 통합 개발 기획 레포트를 작성해주세요:
- 오케스트레이션 지시사항: {{orchestration_directives}}
- 제형 분석: {{formulation_analysis}}
- 성분 분석: {{ingredient_analysis}}
- 브랜드 컨설팅: {{brand_consulting}}
- 제품명 기획: {{product_naming}}
- 디자인 제안: {{design_proposal}}
- 시장 분석: {{market_analysis}}
- 제조 가이드: {{manufacturing_guide}}

통합 레포트에 포함해야 할 내용:
1. 경영진을 위한 요약 (핵심 컨셉, 차별화 요소, 비즈니스 기회)
2. {{orchestration_directives.strategic_priorities}}를 반영한 제품 명세 및 포지셔닝
3. {{orchestration_directives.key_decision_points}}에 대한 명확한 권고안
4. 브랜드, 제형, 성분, 디자인 전략의 통합적 접근법
5. 시장 기회 평가 및 경쟁 우위 요소
6. 상세 구현 계획 (타임라인, 리소스, 예산)
7. 위험 평가 및 대응 전략
8. 성공 지표 및 평가 방법론
9. {{orchestration_directives.integration_focus}}에 중점을 둔 전략적 권장사항
10. 효과적인 프레젠테이션 구조 및 스토리텔링 접근법

각 전문 분야의 핵심 인사이트를 추출하되, 상충되는 부분은 전략적 우선순위에 따라 조율하세요.
최종 결과물은 내적 일관성을 갖추고, 실행 가능하며, 비즈니스 가치를 명확히 전달해야 합니다.
```

### 8.4 지식 베이스

- 전략적 비즈니스 기획 프레임워크 및 방법론
- 제품 개발 프로세스 및 표준 문서 템플릿
- 화장품 산업 시장 데이터 및 트렌드 분석
- 개발 타임라인 및 비용 추정 기준
- 리스크 평가 및 관리 프레임워크
- 성공적인 화장품 제품 출시 사례 연구
- 효과적인 프레젠테이션 구조 및 스토리텔링 기법
- 프로젝트 관리 및 자원 계획 방법론
- 화장품 규제 및 인증 요구사항 데이터베이스
- 에이전트 결과 평가 및 통합 알고리즘
- 모순 및 불일치 감지 및 해결 방법론
- 데이터 품질 평가 및 개선 메커니즘
- 시스템 성능 피드백 생성 프레임워크

### 8.5 워크플로우 로직

1. **전문 에이전트 결과 수집 및 평가**
   - 모든 에이전트 결과물 수집 및 인덱싱
   - 결과 완전성 및 품질 평가 메트릭 적용
   - 누락된 정보 식별 및 보완 전략 수립
   - 신뢰도 및 정확성 평가 수행

2. **일관성 검증 및 충돌 해결**
   - 에이전트 간 정보 불일치 탐지 알고리즘 적용
   - 충돌 해결 전략 및 중재 로직 실행
   - 오케스트레이터 지시에 따른 우선순위 적용
   - 데이터 통합 및 합성 과정에서 품질 유지

3. **종합 보고서 구성 및 최적화**
   - 전략적 목표에 따른 최적 구조 결정
   - 핵심 인사이트 추출 및 비즈니스 가치 강조
   - 실행 로드맵 및 리스크 관리 전략 구조화
   - 의사결정자를 위한 요약 및 기술 상세 정보 분리

4. **시각적 요소 통합 및 피드백 생성**
   - 데이터 기반 차트, 표, 다이어그램 생성
   - 디자인 에이전트 제안 시각화 및 프레젠테이션 최적화
   - 시스템 성능 및 결과 품질 피드백 생성
   - 지식 베이스 업데이트를 위한 학습 데이터 추출

## 9. 지속적 학습 및 지식 베이스 업데이트 시스템

### 9.1 기능 정의

지속적 학습 시스템은 모든 에이전트의 작업 결과와 사용자 피드백을 기반으로 지식 베이스를 확장하고 최적화합니다. 프로젝트 실행 과정에서 생성된 새로운 인사이트, 성공 및 실패 사례, 시장 변화 등을 포착하여 향후 프로젝트 품질을 개선합니다. 오케스트레이터와 긴밀하게 연동되어 지식 격차와 중요 업데이트 영역을 식별합니다.

### 9.2 핵심 구성요소

#### 9.2.1 지식 추출 모듈
- 프로젝트 결과에서 재사용 가능한 지식 항목 자동 추출
- 카테고리별 지식 분류 및 메타데이터 태깅
- 중복 및 모순 정보 필터링
- 신뢰도 점수 계산 및 검증 요구사항 식별

#### 9.2.2 벡터 데이터베이스 관리
- 추출된 지식의 벡터 임베딩 생성 및 저장
- 의미적 유사성 기반 지식 조직화
- 시간 경과에 따른 지식 관련성 평가
- 벡터 검색 최적화 및 인덱스 관리

#### 9.2.3 피드백 통합 시스템
- 사용자 피드백 수집 및 분석
- 에이전트 성능 메트릭 모니터링
- 품질 문제 및 개선 기회 식별
- 프롬프트 최적화 제안 생성

#### 9.2.4 자동 지식 검증
- 외부 데이터 소스와의 교차 검증
- 시간 경과에 따른 지식 유효성 평가
- 정보 충돌 식별 및 해결
- 지식 신뢰도 점수 지속적 업데이트

### 9.3 워크플로우 로직

1. **프로젝트 종료 분석**
   - 완료된 프로젝트 결과 및 메트릭 수집
   - 성공 및 실패 요인 분석
   - 재사용 가능한 지식 항목 식별
   - 지식 격차 및 불확실성 영역 매핑

2. **지식 추출 및 분류**
   - 카테고리별 지식 추출 (제형, 성분, 브랜드 등)
   - 메타데이터 태깅 및 관계 네트워크 구축
   - 신뢰도 및 관련성 점수 계산
   - 벡터 임베딩 생성 및 저장

3. **지식 베이스 업데이트**
   - 기존 지식과 신규 지식 통합
   - 중복 및 모순 해결
   - 시간적 요소를 고려한 관련성 조정
   - 에이전트별 지식 베이스 동기화

4. **시스템 최적화 피드백**
   - 에이전트 프롬프트 개선 제안
   - 워크플로우 효율성 개선 방안
   - 사용자 경험 최적화 인사이트
   - 새로운 기능 및 역량 개발 제안

## 10. 성능 모니터링 및 최적화 시스템

### 10.1 기능 정의

성능 모니터링 및 최적화 시스템은 전체 에이전트 네트워크의 효율성, 정확성, 속도를 지속적으로 모니터링하고 최적화합니다. 실시간 메트릭 수집, 병목 현상 분석, 자원 사용 최적화를 통해 시스템 성능을 향상시키며, 오케스트레이터와 협력하여 전체 워크플로우의 실행 효율성을 개선합니다.

### 10.2 핵심 구성요소

#### 10.2.1 메트릭 수집 시스템
- 에이전트별 응답 시간 및 처리량 측정
- 리소스 사용량(CPU, 메모리, API 호출) 모니터링
- 오류율 및 재시도 패턴 추적
- 워크플로우 단계별 실행 시간 분석

#### 10.2.2 성능 분석 엔진
- 병목 현상 및 비효율성 자동 식별
- 패턴 인식을 통한 성능 이상 감지
- 기준선 대비 성능 변화 추적
- 원인-결과 분석을 통한 개선 포인트 도출

#### 10.2.3 캐싱 및 최적화 시스템
- 지능형 결과 캐싱 전략 구현
- 중복 계산 및 처리 제거
- 병렬 실행 기회 식별 및 활용
- 적응형 타임아웃 및 재시도 정책 적용

#### 10.2.4 자원 할당 관리자
- 워크로드에 따른 동적 자원 할당
- 우선순위 기반 작업 스케줄링
- 코스트 효율적인 자원 사용 최적화
- 성능 예측 모델을 통한 선제적 스케일링

### 10.3 워크플로우 로직

1. **실시간 모니터링**
   - 모든 에이전트 및 워크플로우 실행 추적
   - 핵심 성능 지표(KPI) 실시간 수집
   - 성능 이상 및 오류 즉시 감지
   - 상태 대시보드 및 알림 시스템 유지

2. **성능 분석 및 진단**
   - 수집된 메트릭의 심층 분석 수행
   - 병목 현상 및 지연 원인 식별
   - 에이전트 간 의존성 및 영향 평가
   - 오류 패턴 및 근본 원인 분석

3. **최적화 전략 적용**
   - 성능 개선을 위한 자원 재할당
   - 캐싱 전략 및 중복 제거 최적화
   - 병렬 실행 및 비동기 처리 확대
   - 프롬프트 효율성 및 토큰 사용 최적화

4. **지속적 개선 피드백 루프**
   - 최적화 효과 측정 및 검증
   - 새로운 성능 개선 기회 지속 식별
   - A/B 테스트를 통한 최적화 검증
   - 시스템 확장성 및 복원력 강화