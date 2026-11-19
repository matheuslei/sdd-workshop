/* Simulador do Workshop SDD — motor compartilhado (JS clássico, funciona em file://) */
(function () {
  "use strict";
  var CHAVE = "sdd-sim-v1";
  var CHAVE_HABITOS = "sdd-sim-v1-habitos";
  var mem = null;
  var ouvintesArquivo = [];

  // ---------- utilidades ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function raiz() { return document.body.getAttribute("data-raiz") || ""; }
  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // ---------- estado ----------
  function padrao() { return { trilha: null, tema: null, feitas: { instalacao: [], projeto: [] }, arquivos: [], bonus: false, appAberto: false, ui: {} }; }
  function estado() {
    if (mem) return mem;
    var s = null;
    try { s = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { s = null; }
    var p = padrao();
    if (s && typeof s === "object") {
      for (var k in p) if (s[k] != null) p[k] = s[k];
      p.feitas.instalacao = p.feitas.instalacao || [];
      p.feitas.projeto = p.feitas.projeto || [];
    }
    mem = p;
    return mem;
  }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado())); } catch (e) { /* aba privada: segue só na memória */ } }
  function reiniciarTudo() {
    try { localStorage.removeItem(CHAVE); localStorage.removeItem(CHAVE_HABITOS); } catch (e) { }
    var tema = estado().tema; mem = padrao(); mem.tema = tema; salvar();
  }
  function trilha() { return estado().trilha; }
  function nomeAgente(t) { return (t || trilha()) === "claude" ? "Claude Code" : "OpenCode"; }
  function ctx() { var t = trilha() || "opencode"; return { trilha: t, agente: nomeAgente(t), cmdAgente: t === "claude" ? "claude" : "opencode" }; }
  function etapasDaTrilha(lista) { var t = trilha() || "opencode"; return lista.filter(function (e) { return !e.trilha || e.trilha === "comum" || e.trilha === t; }); }
  function val(v) { return typeof v === "function" ? v(ctx()) : v; }

  // Na trilha Claude, os comandos do Spec Kit são skills com hífen: /speckit-plan.
  function comandoDe(etapa) {
    var c = val(etapa.comando) || "";
    if (trilha() === "claude" && etapa.shell === "agente") c = c.replace(/^\/speckit\./, "/speckit-");
    return c;
  }

  // ---------- segurança de credenciais ----------
  var PADROES_CHAVE = [/sk-or-v1-[0-9a-f]{16,}/i, /sk-ant-[A-Za-z0-9_\-]{16,}/, /\bsk-(?!or-FALSA)[A-Za-z0-9_\-]{32,}/, /sk-or-(?!FALSA)[A-Za-z0-9_\-]{8,}/i];
  function ehChaveReal(t) { t = String(t || ""); return PADROES_CHAVE.some(function (r) { return r.test(t); }); }
  function alertaChave(aoFechar) {
    var fundo = el("div", { class: "modal-fundo", role: "dialog", "aria-modal": "true", "aria-labelledby": "tit-chave" });
    var m = el("div", { class: "modal" },
      '<h2 id="tit-chave">🔐 Isso parece uma chave real</h2>' +
      "<p>O texto colado tem formato de chave de API <b>de verdade</b>. Ele <b>não foi exibido nem salvo</b>: o simulador descartou o texto.</p>" +
      "<ul><li>Nunca cole chaves em sites, códigos, prints ou chats.</li>" +
      "<li>Se a chave for real, <b>revogue-a</b> no painel do provedor e crie outra.</li>" +
      "<li>Aqui use a chave falsa: <code>sk-or-FALSA-curso-sdd</code></li></ul>");
    var b = el("button", { type: "button", class: "btn primario" }, "Entendi");
    b.onclick = function () { fundo.remove(); if (aoFechar) aoFechar(); };
    fundo.addEventListener("keydown", function (e) { if (e.key === "Escape") b.onclick(); });
    m.appendChild(b); fundo.appendChild(m); document.body.appendChild(fundo); b.focus();
  }

  // ---------- copiar ----------
  // região invisível para anunciar mudanças a leitores de tela
  function anunciar(msg) {
    var r = document.getElementById("sr-anuncio");
    if (!r) { r = el("div", { id: "sr-anuncio", class: "oculto", role: "status", "aria-live": "polite" }); document.body.appendChild(r); }
    r.textContent = ""; setTimeout(function () { r.textContent = msg; }, 50);
  }
  function copiar(texto, botao) {
    function ok() { anunciar("Copiado para a área de transferência."); if (!botao) return; var o = botao.textContent; botao.textContent = "Copiado!"; botao.classList.add("ok"); setTimeout(function () { botao.textContent = o; botao.classList.remove("ok"); }, 1500); }
    function reserva() {
      var ta = el("textarea"); ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var deu = false; try { deu = document.execCommand("copy"); } catch (e) { deu = false; }
      ta.remove();
      if (deu) ok(); else if (botao) { botao.textContent = "Selecione e use Ctrl+C"; }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok, reserva);
    else reserva();
  }
  function blocoCopiavel(texto, classeExtra) {
    var w = el("div", { class: "copiavel" });
    var pre = el("pre", { class: "bloco " + (classeExtra || "") }); pre.textContent = texto;
    var b = el("button", { type: "button", class: "btn-copiar" }, "Copiar");
    b.onclick = function () { copiar(texto, b); };
    w.appendChild(pre); w.appendChild(b); return w;
  }

  // ---------- página ----------
  var PAGINAS = [
    ["inicio", "index.html", "Início"],
    ["guia", "guia/instalacao.html", "Guia de instalação"],
    ["prompts", "guia/prompts.html", "Prompts"],
    ["instalacao", "simulador/instalacao.html", "1 · Instalação"],
    ["projeto", "simulador/projeto.html", "2 · Projeto"],
    ["app", "simulador/app-final.html", "3 · App final"]
  ];
  function aplicarTema() {
    var t = estado().tema;
    if (t) document.documentElement.setAttribute("data-tema", t); else document.documentElement.removeAttribute("data-tema");
  }
  function iniciarPagina() {
    aplicarTema();
    var pag = document.body.getAttribute("data-pagina");
    var topo = el("header", { class: "topo" });
    var tin = el("div", { class: "topo-in" });
    tin.appendChild(el("a", { class: "marca", href: raiz() + "index.html" }, "<b>SDD</b> Simulador do Workshop"));
    var nav = el("nav", { class: "nav", "aria-label": "Seções" });
    PAGINAS.forEach(function (p) {
      var a = el("a", { href: raiz() + p[1] }, esc(p[2]));
      if (p[0] === pag) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    // No celular o menu fica recolhido atrás do botão ☰
    var bMenu = el("button", { type: "button", class: "btn-menu", "aria-label": "Abrir menu", "aria-expanded": "false" }, "☰");
    bMenu.onclick = function () { var ab = topo.classList.toggle("aberto"); bMenu.setAttribute("aria-expanded", ab ? "true" : "false"); bMenu.textContent = ab ? "✕" : "☰"; };
    tin.appendChild(bMenu);
    tin.appendChild(nav);
    var acoes = el("div", { class: "topo-acoes" });
    var chip = el("a", { class: "chip-trilha", href: raiz() + "index.html#trilhas", title: "Trocar trilha" },
      trilha() ? "Trilha: " + esc(nomeAgente()) : "Escolher trilha");
    acoes.appendChild(chip);
    var bt = el("button", { type: "button", class: "btn-tema", "aria-label": "Alternar tema claro/escuro" });
    function rotulo() { var t = estado().tema; bt.textContent = t === "escuro" ? "🌙" : t === "claro" ? "☀️" : "🌓"; bt.title = "Tema: " + (t || "automático"); }
    bt.onclick = function () { var t = estado().tema; estado().tema = t == null ? "escuro" : t === "escuro" ? "claro" : null; salvar(); aplicarTema(); rotulo(); };
    rotulo(); acoes.appendChild(bt);
    tin.appendChild(acoes); topo.appendChild(tin);
    document.body.insertBefore(topo, document.body.firstChild);
    var principal = document.querySelector("main"); if (principal && !principal.id) principal.id = "principal";
    if (principal) principal.setAttribute("tabindex", "-1");
    document.body.insertBefore(el("a", { class: "pular", href: "#principal" }, "Pular para o conteúdo"), document.body.firstChild);
  }
  // Se a trilha ainda não foi escolhida, mostra a escolha dentro do elemento e chama cb depois.
  function exigirTrilha(alvo, cb) {
    if (trilha()) { cb(); return; }
    var c = el("div", { class: "card" }, "<h2 style='margin-top:0'>Escolha sua trilha</h2><p>Qual agente você vai usar no workshop? Dá para trocar depois, na página inicial.</p>");
    var g = el("div", { class: "trilhas" });
    [["opencode", "OpenCode + OpenRouter", "A trilha do guia do workshop: o agente OpenCode, com um modelo gratuito pelo OpenRouter."],
     ["claude", "Claude Code", "O agente é o Claude Code. Na vida real, é preciso ter uma conta Claude."]].forEach(function (o) {
      var b = el("button", { type: "button", class: "trilha", "aria-pressed": "false" }, "<span class='trilha-tit'>" + o[1] + "</span><span class='trilha-desc'>" + o[2] + "</span>");
      b.onclick = function () { estado().trilha = o[0]; salvar(); c.remove(); var chip = document.querySelector(".chip-trilha"); if (chip) chip.textContent = "Trilha: " + nomeAgente(); cb(); };
      g.appendChild(b);
    });
    c.appendChild(g); alvo.appendChild(c);
  }

  // ---------- arquivos simulados ----------
  function criarArquivo(chave) {
    var e = estado();
    if (!window.ARQUIVOS || window.ARQUIVOS[chave] == null) { if (window.console) console.warn("Arquivo simulado sem conteúdo:", chave); }
    e.arquivos = e.arquivos.filter(function (k) { return k !== chave; });
    e.arquivos.push(chave); salvar();
    ouvintesArquivo.forEach(function (f) { f(chave); });
  }
  function caminho(chave) { return chave.split("@")[0]; }
  function arquivosAtuais() {
    var mapa = {};
    estado().arquivos.forEach(function (k) { mapa[caminho(k)] = k; });
    return mapa;
  }
  function arvore(alvo, vis) {
    var aberto = null, novos = {};
    function abrir(k) {
      aberto = caminho(k);
      vis.innerHTML = "";
      var cab = el("div", { class: "vis-cab" }, "📄 " + esc(caminho(k)));
      var pre = el("pre", { tabindex: "0" }); pre.textContent = (window.ARQUIVOS && window.ARQUIVOS[k]) || "(conteúdo ilustrativo indisponível)";
      vis.appendChild(cab); vis.appendChild(pre);
      pre.setAttribute("aria-label", "Conteúdo de " + caminho(k));
      desenhar();
    }
    function desenhar() {
      var mapa = arquivosAtuais(); var caminhos = Object.keys(mapa).sort();
      alvo.innerHTML = "";
      if (!caminhos.length) { alvo.appendChild(el("p", { class: "vazio" }, "A pasta ainda está vazia. Os arquivos aparecem aqui conforme você avança.")); return; }
      var raizArv = {};
      caminhos.forEach(function (c) {
        var partes = c.split("/"), no = raizArv;
        partes.forEach(function (p, i) { if (i === partes.length - 1) { no[p] = mapa[c]; } else { no[p] = no[p] && typeof no[p] === "object" ? no[p] : {}; no = no[p]; } });
      });
      function monta(no) {
        var ul = el("ul");
        var nomes = Object.keys(no).sort(function (a, b) {
          var pa = typeof no[a] === "object", pb = typeof no[b] === "object";
          return pa === pb ? a.localeCompare(b) : (pa ? -1 : 1);
        });
        nomes.forEach(function (n) {
          var li = el("li");
          if (typeof no[n] === "object") { li.appendChild(el("div", { class: "pasta" }, "📁 " + esc(n))); li.appendChild(monta(no[n])); }
          else {
            var k = no[n];
            var b = el("button", { type: "button", title: caminho(k) }, "📄 " + esc(n));
            if (novos[caminho(k)]) b.classList.add("novo");
            if (aberto === caminho(k)) b.classList.add("aberto");
            b.onclick = function () {
              delete novos[caminho(k)]; abrir(k);
              if (window.matchMedia && window.matchMedia("(max-width:760px)").matches) vis.scrollIntoView({ block: "start", behavior: "smooth" });
            };
            li.appendChild(b);
          }
          ul.appendChild(li);
        });
        return ul;
      }
      alvo.appendChild(el("div", { class: "pasta" }, "📁 sdd-workshop"));
      alvo.appendChild(monta(raizArv));
    }
    ouvintesArquivo.push(function (k) { novos[caminho(k)] = true; if (aberto === caminho(k)) abrir(k); else desenhar(); });
    desenhar();
    return { desenhar: desenhar, abrir: abrir };
  }

  // ---------- validação ----------
  function normaliza(s) {
    return String(s || "").replace(/[\u201C\u201D\u201E]/g, '"').replace(/[\u2018\u2019]/g, "'").replace(/\r/g, "")
      .split("\n").map(function (l) { return l.trim(); }).filter(Boolean).join("\n").replace(/[ \t]+/g, " ").trim();
  }
  function normC(s) { return normaliza(s).toLowerCase().replace(/\s*;\s*$/, ""); }
  function primeiraDiferenca(a, b) {
    var i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return i;
  }
  function valida(etapa, texto, todas) {
    var modo = etapa.modo || "exato";
    var esperado = comandoDe(etapa);
    var n = normC(texto), e = normC(esperado);
    if (modo === "livre") return n ? { ok: true } : { ok: false, dica: "Escreva sua resposta (ou clique numa das respostas combinadas)." };
    if (modo === "chave") {
      if (/^sk-or-falsa/i.test(n)) return { ok: true };
      return { ok: false, dica: "Cole a chave <b>falsa</b> da simulação: <code>sk-or-FALSA-curso-sdd</code>." };
    }
    if (modo === "prefixo") {
      var pre = e.split(/\s/)[0];
      var alt = pre.replace("/speckit-", "/speckit.");
      if ((n.indexOf(pre) === 0 || n.indexOf(alt) === 0 || n.indexOf(pre.replace("/speckit.", "/speckit-")) === 0) && n.length > pre.length + 3) {
        return n === e || n === e.replace("/speckit-", "/speckit.") ? { ok: true } : { ok: true, aviso: "Você mudou o texto do prompt. Tudo bem! A simulação mostra o resultado do prompt original." };
      }
    }
    if (modo === "bloco") {
      var falta = (etapa.chaves || []).filter(function (c) { return n.indexOf(c.toLowerCase()) < 0; });
      if (!falta.length && n) return { ok: true };
      if (n && falta.length < (etapa.chaves || []).length) return { ok: false, dica: "Parece que faltou parte do bloco. Use o botão <b>Copiar</b> para levar o bloco <b>inteiro</b>, da primeira à última linha." };
    }
    if (modo === "exato" || modo === "prefixo") {
      var aceitos = [e, e.replace(/^\/speckit-/, "/speckit."), e.replace(/^\/speckit\./, "/speckit-")].concat((etapa.aceitos || []).map(normC));
      if (aceitos.indexOf(n) >= 0) return { ok: true };
    }
    // dicas da etapa
    var ds = etapa.dicas || [];
    for (var i = 0; i < ds.length; i++) if (ds[i][0].test(texto)) return { ok: false, dica: ds[i][1] };
    // terminal errado
    if (etapa.shell === "cmd" && /^\s*(\$|irm\s|invoke-|new-item|write-host|ps c:)/i.test(texto)) return { ok: false, dica: "Esse comando é do 🟦 <b>PowerShell</b>, mas esta etapa é no ⬛ <b>cmd</b>. Confira o terminal indicado." };
    if (etapa.shell === "ps" && /^\s*(set\s+\w+=|npm config set prefix|.*%[A-Z]+%)/i.test(texto)) return { ok: false, dica: "Esse comando é do ⬛ <b>cmd</b>, mas esta etapa é no 🟦 <b>PowerShell</b>." };
    if (etapa.shell !== "agente" && /^\s*\/\w/.test(texto)) return { ok: false, dica: "Comandos que começam com <code>/</code> são digitados <b>dentro do agente</b>, não no terminal. Esta etapa é no " + (etapa.shell === "ps" ? "🟦 PowerShell" : "⬛ cmd") + "." };
    if (etapa.shell === "agente" && /^\s*(uv|npm|specify|cd|powershell)\s/i.test(texto)) return { ok: false, dica: "Esse comando é do terminal (cmd), mas agora você está <b>dentro do agente</b>. Esta etapa pede um texto para o agente." };
    // comando de outra etapa
    if (todas) for (var j = 0; j < todas.length; j++) {
      if (todas[j] !== etapa && todas[j].modo !== "livre" && todas[j].modo !== "botao" && normC(comandoDe(todas[j])) === n)
        return { ok: false, dica: "Esse é o comando da etapa <b>" + esc(todas[j].titulo) + "</b>. Agora a etapa é <b>" + esc(etapa.titulo) + "</b>." };
    }
    if (!n) return { ok: false, dica: "Cole o comando e pressione Enter." };
    var p = primeiraDiferenca(n, e);
    var trecho = e.slice(Math.max(0, p - 8), p + 18);
    return { ok: false, dica: "O comando não confere com o esperado. A diferença começa perto de: <code>" + esc(trecho) + "</code>. Dica: use o botão <b>Copiar</b>." };
  }

  // ---------- terminal guiado ----------
  function terminalGuiado(alvo, cfg) {
    var sim = cfg.sim;
    var etapas = etapasDaTrilha(cfg.etapas);
    var est = estado();
    var feitas = est.feitas[sim] = est.feitas[sim] || [];
    var idx = primeiraPendente();
    var desvio = null;           // problema comum em andamento
    var rodando = false, rapido = false, assistindo = false;
    var hist = [], hi = 0;
    var shellAtual = null, agenteAtivo = false, iniciado = false;

    // estrutura
    var layout = el("div", { class: "sim" + (cfg.arvore ? " com-arvore" : "") });
    var lateral = el("aside", { class: "lateral card col-lista" });
    var det = el("details", { open: "" }); det.appendChild(el("summary", null, "<b>Etapas</b> <span class='contagem'></span>"));
    var barra = el("div", { class: "barra", style: "margin:.5rem 0" }, "<i></i>");
    var lista = el("ol", { class: "lista-etapas" });
    det.appendChild(barra); det.appendChild(lista); lateral.appendChild(det);
    var centro = el("div", { class: "centro" });
    var card = el("section", { class: "card etapa-card", "aria-label": "Etapa atual" });
    var term = el("div", { class: "term", role: "region", "aria-label": "Terminal simulado (saídas ilustrativas)" });
    var tBarra = el("div", { class: "term-barra" });
    var saida = el("div", { class: "term-saida", role: "log", "aria-live": "polite", tabindex: "0", "aria-label": "Saída do terminal" });
    var linha = el("div", { class: "term-linha-in" });
    var pr = el("span", { class: "pr" });
    var inp = el("textarea", { rows: "1", spellcheck: "false", autocomplete: "off", "aria-label": "Terminal: cole o comando e pressione Enter", placeholder: "cole aqui e pressione Enter" });
    linha.appendChild(pr); linha.appendChild(inp);
    var sug = el("div", { class: "sugestoes", role: "group", "aria-label": "Sugestões de comandos (Tab completa o primeiro)" });
    var rodape = el("div", { class: "agente-rodape", lang: "en" });
    term.appendChild(tBarra); term.appendChild(saida); term.appendChild(sug); term.appendChild(linha); term.appendChild(rodape);
    centro.appendChild(term);
    var ctrl = el("div", { class: "term-ctrl" });
    var bAssistir = el("button", { type: "button", class: "btn peq btn-assistir" }, "▶ Assistir (automático)");
    var bRapido = el("button", { type: "button", class: "btn peq", title: "Mostrar a saída de uma vez" }, "⏩ Acelerar saída");
    var bLimpar = el("button", { type: "button", class: "btn peq" }, "🧹 Limpar tela");
    ctrl.appendChild(bAssistir); ctrl.appendChild(bRapido); ctrl.appendChild(bLimpar); ctrl.appendChild(el("span", { class: "esp" }));
    ctrl.appendChild(el("span", { class: "ilustrativo", style: "margin:0" }, "Enter envia · Shift+Enter quebra linha · ↑↓ histórico"));
    centro.appendChild(ctrl);
    centro.appendChild(card); // terminal em cima, comandos da etapa embaixo
    if (cfg.problemas && cfg.problemas.length) {
      var dp = el("details", { class: "problemas card" }, "<summary>⚠️ Simular um problema comum</summary><p class='ilustrativo'>Veja o erro que costuma aparecer no workshop e pratique a correção. Depois você volta para a etapa em que estava.</p>");
      var pl = el("div", { class: "problemas-lista" });
      cfg.problemas.forEach(function (id) {
        var p = window.ROTEIROS.problemas[id]; if (!p) return;
        var b = el("button", { type: "button", class: "btn peq" }, esc(p.titulo));
        b.onclick = function () { iniciarProblema(p); };
        pl.appendChild(b);
      });
      dp.appendChild(pl); centro.appendChild(dp);
    }
    layout.appendChild(lateral); layout.appendChild(centro);
    var arv = null;
    if (cfg.arvore) {
      var col = el("aside", { class: "col-arvore card lateral" }, "<b>Arquivos do projeto</b><p class='ilustrativo'>Clique num arquivo para ler. Em verde: criado agora.</p>");
      var arvEl = el("div", { class: "arvore" }); var vis = el("div", { class: "visualizador" });
      col.appendChild(arvEl); col.appendChild(vis); layout.appendChild(col);
      arv = arvore(arvEl, vis);
    }

    // ---------- painéis laterais recolhíveis (desktop): o conteúdo do meio ganha espaço ----------
    est.ui = est.ui || {};
    function painelRecolhivel(painel, lado, icone, nome, chaveUi) {
      var bRec = el("button", { type: "button", class: "btn-recolher", title: "Recolher " + nome.toLowerCase(), "aria-label": "Recolher " + nome.toLowerCase() }, lado === "esq" ? "«" : "»");
      var rail = el("button", { type: "button", class: "painel-rail", title: "Mostrar " + nome.toLowerCase(), "aria-label": "Mostrar " + nome.toLowerCase() },
        '<span class="rail-ic">' + icone + '</span><span class="rail-txt">' + esc(nome) + ' <span class="rail-cont"></span></span>');
      painel.insertBefore(bRec, painel.firstChild);
      painel.appendChild(rail);
      function aplica(min) {
        layout.classList.toggle("min-" + lado, min);
        painel.classList.toggle("recolhido", min);
        if (!min) rail.classList.remove("novo");
      }
      bRec.onclick = function () { est.ui[chaveUi] = true; salvar(); aplica(true); rail.focus(); };
      rail.onclick = function () { est.ui[chaveUi] = false; salvar(); aplica(false); bRec.focus(); };
      aplica(!!est.ui[chaveUi]);
      return rail;
    }
    var railEsq = painelRecolhivel(lateral, "esq", "☰", "Etapas", "minEtapas");
    var railDir = cfg.arvore ? painelRecolhivel(col, "dir", "📁", "Arquivos", "minArquivos") : null;
    // arquivo novo com o painel recolhido: bolinha verde no trilho
    if (railDir) ouvintesArquivo.push(function () { if (col.classList.contains("recolhido")) railDir.classList.add("novo"); });
    // ---------- celular: abas (Etapa · Etapas · Arquivos) + barra inferior com a ação principal ----------
    var mq = window.matchMedia ? window.matchMedia("(max-width:760px)") : { matches: false };
    function ehMobile() { return mq.matches; }
    var abasM = el("div", { class: "abas-mobile", role: "group", "aria-label": "Mostrar área do simulador" });
    var botoesAba = {};
    [["etapa", "▶ Etapa"], ["lista", "☰ Etapas"]].concat(cfg.arvore ? [["arquivos", "📁 Arquivos"]] : []).forEach(function (a) {
      var b = el("button", { type: "button", "aria-pressed": "false" }, a[1]);
      b.onclick = function () { aba(a[0]); };
      botoesAba[a[0]] = b; abasM.appendChild(b);
    });
    function aba(n) {
      layout.setAttribute("data-aba", n);
      for (var k in botoesAba) { botoesAba[k].setAttribute("aria-pressed", k === n ? "true" : "false"); if (k === n) botoesAba[k].classList.remove("novo"); }
      if (ehMobile()) window.scrollTo({ top: Math.max(0, abasM.getBoundingClientRect().top + window.scrollY - 4) });
    }
    if (cfg.arvore) ouvintesArquivo.push(function () { if (layout.getAttribute("data-aba") !== "arquivos") botoesAba.arquivos.classList.add("novo"); });
    var barraM = el("div", { class: "barra-mobile" });
    function atualizaBarra() {
      barraM.innerHTML = "";
      var e = desvio || etapas[idx];
      if (!e) { barraM.classList.add("vazia"); return; }
      barraM.classList.remove("vazia");
      barraM.appendChild(el("div", { class: "bm-info" }, "<small>" + (desvio ? "⚠️ Problema comum" : "Etapa " + (idx + 1) + " de " + etapas.length) + "</small><b>" + esc(e.titulo) + "</b>"));
      if (rodando) { barraM.appendChild(el("button", { type: "button", class: "btn", disabled: "" }, "⏳ Executando…")); return; }
      var prox = card.querySelector(".btn-prox");
      if (prox) {
        var lk = card.querySelector(".dica a.btn.primario");
        if (lk) barraM.appendChild(el("a", { class: "btn primario", href: lk.getAttribute("href") }, "🌐 Abrir app"));
        var bp = el("button", { type: "button", class: "btn " + (lk ? "" : "primario") }, esc(prox.textContent));
        bp.onclick = function () { prox.click(); aba("etapa"); };
        barraM.appendChild(bp); return;
      }
      var bx = el("button", { type: "button", class: "btn primario" }, e.modo === "botao" ? esc(e.botao || "Executar") : "▶ Executar");
      bx.onclick = function () {
        if (rodando) return;
        executar(e.modo === "botao" ? "" : (e.modo === "livre" ? (e.opcoes || [comandoDe(e)])[0] : comandoDe(e)), true);
        term.scrollIntoView({ block: "start", behavior: "smooth" });
      };
      barraM.appendChild(bx);
    }
    alvo.appendChild(abasM);
    alvo.appendChild(layout);
    alvo.appendChild(barraM);
    document.body.classList.add("tem-barra-mobile");
    layout.setAttribute("data-aba", "etapa"); botoesAba.etapa.setAttribute("aria-pressed", "true");

    // ---------- helpers ----------
    function feita(e) { return feitas.indexOf(e.id) >= 0; }
    function primeiraPendente() { for (var i = 0; i < etapas.length; i++) if (feitas.indexOf(etapas[i].id) < 0) return i; return etapas.length; }
    function liberada(i) { for (var j = 0; j < i; j++) if (!feita(etapas[j]) && !etapas[j].opcional) return false; return true; }
    function obrigatorias() { return etapas.filter(function (e) { return !e.opcional; }); }
    function pasta(i) { var p = ""; for (var j = 0; j < i && j < etapas.length; j++) if (etapas[j].entra != null) p = etapas[j].entra; return p; }
    // ---------- interfaces dos agentes (ilustrativas) ----------
    var cmdSalvo = null;
    var MODELO_OC = "Nemotron 3.5 Super VL (free)";
    function skin() { return trilha() === "claude" ? "claude" : "opencode"; }
    function conectado() { return sim === "projeto" || feitas.indexOf(skin() === "claude" ? "claude-login" : "chave") >= 0; }
    function specInit() { return sim === "projeto" || feitas.indexOf("init") >= 0; }
    function cwd() { return "C:\\Users\\aluno" + (pasta(idx) ? "\\" + pasta(idx) : ""); }
    var LOGO = { o: ["█▀▀█", "█  █", "▀▀▀▀"], p: ["█▀▀█", "█▄▄█", "█   "], e: ["█▀▀▀", "█▀▀ ", "▀▀▀▀"], n: ["█▀▀▄", "█  █", "▀  ▀"], c: ["█▀▀▀", "█   ", "▀▀▀▀"], d: ["█▀▀▄", "█  █", "▀▀▀ "] };
    function logoOpenCode() {
      var l = [0, 1, 2].map(function (r) {
        return '<span class="oc-open">' + "open".split("").map(function (ch) { return LOGO[ch][r]; }).join(" ") + '</span> <span class="oc-code">' +
          "code".split("").map(function (ch) { return LOGO[ch][r]; }).join(" ") + "</span>";
      });
      return '<span class="oc-logo">' + l.join("\n") + "</span>";
    }
    function homeOpenCode() {
      var cmds = [["/new", "new session", "ctrl+x n"], ["/help", "show help", "ctrl+x h"], ["/share", "share session", "ctrl+x s"], ["/models", "list models", "ctrl+x m"], ["/agents", "list agents", "ctrl+x a"]];
      return '<div class="oc-home" lang="en">' + logoOpenCode() + '\n<span class="t-dim">v1.x.y</span>\n\n<span class="oc-cmds">' +
        cmds.map(function (c) { return '<b>' + c[0] + '</b><span>' + c[1] + '</span><span class="t-dim">' + c[2] + "</span>"; }).join("") + "</span>" +
        (conectado() ? "" : '\n\n<span class="t-warn">Nenhum provedor conectado. Use /connect</span>') + "</div>";
    }
    // Claude Code v2 (ilustrativo): caixa com título na borda, mascote, dicas e atividade recente
    var MASCOTE = " ▐▛███▜▌\n▝▜█████▛▘\n  ▘▘ ▝▝";
    function homeClaude() {
      var ok = conectado();
      var esq = '<div class="cl-col cl-col-esq"><div class="t-b">' + (ok ? "Welcome back!" : "Welcome to Claude Code!") + "</div>" +
        '<pre class="cl-mascote">' + MASCOTE + "</pre>" +
        '<div class="t-dim">' + (ok ? "Sonnet 4.5 · Claude Pro" : "Not logged in") + "</div>" +
        '<div class="t-dim">' + esc(cwd()) + "</div></div>";
      var dir = '<div class="cl-col cl-col-dir"><div class="cl-tit">Tips for getting started</div>' +
        "<div>Run /init to create a CLAUDE.md file with instructions for Claude</div>" +
        '<div class="cl-sep"></div><div class="cl-tit">Recent activity</div><div class="t-dim">No recent activity</div></div>';
      return '<fieldset class="cl-box" lang="en"><legend>Claude Code v2.x.y</legend>' + esq + dir + "</fieldset>";
    }
    var aceitaEdicoes = false, bashOk = {};
    function atualizaRodape() {
      if (!agenteAtivo) { rodape.innerHTML = ""; return; }
      if (skin() === "claude") rodape.innerHTML = aceitaEdicoes
        ? '<span><span class="cl-aceita">⏵⏵ accept edits on</span> <span class="t-dim">(shift+tab to cycle)</span></span><span></span>'
        : '<span class="t-dim">? for shortcuts</span><span></span>';
      else rodape.innerHTML = '<span><span class="oc-modo">BUILD</span> ' + (conectado() ? esc(MODELO_OC) + ' <span class="t-dim">OpenRouter</span>' : '<span class="t-warn">sem provedor</span>') +
        '</span><span class="t-dim">tab agents · ctrl+p commands</span>';
    }
    function entrarAgente() {
      if (agenteAtivo) return;
      agenteAtivo = true; aceitaEdicoes = false; bashOk = {};
      if (skin() === "opencode") { cmdSalvo = saida.innerHTML; limpar(); escreve(homeOpenCode()); } // TUI de tela cheia
      else escreve(homeClaude());                                                                    // Claude Code roda no próprio terminal
      aplicaSkin();
    }
    function sairAgente() {
      if (!agenteAtivo) return;
      agenteAtivo = false;
      if (skin() === "opencode") { limpar(); if (cmdSalvo != null) saida.innerHTML = cmdSalvo; cmdSalvo = null; saida.scrollTop = saida.scrollHeight; }
      aplicaSkin();
    }
    function aplicaSkin() {
      term.classList.toggle("skin-claude", agenteAtivo && skin() === "claude");
      term.classList.toggle("skin-opencode", agenteAtivo && skin() === "opencode");
      var fam = shellAtual === "ps" ? "🟦 Windows PowerShell" : "⬛ Prompt de Comando (cmd)";
      tBarra.innerHTML = "<i></i><i></i><i></i><span>" + esc(fam + (agenteAtivo ? " — " + (skin() === "claude" ? "claude" : "opencode") : "")) + '</span><span class="selo-ilustr">interface ilustrativa</span>';
      if (agenteAtivo) { pr.textContent = skin() === "claude" ? ">" : ""; inp.placeholder = skin() === "claude" ? 'Try "create a util logging.py that..."' : "Pergunte qualquer coisa… (cole o prompt aqui)"; }
      atualizaRodape(); escondeSugestoes();
    }
    function comandosAgente() {
      var l, sk = ["constitution", "specify", "clarify", "plan", "tasks", "analyze", "implement", "checklist"];
      if (skin() === "claude") {
        l = [["/help", "Show help and available commands"], ["/clear", "Clear conversation history"], ["/model", "Set the AI model"], ["/login", "Sign in with your account"], ["/exit", "Exit the REPL"]];
        if (specInit()) sk.forEach(function (n) { l.push(["/speckit-" + n, "(skill) Spec Kit: " + n]); });
      } else {
        l = [["/connect", "connect a provider"], ["/models", "list models"], ["/new", "new session"], ["/help", "show help"], ["/exit", "exit the app"]];
        if (specInit()) sk.forEach(function (n) { l.push(["/speckit." + n, "Spec Kit: " + n]); });
      }
      return l;
    }
    function escondeSugestoes() { sug.style.display = "none"; sug.innerHTML = ""; }
    function mostraSugestoes() {
      var v = inp.value;
      if (!agenteAtivo || !/^\/[\w.\-]*$/.test(v)) { escondeSugestoes(); return; }
      var m = comandosAgente().filter(function (c) { return c[0].indexOf(v.toLowerCase()) === 0; }).slice(0, 9);
      if (!m.length) { escondeSugestoes(); return; }
      sug.innerHTML = "";
      m.forEach(function (c, k) {
        var b = el("button", { type: "button", class: k === 0 ? "ativo" : "" }, '<span class="sug-cmd">' + esc(c[0]) + '</span><span class="t-dim">' + esc(c[1]) + "</span>");
        b.onclick = function () { inp.value = c[0] + (/speckit/.test(c[0]) ? " " : ""); escondeSugestoes(); autoAltura(); inp.focus(); };
        sug.appendChild(b);
      });
      // Claude Code mostra o menu ABAIXO da entrada; OpenCode, acima
      term.insertBefore(sug, skin() === "claude" ? rodape : linha);
      sug.style.display = "block";
    }
    function promptDe(e, i) {
      if (e.shell === "agente") return trilha() === "claude" ? ">" : "";
      var base = "C:\\Users\\aluno" + (pasta(i) ? "\\" + pasta(i) : "");
      if (e.novaJanela && e.shell !== "ps") base = "C:\\Users\\aluno" + (e.pastaJanela ? "\\" + e.pastaJanela : "");
      return e.shell === "ps" ? "PS " + base + ">" : base + ">";
    }
    function escreve(html) { saida.insertAdjacentHTML("beforeend", html); saida.scrollTop = saida.scrollHeight; }
    function limpar() { saida.innerHTML = ""; }
    function intro(e) {
      var nome = e.shell === "ps" ? "🟦 Windows PowerShell" : "⬛ Prompt de Comando (cmd)";
      escreve('<span class="t-dim">' + (e.shell === "ps" ? "Windows PowerShell\nCopyright (C) Microsoft Corporation." : "Microsoft Windows [versão 10.0.x]\n(c) Microsoft Corporation.") + "</span>\n\n");
      return nome;
    }
    function ajustaTerminal(e, i) {
      var familia = e.shell === "ps" ? "ps" : "cmd";
      if (shellAtual !== familia || e.novaJanela) {
        limpar(); shellAtual = familia; agenteAtivo = false; cmdSalvo = null;
        if (e.shell !== "agente") intro(e);
      }
      term.classList.toggle("ps", familia === "ps");
      if (e.shell === "agente") entrarAgente(); else sairAgente();
      aplicaSkin();
      if (!agenteAtivo) {
        pr.textContent = promptDe(e, i);
        inp.placeholder = e.modo === "botao" ? "use o botão da etapa acima" : "cole o comando aqui e pressione Enter";
      }
      inp.disabled = e.modo === "botao";
      autoAltura();
    }

    // ---------- lista lateral ----------
    function desenhaLista() {
      lista.innerHTML = "";
      var grupo = null;
      etapas.forEach(function (e, i) {
        if (e.grupo && e.grupo !== grupo) { grupo = e.grupo; lista.appendChild(el("li", { class: "grupo", role: "presentation" }, esc(grupo))); }
        var li = el("li");
        var ok = feita(e), lib = liberada(i);
        if (ok) li.classList.add("feita");
        if (i === idx && !desvio) li.classList.add("atual");
        if (!lib && !ok) li.classList.add("bloq");
        var b = el("button", { type: "button", "aria-current": i === idx ? "step" : null, "aria-disabled": !lib && !ok ? "true" : null },
          '<span class="ic">' + (ok ? "✓" : i === idx ? "▸" : lib ? "○" : "🔒") + "</span><span>" + esc(e.titulo) + (e.opcional ? " <small>(opcional)</small>" : "") + "</span>");
        b.onclick = function () { if (rodando) return; if (lib || ok) { desvio = null; ir(i); if (ehMobile()) aba("etapa"); } };
        li.appendChild(b); lista.appendChild(li);
      });
      var tot = obrigatorias().length, f = obrigatorias().filter(feita).length;
      barra.firstChild.style.width = Math.round(f / Math.max(1, tot) * 100) + "%";
      det.querySelector(".contagem").textContent = f + " de " + tot + " obrigatórias";
      if (botoesAba.lista) botoesAba.lista.textContent = "☰ Etapas " + f + "/" + tot;
      var rc = lateral.querySelector(".rail-cont"); if (rc) rc.textContent = f + "/" + tot;
    }

    // ---------- cartão da etapa ----------
    function desenhaCard() {
      card.innerHTML = "";
      if (!desvio && idx >= etapas.length) { cartaoFinal(); return; }
      var e = desvio || etapas[idx];
      var selo = e.shell === "ps" ? '<span class="selo ps">🟦 PowerShell</span>' : e.shell === "agente" ? '<span class="selo agente">🤖 dentro do ' + esc(nomeAgente()) + "</span>" : '<span class="selo cmd">⬛ cmd</span>';
      var cab = el("div", null, (desvio ? '<span class="selo conferir">⚠️ Problema comum</span> ' : '<span class="selo">Etapa ' + (idx + 1) + " de " + etapas.length + "</span> ") + selo +
        (e.opcional ? ' <span class="selo opc">opcional</span>' : "") + (e.conferir ? ' <span class="selo conferir" title="Este comando não está no guia do workshop">conferir na documentação oficial</span>' : ""));
      card.appendChild(cab);
      card.appendChild(el("h2", null, esc(e.titulo)));
      if (e.explica) card.appendChild(el("div", { class: "explica" }, val(e.explica)));
      var cmd = comandoDe(e);
      if (e.modo === "botao") {
        var bb = el("button", { type: "button", class: "btn primario" }, esc(e.botao || "Executar"));
        bb.onclick = function () { if (!rodando) { verTerminal(); executar("", true); } };
        var ac = el("div", { class: "etapa-acoes" }); ac.appendChild(bb); card.appendChild(ac);
      } else if (e.modo === "livre") {
        card.appendChild(el("p", { style: "margin:.6rem 0 .2rem" }, "<b>Resposta combinada da turma</b> (clique para colocar no terminal):"));
        var op = el("div", { class: "opcoes" });
        (e.opcoes || [cmd]).forEach(function (o) { var b = el("button", { type: "button", class: "btn peq" }, esc(o)); b.onclick = function () { inp.value = o; autoAltura(); inp.focus(); }; op.appendChild(b); });
        card.appendChild(op);
      } else {
        card.appendChild(el("p", { style: "margin:.6rem 0 .2rem" }, e.shell === "agente" ? "<b>Copie e cole no agente:</b>" : "<b>Copie e cole no terminal:</b>"));
        card.appendChild(blocoCopiavel(cmd));
      }
      var acoes = el("div", { class: "etapa-acoes" });
      if (e.modo !== "botao") {
        var bMostra = el("button", { type: "button", class: "btn peq" }, "👀 Preencher para mim");
        bMostra.onclick = function () { inp.value = cmd; autoAltura(); verTerminal(); inp.focus({ preventScroll: true }); };
        acoes.appendChild(bMostra);
        var bPula = el("button", { type: "button", class: "btn peq so-desk" }, "⏭ Executar por mim");
        bPula.onclick = function () { if (!rodando) { verTerminal(); executar(cmd, true); } };
        acoes.appendChild(bPula);
      }
      if (e.opcional && !desvio) {
        var bOp = el("button", { type: "button", class: "btn peq" }, "Pular esta etapa opcional");
        bOp.onclick = function () { if (rodando) return; avancar(); };
        acoes.appendChild(bOp);
      }
      if (desvio) {
        var bVolta = el("button", { type: "button", class: "btn peq" }, "↩ Voltar à etapa");
        bVolta.onclick = function () { desvio = null; ir(idx); };
        acoes.appendChild(bVolta);
      }
      card.appendChild(acoes);
      if (e.corrige) {
        var d = el("details", null, "<summary>Se não ficou como pedido</summary>");
        d.appendChild(el("p", { class: "ilustrativo" }, "Prompt de correção do material (na vida real, use se o agente fugir do pedido):"));
        d.appendChild(blocoCopiavel(e.corrige));
        card.appendChild(d);
      }
      card.appendChild(el("div", { class: "dica", role: "status", "aria-live": "polite" }));
    }
    // o terminal fica acima do cartão: ao agir pelo cartão, traz o terminal para a tela
    function verTerminal() { var r = term.getBoundingClientRect(); if (r.top < 0 || r.top > window.innerHeight * 0.5) term.scrollIntoView({ block: "start", behavior: "smooth" }); }
    function dica(html, tipo) {
      var d = card.querySelector(".dica"); if (!d) return;
      d.innerHTML = html ? '<div class="aviso ' + (tipo || "warn") + '">' + html + "</div>" : "";
    }
    function cartaoFinal() {
      card.innerHTML = "";
      card.appendChild(el("h2", null, "🎉 " + esc(cfg.tituloFim || "Tudo concluído!")));
      card.appendChild(el("div", { class: "explica" }, val(cfg.textoFim) || ""));
      var a = el("div", { class: "etapa-acoes" });
      (cfg.botoesFim || []).forEach(function (b) { a.appendChild(el("a", { class: "btn " + (b.primario ? "primario" : ""), href: b.href }, esc(b.texto))); });
      var r = el("button", { type: "button", class: "btn peq" }, "↺ Refazer este simulador");
      r.onclick = function () {
        if (!confirm("Refazer este simulador do começo? (o progresso das etapas dele será zerado)")) return;
        est.feitas[sim] = feitas = []; salvar(); shellAtual = null; ir(0);
      };
      a.appendChild(r); card.appendChild(a);
      inp.disabled = true; inp.placeholder = "simulador concluído";
      if (typeof atualizaBarra === "function") atualizaBarra();
    }

    // ---------- execução ----------
    function ir(i) {
      idx = i; desvio = null;
      desenhaLista(); desenhaCard();
      // no celular não foca o campo: o teclado abriria e cobriria o terminal
      // foco no terminal só depois que a pessoa já interagiu (ao carregar, o foco fica no início da página)
      if (idx < etapas.length) { ajustaTerminal(etapas[idx], idx); if (iniciado && !assistindo && !ehMobile()) setTimeout(function () { inp.focus({ preventScroll: true }); }, 0); }
      else desenhaLista();
      atualizaBarra();
      iniciado = true;
    }
    function avancar() {
      var prox = idx + 1;
      ir(prox);
      if (assistindo) cicloAssistir();
    }
    function iniciarProblema(p) {
      if (rodando) return;
      desvio = { titulo: p.titulo, shell: p.shell, explica: "<p>" + p.causa + "</p>", comando: p.comando, modo: p.modo || "exato", botao: p.botao, saida: p.saida, problema: true };
      desenhaLista(); desenhaCard(); atualizaBarra();
      var e = desvio;
      var fam = e.shell === "ps" ? "ps" : "cmd";
      if (shellAtual !== fam) { limpar(); shellAtual = fam; agenteAtivo = false; cmdSalvo = null; intro(e); }
      term.classList.toggle("ps", fam === "ps");
      if (e.shell === "agente") entrarAgente(); else sairAgente();
      if (!agenteAtivo) pr.textContent = (fam === "ps" ? "PS " : "") + cwd() + ">";
      inp.disabled = e.modo === "botao";
      if (p.gatilho) eco(p.gatilho);
      escreve('<span class="t-err">' + p.erro + "</span>\n\n");
      term.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    function eco(texto) {
      var linhas = String(texto).replace(/\r/g, "").split("\n");
      if (agenteAtivo && skin() === "claude") { escreve('<div class="cl-user">&gt; ' + esc(linhas.join("\n  ")) + "</div>"); return; }
      if (agenteAtivo) { var home = saida.querySelector(".oc-home"); if (home) limpar(); // 1ª mensagem: sai da tela inicial e abre a sessão
        escreve('<div class="oc-user">' + esc(linhas.join("\n")) + "</div>"); return; }
      escreve('<span class="t-acc">' + esc(pr.textContent) + "</span> " + esc(linhas.join("\n  ")) + "\n");
    }
    function linhasDe(chave) { var c = window.ARQUIVOS && window.ARQUIVOS[chave]; return c ? String(c).split("\n").length : 0; }
    // Ferramenta no formato de cada agente: Claude "● Write(arq)" / OpenCode "← Write arq"
    function formataTool(x) {
      var m = /^(\w+)\(([\s\S]*)\)$/.exec(x), verbo = m ? m[1] : x, arg = m ? m[2] : "";
      if (!agenteAtivo || skin() === "claude") return '<span class="cl-tool">●</span> <span class="t-b">' + esc(verbo) + "</span>" + (m ? "(" + esc(arg) + ")" : "");
      if (verbo === "Bash") return '<span class="oc-bash"><span class="t-dim">$</span> ' + esc(arg) + "</span>";
      var seta = verbo === "Read" ? "→" : "←", nome = verbo === "Update" ? "Edit" : verbo;
      return '<span class="oc-tool">' + seta + " " + esc(nome) + " <b>" + esc(arg) + "</b></span>";
    }
    function formata(p) {
      switch (p.t) {
        case "ok": return '<span class="t-ok">' + esc(p.x) + "</span>";
        case "dim": return '<span class="t-dim">' + esc(p.x) + "</span>";
        case "warn": return '<span class="t-warn">' + esc(p.x) + "</span>";
        case "err": return '<span class="t-err">' + esc(p.x) + "</span>";
        case "agente":
          if (agenteAtivo && skin() === "opencode") return '<span class="oc-txt">' + esc(p.x) + "</span>";
          return '<span class="cl-dot">●</span> ' + esc(p.x).replace(/\n/g, "\n  ");
        case "tool": return formataTool(p.x);
        case "sub":
          if (agenteAtivo && skin() === "opencode") return '<span class="t-dim oc-sub">' + esc(p.x) + "</span>";
          return '<span class="t-dim">  ⎿  ' + esc(p.x).replace(/\n/g, "\n     ") + "</span>";
        case "html": return p.x;
        default: return esc(p.x);
      }
    }
    // ---------- Claude Code: prévias, diff e pedidos de permissão ----------
    var VERBOS = ["Pondering", "Cogitating", "Thinking", "Brewing", "Noodling", "Percolating", "Musing", "Ruminating", "Simmering", "Clauding", "Synthesizing", "Crafting"];
    function diffLinhas(a, b) {
      var la = String(a).split("\n"), lb = String(b).split("\n"), ca = {}, cb = {}, add = [], rem = [];
      la.forEach(function (l) { ca[l] = (ca[l] || 0) + 1; });
      lb.forEach(function (l, i) { if (ca[l]) ca[l]--; else add.push([i + 1, l]); });
      lb.forEach(function (l) { cb[l] = (cb[l] || 0) + 1; });
      la.forEach(function (l, i) { if (cb[l]) cb[l]--; else rem.push([i + 1, l]); });
      return { add: add, rem: rem };
    }
    function numLinha(n, txt, cls) { return '<span class="cl-ln ' + (cls || "") + '"><span class="cl-n">' + String(n).padStart(4, " ") + "</span> " + (cls === "add" ? "+ " : cls === "rem" ? "- " : "  ") + esc(txt) + "</span>"; }
    function resumoWrite(chave, conteudo) {
      var ls = String(conteudo).split("\n"), mostra = ls.slice(0, 4);
      return '<span class="t-dim">  ⎿  Wrote <b>' + ls.length + "</b> lines to <b>" + esc(caminho(chave)) + "</b></span>\n" +
        mostra.map(function (l, i) { return "     " + numLinha(i + 1, l); }).join("\n") + "\n" +
        (ls.length > 4 ? '<span class="t-dim">     … +' + (ls.length - 4) + " lines (ctrl+o to expand)</span>\n" : "");
    }
    function resumoDiff(chaveAnt, chaveNova) {
      var A = (window.ARQUIVOS || {})[chaveAnt] || "", B = (window.ARQUIVOS || {})[chaveNova] || "";
      if (chaveAnt === chaveNova) return '<span class="t-dim">  ⎿  Updated <b>' + esc(caminho(chaveNova)) + "</b></span>\n";
      var d = diffLinhas(A, B);
      var cab = '<span class="t-dim">  ⎿  Updated <b>' + esc(caminho(chaveNova)) + "</b> with <b>" + d.add.length + "</b> addition" + (d.add.length === 1 ? "" : "s") +
        " and <b>" + d.rem.length + "</b> removal" + (d.rem.length === 1 ? "" : "s") + "</span>\n";
      var linhas = d.rem.slice(0, 2).map(function (x) { return "     " + numLinha(x[0], x[1], "rem"); })
        .concat(d.add.slice(0, 3).map(function (x) { return "     " + numLinha(x[0], x[1], "add"); }));
      var resto = d.add.length + d.rem.length - linhas.length;
      return cab + linhas.join("\n") + (linhas.length ? "\n" : "") + (resto > 0 ? '<span class="t-dim">     … +' + resto + " lines (ctrl+o to expand)</span>\n" : "");
    }
    function previaArquivo(conteudo) {
      var ls = String(conteudo).split("\n");
      return '<div class="cl-perm-previa">' + ls.slice(0, 8).map(function (l, i) { return numLinha(i + 1, l); }).join("\n") +
        (ls.length > 8 ? '\n<span class="t-dim">  … +' + (ls.length - 8) + " lines</span>" : "") + "</div>";
    }
    function previaDiff(chaveAnt, chaveNova) {
      if (chaveAnt === chaveNova) return previaArquivo((window.ARQUIVOS || {})[chaveNova] || ""); // refazendo a etapa: mostra o arquivo
      var d = diffLinhas((window.ARQUIVOS || {})[chaveAnt] || "", (window.ARQUIVOS || {})[chaveNova] || "");
      var ls = d.rem.slice(0, 3).map(function (x) { return numLinha(x[0], x[1], "rem"); }).concat(d.add.slice(0, 5).map(function (x) { return numLinha(x[0], x[1], "add"); }));
      return '<div class="cl-perm-previa">' + (ls.join("\n") || '<span class="t-dim">(sem diferenças visíveis)</span>') + "</div>";
    }
    // Caixa de permissão do Claude Code: setas/1-3/Enter/Esc ou clique. No modo Assistir/acelerado escolhe a opção 2.
    function pedePermissao(titulo, arquivo, previaHtml, pergunta, opcoes) {
      return new Promise(function (ok) {
        var sel = 0;
        var box = el("div", { class: "cl-perm", role: "group", "aria-label": "Pedido de permissão: " + titulo, lang: "en" });
        box.innerHTML = '<div class="cl-perm-tit">' + esc(titulo) + "</div>" + (arquivo ? '<div class="cl-perm-arq">' + esc(arquivo) + "</div>" : "") + previaHtml +
          '<div class="cl-perm-q">' + esc(pergunta) + "</div>";
        var bs = opcoes.map(function (o, k) {
          var b = el("button", { type: "button", class: "cl-perm-op" }, "");
          b.onclick = function () { escolhe(k); };
          b.onmouseenter = function () { sel = k; pinta(); };
          box.appendChild(b); return b;
        });
        function pinta() { bs.forEach(function (b, k) { b.classList.toggle("sel", k === sel); b.innerHTML = (k === sel ? "❯ " : "  ") + (k + 1) + ". " + esc(opcoes[k]); }); }
        var feito = false;
        function escolhe(k) { if (feito) return; feito = true; box.remove(); ok(k); }
        box.addEventListener("keydown", function (ev) {
          if (ev.key === "ArrowDown") { sel = (sel + 1) % opcoes.length; pinta(); bs[sel].focus(); ev.preventDefault(); }
          else if (ev.key === "ArrowUp") { sel = (sel + opcoes.length - 1) % opcoes.length; pinta(); bs[sel].focus(); ev.preventDefault(); }
          else if (/^[1-9]$/.test(ev.key) && +ev.key <= opcoes.length) escolhe(+ev.key - 1);
          else if (ev.key === "Enter") { ev.preventDefault(); escolhe(sel); }
          else if (ev.key === "Escape") escolhe(opcoes.length - 1);
        });
        pinta(); saida.appendChild(box); saida.scrollTop = saida.scrollHeight;
        if (rapido || assistindo) { setTimeout(function () { sel = 1; pinta(); setTimeout(function () { escolhe(1); }, rapido ? 0 : 500); }, rapido ? 0 : 600); }
        else bs[0].focus({ preventScroll: true });
      });
    }
    function rodaSaida(lista) {
      var i = 0;
      return new Promise(function (fim) {
        function prox() {
          if (i >= lista.length) { fim(); return; }
          var p = lista[i++];
          var claude = agenteAtivo && skin() === "claude";
          if (p.t === "cria") {
            var verbo = p.verbo || "Write";
            if (!claude) {
              escreve(formataTool(verbo + "(" + caminho(p.x) + ")") + "\n");
              criarArquivo(p.x);
              setTimeout(prox, rapido ? 0 : (p.ms || 260)); return;
            }
            var anterior = arquivosAtuais()[caminho(p.x)];
            var existe = !!anterior, conteudo = (window.ARQUIVOS && window.ARQUIVOS[p.x]) || "";
            var acao = existe ? "Update" : "Write";
            function aplica() {
              escreve(formataTool(acao + "(" + caminho(p.x) + ")") + "\n");
              escreve(existe ? resumoDiff(anterior, p.x) : resumoWrite(p.x, conteudo));
              criarArquivo(p.x);
              setTimeout(prox, rapido ? 0 : (p.ms || 260));
            }
            if (aceitaEdicoes) { aplica(); return; }
            var nome = caminho(p.x).split("/").pop();
            pedePermissao(existe ? "Edit file" : "Create file", caminho(p.x),
              existe ? previaDiff(anterior, p.x) : previaArquivo(conteudo),
              existe ? "Do you want to make this edit to " + nome + "?" : "Do you want to create " + nome + "?",
              ["Yes", "Yes, allow all edits during this session (shift+tab)", "No, and tell Claude what to do differently (esc)"]
            ).then(function (op) {
              if (op === 1) { aceitaEdicoes = true; atualizaRodape(); }
              if (op === 2) escreve('<span class="t-dim">  ⎿  (Na simulação a edição segue mesmo assim. Na vida real, você escreveria ao Claude o que mudar.)</span>\n');
              aplica();
            });
            return;
          }
          if (p.t === "tool" && claude && /^Bash\(/.test(p.x)) {
            var cmd = p.x.slice(5, -1), chaveB = cmd.split(/\s/)[0];
            if (bashOk[chaveB]) { escreve(formata(p) + "\n"); setTimeout(prox, rapido ? 0 : (p.ms || 220)); return; }
            pedePermissao("Bash command", null, '<div class="cl-perm-cmd">' + esc(cmd) + "</div>", "Do you want to proceed?",
              ["Yes", "Yes, and don't ask again for " + chaveB + " commands in " + cwd(), "No, and tell Claude what to do differently (esc)"]
            ).then(function (op) {
              if (op === 1) bashOk[chaveB] = true;
              escreve(formata(p) + "\n"); setTimeout(prox, rapido ? 0 : (p.ms || 220));
            });
            return;
          }
          if (p.t === "todos") {
            var lis = p.itens.map(function (t, k) { return k < p.feitos ? '<span class="cl-todo-ok">☒ ' + esc(t) + "</span>" : k === p.feitos && claude ? '<span class="t-b">☐ ' + esc(t) + "</span>" : "☐ " + esc(t); });
            if (claude) escreve('<span class="cl-tool">●</span> <span class="t-b">Update Todos</span>\n<span class="cl-todos">  ⎿  ' + lis.join("\n     ") + "</span>\n");
            else escreve('<span class="oc-tool">☰ Todo</span><span class="oc-sub">' + lis.join("\n") + "</span>\n");
            setTimeout(prox, rapido ? 0 : (p.ms || 300)); return;
          }
          if (p.t === "abreAgente") { entrarAgente(); setTimeout(prox, rapido ? 0 : 400); return; }
          if (p.t === "fechaAgente") { sairAgente(); setTimeout(prox, 0); return; }
          if (p.t === "boasVindas") { escreve(skin() === "claude" ? homeClaude() : homeOpenCode()); atualizaRodape(); setTimeout(prox, 0); return; }
          if (p.t === "pensa") {
            var cl = !agenteAtivo || skin() === "claude";
            var quadros = cl ? ["·", "✢", "✳", "✶", "✻", "✽", "✻", "✶", "✳", "✢"] : ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
            var sp = el("div", { class: cl ? "cl-pensa" : "oc-pensa" }); saida.appendChild(sp); saida.scrollTop = saida.scrollHeight;
            // Claude Code: verbo "divertido" + tempo + tokens; OpenCode: texto da etapa
            var verboC = VERBOS[Math.floor(Math.random() * VERBOS.length)] + "…", t0p = Date.now(), tok = 0;
            function txtP() { return cl ? '<span class="cl-verbo">' + verboC + '</span> <span class="t-dim">(esc to interrupt · ' + Math.floor((Date.now() - t0p) / 1000) + "s · ↓ " + tok + " tokens)</span>" : esc(p.x || "Pensando…"); }
            var q = 0; sp.innerHTML = '<span class="giro">' + quadros[0] + "</span> " + txtP();
            var tm = setInterval(function () { q = (q + 1) % quadros.length; tok += 7 + Math.floor(Math.random() * 30); sp.innerHTML = '<span class="giro">' + quadros[q] + "</span> " + txtP(); }, 110);
            setTimeout(function () { clearInterval(tm); sp.remove(); prox(); }, rapido ? 0 : (p.ms || 1300)); return;
          }
          if (p.t === "limpa") { limpar(); setTimeout(prox, 0); return; }
          escreve(formata(p) + "\n");
          setTimeout(prox, rapido ? 0 : (p.ms != null ? p.ms : 220));
        }
        prox();
      });
    }
    function executar(texto, porMim) {
      var e = desvio || etapas[idx]; if (!e || rodando) return;
      if (e.modo !== "botao") {
        if (ehChaveReal(texto)) { inp.value = ""; autoAltura(); alertaChave(function () { inp.focus(); }); return; }
        var raw = String(texto).trim();
        if (!raw) { if (card.querySelector(".btn-prox")) card.querySelector(".btn-prox").click(); return; }
        if (/^(cls|clear)$/i.test(raw)) { limpar(); inp.value = ""; return; }
        hist.push(raw); hi = hist.length;
        eco(raw); inp.value = ""; autoAltura();
        var r = porMim ? { ok: true } : valida(e, raw, etapas);
        if (!r.ok) {
          escreve('<span class="t-warn">' + (e.shell === "agente" ? "(o agente não reconheceu este pedido como o desta etapa)" : "'" + esc(raw.split(/\s/)[0]) + "' não produziu o resultado esperado nesta etapa.") + "</span>\n\n");
          dica("💡 " + r.dica); return;
        }
        dica(r.aviso ? "ℹ️ " + r.aviso : "", "info");
      } else {
        escreve('<span class="t-dim">» ' + esc(e.botao || "Executar") + "</span>\n");
      }
      rodando = true; inp.disabled = true; atualizaRodape(); escondeSugestoes(); atualizaBarra();
      var lista = val(e.saida) || [];
      var t0 = Date.now();
      rodaSaida(lista).then(function () {
        // OpenCode mostra, ao fim de cada resposta, o agente e o modelo usados
        if (agenteAtivo && skin() === "opencode" && lista.some(function (p) { return p.t === "agente" || p.t === "cria"; }))
          escreve('<span class="oc-meta">▣ Build · ' + esc(MODELO_OC) + " · " + Math.max(1, Math.round((Date.now() - t0) / 1000)) + "s</span>\n");
        escreve("\n"); rodando = false; rapido = false; atualizaRodape();
        inp.disabled = false;
        if (e.problema) {
          dica("✅ Problema resolvido! Agora volte para a etapa em que você estava.", "ok");
          var bv = el("button", { type: "button", class: "btn primario btn-prox" }, "↩ Voltar à etapa " + (idx + 1));
          bv.onclick = function () { desvio = null; ir(idx); };
          card.querySelector(".dica").appendChild(bv); bv.focus({ preventScroll: true });
          atualizaBarra();
          return;
        }
        if (feitas.indexOf(e.id) < 0) feitas.push(e.id);
        (val(e.cria) || []).forEach(criarArquivo);
        if (e.fim === "bonus") est.bonus = true;
        salvar();
        desenhaLista();
        var aviso = card.querySelector(".dica .aviso.info") ? card.querySelector(".dica").innerHTML : "";
        dica((aviso ? "" : "") + "✅ Etapa concluída." + (e.depois ? " " + val(e.depois) : ""), "ok");
        var cx = card.querySelector(".dica");
        if (e.fim === "abrirApp") {
          var a = el("a", { class: "btn primario", href: raiz() + "simulador/app-final.html" }, "🌐 Abrir http://127.0.0.1:8000");
          cx.appendChild(a);
          cx.appendChild(document.createTextNode(" "));
          if (assistindo) pararAssistir();
        }
        var bp = el("button", { type: "button", class: "btn " + (e.fim === "abrirApp" ? "" : "primario") + " btn-prox" }, idx + 1 < etapas.length ? "Próxima etapa →" : "Concluir →");
        bp.onclick = avancar; cx.appendChild(bp);
        if (!assistindo && !ehMobile()) bp.focus({ preventScroll: true });
        atualizaBarra();
        if (cfg.aoConcluir) cfg.aoConcluir(e);
        if (assistindo) setTimeout(function () { if (assistindo) avancar(); }, 900);
      });
    }

    // ---------- modo Assistir ----------
    function digitaNoCampo(texto) {
      return new Promise(function (fim) {
        var k = 0, passo = Math.max(1, Math.ceil(texto.length / 60));
        (function dig() {
          if (!assistindo) { fim(false); return; }
          if (k >= texto.length) { inp.value = texto; autoAltura(); fim(true); return; }
          k = Math.min(texto.length, k + passo); inp.value = texto.slice(0, k); autoAltura();
          setTimeout(dig, 18);
        })();
      });
    }
    function cicloAssistir() {
      if (!assistindo) return;
      if (idx >= etapas.length) { pararAssistir(); return; }
      var e = etapas[idx];
      if (feita(e) && e.fim === "abrirApp") { pararAssistir(); return; }
      espera(600).then(function () {
        if (!assistindo) return;
        if (e.modo === "botao") { executar("", true); return; }
        var t = e.modo === "livre" ? (e.opcoes || [comandoDe(e)])[0] : comandoDe(e);
        digitaNoCampo(t).then(function (ok) { if (ok) espera(300).then(function () { if (assistindo) executar(t, true); }); });
      });
    }
    function pararAssistir() { assistindo = false; bAssistir.textContent = "▶ Assistir (automático)"; }
    bAssistir.onclick = function () {
      if (assistindo) { pararAssistir(); return; }
      if (desvio) { desvio = null; ir(idx); }
      assistindo = true; bAssistir.textContent = "⏸ Parar de assistir";
      var bp = card.querySelector(".btn-prox");
      if (bp && !rodando) avancar(); else if (!rodando) cicloAssistir();
    };
    bRapido.onclick = function () { rapido = true; var op = saida.querySelectorAll(".cl-perm .cl-perm-op")[1]; if (op) op.click(); };
    bLimpar.onclick = limpar;

    // ---------- entrada ----------
    function autoAltura() { if (!inp.value) { inp.style.height = ""; inp.style.overflowY = "hidden"; return; } inp.style.height = "auto"; inp.style.height = Math.min(180, inp.scrollHeight) + "px"; inp.style.overflowY = inp.scrollHeight > 182 ? "auto" : "hidden"; }
    inp.addEventListener("input", function () { autoAltura(); mostraSugestoes(); });
    inp.addEventListener("keydown", function (ev) {
      if (ev.key === "Tab" && sug.style.display === "block") { ev.preventDefault(); sug.firstChild.click(); }
      else if (ev.key === "Escape") escondeSugestoes();
    });
    inp.addEventListener("paste", function (ev) {
      var t = (ev.clipboardData || window.clipboardData);
      t = t ? t.getData("text") : "";
      if (ehChaveReal(t)) { ev.preventDefault(); inp.value = ""; alertaChave(function () { inp.focus(); }); }
    });
    inp.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); if (assistindo) pararAssistir(); executar(inp.value); }
      else if (ev.key === "ArrowUp" && inp.value.indexOf("\n") < 0) { if (hi > 0) { hi--; inp.value = hist[hi]; autoAltura(); } ev.preventDefault(); }
      else if (ev.key === "ArrowDown" && inp.value.indexOf("\n") < 0) { if (hi < hist.length - 1) { hi++; inp.value = hist[hi]; } else { hi = hist.length; inp.value = ""; } autoAltura(); ev.preventDefault(); }
    });
    saida.addEventListener("click", function () { if (!window.getSelection().toString() && !inp.disabled) inp.focus({ preventScroll: true }); });

    ir(idx);
    return { ir: ir, etapas: etapas };
  }

  // progresso de um simulador (para a página inicial)
  function progresso(sim, lista) {
    var es = etapasDaTrilha(lista).filter(function (e) { return !e.opcional; });
    var f = estado().feitas[sim] || [];
    var n = es.filter(function (e) { return f.indexOf(e.id) >= 0; }).length;
    return { feitas: n, total: es.length, pct: es.length ? Math.round(n / es.length * 100) : 0 };
  }

  window.Sim = {
    esc: esc, el: el, raiz: raiz, estado: estado, salvar: salvar, reiniciarTudo: reiniciarTudo,
    trilha: trilha, nomeAgente: nomeAgente, ctx: ctx, val: val, comandoDe: comandoDe,
    etapasDaTrilha: etapasDaTrilha, ehChaveReal: ehChaveReal, alertaChave: alertaChave,
    copiar: copiar, anunciar: anunciar, blocoCopiavel: blocoCopiavel, iniciarPagina: iniciarPagina, exigirTrilha: exigirTrilha,
    criarArquivo: criarArquivo, arvore: arvore, terminalGuiado: terminalGuiado, progresso: progresso,
    valida: valida, CHAVE_HABITOS: CHAVE_HABITOS
  };
})();
