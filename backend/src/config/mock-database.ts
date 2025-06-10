// Mock database for development without PostgreSQL
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  company?: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  product_type: string;
  target_customer: string;
  keywords: string[];
  concept?: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface AISuggestion {
  id: string;
  project_id: string;
  product_name: string;
  concept: string;
  ingredients: any;
  design: any;
  target_price: string;
  features: string[];
  is_accepted: boolean;
  version: number;
  created_at: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  category_id: string;
  image_url?: string;
  tags: string[];
  popularity_score: number;
  is_featured: boolean;
  created_at: string;
}

export interface TrendCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface UserPin {
  id: string;
  user_id: string;
  trend_id: string;
  notes?: string;
  created_at: string;
}

// In-memory storage
let users: User[] = [];
let projects: Project[] = [];
let aiSuggestions: AISuggestion[] = [];
let trends: Trend[] = [];
let trendCategories: TrendCategory[] = [];
let userPins: UserPin[] = [];

// Generate UUID v4
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Initialize with sample data
export const initializeMockData = () => {
  // Categories
  trendCategories = [
    {
      id: 'cat1',
      name: '스킨케어',
      description: '기초 화장품 및 스킨케어 트렌드',
      color: '#FF6B9D',
      created_at: new Date().toISOString()
    },
    {
      id: 'cat2',
      name: '메이크업',
      description: '색조 화장품 트렌드',
      color: '#C44569',
      created_at: new Date().toISOString()
    },
    {
      id: 'cat3',
      name: '바디케어',
      description: '바디 및 헤어케어 트렌드',
      color: '#786FA6',
      created_at: new Date().toISOString()
    },
    {
      id: 'cat4',
      name: '패키징',
      description: '용기 및 패키징 디자인 트렌드',
      color: '#F8B500',
      created_at: new Date().toISOString()
    }
  ];

  // Trends
  trends = [
    {
      id: 'trend1',
      title: '글래스 스킨 트렌드',
      description: '투명하고 윤기 있는 유리 같은 피부를 만드는 K-뷰티 트렌드',
      category_id: 'cat1',
      tags: ['보습', '글로우', 'K-뷰티', '히알루론산'],
      popularity_score: 95,
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'trend2',
      title: '클린 뷰티 성분',
      description: '자연 유래 성분과 지속가능한 포뮬레이션에 대한 관심 증가',
      category_id: 'cat1',
      tags: ['자연성분', '친환경', '비건', '무첨가'],
      popularity_score: 88,
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'trend3',
      title: '미니멀 패키징',
      description: '심플하고 지속가능한 패키징 디자인이 주목받고 있음',
      category_id: 'cat4',
      tags: ['미니멀', '친환경', '재활용', '심플'],
      popularity_score: 82,
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'trend4',
      title: '틴티드 립밤',
      description: '보습과 컬러를 동시에 제공하는 멀티 기능 립 제품',
      category_id: 'cat2',
      tags: ['멀티기능', '자연발색', '보습', '데일리'],
      popularity_score: 79,
      is_featured: false,
      created_at: new Date().toISOString()
    }
  ];

  console.log('🗄️ Mock database initialized with sample data');
};

// Mock query function
export const mockQuery = async (query: string, params?: any[]): Promise<{ rows: any[] }> => {
  const lowerQuery = query.toLowerCase();

  // Health check
  if (lowerQuery.includes('select 1')) {
    return { rows: [{ result: 1 }] };
  }

  // User queries
  if (lowerQuery.includes('select id, email, name, role from users where id')) {
    const userId = params?.[0];
    console.log('Looking for user ID:', userId, 'in users:', users.map(u => ({ id: u.id, email: u.email })));
    const user = users.find(u => u.id === userId && u.is_verified);
    console.log('Found user:', user ? { id: user.id, email: user.email } : 'not found');
    return { rows: user ? [{ id: user.id, email: user.email, name: user.name, role: user.role }] : [] };
  }

  if (lowerQuery.includes('select id, email, name')) {
    const userId = params?.[0];
    const user = users.find(u => u.id === userId);
    return { rows: user ? [user] : [] };
  }

  if (lowerQuery.includes('select id from users where email')) {
    const email = params?.[0];
    const user = users.find(u => u.email === email);
    return { rows: user ? [{ id: user.id }] : [] };
  }

  if (lowerQuery.includes('insert into users')) {
    const [email, password_hash, name, company] = params || [];
    const user: User = {
      id: generateId(),
      email,
      password_hash,
      name,
      company,
      role: 'user',
      is_verified: true,
      created_at: new Date().toISOString()
    };
    users.push(user);
    return { rows: [{ id: user.id, email: user.email, name: user.name, company: user.company }] };
  }

  if (lowerQuery.includes('select id, email, name, company, password_hash, role from users')) {
    const email = params?.[0];
    const user = users.find(u => u.email === email && u.is_verified);
    return { rows: user ? [user] : [] };
  }

  // Trend queries
  if (lowerQuery.includes('from trends t') && lowerQuery.includes('join trend_categories tc')) {
    let filteredTrends = trends.map(trend => {
      const category = trendCategories.find(c => c.id === trend.category_id);
      return {
        ...trend,
        category_name: category?.name,
        category_color: category?.color,
        total_count: trends.length
      };
    });

    // Apply search filter if exists
    if (params && params.length > 0) {
      const searchTerm = params[params.length - 2]; // Search is usually second-to-last param
      if (typeof searchTerm === 'string' && searchTerm.includes('%')) {
        const cleanSearch = searchTerm.replace(/%/g, '').toLowerCase();
        filteredTrends = filteredTrends.filter(t => 
          t.title.toLowerCase().includes(cleanSearch) ||
          t.description.toLowerCase().includes(cleanSearch) ||
          t.tags.some(tag => tag.toLowerCase().includes(cleanSearch))
        );
      }
    }

    // Sort by popularity
    filteredTrends.sort((a, b) => b.popularity_score - a.popularity_score);

    return { rows: filteredTrends };
  }

  if (lowerQuery.includes('from trend_categories')) {
    return { rows: trendCategories };
  }

  // Project queries
  if (lowerQuery.includes('insert into projects')) {
    const [user_id, name, description, product_type, target_customer, keywords, concept, progress] = params || [];
    const project: Project = {
      id: generateId(),
      user_id,
      name,
      description,
      product_type,
      target_customer,
      keywords: keywords || [],
      concept,
      status: 'draft',
      progress: progress || 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    projects.push(project);
    return { rows: [project] };
  }

  if (lowerQuery.includes('from projects')) {
    if (lowerQuery.includes('where id =') && lowerQuery.includes('and user_id =')) {
      const [projectId, userId] = params || [];
      const project = projects.find(p => p.id === projectId && p.user_id === userId);
      return { rows: project ? [project] : [] };
    }

    if (lowerQuery.includes('where user_id =')) {
      const userId = params?.[0];
      const userProjects = projects.filter(p => p.user_id === userId).map(p => ({
        ...p,
        trend_count: 0,
        ai_product_name: null
      }));
      return { rows: userProjects };
    }
  }

  // AI Suggestion queries
  if (lowerQuery.includes('insert into ai_suggestions')) {
    const [project_id, product_name, concept, ingredients, design, target_price, features, version] = params || [];
    const suggestion: AISuggestion = {
      id: generateId(),
      project_id,
      product_name,
      concept,
      ingredients: typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients),
      design: typeof design === 'string' ? design : JSON.stringify(design),
      target_price,
      features: features || [],
      is_accepted: false,
      version: version || 1,
      created_at: new Date().toISOString()
    };
    aiSuggestions.push(suggestion);
    return { rows: [suggestion] };
  }

  if (lowerQuery.includes('from ai_suggestions') && lowerQuery.includes('where project_id =')) {
    if (lowerQuery.includes('order by version desc limit 1')) {
      const projectId = params?.[0];
      const suggestions = aiSuggestions.filter(s => s.project_id === projectId);
      const latestSuggestion = suggestions.sort((a, b) => b.version - a.version)[0];
      return { rows: latestSuggestion ? [latestSuggestion] : [] };
    }
  }

  if (lowerQuery.includes('coalesce(max(version), 0) + 1 as next_version')) {
    const projectId = params?.[0];
    const suggestions = aiSuggestions.filter(s => s.project_id === projectId);
    const maxVersion = suggestions.length > 0 ? Math.max(...suggestions.map(s => s.version)) : 0;
    return { rows: [{ next_version: maxVersion + 1 }] };
  }

  if (lowerQuery.includes('update projects') && lowerQuery.includes('set status')) {
    // Mock update - in real implementation this would update the project
    return { rows: [] };
  }

  // Default empty response
  return { rows: [] };
};

// Mock pool with query method
export const mockPool = {
  query: mockQuery,
  connect: async () => ({
    query: mockQuery,
    release: () => {}
  }),
  end: async () => {},
  on: (event: string, callback: Function) => {
    if (event === 'connect') {
      callback();
    }
  }
};