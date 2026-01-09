// Utilitário para URLs da API
export const API_URLS = {
  BASE: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev',
  LOGIN: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_LOGIN_ENDPOINT || '/login'}`,
  REGISTER: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_REGISTER_ENDPOINT || '/register'}`,
  LOGOUT: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_LOGOUT_ENDPOINT || '/logout'}`,
  VERIFY: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_VERIFY_ENDPOINT || '/verify'}`,
  CONVERSAS: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_CONVERSAS_ENDPOINT || '/conversas'}`,
  CONVERSAS_ALL: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_CONVERSAS_ALL_ENDPOINT || '/conversas/all'}`,
  CONVERSAS_STATS: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_CONVERSAS_STATS_ENDPOINT || '/conversas/stats'}`,
  CONVERSAS_STATS_MES: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_CONVERSAS_STATS_MES_ENDPOINT || '/conversas/stats-mes'}`,
  DASH_ATENDENTES: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_DASH_ATENDENTES_ENDPOINT || '/conversas/dash-atendentes'}`,
  MENSAGENS: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev'}${process.env.NEXT_PUBLIC_MENSAGENS_ENDPOINT || '/mensagens'}`
}