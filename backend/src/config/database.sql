-- Vibe-Play Database Schema
-- 화장품 개발 플랫폼 데이터베이스 스키마

-- 사용자 테이블
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    profile_image TEXT,
    company VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user', -- user, admin
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 프로젝트 테이블
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_type VARCHAR(50) NOT NULL, -- 스킨케어, 메이크업, 바디케어 등
    target_customer VARCHAR(50) NOT NULL, -- 10대, 20대, 30대 등
    keywords TEXT[], -- 핵심 키워드 배열
    concept TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, concept_ready, ai_generated, completed
    progress INTEGER DEFAULT 0, -- 0-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI 생성 제안 테이블
CREATE TABLE ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    product_name VARCHAR(255),
    concept TEXT,
    ingredients JSONB, -- [{"name": "비타민 C", "percentage": "15%"}]
    design JSONB, -- {"packaging": "드로퍼 병", "color": "골드", "size": "30ml"}
    target_price VARCHAR(50),
    features TEXT[],
    is_accepted BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1, -- 재생성 버전 관리
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 트렌드 카테고리 테이블
CREATE TABLE trend_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- hex color
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 트렌드 테이블
CREATE TABLE trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES trend_categories(id),
    image_url TEXT,
    tags TEXT[],
    popularity_score INTEGER DEFAULT 0, -- 0-100
    source_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 핀 테이블 (마이핀)
CREATE TABLE user_pins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trend_id UUID REFERENCES trends(id) ON DELETE CASCADE,
    notes TEXT, -- 사용자 메모
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, trend_id) -- 중복 핀 방지
);

-- 프로젝트-트렌드 연결 테이블
CREATE TABLE project_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    trend_id UUID REFERENCES trends(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, trend_id)
);

-- 무드보드 테이블 (Phase 2)
CREATE TABLE moodboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    style_keywords TEXT[],
    generated_images JSONB, -- AI 생성 이미지 URL들
    is_final BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 제품 목업 테이블 (Phase 2)
CREATE TABLE product_mockups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    container_type VARCHAR(100),
    colors JSONB, -- {"primary": "#FF6B9D", "accent": "#C44569"}
    labels JSONB, -- 라벨 정보
    mockup_images JSONB, -- 생성된 목업 이미지들
    is_final BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 견적 요청 테이블 (Phase 3)
CREATE TABLE quotation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, matched, quoted, accepted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 제조사 테이블 (Phase 3)
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    specialties TEXT[], -- 전문 분야
    min_quantity INTEGER,
    location VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0.0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 견적서 테이블 (Phase 3)
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_request_id UUID REFERENCES quotation_requests(id) ON DELETE CASCADE,
    manufacturer_id UUID REFERENCES manufacturers(id),
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    lead_time_days INTEGER,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_trends_category_id ON trends(category_id);
CREATE INDEX idx_trends_popularity ON trends(popularity_score DESC);
CREATE INDEX idx_user_pins_user_id ON user_pins(user_id);
CREATE INDEX idx_user_pins_trend_id ON user_pins(trend_id);
CREATE INDEX idx_ai_suggestions_project_id ON ai_suggestions(project_id);

-- 기본 데이터 삽입
INSERT INTO trend_categories (name, description, color) VALUES
('스킨케어', '기초 화장품 및 스킨케어 트렌드', '#FF6B9D'),
('메이크업', '색조 화장품 트렌드', '#C44569'),
('바디케어', '바디 및 헤어케어 트렌드', '#786FA6'),
('패키징', '용기 및 패키징 디자인 트렌드', '#F8B500'),
('성분', '혁신적인 화장품 성분 트렌드', '#4BCFFA');

-- 샘플 트렌드 데이터
INSERT INTO trends (title, description, category_id, tags, popularity_score, is_featured) 
SELECT 
    '글래스 스킨 트렌드',
    '투명하고 윤기 있는 유리 같은 피부를 만드는 K-뷰티 트렌드',
    id,
    ARRAY['보습', '글로우', 'K-뷰티', '히알루론산'],
    95,
    true
FROM trend_categories WHERE name = '스킨케어';

INSERT INTO trends (title, description, category_id, tags, popularity_score) 
SELECT 
    '클린 뷰티 성분',
    '자연 유래 성분과 지속가능한 포뮬레이션에 대한 관심 증가',
    id,
    ARRAY['자연성분', '친환경', '비건', '무첨가'],
    88
FROM trend_categories WHERE name = '성분';

INSERT INTO trends (title, description, category_id, tags, popularity_score) 
SELECT 
    '미니멀 패키징',
    '심플하고 지속가능한 패키징 디자인이 주목받고 있음',
    id,
    ARRAY['미니멀', '친환경', '재활용', '심플'],
    82
FROM trend_categories WHERE name = '패키징';

INSERT INTO trends (title, description, category_id, tags, popularity_score) 
SELECT 
    '틴티드 립밤',
    '보습과 컬러를 동시에 제공하는 멀티 기능 립 제품',
    id,
    ARRAY['멀티기능', '자연발색', '보습', '데일리'],
    79
FROM trend_categories WHERE name = '메이크업';

INSERT INTO trends (title, description, category_id, tags, popularity_score) 
SELECT 
    '프로바이오틱스 스킨케어',
    '피부 마이크로바이옴 건강을 위한 프로바이오틱스 성분 활용',
    id,
    ARRAY['프로바이오틱스', '마이크로바이옴', '피부장벽', '건강'],
    76
FROM trend_categories WHERE name = '스킨케어';

INSERT INTO trends (title, description, category_id, tags, popularity_score) 
SELECT 
    '리필 가능한 용기',
    '환경을 고려한 리필 시스템이 적용된 화장품 용기',
    id,
    ARRAY['리필', '지속가능', '환경보호', '경제적'],
    71
FROM trend_categories WHERE name = '패키징';