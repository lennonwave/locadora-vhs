let filmes = [];
let indexAtual = 0;

async function carregarFilmes() {
  try {
    const resp = await fetch('filmes.json');
    filmes = await resp.json();
    renderizarCarrossel();
    
    setTimeout(() => {
      atualizarDestaque(0);
    }, 200);

  } catch (erro) {
    console.error("Erro ao carregar filmes:", erro);
  }
}

function renderizarCarrossel() {
  const carrossel = document.getElementById('carrossel');
  carrossel.innerHTML = '';

  filmes.forEach((filme, index) => {
    const div = document.createElement('div');
    div.className = 'fita';
    div.style.backgroundImage = `url('${filme.lombada}')`;
    div.dataset.capa = filme.capa;
    
    div.addEventListener('click', () => {
      if (index !== indexAtual) {
        indexAtual = index;
        atualizarDestaque(index);
      }
    });

    carrossel.appendChild(div);
  });
}

function atualizarDestaque(index) {
  const fitas = document.querySelectorAll('.fita');
  
  // Reseta todas as fitas para a imagem da lombada
  fitas.forEach((f, i) => {
    f.classList.remove('destaque');
    f.style.backgroundImage = `url('${filmes[i].lombada}')`;
  });
  
  // Ativa a fita clicada
  const fitaAtiva = fitas[index];
  if (!fitaAtiva) return;
  
  fitaAtiva.classList.add('destaque');
  fitaAtiva.style.backgroundImage = `url('${fitaAtiva.dataset.capa}')`;

  // Rola o carrossel para centralizar
  setTimeout(() => {
    fitaAtiva.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, 50);

  // Atualiza os textos
  const filme = filmes[index];
  document.getElementById('titulo-destaque').textContent = filme.titulo;
  document.getElementById('diretor-destaque').textContent = `UM FILME DE ${filme.diretor.toUpperCase()}`;
  document.getElementById('ano-destaque').textContent = filme.ano;
  
  // Salva o link no botão
  const btn = document.getElementById('btnAssistir');
  btn.dataset.link = filme.link; 
}

// Setas
document.getElementById('btnPrev').addEventListener('click', () => {
  if (indexAtual > 0) {
    indexAtual--;
    atualizarDestaque(indexAtual);
  }
});
document.getElementById('btnNext').addEventListener('click', () => {
  if (indexAtual < filmes.length - 1) {
    indexAtual++;
    atualizarDestaque(indexAtual);
  }
});

/* =========================================
   CONTROLE DO MODAL (PLAYER CRT)
   ========================================= */
   
const modalPlayer = document.getElementById('modalPlayer');
const iframeDrive = document.getElementById('iframeDrive');
const btnAssistir = document.getElementById('btnAssistir');
const btnFecharPlayer = document.getElementById('fecharPlayer');
const crtOverlay = document.getElementById('crtOverlay');
const btnToggleCrt = document.getElementById('btnToggleCrt');

btnAssistir.addEventListener('click', (e) => {
  e.preventDefault();
  const link = e.target.dataset.link;
  
  if(link) {
    // Adiciona autoplay ao link do drive
    iframeDrive.src = link + "?autoplay=1"; 
    modalPlayer.classList.add('ativo');
  }
});

function fecharPlayer() {
  modalPlayer.classList.remove('ativo');
  iframeDrive.src = ""; // Para o vídeo e libera memória
}

btnFecharPlayer.addEventListener('click', fecharPlayer);

// Fechar ao clicar no fundo escuro fora da TV
modalPlayer.addEventListener('click', (e) => {
  if (e.target === modalPlayer) {
    fecharPlayer();
  }
});

// Lógica para Ligar/Desligar CRT
btnToggleCrt.addEventListener('click', () => {
  crtOverlay.classList.toggle('desativado');
  
  if (crtOverlay.classList.contains('desativado')) {
    btnToggleCrt.textContent = "CRT: OFF";
    btnToggleCrt.style.color = "#666";
    btnToggleCrt.style.borderColor = "#666";
  } else {
    btnToggleCrt.textContent = "CRT: ON";
    btnToggleCrt.style.color = "var(--verde-crt)";
    btnToggleCrt.style.borderColor = "var(--verde-crt)";
  }
});

// Inicia tudo
carregarFilmes();