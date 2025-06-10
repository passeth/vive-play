'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { projects, auth, Project } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/');
      return;
    }
    loadProjects();
  }, [router]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projects.getAll();
      setProjectsList(response.projects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('프로젝트를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
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
              <Link href="/dashboard" className="text-pink-600 font-semibold">대시보드</Link>
              <Link href="/trends" className="text-gray-600 hover:text-pink-600 transition">트렌드핀</Link>
              <Link href="/vibe-play" className="text-gray-600 hover:text-pink-600 transition">Vibe Play</Link>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프로젝트 대시보드</h1>
          <p className="text-gray-600">진행 중인 화장품 기획 프로젝트를 관리하세요</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 프로젝트</p>
                <p className="text-3xl font-bold text-gray-900">{loading ? '-' : projectsList.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">완료된 기획</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">저장된 트렌드핀</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">내 프로젝트</h2>
              <Link 
                href="/vibe-play"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>새 프로젝트</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-600">프로젝트를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={loadProjects}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
              >
                다시 시도
              </button>
            </div>
          ) : projectsList.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">첫 프로젝트를 시작해보세요</h3>
              <p className="text-gray-600 mb-6">AI와 함께 화장품 기획을 시작할 수 있습니다</p>
              <Link 
                href="/vibe-play"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition inline-flex items-center space-x-2"
              >
                <span>첫 프로젝트 만들기</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {projectsList.map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">{project.product_type}</span>
                        <span className="text-sm text-pink-600 font-medium">{project.status}</span>
                        <span className="text-sm text-gray-500">{project.target_customer}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/vibe-play`}
                      className="text-pink-600 hover:text-pink-700 font-medium"
                    >
                      열기 →
                    </Link>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>진행률</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    마지막 수정: {new Date(project.updated_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/trends" className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">트렌드 탐색하기</h3>
                <p className="text-gray-600">최신 화장품 트렌드를 확인해보세요</p>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/mypins" className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">마이핀 보기</h3>
                <p className="text-gray-600">저장된 트렌드핀을 관리하세요</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}