# To Task - SEO Guide

## ✅ Implementado

### 1. Meta Tags SEO
- `<title>` otimizado com palavras-chave
- `<meta description>` descritivo (150-160 caracteres)
- `<meta keywords>` com termos relevantes
- `lang="pt-BR"` no HTML
- `<meta robots>` configurado para indexação

### 2. Open Graph (Redes Sociais)
- Facebook, LinkedIn, WhatsApp otimizados
- Twitter Cards configuradas
- URLs canônicas definidas

### 3. Schema.org (JSON-LD)
- Marcação estruturada para Google
- Tipo: WebApplication
- Informações de preço, categoria, autor

### 4. Arquivos SEO
- ✅ `robots.txt` (permite crawlers)
- ✅ `sitemap.xml` (3 páginas principais)

## 📊 Próximos Passos para Indexação

### 1. Google Search Console
```
1. Acesse: https://search.google.com/search-console
2. Adicione a propriedade: https://todo-fullstack-sqlite.onrender.com
3. Verifique propriedade (meta tag ou DNS)
4. Envie o sitemap: /sitemap.xml
5. Solicite indexação das páginas principais
```

### 2. Google Analytics (Opcional)
```html
<!-- Adicionar no index.html antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. Backlinks (Melhorar Ranking)
- Criar perfil no GitHub com link para o projeto
- Compartilhar no LinkedIn, Twitter, Reddit
- Adicionar no portfólio pessoal
- Listar em diretórios de apps gratuitos
- Publicar artigo no Medium/Dev.to sobre o projeto

### 4. Performance (Core Web Vitals)
- ✅ Lazy loading implementado
- ✅ Compressão gzip/brotli ativa
- ✅ Code-splitting configurado
- ⚠️ Adicionar cache HTTP headers
- ⚠️ Adicionar Service Worker (PWA)

### 5. Conteúdo (Melhorar SEO)
- Criar página "Sobre" com mais texto
- Adicionar FAQ com perguntas comuns
- Blog com dicas de produtividade
- Página de recursos/features detalhadas

## 🎯 Palavras-chave Alvo

**Principais:**
- gerenciador de tarefas
- todo list online
- lista de tarefas gratuito
- organizar tarefas

**Secundárias:**
- task manager brasil
- planejamento de projetos
- produtividade online
- gestor de tarefas web

## 📈 Tempo de Indexação

- **Google:** 1-7 dias (com Search Console)
- **Bing:** 1-2 semanas
- **Yahoo:** 2-4 semanas

## 🔍 Verificar Indexação

```
site:todo-fullstack-sqlite.onrender.com
```

Digite isso no Google para ver páginas indexadas.
