import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-brand rounded-lg"></div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Vibe-Play
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/trends" className="text-gray-600 hover:text-pink-600 transition">트렌드핀</Link>
          <Link href="/about" className="text-gray-600 hover:text-pink-600 transition">서비스 소개</Link>
          <Link href="/pricing" className="text-gray-600 hover:text-pink-600 transition">요금제</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-pink-600 transition">로그인</Link>
          <Link href="/signup" className="bg-gradient-brand text-white px-4 py-2 rounded-lg hover:shadow-lg transition">
            시작하기
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI가 만드는
            </span>
            <br />
            <span className="text-gray-900">화장품 기획의 혁신</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            트렌드 분석부터 제품 기획, 무드보드 생성까지. 
            AI와 함께 당신만의 화장품을 만들어보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/vibe-play" className="bg-gradient-brand text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition">
              무료로 시작하기
            </Link>
            <Link href="/trends" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-pink-500 hover:text-pink-600 transition">
              트렌드 탐색하기
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-primary-100 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vibe Play</h3>
            <p className="text-gray-600 leading-relaxed">
              AI와 함께 제품 컨셉을 구체화하고, 성분부터 디자인까지 종합적인 기획안을 생성합니다.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">트렌드핀 아카이브</h3>
            <p className="text-gray-600 leading-relaxed">
              최신 화장품 트렌드를 탐색하고, 마이핀에 저장하여 프로젝트에 활용하세요.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl mb-6 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">제조사 연결</h3>
            <p className="text-gray-600 leading-relaxed">
              기획이 완료되면 최적의 제조사와 매칭하여 견적부터 샘플 제작까지 원스톱 진행합니다.
            </p>
          </div>
        </div>

        {/* Process Flow */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            간단한 3단계로 완성하는 화장품 기획
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">아이디어 입력</h3>
              <p className="text-gray-600">제품 유형, 타겟 고객, 핵심 키워드를 입력하고 트렌드를 탐색합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI 기획 생성</h3>
              <p className="text-gray-600">AI가 제품명, 컨셉, 성분, 디자인 제안을 종합적으로 생성합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">제조사 연결</h3>
              <p className="text-gray-600">완성된 기획안으로 견적을 받고 샘플 제작을 진행합니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}