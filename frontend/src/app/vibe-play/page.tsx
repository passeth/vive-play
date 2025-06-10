'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { projects, ai, auth, Project, AISuggestion } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';

function VibePlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productType: '',
    targetCustomer: '',
    keywords: '',
    concept: '',
    selectedTrends: []
  });

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication (allow demo without login)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  // Handle trend information from URL parameters
  useEffect(() => {
    const trendTitle = searchParams.get('trend');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');

    if (trendTitle || category || tags) {
      setFormData(prev => ({
        ...prev,
        productType: category === '스킨케어' ? '스킨케어' : 
                    category === '메이크업' ? '메이크업' : 
                    category === '바디케어' ? '바디케어' : prev.productType,
        keywords: tags ? tags.replace(/,/g, ', ') : prev.keywords,
        concept: trendTitle ? `${trendTitle} 트렌드를 활용한 제품을 개발하고 싶습니다.` : prev.concept
      }));
    }
  }, [searchParams]);

  const productTypes = [
    '스킨케어', '메이크업', '바디케어', '헤어케어', '향수'
  ];

  const targetCustomers = [
    '10대', '20대', '30대', '40대+', '전 연령대'
  ];

  // Professional ingredient database
  const getIngredientData = (ingredientName: string) => {
    const ingredientDB: Record<string, any> = {
      '히알루론산': {
        scientificName: 'Hyaluronic Acid',
        efficacy: '분자량별 다층 보습 시스템으로 표피-진피층까지 수분 공급 및 유지',
        benefits: ['즉각적 수분 공급 (24시간 지속)', '피부 탄력 개선 15%', '수분 보유력 300% 증가'],
        regulatory: ['FDA', 'EU', 'K-FDA']
      },
      '펩타이드 복합체': {
        scientificName: 'Peptide Complex',
        efficacy: '콜라겐 합성 촉진 및 피부 재생 신호 전달 물질로 안티에이징 효과',
        benefits: ['콜라겐 생성 40% 증가', '주름 깊이 25% 감소', '피부 탄력성 향상'],
        regulatory: ['FDA', 'EU', 'K-FDA']
      },
      '세라마이드': {
        scientificName: 'Ceramide NP',
        efficacy: '피부 장벽 강화 및 경피수분손실 방지, 민감성 피부 진정',
        benefits: ['피부 장벽 복원', '수분 손실 50% 감소', '외부 자극 차단'],
        regulatory: ['FDA', 'EU', 'K-FDA']
      },
      '식물성 스쿠알란': {
        scientificName: 'Squalane (Plant-derived)',
        efficacy: '피부와 동일한 지질 구조로 깊은 보습 및 피부 컨디셔닝',
        benefits: ['비코메도제닉 (모공 막지 않음)', '항산화 효과', '피부 연화'],
        regulatory: ['FDA', 'EU', 'K-FDA', 'ECOCERT']
      },
      '비타민 C': {
        scientificName: 'L-Ascorbic Acid',
        efficacy: '강력한 항산화 작용 및 멜라닌 생성 억제를 통한 브라이트닝',
        benefits: ['색소 침착 20% 개선', '항산화 효과', '콜라겐 합성 촉진'],
        regulatory: ['FDA', 'EU', 'K-FDA']
      },
      '비타민 E': {
        scientificName: 'Tocopherol',
        efficacy: '지용성 항산화제로 비타민 C와 시너지 효과, 피부 보호막 형성',
        benefits: ['자외선 손상 방지', '피부 보호막 강화', '항염 효과'],
        regulatory: ['FDA', 'EU', 'K-FDA']
      },
      '나이아신아마이드': {
        scientificName: 'Niacinamide',
        efficacy: '피지 조절 및 모공 수축, 피부 톤 개선 효과',
        benefits: ['모공 크기 35% 감소', '피지 분비 조절', '피부 톤 균일화'],
        regulatory: ['FDA', 'EU', 'K-FDA']
      }
    };

    return ingredientDB[ingredientName] || {
      scientificName: 'Active Ingredient',
      efficacy: '피부 개선 및 케어 효과',
      benefits: ['피부 건강 개선', '안전성 확인'],
      regulatory: ['K-FDA']
    };
  };

  // Target persona data
  const getTargetPersona = (targetCustomer: string) => {
    const personaDB: Record<string, any> = {
      '10대': {
        name: '지유 (17세)',
        description: '트렌드에 민감한 고등학생',
        painPoints: ['첫 화장품 선택의 어려움', '민감한 사춘기 피부', '합리적 가격 추구'],
        lifestyle: ['소셜미디어 활발 사용', '친구들과 뷰티 정보 공유', '자연스러운 메이크업 선호'],
        brandMuse: '아이유, 뉴진스 하니'
      },
      '20대': {
        name: '민지 (24세)',
        description: '바쁜 직장생활 속 셀프케어를 중시하는 직장인',
        painPoints: ['시간 부족으로 인한 간편한 케어 필요', '스트레스성 피부트러블', '성분 및 효과 중시'],
        lifestyle: ['효율적인 스킨케어 루틴', '성분 중심 제품 선택', '온라인 리뷰 참고'],
        brandMuse: '김고은, 전지현'
      },
      '30대': {
        name: '수현 (32세)',
        description: '안티에이징에 관심이 높은 커리어우먼',
        painPoints: ['초기 노화 신호', '프리미엄 제품 선호', '확실한 효과 추구'],
        lifestyle: ['투자 가치 있는 제품 선택', '전문성 있는 브랜드 신뢰', '장기적 피부 관리'],
        brandMuse: '송혜교, 한지민'
      },
      '40대+': {
        name: '영희 (45세)',
        description: '성숙한 아름다움을 추구하는 워킹맘',
        painPoints: ['확실한 안티에이징 효과', '자극 없는 순한 제품', '시간 효율적 케어'],
        lifestyle: ['검증된 브랜드 선호', '기능성 화장품 관심', '가족과 함께 사용'],
        brandMuse: '김희애, 이영애'
      }
    };

    return personaDB[targetCustomer] || personaDB['20대'];
  };

  const handleCreateProject = async () => {
    try {
      setError(null);
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
      
      if (!isAuthenticated) {
        // Demo mode - create mock project
        const mockProject = {
          id: 'demo-project-' + Date.now(),
          name: `${formData.productType} 프로젝트`,
          description: formData.concept,
          product_type: formData.productType,
          target_customer: formData.targetCustomer,
          keywords: keywordsArray,
          concept: formData.concept,
          status: 'draft',
          progress: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCurrentProject(mockProject);
        setStep(3);
        return;
      }

      const projectData = {
        name: `${formData.productType} 프로젝트`,
        description: formData.concept,
        productType: formData.productType,
        targetCustomer: formData.targetCustomer,
        keywords: keywordsArray,
        concept: formData.concept
      };

      const response = await projects.create(projectData);
      setCurrentProject(response.project);
      setStep(3);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleGenerateAI = async () => {
    if (!currentProject) {
      setError('프로젝트가 생성되지 않았습니다.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      if (!isAuthenticated) {
        // Demo mode - generate mock AI suggestion
        setTimeout(() => {
          const mockSuggestion = {
            id: 'demo-suggestion-' + Date.now(),
            project_id: currentProject.id,
            product_name: formData.keywords.includes('글로우') ? "래디언스 글로우 세럼" : 
                         formData.keywords.includes('보습') ? "하이드라 플러스 에센스" :
                         formData.productType === '메이크업' ? "내추럴 글로우 틴트" : "글로우 비타민 세럼",
            concept: formData.keywords.includes('자연') ? 
              "자연 유래 성분으로 만든 순한 세럼으로, 민감한 피부도 안심하고 사용할 수 있습니다. 지속가능한 패키징과 비건 포뮬레이션으로 환경까지 생각한 제품입니다." :
              "첨단 성분과 검증된 효능을 결합한 프리미엄 세럼입니다. 즉각적인 효과와 장기적인 피부 개선을 동시에 제공하여 건강하고 빛나는 피부로 가꿔줍니다.",
            ingredients: [
              { name: "히알루론산", percentage: "2%", purpose: "집중 보습" },
              { name: "펩타이드 복합체", purpose: "탄력 증진" },
              { name: "세라마이드", purpose: "피부 장벽 강화" },
              { name: "식물성 스쿠알란", purpose: "부드러운 보습" }
            ],
            design: {
              packaging: "프리미엄 에어레스 펌프",
              color: "매트 화이트 + 로즈골드",
              size: "30ml",
              style: "모던 럭셔리"
            },
            target_price: formData.targetCustomer === "10대" ? "28,000원" : 
                         formData.targetCustomer === "20대" ? "35,000원" : "48,000원",
            features: ["즉각적인 수분 공급", "브라이트닝 효과", "안티에이징", "모공 개선"],
            is_accepted: false,
            version: 1,
            created_at: new Date().toISOString()
          };
          setAiSuggestion(mockSuggestion);
          setStep(4);
          setIsGenerating(false);
        }, 2000); // 실제 AI 생성처럼 2초 대기
        return;
      }
      
      const response = await ai.generate(currentProject.id);
      setAiSuggestion(response.suggestion);
      setStep(4);
    } catch (err) {
      console.error('Failed to generate AI suggestion:', err);
      setError('AI 제안 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptSuggestion = async () => {
    if (!aiSuggestion) return;

    try {
      if (!isAuthenticated) {
        // Demo mode - show login prompt
        alert('로그인하시면 프로젝트를 저장하고 관리할 수 있습니다!');
        router.push('/');
        return;
      }
      
      await ai.accept(aiSuggestion.id);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to accept suggestion:', err);
      setError('제안 승인에 실패했습니다.');
    }
  };

  const handleRegenerateSuggestion = async () => {
    if (!currentProject) return;

    try {
      setIsGenerating(true);
      setError(null);
      
      if (!isAuthenticated) {
        // Demo mode - regenerate mock AI suggestion
        setTimeout(() => {
          handleGenerateAI(); // Reuse the generate function
        }, 1500);
        return;
      }
      
      const response = await ai.generate(currentProject.id, true); // regenerate = true
      setAiSuggestion(response.suggestion);
    } catch (err) {
      console.error('Failed to regenerate AI suggestion:', err);
      setError('AI 제안 재생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"></div>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Vibe-Play
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-pink-600 transition">대시보드</Link>
              <Link href="/trends" className="text-gray-600 hover:text-pink-600 transition">트렌드핀</Link>
              <Link href="/vibe-play" className="text-pink-600 font-semibold">Vibe Play</Link>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vibe Play</h1>
          <p className="text-gray-600">AI와 함께 화장품 컨셉을 구체화해보세요</p>
        </div>

        {/* Demo Mode Banner */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-blue-800 font-semibold">체험 모드로 이용 중입니다</h3>
                <p className="text-blue-700 text-sm">로그인하시면 프로젝트를 저장하고 관리할 수 있습니다.</p>
              </div>
              <Link 
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                로그인하기
              </Link>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">진행 단계: {step}/4</span>
            <span className="text-sm text-gray-600">{Math.round((step/4) * 100)}% 완료</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step/4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">기본 정보 입력</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">제품 유형</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, productType: type})}
                      className={`p-3 rounded-lg border transition ${
                        formData.productType === type
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">타겟 고객</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {targetCustomers.map((target) => (
                    <button
                      key={target}
                      onClick={() => setFormData({...formData, targetCustomer: target})}
                      className={`p-3 rounded-lg border transition ${
                        formData.targetCustomer === target
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">핵심 키워드</label>
                <textarea
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="예: 보습, 안티에이징, 민감성 피부, 자연 성분..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <div></div>
              <button
                onClick={handleCreateProject}
                disabled={!formData.productType || !formData.targetCustomer}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                프로젝트 생성 후 계속
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Trend Exploration */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">트렌드 탐색 (선택사항)</h2>
            
            {/* Show selected trend if coming from trends page */}
            {searchParams.get('trend') && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">선택된 트렌드</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900">{searchParams.get('trend')}</h4>
                    <p className="text-sm text-purple-600">
                      카테고리: {searchParams.get('category')} | 
                      태그: {searchParams.get('tags')?.split(',').join(', ')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-purple-700 mt-3">
                  이 트렌드 정보가 프로젝트에 자동으로 반영되었습니다.
                </p>
              </div>
            )}

            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchParams.get('trend') ? '추가 트렌드 탐색' : '트렌드핀 아카이브 탐색'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchParams.get('trend') ? 
                  '더 많은 트렌드를 확인하고 프로젝트에 반영해보세요' :
                  '최신 화장품 트렌드를 확인하고 프로젝트에 반영해보세요'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/trends"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  {searchParams.get('trend') ? '더 많은 트렌드 보기' : '트렌드 탐색하기'}
                </Link>
                <button
                  onClick={() => setStep(3)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-pink-500 transition"
                >
                  건너뛰기
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                ← 이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
              >
                다음 단계
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Concept Development */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">아이디어 구체화</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제품 컨셉 설명</label>
                <textarea
                  value={formData.concept}
                  onChange={(e) => setFormData({...formData, concept: e.target.value})}
                  placeholder="어떤 제품을 만들고 싶으신가요? 자세히 설명해주세요..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows={5}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">입력된 정보 요약</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li><span className="font-medium">제품 유형:</span> {formData.productType}</li>
                  <li><span className="font-medium">타겟 고객:</span> {formData.targetCustomer}</li>
                  <li><span className="font-medium">키워드:</span> {formData.keywords}</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                ← 이전
              </button>
              <button
                onClick={handleGenerateAI}
                disabled={!formData.concept || isGenerating}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{isGenerating ? 'AI 생성 중...' : 'AI 제안 생성'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI가 제안을 생성하고 있습니다</h3>
            <p className="text-gray-600">잠시만 기다려주세요...</p>
          </div>
        )}

        {/* Step 4: AI Suggestions - Brand Deck Style */}
        {step === 4 && aiSuggestion && (
          <div className="space-y-6">
            {/* Hero Section with Product Visual */}
            <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8 rounded-xl border border-gray-200 overflow-hidden relative">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Product Info */}
                <div className="space-y-4">
                  <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formData.productType}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{aiSuggestion.product_name}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{aiSuggestion.concept}</p>
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {aiSuggestion.target_price}
                    </div>
                    <div className="text-sm text-gray-600">타겟: {formData.targetCustomer}</div>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative rounded-2xl overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/f4/e3/37/f4e337a3d77f2a4b06078a3d024184a1.jpg" 
                    alt="Premium Serum Product"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-white text-sm font-medium">{aiSuggestion.design?.packaging}</p>
                    <p className="text-white text-xs opacity-90">{aiSuggestion.design?.size || '30ml'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product USP & Usage */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">제품 USP & 사용법</h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Product USP */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <span>핵심 경쟁력 (USP)</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">다층 보습 시스템</h5>
                        <p className="text-sm text-gray-600">3가지 분자량의 히알루론산으로 표피부터 진피까지 단계별 수분 공급</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">즉시 & 지속 효과</h5>
                        <p className="text-sm text-gray-600">발림과 동시에 느껴지는 보습감과 24시간 지속되는 수분 유지력</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">임상 검증된 성분 조합</h5>
                        <p className="text-sm text-gray-600">펩타이드-세라마이드 복합체로 피부 장벽 강화와 탄력 개선 동시 구현</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">4</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">모든 피부타입 적합</h5>
                        <p className="text-sm text-gray-600">민감성 피부부터 건성 피부까지 안전하게 사용 가능한 순한 포뮬레이션</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">5</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">혁신적 에어레스 펌핑</h5>
                        <p className="text-sm text-gray-600">산화 방지와 정량 분출로 마지막까지 신선한 상태 유지</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Instructions */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>사용법 가이드</span>
                  </h4>
                  
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2">🌅 아침 사용법</h5>
                        <ol className="text-sm text-blue-800 space-y-1 ml-4">
                          <li>1. 세안 후 토너로 피부 결 정리</li>
                          <li>2. 펌핑 1-2회분을 손바닥에 덜어내기</li>
                          <li>3. 얼굴 중앙에서 바깥쪽으로 부드럽게 발라주기</li>
                          <li>4. 목과 데콜테까지 연장하여 발라주기</li>
                          <li>5. 가볍게 두드려 충분히 흡수시키기</li>
                        </ol>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-2">🌙 저녁 사용법</h5>
                        <ol className="text-sm text-blue-800 space-y-1 ml-4">
                          <li>1. 이중 세안 후 토너 적용</li>
                          <li>2. 펌핑 2-3회분으로 충분한 양 사용</li>
                          <li>3. 특히 건조한 부위에 중점적으로 발라주기</li>
                          <li>4. 나이트 크림 전 베이스로 활용</li>
                          <li>5. 마사지하듯 흡수시켜 숙면 케어 완성</li>
                        </ol>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg">
                        <h6 className="font-semibold text-gray-900 text-sm mb-1">💡 사용 팁</h6>
                        <p className="text-xs text-gray-600">
                          • 습한 상태의 피부에 발라주면 보습 효과 극대화<br/>
                          • 건조한 계절에는 사용량을 늘려 레이어링 추천<br/>
                          • 메이크업 전 5분 정도 흡수 시간 필요
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Formulation Section */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">제형 & 텍스처</h3>
              
              <div className="text-center">
                {/* Formulation Image */}
                <div className="w-[70%] mx-auto mb-6">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://i.pinimg.com/736x/bc/26/07/bc26076cb6f797f91f7d6f61b6a00cb9.jpg" 
                      alt="Serum Texture and Formulation"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">프리미엄 세럼 텍스처</div>
                    </div>
                  </div>
                </div>
                
                {/* Formulation Description */}
                <div className="max-w-4xl mx-auto">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">고농축 에센스 세럼</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">텍스처 특성</h5>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>수분감이 풍부한 젤 타입의 가벼운 텍스처</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>끈적임 없이 빠르게 흡수되는 실키한 마감감</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>투명하고 깔끔한 발림성으로 레이어링 용이</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">제형 기술</h5>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>나노 에멀젼 기술로 성분 침투력 극대화</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>특허받은 다층 보습 캡슐화 시스템</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>pH 5.5 약산성으로 피부와 동일한 산도 유지</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Identity Section */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">브랜드 아이덴티티</h3>
              
              {/* Color Palette */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">컬러 팔레트</h4>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg shadow-md mb-2" style={{backgroundColor: '#252217'}}></div>
                    <p className="text-xs text-gray-600">Deep Earth</p>
                    <p className="text-xs text-gray-400">#252217</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg shadow-md mb-2" style={{backgroundColor: '#6d6945'}}></div>
                    <p className="text-xs text-gray-600">Natural Olive</p>
                    <p className="text-xs text-gray-400">#6d6945</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg shadow-md mb-2" style={{backgroundColor: '#a6a282'}}></div>
                    <p className="text-xs text-gray-600">Sage Green</p>
                    <p className="text-xs text-gray-400">#a6a282</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg shadow-md mb-2" style={{backgroundColor: '#d7d6ca'}}></div>
                    <p className="text-xs text-gray-600">Soft Cream</p>
                    <p className="text-xs text-gray-400">#d7d6ca</p>
                  </div>
                </div>
              </div>

              {/* Instagram Brand Feed Style Mood Board */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Instagram 브랜드 피드</h4>
                <div className="grid grid-cols-3 gap-2">
                  {/* Post 1: Product Shot */}
                  <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-purple-200/40"></div>
                    <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">제품 메인샷</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-16 bg-gradient-to-b from-white to-gray-200 rounded-lg shadow-lg transform rotate-12"></div>
                    </div>
                  </div>

                  {/* Post 2: Ingredient Story */}
                  <div className="relative aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">성분 스토리</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-green-700 opacity-70"></div>
                      </div>
                    </div>
                  </div>

                  {/* Post 3: Lifestyle */}
                  <div className="relative aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">라이프스타일</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gradient-radial from-yellow-300 to-orange-500 rounded-full">
                        <div className="absolute top-1 left-1 w-8 h-8 bg-gradient-radial from-white/50 to-transparent rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Post 4: Before/After */}
                  <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-indigo-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">비포&애프터</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center space-x-2">
                      <div className="w-4 h-6 bg-gray-400 rounded opacity-60"></div>
                      <div className="text-white text-xs">→</div>
                      <div className="w-4 h-6 bg-gradient-to-b from-pink-300 to-purple-400 rounded"></div>
                    </div>
                  </div>

                  {/* Post 5: Flat Lay */}
                  <div className="relative aspect-square bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-pink-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">플랫레이</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3 h-4 bg-white rounded shadow-sm"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                        <div className="w-3 h-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Post 6: User Generated Content */}
                  <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-cyan-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">고객 후기</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                  </div>

                  {/* Post 7: Tutorial */}
                  <div className="relative aspect-square bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-200/30 to-emerald-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">사용법 튜토리얼</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-sm">▶</div>
                    </div>
                  </div>

                  {/* Post 8: Lab/Research */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-slate-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 to-slate-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">연구소 스토리</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-400 rounded-full">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1 ml-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Post 9: Sustainability */}
                  <div className="relative aspect-square bg-gradient-to-br from-lime-100 to-green-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-200/30 to-green-200/40"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">지속가능성</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-green-700"></div>
                        <div className="absolute top-2 left-1 w-2 h-1 bg-green-300 rounded-full opacity-60"></div>
                        <div className="absolute top-3 right-1 w-1.5 h-0.5 bg-green-300 rounded-full opacity-60"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Product Analysis */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">전문 성분 분석</h3>
              
              {/* Ingredient Concept Image */}
              <div className="mb-8">
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://i.pinimg.com/736x/1c/b8/6c/1cb86c3081f71a1af2f4571fed936158.jpg" 
                    alt="Premium Skincare Ingredients Concept"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-white text-xs font-medium bg-black/60 rounded px-2 py-1">프리미엄 성분 컨셉</div>
                  </div>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-1 gap-8">
                {/* Advanced Ingredients Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span>핵심 성분 & 효능 분석</span>
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {aiSuggestion.ingredients.map((ingredient, index) => {
                      const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.name;
                      const ingredientData = getIngredientData(ingredientName);
                      
                      return (
                        <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border border-pink-100 hover:shadow-lg transition">
                          {/* Ingredient Visual */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden">
                              {/* Realistic ingredient photo mockups */}
                              {ingredientName === '히알루론산' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-300">
                                  {/* Water droplet texture */}
                                  <div className="absolute inset-1 bg-gradient-radial from-white/40 via-blue-200/60 to-transparent rounded-lg">
                                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/70 rounded-full blur-sm"></div>
                                    <div className="absolute bottom-3 right-3 w-2 h-2 bg-white/50 rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-radial from-blue-300 to-blue-500 rounded-full opacity-80">
                                      <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {ingredientName === '펩타이드 복합체' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-200 to-indigo-300">
                                  {/* Molecular structure texture */}
                                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-lg">
                                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                    <div className="absolute top-4 right-3 w-1 h-1 bg-purple-500 rounded-full"></div>
                                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                                    <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-700 rounded-full"></div>
                                    {/* Connection lines */}
                                    <div className="absolute top-3 left-3 w-4 h-0.5 bg-purple-400 opacity-60 rotate-45"></div>
                                    <div className="absolute bottom-4 right-4 w-3 h-0.5 bg-purple-400 opacity-60 -rotate-45"></div>
                                  </div>
                                </div>
                              )}
                              {ingredientName === '세라마이드' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-300">
                                  {/* Barrier/membrane texture */}
                                  <div className="absolute inset-1 bg-gradient-to-r from-white/30 via-yellow-200/40 to-white/30 rounded-lg">
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-500 opacity-80"></div>
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 transform -translate-y-1"></div>
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 transform translate-y-1"></div>
                                    <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-600 rounded-full"></div>
                                    <div className="absolute bottom-2 right-2 w-1 h-1 bg-orange-600 rounded-full"></div>
                                  </div>
                                </div>
                              )}
                              {ingredientName === '식물성 스쿠알란' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-200 to-teal-300">
                                  {/* Plant/leaf texture */}
                                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-green-300/40 rounded-lg">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-80">
                                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-green-700 opacity-70"></div>
                                      <div className="absolute top-2 left-1 w-2 h-1 bg-green-300 rounded-full opacity-60"></div>
                                      <div className="absolute top-3 right-1 w-1.5 h-0.5 bg-green-300 rounded-full opacity-60"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {ingredientName === '비타민 C' && (
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-yellow-200 to-amber-300">
                                  {/* Citrus texture */}
                                  <div className="absolute inset-1 bg-gradient-radial from-white/40 via-orange-200/60 to-transparent rounded-lg">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-radial from-yellow-300 to-orange-500 rounded-full">
                                      <div className="absolute top-1 left-1 w-4 h-4 bg-gradient-radial from-white/50 to-transparent rounded-full"></div>
                                      <div className="absolute top-2 left-2 w-1 h-1 bg-orange-600 rounded-full"></div>
                                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-600 rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {!['히알루론산', '펩타이드 복합체', '세라마이드', '식물성 스쿠알란', '비타민 C'].includes(ingredientName) && (
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300">
                                  {/* Generic ingredient texture */}
                                  <div className="absolute inset-1 bg-gradient-radial from-white/30 via-pink-200/50 to-transparent rounded-lg">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-radial from-pink-400 to-rose-600 rounded-full opacity-80">
                                      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white/40 rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-gray-900">{ingredientName}</h5>
                                {typeof ingredient === 'object' && ingredient.percentage && (
                                  <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {ingredient.percentage}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 font-medium">{ingredientData.scientificName}</p>
                            </div>
                          </div>

                          {/* Efficacy Details */}
                          <div className="space-y-3">
                            <div>
                              <h6 className="text-sm font-semibold text-gray-800 mb-1">주요 효능</h6>
                              <p className="text-sm text-gray-600">{ingredientData.efficacy}</p>
                            </div>
                            
                            <div>
                              <h6 className="text-sm font-semibold text-gray-800 mb-1">입증된 효과</h6>
                              <ul className="space-y-1">
                                {ingredientData.benefits.map((benefit: string, idx: number) => (
                                  <li key={idx} className="flex items-center space-x-2 text-xs">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Regulatory Status */}
                            <div className="flex items-center justify-between pt-2 border-t border-pink-200">
                              <div className="flex space-x-2">
                                {ingredientData.regulatory.map((region: string, idx: number) => (
                                  <span key={idx} className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    region === 'FDA' ? 'bg-blue-100 text-blue-700' :
                                    region === 'EU' ? 'bg-green-100 text-green-700' :
                                    region === 'K-FDA' ? 'bg-purple-100 text-purple-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {region} 승인
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-700 font-medium">안전</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <span>핵심 기능</span>
                  </h4>
                  <div className="space-y-3">
                    {aiSuggestion.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Package Design Showcase */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">패키지 디자인</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Package 3D View */}
                <div className="md:col-span-2">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 h-64 flex items-center justify-center relative overflow-hidden">
                    {/* 3D Package Mockup */}
                    <div className="relative transform rotate-12">
                      <div className="w-32 h-48 bg-gradient-to-b from-white to-gray-200 rounded-xl shadow-2xl relative">
                        {/* Label */}
                        <div className="absolute top-4 left-2 right-2 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white">
                            <h4 className="font-bold text-sm">{aiSuggestion.product_name}</h4>
                            <p className="text-xs opacity-90">{aiSuggestion.design?.size}</p>
                          </div>
                        </div>
                        {/* Bottom detail */}
                        <div className="absolute bottom-4 left-2 right-2 h-8 bg-gray-300 rounded opacity-60"></div>
                      </div>
                      {/* Shadow */}
                      <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/10 rounded-full blur-sm"></div>
                    </div>
                    
                    {/* Background Elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-pink-200 rounded-full opacity-40"></div>
                    <div className="absolute bottom-8 right-8 w-8 h-8 bg-purple-200 rounded-full opacity-40"></div>
                  </div>
                </div>

                {/* Package Specs */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">용기 유형</div>
                    <div className="font-semibold text-gray-900">{aiSuggestion.design?.packaging}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">컬러 스킴</div>
                    <div className="font-semibold text-gray-900">{aiSuggestion.design?.color}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">용량</div>
                    <div className="font-semibold text-gray-900">{aiSuggestion.design?.size}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">디자인 스타일</div>
                    <div className="font-semibold text-gray-900">{aiSuggestion.design?.style}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Persona & Brand Muse */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">타겟 페르소나 & 브랜드 뮤즈</h3>
              
              {/* Target Persona */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {getTargetPersona(formData.targetCustomer).name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{getTargetPersona(formData.targetCustomer).name}</h4>
                      <p className="text-gray-600 text-sm">{getTargetPersona(formData.targetCustomer).description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Pain Points</h5>
                      <ul className="space-y-1">
                        {getTargetPersona(formData.targetCustomer).painPoints.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Lifestyle</h5>
                      <ul className="space-y-1">
                        {getTargetPersona(formData.targetCustomer).lifestyle.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Muse */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">브랜드 뮤즈</h4>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Magazine Style Photo 1 */}
                  <div className="relative rounded-xl overflow-hidden shadow-lg group">
                    <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      {/* Magazine-style portrait mockup */}
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-pink-200 to-rose-300 rounded-full shadow-lg">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-white/30 to-pink-300/50 rounded-full"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-rose-200 to-pink-400 rounded-full opacity-80"></div>
                      </div>
                      {/* Hair mockup */}
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-2 w-24 h-12 bg-gradient-to-b from-amber-200 to-yellow-300 rounded-t-full opacity-70"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <div className="text-white text-sm font-medium">자연스러운 매력</div>
                      </div>
                    </div>
                  </div>

                  {/* Magazine Style Photo 2 */}
                  <div className="relative rounded-xl overflow-hidden shadow-lg group">
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                      {/* Magazine-style portrait mockup */}
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-blue-200 to-indigo-300 rounded-full shadow-lg">
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-white/30 to-blue-300/50 rounded-full"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-blue-200 to-indigo-400 rounded-full opacity-80"></div>
                      </div>
                      {/* Hair mockup */}
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-2 w-24 h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-full opacity-70"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <div className="text-white text-sm font-medium">세련된 우아함</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100">
                  <h5 className="font-semibold text-gray-800 mb-3">브랜드 이미지</h5>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    현대적이면서도 친근한 매력을 가진 브랜드 뮤즈들이 자연스러운 아름다움과 세련된 라이프스타일을 대변합니다. 
                    이들의 이미지는 제품의 핵심 가치인 '효과적이면서도 순한' 특성을 완벽하게 표현하며, 
                    다양한 연령대와 라이프스타일을 아우르는 포용적인 브랜드 철학을 보여줍니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h6 className="font-medium text-gray-800 mb-2">자연스러운 매력</h6>
                      <p className="text-xs text-gray-600">
                        건강하고 생기 넘치는 피부를 가진 모델로, 자연스러운 아름다움과 
                        일상 속에서도 빛나는 편안함을 강조합니다.
                      </p>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-800 mb-2">세련된 우아함</h6>
                      <p className="text-xs text-gray-600">
                        모던하고 세련된 스타일링으로 도시적이면서도 
                        우아한 브랜드의 프리미엄 이미지를 대변합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['자연스러운', '세련된', '신뢰할 수 있는', '포용적인', '모던한'].map((trait, idx) => (
                      <span key={idx} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Research Brief */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">시장 조사 브리프</h3>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Market Size */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900">시장 규모</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">한국 {formData.productType} 시장</span>
                      <span className="text-sm font-semibold">2.8조원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">연간 성장률</span>
                      <span className="text-sm font-semibold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">타겟 세그먼트</span>
                      <span className="text-sm font-semibold">85만명</span>
                    </div>
                  </div>
                </div>

                {/* Competitor Analysis */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900">경쟁사 분석</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">설화수 윤조에센스</span>
                        <span className="text-xs text-orange-600">직접경쟁</span>
                      </div>
                      <div className="text-xs text-gray-600">150,000원 | 프리미엄 한방</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">라네즈 워터뱅크</span>
                        <span className="text-xs text-amber-600">간접경쟁</span>
                      </div>
                      <div className="text-xs text-gray-600">28,000원 | 대중적 보습</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">토리든 다이브인</span>
                        <span className="text-xs text-green-600">참고제품</span>
                      </div>
                      <div className="text-xs text-gray-600">16,800원 | 성분 특화</div>
                    </div>
                  </div>
                </div>

                {/* Market Opportunity */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900">기회 요인</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">성분 투명성 트렌드</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">개인 맞춤화 수요</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">온라인 채널 확대</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">K-뷰티 글로벌 인기</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <div className="text-xs text-gray-500">예상 시장 점유율</div>
                    <div className="text-lg font-bold text-purple-600">0.15%</div>
                    <div className="text-xs text-gray-500">12개월 내 목표</div>
                  </div>
                </div>
              </div>
            </div>


            {/* Marketing Strategy */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">마케팅 전략 & 가격 정책</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm text-gray-600">예상 판매가</div>
                      <div className="text-3xl font-bold text-green-600">{aiSuggestion.target_price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">타겟 고객</div>
                      <div className="text-lg font-semibold text-gray-900">{formData.targetCustomer}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">카테고리</div>
                      <div className="text-lg font-semibold text-gray-900">{formData.productType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">포지셔닝</div>
                      <div className="text-lg font-semibold text-gray-900">프리미엄 세그먼트</div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <div className="flex flex-col space-y-4">
                <h3 className="text-xl font-bold text-gray-900">다음 단계</h3>
                <p className="text-gray-600">AI 제안이 마음에 드시나요? 수정하거나 저장하실 수 있습니다.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-pink-500 hover:text-pink-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span>컨셉 수정하기</span>
                  </button>
                  
                  <button 
                    onClick={handleRegenerateSuggestion}
                    disabled={isGenerating}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{isGenerating ? 'AI 생성 중...' : '새로운 제안 받기'}</span>
                  </button>
                  
                  <button 
                    onClick={handleAcceptSuggestion}
                    className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{isAuthenticated ? '기획안 저장하기' : '로그인 후 저장하기'}</span>
                  </button>
                </div>

                {/* Additional Download Options */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">기획안 내보내기</p>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>PDF 다운로드</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>공유하기</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VibePlay() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>}>
      <VibePlayContent />
    </Suspense>
  );
}