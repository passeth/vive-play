'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { trends, auth, Trend, TrendCategory } from '@/lib/api';

export default function TrendsArchive() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendsList, setTrendsList] = useState<Trend[]>([]);
  const [categories, setCategories] = useState<TrendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [pinnedTrends, setPinnedTrends] = useState<Set<string>>(new Set());

  // Load trends and categories
  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  // Check pin status for authenticated users
  useEffect(() => {
    if (auth.isAuthenticated() && trendsList.length > 0) {
      checkPinStatuses();
    }
  }, [trendsList]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories on first load
      if (categories.length === 0) {
        const categoriesResponse = await trends.getCategories();
        setCategories(categoriesResponse.categories);
      }

      // Load trends with filters
      const filterParams: any = {
        page: 1,
        limit: 20
      };
      
      if (selectedCategory !== '전체') {
        filterParams.category = selectedCategory;
      }
      
      if (searchQuery) {
        filterParams.search = searchQuery;
      }
      
      const trendsResponse = await trends.getAll(filterParams);

      setTrendsList(trendsResponse.trends);
      setPagination(trendsResponse.pagination);

    } catch (err) {
      console.error('Failed to load trends:', err);
      setError('트렌드를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const checkPinStatuses = async () => {
    if (!auth.isAuthenticated()) return;

    try {
      const pinStatuses = await Promise.allSettled(
        trendsList.map(trend => trends.checkPinStatus(trend.id))
      );

      const newPinnedTrends = new Set<string>();
      pinStatuses.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.isPinned) {
          newPinnedTrends.add(trendsList[index].id);
        }
      });

      setPinnedTrends(newPinnedTrends);
    } catch (err) {
      console.error('Failed to check pin statuses:', err);
    }
  };

  const togglePin = async (trendId: string) => {
    if (!auth.isAuthenticated()) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const isPinned = pinnedTrends.has(trendId);
      
      if (isPinned) {
        await trends.unpin(trendId);
        setPinnedTrends(prev => {
          const newSet = new Set(prev);
          newSet.delete(trendId);
          return newSet;
        });
      } else {
        await trends.pin(trendId);
        setPinnedTrends(prev => new Set(prev).add(trendId));
      }
    } catch (err) {
      console.error('Failed to toggle pin:', err);
      alert('핀 상태 변경에 실패했습니다.');
    }
  };

  const categoryOptions = ['전체', ...categories.map(cat => cat.name)];

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
              <Link href="/trends" className="text-pink-600 font-semibold">트렌드핀</Link>
              <Link href="/vibe-play" className="text-gray-600 hover:text-pink-600 transition">Vibe Play</Link>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">트렌드핀 아카이브</h1>
          <p className="text-gray-600">최신 화장품 트렌드를 탐색하고 마이핀에 저장하세요</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="트렌드 검색..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-gray-600">트렌드를 불러오는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{pagination.totalCount}</span>개의 트렌드
              </p>
              <div className="flex items-center space-x-4">
                {auth.isAuthenticated() && (
                  <Link href="/dashboard/mypins" className="text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>마이핀 보기</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Trend Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendsList.map((trend) => (
                <div key={trend.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group">
                  {/* Image */}
                  <div className="relative h-48" style={{ backgroundColor: trend.category_color + '20' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8" style={{ color: trend.category_color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600">{trend.category_name}</p>
                      </div>
                    </div>
                    
                    {/* Pin Button */}
                    {auth.isAuthenticated() && (
                      <button
                        onClick={() => togglePin(trend.id)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition ${
                          pinnedTrends.has(trend.id)
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-white text-gray-400 hover:text-pink-500 shadow-md'
                        }`}
                      >
                        <svg className="w-4 h-4" fill={pinnedTrends.has(trend.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span 
                        className="text-white text-xs px-2 py-1 rounded-full font-medium shadow-md"
                        style={{ backgroundColor: trend.category_color }}
                      >
                        {trend.category_name}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {trend.is_featured && (
                      <div className="absolute top-12 left-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                          🔥 인기
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition">
                        {trend.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>{trend.popularity_score}%</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {trend.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {trend.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
                          onClick={() => setSearchQuery(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">
                        자세히 보기
                      </button>
                      <div className="flex space-x-2">
                        {auth.isAuthenticated() && (
                          <button
                            onClick={() => togglePin(trend.id)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                              pinnedTrends.has(trend.id)
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700'
                            }`}
                          >
                            {pinnedTrends.has(trend.id) ? '핀 해제' : '핀하기'}
                          </button>
                        )}
                        <Link
                          href={`/vibe-play?trend=${encodeURIComponent(trend.title)}&category=${encodeURIComponent(trend.category_name)}&tags=${encodeURIComponent(trend.tags.join(','))}`}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:shadow-lg transition"
                        >
                          활용하기
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
          ))}
        </div>

            {/* Empty State */}
            {trendsList.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600 mb-6">다른 키워드로 검색해보시거나 카테고리를 변경해보세요</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('전체');
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  전체 트렌드 보기
                </button>
              </div>
            )}

            {/* Load More */}
            {pagination.hasNextPage && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => {
                    // Load next page logic would go here
                    console.log('Load more trends');
                  }}
                  className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-pink-500 hover:text-pink-600 transition"
                >
                  더 많은 트렌드 보기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}