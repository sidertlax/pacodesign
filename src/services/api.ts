/**
 * SIDERTLAX API Client
 * Centralized API service for all modules
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Mock auth token for development
// TODO: Replace with real auth when auth-service is integrated
const AUTH_TOKEN = 'dev-token-12345';

/**
 * Generic API request wrapper
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================================================
// GASTO MODULE
// ============================================================================

export const gastoAPI = {
  getDependencies: (fiscalYear: number, quarter: number) =>
    apiRequest(`/gasto/dependencies?fiscal_year=${fiscalYear}&quarter=${quarter}`),

  getDependencyDetails: (id: string, fiscalYear: number, quarter: number) =>
    apiRequest(`/gasto/dependencies/${id}?fiscal_year=${fiscalYear}&quarter=${quarter}`),

  getCategories: () => apiRequest('/gasto/categories'),

  saveDraft: (data: any) =>
    apiRequest('/gasto/enlace/save-draft', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitEntry: (entryId: string) =>
    apiRequest('/gasto/enlace/submit', {
      method: 'POST',
      body: JSON.stringify({ entry_id: entryId }),
    }),

  getPendingEntries: () => apiRequest('/gasto/cgpi/pending'),

  validateEntry: (id: string, action: 'validado' | 'rechazado', notes?: string) =>
    apiRequest(`/gasto/cgpi/validate/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    }),
};

// ============================================================================
// INDICADORES MODULE
// ============================================================================

export const indicadoresAPI = {
  getByDependency: (dependencyId: string, fiscalYear: number, quarter: number) =>
    apiRequest(`/indicadores/dependencies/${dependencyId}?fiscal_year=${fiscalYear}&quarter=${quarter}`),

  getStatistics: (dependencyId: string, fiscalYear: number, quarter: number) =>
    apiRequest(`/indicadores/dependencies/${dependencyId}/statistics?fiscal_year=${fiscalYear}&quarter=${quarter}`),

  getAllStatistics: (fiscalYear: number, quarter: number) =>
    apiRequest(`/indicadores/statistics/bulk?fiscal_year=${fiscalYear}&quarter=${quarter}`),

  getById: (id: string) => apiRequest(`/indicadores/${id}`),

  create: (data: any) =>
    apiRequest('/indicadores', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/indicadores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  submit: (id: string) =>
    apiRequest(`/indicadores/${id}/submit`, {
      method: 'POST',
    }),

  getPending: () => apiRequest('/indicadores/admin/pending'),

  validate: (id: string, action: 'validado' | 'rechazado', notes?: string) =>
    apiRequest(`/indicadores/${id}/validate`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    }),

  delete: (id: string) =>
    apiRequest(`/indicadores/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// COMPROMISOS MODULE
// ============================================================================

export const compromisosAPI = {
  getAll: (filters?: { municipio?: string; fase?: string; año_contexto?: string }) => {
    const params = new URLSearchParams(filters as any);
    return apiRequest(`/compromisos?${params.toString()}`);
  },

  getByDependency: (dependencyId: string, añoContexto?: string) => {
    const params = añoContexto && añoContexto !== 'todos' ? `?año_contexto=${añoContexto}` : '';
    return apiRequest(`/compromisos/dependencies/${dependencyId}${params}`);
  },

  getStatistics: (dependencyId: string, añoContexto?: string) => {
    const params = añoContexto && añoContexto !== 'todos' ? `?año_contexto=${añoContexto}` : '';
    return apiRequest(`/compromisos/dependencies/${dependencyId}/statistics${params}`);
  },

  getAllStatistics: (añoContexto?: string) => {
    const params = añoContexto && añoContexto !== 'todos' ? `?año_contexto=${añoContexto}` : '';
    return apiRequest(`/compromisos/statistics/bulk${params}`);
  },

  getById: (id: string) => apiRequest(`/compromisos/${id}`),

  create: (data: any) =>
    apiRequest('/compromisos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/compromisos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  submit: (id: string) =>
    apiRequest(`/compromisos/${id}/submit`, {
      method: 'POST',
    }),

  getPending: () => apiRequest('/compromisos/admin/pending'),

  validate: (id: string, action: 'validado' | 'rechazado', notes?: string) =>
    apiRequest(`/compromisos/${id}/validate`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    }),

  delete: (id: string) =>
    apiRequest(`/compromisos/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// NORMATIVIDAD MODULE
// ============================================================================

export const normatividadAPI = {
  getByDependency: (dependencyId: string) =>
    apiRequest(`/normatividad/dependencies/${dependencyId}`),

  getById: (id: string) => apiRequest(`/normatividad/${id}`),

  create: (data: any) =>
    apiRequest('/normatividad', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/normatividad/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  submit: (id: string) =>
    apiRequest(`/normatividad/${id}/submit`, {
      method: 'POST',
    }),

  getPending: () => apiRequest('/normatividad/admin/pending'),

  validate: (id: string, action: 'validado' | 'rechazado', notes?: string) =>
    apiRequest(`/normatividad/${id}/validate`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    }),

  delete: (id: string) =>
    apiRequest(`/normatividad/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// OBRA PÚBLICA MODULE
// ============================================================================

export const obraPublicaAPI = {
  getAll: (filters?: { municipio?: string; etapa?: string; estado_validacion?: string }) => {
    const params = new URLSearchParams(filters as any);
    return apiRequest(`/obra-publica?${params.toString()}`);
  },

  getByDependency: (dependencyId: string) =>
    apiRequest(`/obra-publica/dependencies/${dependencyId}`),

  getById: (id: string) => apiRequest(`/obra-publica/${id}`),

  create: (data: any) =>
    apiRequest('/obra-publica', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest(`/obra-publica/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  submit: (id: string) =>
    apiRequest(`/obra-publica/${id}/submit`, {
      method: 'POST',
    }),

  addIgdiEvaluation: (id: string, criterio: string, puntaje: number, peso: number) =>
    apiRequest(`/obra-publica/${id}/igdi`, {
      method: 'POST',
      body: JSON.stringify({ criterio, puntaje, peso }),
    }),

  getPending: () => apiRequest('/obra-publica/admin/pending'),

  validate: (id: string, action: 'validado' | 'rechazado', notes?: string) =>
    apiRequest(`/obra-publica/${id}/validate`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    }),

  delete: (id: string) =>
    apiRequest(`/obra-publica/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================================================
// DEPENDENCIES (Shared across modules)
// ============================================================================

export const dependenciesAPI = {
  getAll: () => apiRequest('/dependencies'),
};

export default {
  gasto: gastoAPI,
  indicadores: indicadoresAPI,
  compromisos: compromisosAPI,
  normatividad: normatividadAPI,
  obraPublica: obraPublicaAPI,
  dependencies: dependenciesAPI,
};
