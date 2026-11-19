/* Monitor de hábitos — versão simulada do app gerado no workshop.
   No projeto real os dados ficam em data/habitos.json (servidor FastAPI); aqui ficam no localStorage. */
(function () {
  "use strict";
  var CHAVE = (window.Sim && Sim.CHAVE_HABITOS) || "sdd-sim-v1-habitos";
  var DIAS_SEM = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var dados = { habitos: [] };
  var offset = 0;          // semanas para trás
  var raiz, msgEl, bonus = false;

  // ---------- datas (sempre no horário local) ----------
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function deIso(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function hoje() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function soma(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function diasEntre(a, b) { return Math.round((b - a) / 86400000); }
  function inicioSemana(d) { var dow = (d.getDay() + 6) % 7; return soma(d, -dow); } // segunda-feira

  // ---------- persistência ----------
  function carregar() {
    try { var s = JSON.parse(localStorage.getItem(CHAVE)); if (s && Array.isArray(s.habitos)) dados = s; } catch (e) { /* começa vazio */ }
  }
  function gravar() { try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { msg("Não consegui salvar neste navegador (aba privada?). As mudanças valem só até fechar a página.", "err"); } }

  // ---------- regras ----------
  function marcado(h, s) { return h.dias.indexOf(s) >= 0; }
  function sequencia(h) {
    var t = hoje(), n = 0;
    if (marcado(h, iso(t))) n++;                 // hoje marcado soma
    var d = soma(t, -1);                          // hoje sem marcação não quebra: conta até ontem
    while (marcado(h, iso(d))) { n++; d = soma(d, -1); }
    return n;
  }
  function frequencia(h) {
    // Período: dos últimos 30 dias, a partir do dia mais antigo entre a criação e a primeira marcação
    // (marcar dias anteriores à criação é permitido, então eles entram no período).
    var t = hoje(), inicio = deIso(h.criado), feitos = 0;
    h.dias.forEach(function (s) { var d = deIso(s); if (d < inicio) inicio = d; });
    var total = Math.min(30, Math.max(1, diasEntre(inicio, t) + 1));
    for (var i = 0; i < total; i++) if (marcado(h, iso(soma(t, -i)))) feitos++;
    return Math.min(100, Math.round(feitos / total * 100));
  }
  function feitosNaSemana(h, seg) { var n = 0; for (var i = 0; i < 7; i++) { var d = soma(seg, i); if (d <= hoje() && marcado(h, iso(d))) n++; } return n; }
  function sequenciaSemanal(h) {
    var seg = inicioSemana(hoje()), n = feitosNaSemana(h, seg) >= h.meta ? 1 : 0; // semana atual só soma se já cumpriu
    var s = soma(seg, -7);
    while (feitosNaSemana(h, s) >= h.meta && s >= inicioSemana(deIso(h.criado))) { n++; s = soma(s, -7); }
    return n;
  }
  function nomeValido(nome, ignorarId) {
    nome = (nome || "").trim();
    if (!nome) return "Digite um nome para o hábito.";
    if (nome.length > 40) return "Use um nome com até 40 caracteres.";
    var dup = dados.habitos.some(function (h) { return !h.arquivado && h.id !== ignorarId && h.nome.toLowerCase() === nome.toLowerCase(); });
    if (dup) return "Já existe um hábito ativo com esse nome. Escolha outro.";
    return null;
  }

  // ---------- ações ----------
  function msg(t, tipo) { msgEl.textContent = t || ""; msgEl.className = "app-msg " + (tipo || ""); }
  function criar(nome) {
    var erro = nomeValido(nome); if (erro) { msg(erro, "err"); return false; }
    dados.habitos.push({ id: "h" + Date.now().toString(36), nome: nome.trim(), arquivado: false, criado: iso(hoje()), dias: [], meta: null });
    gravar(); msg("Hábito criado. Clique no dia de hoje para marcar.", "ok"); desenhar(); return true;
  }
  function alternar(h, s) {
    if (deIso(s) > hoje()) { msg("Dias futuros não podem ser marcados.", "err"); return; }
    var i = h.dias.indexOf(s);
    if (i >= 0) h.dias.splice(i, 1); else h.dias.push(s);
    gravar(); msg(""); desenhar();
  }
  function renomear(h) {
    var n = prompt("Novo nome para \"" + h.nome + "\":", h.nome); if (n == null) return;
    var erro = nomeValido(n, h.id); if (erro) { msg(erro, "err"); return; }
    h.nome = n.trim(); gravar(); msg("Hábito renomeado.", "ok"); desenhar();
  }
  function arquivar(h, sim) { h.arquivado = sim; gravar(); msg(sim ? "Hábito arquivado: ele some da grade, mas o histórico fica guardado." : "Hábito restaurado.", "ok"); desenhar(); }
  function excluir(h) {
    if (!confirm("Excluir \"" + h.nome + "\" e TODO o histórico dele? Isso não pode ser desfeito.")) return;
    dados.habitos = dados.habitos.filter(function (x) { return x !== h; });
    gravar(); msg("Hábito excluído.", "ok"); desenhar();
  }
  function definirMeta(h) {
    var v = prompt("Meta semanal para \"" + h.nome + "\": de 1 a 7 vezes por semana.\nDeixe vazio para voltar a diário.", h.meta || "");
    if (v == null) return;
    v = v.trim();
    if (!v) { h.meta = null; }
    else { var n = parseInt(v, 10); if (!(n >= 1 && n <= 7) || String(n) !== v) { msg("A meta precisa ser um número de 1 a 7.", "err"); return; } h.meta = n; }
    gravar(); msg(h.meta ? "Meta definida: " + h.meta + " vez(es) por semana." : "Hábito voltou a ser diário.", "ok"); desenhar();
  }

  // ---------- interface ----------
  function el(tag, attrs, html) { return Sim.el(tag, attrs, html); }
  function esc(s) { return Sim.esc(s); }
  function desenhar() {
    var corpo = raiz.querySelector(".app-corpo"); corpo.innerHTML = "";
    var fim = soma(hoje(), -7 * offset), ini = soma(fim, -6);
    var dias = []; for (var i = 0; i < 7; i++) dias.push(soma(ini, i));

    var nav = el("div", { class: "app-nav" });
    var bAnt = el("button", { type: "button" }, "◀ Semana anterior");
    var bHoje = el("button", { type: "button" }, "Hoje");
    var bProx = el("button", { type: "button" }, "Próxima semana ▶");
    bAnt.onclick = function () { offset++; desenhar(); };
    bHoje.onclick = function () { offset = 0; desenhar(); };
    bProx.onclick = function () { if (offset > 0) { offset--; desenhar(); } };
    bProx.disabled = offset === 0; bHoje.disabled = offset === 0;
    nav.appendChild(bAnt); nav.appendChild(el("span", { class: "app-periodo", "aria-live": "polite" }, ini.toLocaleDateString("pt-BR") + " a " + fim.toLocaleDateString("pt-BR"))); nav.appendChild(bHoje); nav.appendChild(bProx);
    corpo.appendChild(nav);

    var ativos = dados.habitos.filter(function (h) { return !h.arquivado; });
    if (!ativos.length) {
      corpo.appendChild(el("p", { class: "app-vazio" }, "Nenhum hábito ainda. Crie o primeiro acima: por exemplo, <b>Beber água</b>."));
    } else {
      var wrap = el("div", { class: "app-tabela" });
      var tb = el("table");
      var periodoTxt = ini.toLocaleDateString("pt-BR") + " a " + fim.toLocaleDateString("pt-BR");
      var th = "<thead><tr><th scope='col'>Hábito</th>";
      var tHoje = iso(hoje());
      dias.forEach(function (d) { th += "<th scope='col' class='" + (iso(d) === tHoje ? "hoje" : "") + "'>" + DIAS_SEM[d.getDay()] + "<br><small>" + String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "</small></th>"; });
      th += "<th scope='col'>Sequência</th><th scope='col'>Últimos 30 dias</th>" + (bonus ? "<th scope='col'>Semana</th>" : "") + "<th scope='col'><span class='oculto'>Ações</span></th></tr></thead>";
      tb.innerHTML = "<caption class='oculto'>Hábitos de " + periodoTxt + ": clique num dia para marcar ou desmarcar</caption>" + th;
      var body = el("tbody");
      ativos.forEach(function (h) {
        var tr = el("tr");
        tr.appendChild(el("th", { scope: "row" }, esc(h.nome) + (bonus && h.meta ? " <small class='app-meta'>" + h.meta + "×/sem</small>" : "")));
        dias.forEach(function (d) {
          var s = iso(d), td = el("td", { class: s === tHoje ? "hoje" : "" });
          var futuro = d > hoje(), m = marcado(h, s);
          var b = el("button", { type: "button", class: "app-dia" + (m ? " feito" : ""), "aria-pressed": m ? "true" : "false",
            "aria-label": h.nome + ", " + d.toLocaleDateString("pt-BR") + (m ? ": feito" : ": não feito"), title: futuro ? "Dia futuro" : (m ? "Clique para desmarcar" : "Clique para marcar") }, m ? "✓" : "");
          if (futuro) b.disabled = true;
          b.onclick = function () { alternar(h, s); };
          td.appendChild(b); tr.appendChild(td);
        });
        var seq = bonus && h.meta ? sequenciaSemanal(h) + " sem." : sequencia(h) + (sequencia(h) === 1 ? " dia" : " dias");
        tr.appendChild(el("td", { class: "num" }, "🔥 " + seq));
        tr.appendChild(el("td", { class: "num" }, frequencia(h) + "%"));
        if (bonus) {
          var semTxt = "—";
          if (h.meta) { var f = feitosNaSemana(h, inicioSemana(fim)); semTxt = (f >= h.meta ? "✅ " : "") + f + " de " + h.meta; }
          tr.appendChild(el("td", { class: "num" }, semTxt));
        }
        var ac = el("td", { class: "app-acoes" });
        if (bonus) { var bm = el("button", { type: "button", title: "Meta semanal", "aria-label": "Definir meta semanal de " + h.nome }, "⚙"); bm.onclick = function () { definirMeta(h); }; ac.appendChild(bm); }
        var br = el("button", { type: "button", title: "Renomear", "aria-label": "Renomear " + h.nome }, "✏️"); br.onclick = function () { renomear(h); };
        var ba = el("button", { type: "button", title: "Arquivar", "aria-label": "Arquivar " + h.nome }, "📦"); ba.onclick = function () { arquivar(h, true); };
        var bx = el("button", { type: "button", title: "Excluir", "aria-label": "Excluir " + h.nome }, "🗑️"); bx.onclick = function () { excluir(h); };
        ac.appendChild(br); ac.appendChild(ba); ac.appendChild(bx); tr.appendChild(ac);
        body.appendChild(tr);
      });
      tb.appendChild(body); wrap.appendChild(tb); corpo.appendChild(wrap);
    }

    var arq = dados.habitos.filter(function (h) { return h.arquivado; });
    if (arq.length) {
      var det = el("details", { class: "app-arquivados" }, "<summary>Arquivados (" + arq.length + ")</summary>");
      var ul = el("ul");
      arq.forEach(function (h) {
        var li = el("li", null, "<span>" + esc(h.nome) + " <small>(" + h.dias.length + " dias no histórico)</small></span>");
        var r = el("button", { type: "button" }, "Restaurar"); r.onclick = function () { arquivar(h, false); };
        var x = el("button", { type: "button" }, "Excluir"); x.onclick = function () { excluir(h); };
        li.appendChild(r); li.appendChild(x); ul.appendChild(li);
      });
      det.appendChild(ul); corpo.appendChild(det);
    }
  }

  function iniciar(alvo) {
    raiz = alvo;
    bonus = !!(window.Sim && Sim.estado().bonus);
    carregar();
    raiz.innerHTML = "";
    raiz.appendChild(el("h2", { class: "app-titulo" }, "Monitor de hábitos"));
    var form = el("form", { class: "app-form", autocomplete: "off" });
    var inp = el("input", { type: "text", maxlength: "40", placeholder: "Novo hábito (ex.: Beber água)", "aria-label": "Nome do novo hábito" });
    form.appendChild(inp); form.appendChild(el("button", { type: "submit" }, "Adicionar"));
    form.onsubmit = function (ev) { ev.preventDefault(); if (criar(inp.value)) inp.value = ""; inp.focus(); };
    raiz.appendChild(form);
    msgEl = el("p", { class: "app-msg", role: "status", "aria-live": "polite" }); raiz.appendChild(msgEl);
    raiz.appendChild(el("div", { class: "app-corpo" }));
    desenhar();
  }

  window.HabitosApp = { iniciar: iniciar, _regras: { sequencia: sequencia, frequencia: frequencia, iso: iso } };
})();
