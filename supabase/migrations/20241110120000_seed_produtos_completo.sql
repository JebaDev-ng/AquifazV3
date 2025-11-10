-- =====================================================
-- MIGRATION: Seed Completo de Produtos - Todas Categorias
-- Data: 2024-11-10
-- Descrição: Adiciona produtos diversos nas categorias existentes
-- Dependências: Requer products e product_categories criadas
-- Nota: Usa categorias já existentes (cartoes, banners, adesivos, print, flyers)
-- =====================================================

BEGIN;
BEGIN;

-- =====================================================
-- PRODUTOS - BANNERS E COMUNICAÇÃO VISUAL
-- =====================================================

INSERT INTO products (
  name, slug, description, category, price, original_price, unit,
  specifications, tags, meta_description,
  active, featured, show_on_home, min_quantity, sort_order
) VALUES
  -- Fachada
  (
    'Fachada',
    'fachada',
    'Comunicação visual externa completa para sua empresa. Destaque sua marca com qualidade e durabilidade.',
    'banners',
    250.00,
    1500.00,
    'projeto',
    '{"material": "ACM, Lona ou Acrílico", "instalacao": "Inclusa", "iluminacao": "Opcional", "durabilidade": "5-10 anos"}'::jsonb,
    ARRAY['fachada', 'comunicação visual', 'externa', 'identidade visual'],
    'Fachadas personalizadas para comunicação visual externa com instalação incluída',
    true,
    true,
    true,
    1,
    10
  ),
  
  -- Faixa Divulgação
  (
    'Faixa Divulgação',
    'faixa-divulgacao',
    'Faixa promocional em lona resistente. Ideal para eventos, promoções e divulgação temporária.',
    'banners',
    20.00,
    60.00,
    'm²',
    '{"material": "Lona 440g", "acabamento": "Ilhós nas bordas", "impressao": "Digital colorida", "uso": "Externo/Interno"}'::jsonb,
    ARRAY['faixa', 'divulgação', 'promocional', 'evento'],
    'Faixas promocionais em lona resistente para divulgação de eventos e promoções',
    true,
    false,
    true,
    1,
    20
  ),
  
  -- Banner Lona
  (
    'Banner Lona',
    'banner-lona',
    'Banner em lona resistente para uso interno e externo. Impressão digital de alta qualidade.',
    'banners',
    20.00,
    45.00,
    'm²',
    '{"material": "Lona 440g", "acabamento": "Ilhós ou bastão", "impressao": "Digital 4x0", "durabilidade": "2-3 anos externa"}'::jsonb,
    ARRAY['banner', 'lona', 'resistente', 'externo'],
    'Banners em lona resistente com impressão digital de alta qualidade',
    true,
    true,
    true,
    1,
    30
  ),
  
  -- Placa de Parede
  (
    'Placa de Parede',
    'placa-de-parede',
    'Placas rígidas para sinalização interna e externa. Diversos tamanhos e materiais disponíveis.',
    'banners',
    20.00,
    120.00,
    'unidade',
    '{"material": "PVC, ACM ou Acrílico", "espessura": "3mm a 5mm", "impressao": "Digital UV", "fixacao": "Fita dupla face ou parafuso"}'::jsonb,
    ARRAY['placa', 'parede', 'sinalização', 'rígida'],
    'Placas de parede rígidas para sinalização interna e externa',
    true,
    false,
    false,
    1,
    40
  ),

-- =====================================================
-- PRODUTOS - ADESIVOS
-- =====================================================
  
  -- Adesivo de Parede
  (
    'Adesivo de Parede',
    'adesivo-de-parede',
    'Adesivo decorativo e comercial para ambientes internos. Fácil aplicação e remoção sem danificar.',
    'adesivos',
    60.00,
    180.00,
    'm²',
    '{"material": "Vinil adesivo", "acabamento": "Corte eletrônico", "aplicacao": "Interna", "remocao": "Sem resíduos"}'::jsonb,
    ARRAY['adesivo', 'parede', 'decorativo', 'comercial'],
    'Adesivos de parede decorativos e comerciais com fácil aplicação',
    true,
    false,
    false,
    1,
    50
  ),
  
  -- Adesivo de Vinil
  (
    'Adesivo de Vinil',
    'adesivo-de-vinil',
    'Adesivo durável para aplicações diversas. Resistente a água e intempéries.',
    'adesivos',
    40.00,
    120.00,
    'm²',
    '{"material": "Vinil calendrado", "acabamento": "Corte ou impresso", "uso": "Externo/Interno", "durabilidade": "3-5 anos"}'::jsonb,
    ARRAY['adesivo', 'vinil', 'durável', 'resistente'],
    'Adesivos de vinil duráveis e resistentes para uso externo e interno',
    true,
    false,
    false,
    1,
    60
  ),
  
  -- Adesivo Fotográfico
  (
    'Adesivo Fotográfico',
    'adesivo-fotografico',
    'Adesivo de alta resolução com qualidade fotográfica. Perfeito para reprodução de imagens detalhadas.',
    'adesivos',
    50.00,
    150.00,
    'm²',
    '{"material": "Vinil foto", "resolucao": "1440 dpi", "acabamento": "Laminação UV", "aplicacao": "Interna"}'::jsonb,
    ARRAY['adesivo', 'fotográfico', 'alta resolução', 'qualidade'],
    'Adesivos fotográficos de alta resolução para reprodução detalhada de imagens',
    true,
    false,
    false,
    1,
    70
  ),

-- =====================================================
-- PRODUTOS - IMPRESSÕES E MATERIAIS GRÁFICOS
-- =====================================================
-- =====================================================
-- PRODUTOS - IMPRESSÕES E MATERIAIS GRÁFICOS
-- =====================================================
  
  -- Cardápio em PVC
  (
    'Cardápio em PVC',
    'cardapio-em-pvc',
    'Cardápio rígido e durável em PVC. Fácil higienização, ideal para restaurantes e lanchonetes.',
    'print',
    25.00,
    70.00,
    'unidade',
    '{"material": "PVC 3mm", "tamanho": "A4 ou A3", "impressao": "Digital UV", "acabamento": "Cantos arredondados"}'::jsonb,
    ARRAY['cardápio', 'PVC', 'restaurante', 'durável'],
    'Cardápios em PVC rígido e durável para restaurantes',
    true,
    false,
    false,
    1,
    80
  ),
  
  -- Cardápio Laminado
  (
    'Cardápio Laminado',
    'cardapio-laminado',
    'Cardápio com laminação protetiva. Proteção contra umidade e sujeira com custo acessível.',
    'print',
    15.00,
    40.00,
    'unidade',
    '{"papel": "Couché 300g", "laminacao": "BOPP fosco ou brilho", "tamanho": "A4 ou A3", "faces": "Frente e verso"}'::jsonb,
    ARRAY['cardápio', 'laminado', 'proteção', 'econômico'],
    'Cardápios laminados com proteção contra umidade e sujeira',
    true,
    false,
    false,
    1,
    90
  ),

-- =====================================================
-- PRODUTOS - CARTÕES E PAPELARIA
-- =====================================================

  -- Camisa Manga Curta
  (
    'Camisa Manga Curta',
    'camisa-manga-curta',
    'Personalização em DTF ou silk screen. Camisas de qualidade com estampas duráveis e vibrantes.',
    'cartoes',
    30.00,
    60.00,
    'unidade',
    '{"tecido": "100% Algodão ou PV", "estampa": "DTF ou Silk", "tamanhos": "P ao GG", "cores": "Variadas"}'::jsonb,
    ARRAY['camisa', 'personalizada', 'DTF', 'silk', 'brinde'],
    'Camisas manga curta personalizadas com estampa DTF ou silk screen',
    true,
    true,
    true,
    1,
    100
  ),
  
  -- Camisa Manga Longa
  (
    'Camisa Manga Longa',
    'camisa-manga-longa',
    'Personalização estampada em manga longa. Conforto e estilo para equipes e eventos.',
    'cartoes',
    40.00,
    80.00,
    'unidade',
    '{"tecido": "100% Algodão ou Moletom", "estampa": "DTF ou Silk", "tamanhos": "P ao GG", "cores": "Variadas"}'::jsonb,
    ARRAY['camisa', 'manga longa', 'personalizada', 'uniforme'],
    'Camisas manga longa personalizadas para equipes e eventos',
    true,
    false,
    false,
    1,
    110
  ),
  
  -- Papelaria Personalizada
  (
    'Papelaria Personalizada',
    'papelaria-personalizada',
    'Kits completos de papelaria corporativa. Timbrado, envelope, cartão de visitas e muito mais.',
    'cartoes',
    30.00,
    150.00,
    'kit',
    '{"itens": "Papel timbrado, envelope, cartão", "papel": "Diversos gramatures", "impressao": "Colorida", "quantidade": "Personalizável"}'::jsonb,
    ARRAY['papelaria', 'kit', 'corporativo', 'identidade visual'],
    'Kits completos de papelaria personalizada para empresas',
    true,
    false,
    false,
    1,
    120
  ),
  
  -- Figurinhas para WhatsApp
  (
    'Figurinhas para WhatsApp',
    'figurinhas-para-whatsapp',
    'Stickers personalizados para WhatsApp. Pack com 20 a 30 figurinhas exclusivas da sua marca.',
    'cartoes',
    10.00,
    30.00,
    'pack',
    '{"formato": "PNG transparente", "quantidade": "20-30 stickers", "entrega": "Digital via link", "compatibilidade": "Android e iOS"}'::jsonb,
    ARRAY['figurinhas', 'whatsapp', 'stickers', 'digital'],
    'Packs de figurinhas personalizadas para WhatsApp',
    true,
    true,
    true,
    1,
    130
  ),
  
  -- Logotipo
  (
    'Logotipo (entrega do arquivo)',
    'logotipo-entrega-arquivo',
    'Criação de logotipo profissional com entrega dos arquivos editáveis. Identidade visual única para sua marca.',
    'cartoes',
    80.00,
    350.00,
    'projeto',
    '{"entrega": "AI, EPS, PDF, PNG, SVG", "revisoes": "3 opções iniciais", "prazo": "5-7 dias úteis", "manual": "Guia de aplicação incluído"}'::jsonb,
    ARRAY['logotipo', 'logo', 'identidade visual', 'design'],
    'Criação profissional de logotipo com entrega de arquivos editáveis',
    true,
    true,
    true,
    1,
    140
  ),

-- =====================================================
-- PRODUTOS - SERVIÇOS DIGITAIS
-- =====================================================
-- =====================================================
-- PRODUTOS - SERVIÇOS DIGITAIS
-- =====================================================

  -- Digitações
  (
    'Digitações',
    'digitacoes',
    'Serviço de digitação de textos e documentos. Rápido, preciso e formatado conforme suas necessidades.',
    'print',
    5.00,
    25.00,
    'página',
    '{"formato": "Word, PDF ou TXT", "revisao": "Incluída", "prazo": "24-48h", "confidencialidade": "Garantida"}'::jsonb,
    ARRAY['digitação', 'texto', 'documento', 'transcrição'],
    'Serviço profissional de digitação de textos e documentos',
    true,
    false,
    false,
    1,
    150
  ),
  
  -- Digitalizações
  (
    'Digitalizações',
    'digitalizacoes',
    'Escaneamento de documentos e fotos em alta resolução. Preservação e backup digital.',
    'print',
    1.00,
    3.00,
    'página',
    '{"resolucao": "300-600 dpi", "formato": "PDF ou JPG", "cores": "Colorido ou PB", "prazo": "Imediato"}'::jsonb,
    ARRAY['digitalização', 'scanner', 'documento', 'foto'],
    'Escaneamento profissional de documentos e fotos em alta resolução',
    true,
    false,
    false,
    1,
    160
  ),
  
  -- Edição de Documentos
  (
    'Edição de Documentos',
    'edicao-de-documentos',
    'Ajuste, correção e formatação profissional de documentos. Normas ABNT, TCC, artigos e mais.',
    'print',
    10.00,
    50.00,
    'documento',
    '{"servicos": "Correção, formatação, ABNT", "software": "Word, PDF", "prazo": "24-72h", "revisoes": "2 rodadas incluídas"}'::jsonb,
    ARRAY['edição', 'formatação', 'ABNT', 'documento'],
    'Edição e formatação profissional de documentos acadêmicos e corporativos',
    true,
    false,
    false,
    1,
    170
  ),
  
  -- Slides em Power Point
  (
    'Slides em Power Point',
    'slides-em-power-point',
    'Apresentações profissionais personalizadas. Design moderno e conteúdo organizado.',
    'print',
    20.00,
    80.00,
    'apresentação',
    '{"slides": "10-30 slides", "design": "Template personalizado", "animacoes": "Incluídas", "formato": "PPTX"}'::jsonb,
    ARRAY['slides', 'powerpoint', 'apresentação', 'design'],
    'Criação de apresentações profissionais em PowerPoint',
    true,
    false,
    false,
    1,
    180
  ),
  
  -- Slides em Vídeo
  (
    'Slides em Vídeo',
    'slides-em-video',
    'Transforme suas apresentações em vídeo animado. Ideal para redes sociais e plataformas online.',
    'print',
    40.00,
    150.00,
    'vídeo',
    '{"duracao": "1-3 minutos", "formato": "MP4, MOV", "qualidade": "Full HD", "trilha": "Música de fundo opcional"}'::jsonb,
    ARRAY['vídeo', 'slides', 'animação', 'apresentação'],
    'Conversão de apresentações em vídeos animados profissionais',
    true,
    true,
    true,
    1,
    190
  ),
  
  -- Vetorização de Logotipo
  (
    'Vetorização de Logotipo',
    'vetorizacao-de-logotipo',
    'Converta sua logo em vetor editável. Qualidade infinita para qualquer tamanho de impressão.',
    'print',
    20.00,
    80.00,
    'arquivo',
    '{"entrega": "AI, EPS, SVG, PDF", "qualidade": "Alta fidelidade", "prazo": "24-48h", "uso": "Ilimitado"}'::jsonb,
    ARRAY['vetorização', 'logo', 'vetor', 'design'],
    'Serviço de vetorização profissional de logotipos',
    true,
    false,
    false,
    1,
    200
  ),
  
  -- Banner para Rede Social
  (
    'Banner para Rede Social',
    'banner-para-rede-social',
    'Arte digital para suas redes sociais. Design otimizado para Instagram, Facebook, LinkedIn e mais.',
    'print',
    20.00,
    60.00,
    'arte',
    '{"formatos": "Feed, Stories, Capa", "plataformas": "Instagram, Facebook, LinkedIn", "revisoes": "2 incluídas", "entrega": "PNG, JPG"}'::jsonb,
    ARRAY['banner', 'rede social', 'design', 'marketing digital'],
    'Criação de banners profissionais para redes sociais',
    true,
    true,
    true,
    1,
    210
  ),
  
  -- Laminação BOPP
  (
    'Laminação BOPP',
    'laminacao-bopp',
    'Laminação fosca ou brilho para proteção e acabamento premium. Durabilidade e elegância.',
    'print',
    5.00,
    20.00,
    'peça A4',
    '{"tipos": "Fosco ou Brilho", "espessura": "BOPP 30 micras", "aplicacao": "Cartões, folders, capas", "protecao": "Água e sujeira"}'::jsonb,
    ARRAY['laminação', 'BOPP', 'acabamento', 'proteção'],
    'Serviço de laminação BOPP fosca ou brilho para acabamento premium',
    true,
    false,
    false,
    1,
    220
  )

ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    unit = EXCLUDED.unit,
    specifications = EXCLUDED.specifications,
    tags = EXCLUDED.tags,
    meta_description = EXCLUDED.meta_description,
    active = EXCLUDED.active,
    featured = EXCLUDED.featured,
    show_on_home = EXCLUDED.show_on_home,
    min_quantity = EXCLUDED.min_quantity,
    sort_order = EXCLUDED.sort_order,
    updated_at = TIMEZONE('utc', NOW());

COMMIT;
