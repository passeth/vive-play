# 바이브-플레이(Vibe-Play) 데이터 스키마

## 1. 사용자 관련 테이블

### 1.1. users
```
- id: uuid (PK)
- email: string (unique)
- password: string (hashed)
- full_name: string
- company_name: string (nullable)
- created_at: timestamp
- updated_at: timestamp
- last_login: timestamp
- account_status: enum ['active', 'inactive', 'suspended']
- profile_image_url: string (nullable)
```

### 1.2. user_preferences
```
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- notification_email: boolean
- notification_platform: boolean
- language: string (default: 'ko')
- theme: enum ['light', 'dark', 'system']
- created_at: timestamp
- updated_at: timestamp
```

## 2. 프로젝트 관련 테이블

### 2.1. projects
```
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- name: string
- description: text (nullable)
- status: enum ['draft', 'concept_development', 'concept_finalized', 'moodboard_created', 'mockup_created', 'ready_for_quote', 'sample_ordered', 'completed']
- created_at: timestamp
- updated_at: timestamp
- last_accessed: timestamp
- is_archived: boolean (default: false)
- thumbnail_url: string (nullable)
```

### 2.2. project_concepts
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- target_audience: text
- core_concept: text
- product_type: enum ['cream', 'serum', 'cleanser', 'mask', 'toner', ...]
- key_benefits: text[]
- ai_suggestions: jsonb (AI 제안 저장)
- selected_product_name: string (nullable)
- selected_concept_summary: text (nullable)
- created_at: timestamp
- updated_at: timestamp
- version: integer (기획안 버전 관리)
```

### 2.3. project_ingredients
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- ingredient_id: uuid (FK -> ingredients.id)
- is_key_ingredient: boolean
- concentration: decimal (nullable)
- purpose: text (nullable)
- notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

### 2.4. project_formulations
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- formulation_type: enum ['emulsion', 'gel', 'suspension', 'solution', ...]
- texture: enum ['light', 'medium', 'rich', ...]
- viscosity: enum ['watery', 'fluid', 'thick', ...]
- ph_level: decimal (nullable)
- formula_details: jsonb (상세 포뮬러 정보)
- created_at: timestamp
- updated_at: timestamp
```

### 2.5. project_designs
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- primary_color: string (hex code)
- secondary_colors: string[] (hex codes)
- packaging_type_id: uuid (FK -> packaging_types.id)
- design_style: string[]
- moodboard_url: string (nullable)
- mockup_urls: string[] (nullable)
- design_notes: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

## 3. 트렌드 및 핀 관련 테이블

### 3.1. trend_cards
```
- id: uuid (PK)
- title: string
- description: text
- category: enum ['ingredient', 'packaging', 'formulation', 'concept', 'marketing', 'design']
- subcategory: string (nullable)
- image_url: string
- source_url: string (nullable)
- popularity_score: decimal (AI 기반 트렌드 점수)
- tags: string[]
- created_at: timestamp
- updated_at: timestamp
- is_active: boolean
```

### 3.2. user_pins
```
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- trend_card_id: uuid (FK -> trend_cards.id)
- notes: text (nullable)
- pinned_at: timestamp
- folder_id: uuid (FK -> pin_folders.id, nullable)
```

### 3.3. pin_folders
```
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- name: string
- description: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

## 4. 마스터 데이터 테이블

### 4.1. ingredients
```
- id: uuid (PK)
- inci_name: string (unique)
- common_name: string
- category: string[]
- functions: string[]
- ewg_rating: decimal (nullable)
- vegan: boolean
- natural: boolean
- description: text
- contraindications: text (nullable)
- recommended_concentration: string (nullable)
- image_url: string (nullable)
- created_at: timestamp
- updated_at: timestamp
```

### 4.2. ingredient_compatibilities
```
- id: uuid (PK)
- ingredient_id_1: uuid (FK -> ingredients.id)
- ingredient_id_2: uuid (FK -> ingredients.id)
- compatibility_level: enum ['incompatible', 'caution', 'compatible', 'synergistic']
- notes: text (nullable)
```

### 4.3. packaging_types
```
- id: uuid (PK)
- name: string
- category: enum ['bottle', 'jar', 'tube', 'dropper', 'airless pump', 'sachet', ...]
- material: string[]
- volume_options: decimal[]
- image_url: string
- model_3d_url: string (nullable)
- sustainable: boolean
- description: text
- created_at: timestamp
- updated_at: timestamp
```

### 4.4. formulation_templates
```
- id: uuid (PK)
- name: string
- type: enum ['emulsion', 'gel', 'suspension', 'solution', ...]
- base_formula: jsonb (기본 포뮬러 템플릿)
- customizable_parameters: jsonb
- description: text
- suitable_product_types: string[]
- created_at: timestamp
- updated_at: timestamp
```

## 5. AI 및 분석 관련 테이블

### 5.1. ai_suggestions
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- suggestion_type: enum ['product_name', 'concept', 'ingredients', 'formulation', 'design', 'full']
- input_parameters: jsonb (AI에 입력된 파라미터)
- results: jsonb (AI 제안 결과)
- model_used: string (사용된 AI 모델 정보)
- created_at: timestamp
- rating: integer (사용자 평가, nullable)
- selected: boolean (제안이 채택되었는지 여부)
```

### 5.2. trend_analytics
```
- id: uuid (PK)
- trend_keyword: string
- category: enum ['ingredient', 'packaging', 'formulation', 'concept', 'marketing', 'design']
- popularity_score: decimal
- growth_rate: decimal (변화율)
- data_sources: string[]
- region: string[]
- time_period: daterange
- related_keywords: string[]
- created_at: timestamp
- updated_at: timestamp
```

## 6. Phase 2-3 확장 테이블 (향후 구현)

### 6.1. moodboards
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- name: string
- image_url: string
- generation_parameters: jsonb
- created_at: timestamp
- updated_at: timestamp
- is_selected: boolean
```

### 6.2. product_mockups
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- packaging_id: uuid (FK -> packaging_types.id)
- name: string
- image_url: string
- model_3d_url: string (nullable)
- generation_parameters: jsonb
- created_at: timestamp
- updated_at: timestamp
- is_selected: boolean
```

### 6.3. manufacturing_quotes
```
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- manufacturer_id: uuid (FK -> manufacturers.id)
- quote_amount: decimal
- moq: integer
- lead_time_days: integer
- validity_period: daterange
- status: enum ['pending', 'received', 'accepted', 'rejected', 'expired']
- quote_details: jsonb
- created_at: timestamp
- updated_at: timestamp
```

### 6.4. manufacturers
```
- id: uuid (PK)
- name: string
- contact_email: string
- contact_phone: string
- location: string
- specialties: string[]
- min_moq: integer
- certification: string[]
- rating: decimal
- onboarded_at: timestamp
- is_active: boolean
```

## 7. 시스템 테이블

### 7.1. system_settings
```
- id: uuid (PK)
- setting_key: string (unique)
- setting_value: jsonb
- category: string
- description: text
- updated_at: timestamp
- updated_by: uuid (FK -> users.id)
```

### 7.2. audit_logs
```
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- action: string
- entity_type: string
- entity_id: uuid
- changes: jsonb
- ip_address: string
- user_agent: string
- created_at: timestamp
```