-- =====================================================
-- MIGRATION: Seed Produtos Categoria Impressões (print)
-- Data: 2024-11-09
-- Descrição: Adiciona 35 produtos reais da categoria print
-- Dependências: Requer products e product_categories criadas
-- =====================================================

BEGIN;

-- 1. Garantir que a categoria "print" existe (categoria padrão do sistema)
INSERT INTO product_categories (id, name, description, icon, sort_order, active)
VALUES (
  'print',
  'Impressões',
  'Serviços gerais de impressão',
  'Printer',
  4,
  true
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    active = true,
    updated_at = TIMEZONE('utc', NOW());

-- 2. Inserir produtos da categoria print (Impressões)
INSERT INTO products (
  name, slug, description, category, price, original_price, unit,
  specifications, tags, meta_description,
  active, featured, show_on_home, min_quantity, sort_order
) VALUES
  -- Convites
  ('Convite de Casamento', 'convite-de-casamento', 'Convite premium com papéis especiais. Impressão de alta qualidade com acabamento sofisticado.', 'print', 3.00, 12.00, 'unidade', '{"papel": "Papel especial", "acabamento": "Premium", "cores": "Colorido", "tamanho": "Personalizado"}'::jsonb, ARRAY['convite', 'casamento', 'premium', 'personalizado'], 'Convite de casamento premium com papéis especiais e impressão de alta qualidade', true, false, false, 1, 10),
  ('Convite Empresarial', 'convite-empresarial', 'Convites formais corporativos. Ideal para eventos empresariais e networking.', 'print', 2.50, 7.00, 'unidade', '{"papel": "Couché 250g", "acabamento": "Fosco", "cores": "Colorido", "tamanho": "10x15cm"}'::jsonb, ARRAY['convite', 'empresarial', 'corporativo', 'evento'], 'Convites empresariais formais para eventos corporativos', true, false, false, 1, 20),
  ('Convite Formatura', 'convite-formatura', 'Convites personalizados para turmas. Design exclusivo para celebrar sua conquista.', 'print', 2.50, 8.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Brilho", "cores": "Colorido", "tamanho": "Personalizado"}'::jsonb, ARRAY['convite', 'formatura', 'personalizado', 'turma'], 'Convites de formatura personalizados para sua turma', true, false, false, 1, 30),
  ('Convite de Aniversário', 'convite-de-aniversario', 'Convite simples ou ilustrado. Perfeito para festas infantis e adultas.', 'print', 1.50, 6.00, 'unidade', '{"papel": "Couché 250g", "acabamento": "Brilho ou Fosco", "cores": "Colorido", "tamanho": "10x15cm"}'::jsonb, ARRAY['convite', 'aniversário', 'festa', 'infantil'], 'Convites de aniversário personalizados para todas as idades', true, false, false, 1, 40),
  
  -- Materiais Promocionais
  ('Flyer', 'flyer', 'Impressos promocionais. Ideal para divulgação de produtos e serviços.', 'print', 80.00, 200.00, 'milheiro', '{"papel": "Couché 150g", "acabamento": "Brilho", "cores": "4x0 ou 4x4", "tamanho": "A5 (14,8x21cm)"}'::jsonb, ARRAY['flyer', 'promocional', 'divulgação', 'marketing'], 'Flyers promocionais para divulgação de produtos e serviços', true, true, true, 1, 50),
  ('Panfleto', 'panfleto', 'Panfleto colorido ou PB. Excelente custo-benefício para campanhas.', 'print', 70.00, 180.00, 'milheiro', '{"papel": "Sulfite 75g", "acabamento": "Sem acabamento", "cores": "Colorido ou PB", "tamanho": "A5 (14,8x21cm)"}'::jsonb, ARRAY['panfleto', 'divulgação', 'campanha', 'promocional'], 'Panfletos coloridos ou preto e branco para campanhas promocionais', true, false, true, 1, 60),
  ('Folder 1 Dobra', 'folder-1-dobra', 'Material dobrado profissional. Apresentação elegante para sua empresa.', 'print', 150.00, 300.00, 'milheiro', '{"papel": "Couché 170g", "acabamento": "Brilho ou Fosco", "cores": "4x4", "tamanho": "A4 aberto (21x29,7cm)"}'::jsonb, ARRAY['folder', 'dobrado', 'profissional', 'apresentação'], 'Folders com 1 dobra para apresentação profissional', true, false, false, 1, 70),
  ('Folder 2 Dobras', 'folder-2-dobras', 'Folder tríptico. Mais espaço para informações detalhadas.', 'print', 200.00, 390.00, 'milheiro', '{"papel": "Couché 170g", "acabamento": "Brilho ou Fosco", "cores": "4x4", "tamanho": "A4 aberto (21x29,7cm)"}'::jsonb, ARRAY['folder', 'tríptico', '2 dobras', 'informativo'], 'Folders trípticos com 2 dobras para informações detalhadas', true, false, false, 1, 80),
  
  -- Papelaria Corporativa
  ('Papel Timbrado', 'papel-timbrado', 'Papel institucional. Identidade visual para sua empresa.', 'print', 80.00, 160.00, '100 unidades', '{"papel": "Sulfite 75g", "acabamento": "Sem acabamento", "cores": "4x0", "tamanho": "A4 (21x29,7cm)"}'::jsonb, ARRAY['papel timbrado', 'institucional', 'identidade visual', 'empresa'], 'Papel timbrado institucional para sua empresa', true, false, false, 1, 90),
  ('Cartão de Visitas', 'cartao-de-visitas', 'Padrão 300g. Essencial para networking profissional.', 'print', 35.00, 80.00, 'milheiro', '{"papel": "Couché 300g", "acabamento": "Fosco ou Brilho", "cores": "4x4", "tamanho": "9x5cm"}'::jsonb, ARRAY['cartão de visita', 'networking', 'profissional', 'contato'], 'Cartões de visita padrão 300g para networking profissional', true, true, true, 1, 100),
  ('Cartão Postal', 'cartao-postal', 'Impressão estilo postal. Perfeito para correspondências especiais.', 'print', 1.00, 3.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Brilho", "cores": "4x4", "tamanho": "10x15cm"}'::jsonb, ARRAY['cartão postal', 'correspondência', 'postal', 'lembrança'], 'Cartões postais para correspondências especiais', true, false, false, 1, 110),
  ('Certificado', 'certificado', 'Documento personalizado. Valorize conquistas e participações.', 'print', 2.00, 6.00, 'unidade', '{"papel": "Vergê 180g", "acabamento": "Sem acabamento", "cores": "4x0", "tamanho": "A4 (21x29,7cm)"}'::jsonb, ARRAY['certificado', 'documento', 'personalizado', 'conquista'], 'Certificados personalizados para eventos e cursos', true, false, false, 1, 120),
  ('Marca Página', 'marca-pagina', 'Marcador de livros. Útil e promocional.', 'print', 1.00, 3.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Brilho", "cores": "4x4", "tamanho": "5x15cm"}'::jsonb, ARRAY['marca página', 'marcador', 'livro', 'promocional'], 'Marcadores de página personalizados', true, false, false, 1, 130),
  
  -- Material Didático
  ('Apostilas', 'apostilas', 'Impressão + encadernação. Material didático completo.', 'print', 15.00, 60.00, 'unidade', '{"papel": "Sulfite 75g", "acabamento": "Espiral ou grampo", "cores": "PB ou Colorido", "tamanho": "A4 (21x29,7cm)"}'::jsonb, ARRAY['apostila', 'encadernação', 'didático', 'curso'], 'Apostilas impressas e encadernadas para cursos', true, false, false, 1, 140),
  ('Receituário', 'receituario', 'Talão médico/profissional. Personalizado com seus dados.', 'print', 20.00, 70.00, 'bloco', '{"papel": "Sulfite 75g", "acabamento": "Bloco colado", "cores": "1x0 ou 4x0", "tamanho": "A5 (14,8x21cm)"}'::jsonb, ARRAY['receituário', 'médico', 'profissional', 'talão'], 'Receituários personalizados para profissionais da saúde', true, false, false, 1, 150),
  ('Revista com Grampo', 'revista-com-grampo', 'Revista grampeada. Acabamento profissional.', 'print', 4.00, 12.00, 'unidade', '{"papel": "Couché 150g (capa) + Sulfite 75g (miolo)", "acabamento": "Grampo canoa", "cores": "4x4", "tamanho": "A4 (21x29,7cm)"}'::jsonb, ARRAY['revista', 'grampo', 'publicação', 'editorial'], 'Revistas grampeadas com acabamento profissional', true, false, false, 1, 160),
  ('Bloco de Anotações', 'bloco-de-anotacoes', 'Bloco personalizado. Útil para o dia a dia.', 'print', 6.00, 20.00, 'unidade', '{"papel": "Sulfite 75g", "acabamento": "Bloco colado", "cores": "1x0 ou 4x0", "tamanho": "A5 ou A6"}'::jsonb, ARRAY['bloco', 'anotações', 'personalizado', 'escritório'], 'Blocos de anotações personalizados', true, false, false, 1, 170),
  ('Planner Semanal', 'planner-semanal', 'Planner impresso. Organize sua semana com estilo.', 'print', 10.00, 30.00, 'unidade', '{"papel": "Sulfite 90g", "acabamento": "Espiral", "cores": "Colorido", "tamanho": "A5 (14,8x21cm)"}'::jsonb, ARRAY['planner', 'semanal', 'organização', 'agenda'], 'Planners semanais para organização pessoal', true, false, false, 1, 180),
  
  -- Embalagens e Etiquetas
  ('Capa de Carnê', 'capa-de-carne', 'Capa personalizada. Proteção e identidade visual.', 'print', 1.00, 3.00, 'unidade', '{"papel": "Couché 250g", "acabamento": "Brilho ou Fosco", "cores": "4x0", "tamanho": "10x15cm"}'::jsonb, ARRAY['capa', 'carnê', 'personalizado', 'proteção'], 'Capas personalizadas para carnês', true, false, false, 1, 190),
  ('Pasta Personalizada', 'pasta-personalizada', 'Impressa ou laminada. Organize documentos com elegância.', 'print', 4.00, 12.00, 'unidade', '{"papel": "Triplex 300g", "acabamento": "Laminação fosca ou brilho", "cores": "4x0", "tamanho": "A4 (22x31cm)"}'::jsonb, ARRAY['pasta', 'personalizada', 'documentos', 'organização'], 'Pastas personalizadas para organização de documentos', true, false, false, 1, 200),
  ('Envelope', 'envelope', 'Envelope personalizado. Correspondência com identidade.', 'print', 1.00, 3.50, 'unidade', '{"papel": "Sulfite 90g", "acabamento": "Sem acabamento", "cores": "1x0 ou 4x0", "tamanho": "Diversos tamanhos"}'::jsonb, ARRAY['envelope', 'personalizado', 'correspondência', 'carta'], 'Envelopes personalizados para correspondências', true, false, false, 1, 210),
  ('Etiquetas', 'etiquetas', 'Cartela de adesivos personalizados. Identifique seus produtos.', 'print', 15.00, 60.00, 'cartela', '{"papel": "Adesivo couché", "acabamento": "Corte especial", "cores": "4x0", "tamanho": "Personalizado"}'::jsonb, ARRAY['etiqueta', 'adesivo', 'personalizado', 'identificação'], 'Etiquetas adesivas personalizadas para produtos', true, false, false, 1, 220),
  ('Solapa', 'solapa', 'Impressos para embalagens. Acabamento profissional.', 'print', 0.80, 2.50, 'unidade', '{"papel": "Couché 250g", "acabamento": "Corte e vinco", "cores": "4x0", "tamanho": "Personalizado"}'::jsonb, ARRAY['solapa', 'embalagem', 'acabamento', 'produto'], 'Solapas impressas para embalagens', true, false, false, 1, 230),
  ('Tags', 'tags', 'Etiquetas para produtos. Informação e estilo.', 'print', 0.80, 2.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Corte especial + ilhós", "cores": "4x4", "tamanho": "5x7cm"}'::jsonb, ARRAY['tag', 'etiqueta', 'produto', 'preço'], 'Tags personalizadas para produtos', true, false, false, 1, 240),
  
  -- Decoração e Eventos
  ('Topo de Bolo', 'topo-de-bolo', 'Decoração personalizada. Destaque especial para festas.', 'print', 10.00, 40.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Corte especial", "cores": "4x0", "tamanho": "Personalizado"}'::jsonb, ARRAY['topo de bolo', 'decoração', 'festa', 'personalizado'], 'Topos de bolo personalizados para festas', true, false, false, 1, 250),
  ('Aviso de Porta', 'aviso-de-porta', 'Placas personalizadas. Comunicação visual eficiente.', 'print', 2.00, 6.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Laminação", "cores": "4x0", "tamanho": "10x20cm"}'::jsonb, ARRAY['aviso', 'porta', 'placa', 'sinalização'], 'Avisos de porta personalizados', true, false, false, 1, 260),
  ('Wobbler', 'wobbler', 'Display de gôndola. Destaque no ponto de venda.', 'print', 1.50, 4.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Corte especial + haste", "cores": "4x0", "tamanho": "Personalizado"}'::jsonb, ARRAY['wobbler', 'display', 'gôndola', 'pdv'], 'Wobblers para destaque em gôndolas', true, false, false, 1, 270),
  ('Cartela Bijuteria', 'cartela-bijuteria', 'Suporte para bijuterias. Apresentação profissional.', 'print', 10.00, 30.00, 'pack', '{"papel": "Triplex 300g", "acabamento": "Corte e vinco", "cores": "4x0", "tamanho": "5x7cm"}'::jsonb, ARRAY['cartela', 'bijuteria', 'suporte', 'apresentação'], 'Cartelas para apresentação de bijuterias', true, false, false, 1, 280),
  ('Lembrança de 7º dia', 'lembranca-de-7-dia', 'Impressos religiosos. Homenagem respeitosa.', 'print', 1.50, 4.00, 'unidade', '{"papel": "Couché 250g", "acabamento": "Brilho", "cores": "4x4", "tamanho": "7x10cm"}'::jsonb, ARRAY['lembrança', '7º dia', 'religioso', 'homenagem'], 'Lembranças de 7º dia personalizadas', true, false, false, 1, 290),
  
  -- Calendários e Displays
  ('Calendário de Mesa', 'calendario-de-mesa', 'Calendário personalizado. Útil o ano todo.', 'print', 5.00, 15.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Wire-o", "cores": "4x4", "tamanho": "10x15cm"}'::jsonb, ARRAY['calendário', 'mesa', 'personalizado', 'brinde'], 'Calendários de mesa personalizados', true, false, false, 1, 300),
  ('Calendário de Parede', 'calendario-de-parede', 'Calendário grande. Visibilidade garantida.', 'print', 10.00, 30.00, 'unidade', '{"papel": "Couché 170g", "acabamento": "Wire-o + ilhós", "cores": "4x4", "tamanho": "A3 (29,7x42cm)"}'::jsonb, ARRAY['calendário', 'parede', 'grande', 'anual'], 'Calendários de parede personalizados', true, false, false, 1, 310),
  ('Display de Mesa', 'display-de-mesa', 'Expositor vertical. Informação sempre visível.', 'print', 10.00, 25.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Corte e vinco", "cores": "4x4", "tamanho": "A5 (14,8x21cm)"}'::jsonb, ARRAY['display', 'mesa', 'expositor', 'vertical'], 'Displays de mesa para exposição', true, false, false, 1, 320),
  ('Display em L', 'display-em-l', 'Display rígido para balcão. Estabilidade e elegância.', 'print', 12.00, 30.00, 'unidade', '{"papel": "Couché 300g", "acabamento": "Corte e vinco em L", "cores": "4x4", "tamanho": "A5 (14,8x21cm)"}'::jsonb, ARRAY['display', 'L', 'balcão', 'rígido'], 'Displays em L para balcões', true, false, false, 1, 330),
  
  -- Impressões Simples
  ('Impressão Colorida A3', 'impressao-colorida-a3', 'Impressão grande. Alta qualidade e definição.', 'print', 3.00, 8.00, 'unidade', '{"papel": "Couché 170g", "acabamento": "Sem acabamento", "cores": "4x0", "tamanho": "A3 (29,7x42cm)"}'::jsonb, ARRAY['impressão', 'A3', 'colorida', 'grande'], 'Impressão colorida em formato A3', true, false, true, 1, 340),
  ('Impressão Colorida A4', 'impressao-colorida-a4', 'Impressão padrão colorida. Qualidade e rapidez.', 'print', 1.00, 2.50, 'unidade', '{"papel": "Sulfite 75g", "acabamento": "Sem acabamento", "cores": "4x0", "tamanho": "A4 (21x29,7cm)"}'::jsonb, ARRAY['impressão', 'A4', 'colorida', 'padrão'], 'Impressão colorida em formato A4', true, true, true, 1, 350)
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

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
SELECT 
  'Produtos na categoria print (Impressões)' AS info,
  COUNT(*) AS total
FROM products
WHERE category = 'print';
