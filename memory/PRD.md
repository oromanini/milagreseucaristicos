# Milagres Eucarísticos - PRD

## Problema Original
Site milagreseucaristicos.com.br - Blog documental católico sobre milagres eucarísticos, inspirado em Carlo Acutis. Foco em conclusões científicas e parecer oficial da Igreja Católica.

## Arquitetura
- **Backend**: FastAPI + MongoDB
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Auth**: JWT

## User Personas
1. Católicos praticantes buscando conhecimento sobre milagres
2. Curiosos sobre a relação entre fé e ciência
3. Catequistas e formadores (admin)

## Requisitos Implementados (Jan 2026)

### Frontend
- [x] Homepage com hero cinematográfico (ostensório)
- [x] Tema escuro elegante com detalhes dourados (#D4AF37)
- [x] Filtros por país, século e status canônico
- [x] Cards de milagres em Bento Grid
- [x] Página de detalhe do milagre com seções navegáveis
- [x] Seletor de idioma (PT/EN/ES)
- [x] Páginas institucionais (Sobre, Disclaimer, Privacidade, Termos)
- [x] Área administrativa com CRUD
- [x] Importação em massa via JSON
- [x] Download de template JSON

### Backend
- [x] CRUD completo de milagres
- [x] Autenticação JWT
- [x] Upload de arquivos (imagens/PDFs)
- [x] Importação bulk de milagres
- [x] Filtros e estatísticas

## Backlog (P0/P1/P2)

### P0 (Crítico)
- Popular banco com milagres reais via JSON

### P1 (Alto)
- Melhorar SEO com metadados dinâmicos
- Adicionar lazy loading nas imagens
- Implementar cache de resumos IA

### P2 (Médio)
- Sistema de anúncios católicos (rodapé/lateral)
- CTA para curso catequético futuro
- PWA para acesso offline

## Próximas Ações
1. Gerar JSON com todos os milagres eucarísticos conhecidos usando ChatGPT
2. Importar via admin/import
3. Configurar domínio milagreseucaristicos.com.br
4. Adicionar Google Analytics
