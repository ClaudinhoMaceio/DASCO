// Array com todas as descrições dos itens
const itensDescricao = [
    "Os pneus estão em boas condições",
    "Freios e embreagens estão funcionando",
    "Há vazamentos de óleo",
    "Extintores em boas condições de uso e conservação",
    "Os instrumentos de controle do painel de comando estão funcionando",
    "Limpador de para-brisas está funcionando",
    "Espelho retrovisor",
    "A partida da máquina está funcionando",
    "O operador está habilitado a operar (possui treinamento e CNH)",
    "O tanque de combustível / cilindro de gás apresenta vazamento",
    "As condições gerais da máquina tais como: pintura, estrutura, assento do operador",
    "Tem proteção tipo cabine para o operador",
    "Possui programa preventivo regular",
    "Durante a inspeção foi observado alguma irregularidade executada pelo operador",
    "Luz alta e baixa",
    "Meia luz dianteira e traseira",
    "A sinaleira, pisca traseira e dianteira",
    "Luz de ré ambos os lados",
    "Faróis de neblina, faróis superiores dos tratores"
];

// Validação do formulário
document.getElementById('inspectionForm').addEventListener('submit', function(e) {
    e.preventDefault();
});

// ========== FUNÇÕES DE CACHE (LOCALSTORAGE) ==========

// Função para salvar dados no localStorage
function salvarNoCache() {
    const dados = coletarDadosFormulario();
    try {
        localStorage.setItem('inspecaoDASCO', JSON.stringify(dados));
        console.log('Dados salvos no cache');
    } catch (e) {
        console.error('Erro ao salvar no cache:', e);
    }
}

// Função para carregar dados do localStorage
function carregarDoCache() {
    try {
        const dadosSalvos = localStorage.getItem('inspecaoDASCO');
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            
            // Preencher campos de texto
            if (dados.operador) document.getElementById('operador').value = dados.operador;
            if (dados.veiculo) document.getElementById('veiculo').value = dados.veiculo;
            if (dados.marcaModelo) document.getElementById('marcaModelo').value = dados.marcaModelo;
            if (dados.placa) document.getElementById('placa').value = dados.placa;
            if (dados.ano) document.getElementById('ano').value = dados.ano;
            if (dados.medidasRecomendadas) document.getElementById('medidasRecomendadas').value = dados.medidasRecomendadas;
            if (dados.tecnicoSeguranca) document.getElementById('tecnicoSeguranca').value = dados.tecnicoSeguranca;
            if (dados.dia) document.getElementById('dia').value = dados.dia;
            if (dados.mes) document.getElementById('mes').value = dados.mes;
            if (dados.anoData) document.getElementById('anoData').value = dados.anoData;
            
            // Preencher radio buttons
            if (dados.itens && dados.itens.length > 0) {
                for (let i = 0; i < dados.itens.length; i++) {
                    if (dados.itens[i]) {
                        const radio = document.querySelector(`input[name="item${i + 1}"][value="${dados.itens[i]}"]`);
                        if (radio) radio.checked = true;
                    }
                }
            }
            
            console.log('Dados carregados do cache');
        }
    } catch (e) {
        console.error('Erro ao carregar do cache:', e);
    }
}

// Função para limpar cache
function limparCache() {
    if (confirm('Tem certeza que deseja limpar o cache? Todos os dados salvos serão perdidos.')) {
        localStorage.removeItem('inspecaoDASCO');
        document.getElementById('inspectionForm').reset();
        alert('Cache limpo com sucesso!');
    }
}

// Salvar automaticamente quando houver mudanças
function configurarAutoSave() {
    // Campos de texto
    const camposTexto = ['operador', 'veiculo', 'marcaModelo', 'placa', 'ano', 
                         'medidasRecomendadas', 'tecnicoSeguranca', 'dia', 'mes', 'anoData'];
    
    camposTexto.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', salvarNoCache);
            campo.addEventListener('change', salvarNoCache);
        }
    });
    
    // Radio buttons
    for (let i = 1; i <= 19; i++) {
        const radios = document.querySelectorAll(`input[name="item${i}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', salvarNoCache);
        });
    }
}

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarDoCache();
    configurarAutoSave();
    registrarServiceWorker();
});

// ========== REGISTRO DO SERVICE WORKER (PWA) ==========
function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./service-worker.js')
                .then(function(registration) {
                    console.log('Service Worker registrado com sucesso:', registration.scope);
                })
                .catch(function(error) {
                    console.log('Falha ao registrar Service Worker:', error);
                });
        });
    }
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
    const dados = {
        operador: document.getElementById('operador').value,
        veiculo: document.getElementById('veiculo').value,
        marcaModelo: document.getElementById('marcaModelo').value,
        placa: document.getElementById('placa').value,
        ano: document.getElementById('ano').value,
        medidasRecomendadas: document.getElementById('medidasRecomendadas').value,
        tecnicoSeguranca: document.getElementById('tecnicoSeguranca').value,
        dia: document.getElementById('dia').value,
        mes: document.getElementById('mes').value,
        anoData: document.getElementById('anoData').value,
        itens: []
    };

    // Coletar respostas dos 19 itens
    for (let i = 1; i <= 19; i++) {
        const radios = document.querySelectorAll(`input[name="item${i}"]:checked`);
        dados.itens.push(radios.length > 0 ? radios[0].value : '');
    }

    return dados;
}

// Função para validar formulário completo
function validarFormulario() {
    const dados = coletarDadosFormulario();
    
    // Validar campos obrigatórios
    if (!dados.operador || !dados.veiculo || !dados.marcaModelo || 
        !dados.placa || !dados.ano || !dados.tecnicoSeguranca || 
        !dados.dia || !dados.mes || !dados.anoData) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return false;
    }

    // Validar se todos os itens foram respondidos
    for (let i = 0; i < dados.itens.length; i++) {
        if (!dados.itens[i]) {
            alert(`Por favor, responda o item ${i + 1}!`);
            return false;
        }
    }

    return true;
}

// Função para gerar PDF
function gerarPDF() {
    if (!validarFormulario()) {
        return;
    }

    const dados = coletarDadosFormulario();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Configurações - otimizadas para uma única página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPos = margin;
    const lineHeight = 4.5;
    const fontSize = 7.5;

    // Função para centralizar texto
    function textoCentralizado(texto, y, fontSize) {
        doc.setFontSize(fontSize);
        const textWidth = doc.getTextWidth(texto);
        const x = (pageWidth - textWidth) / 2;
        doc.text(texto, x, y);
    }

    // Cabeçalho - Logo DASCO centralizado
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    textoCentralizado('DASCO', yPos, 16);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    yPos += 5;
    textoCentralizado('ENGENHARIA LTDA', yPos, 8);
    yPos += 4;
    doc.setFontSize(7);
    textoCentralizado('desde 1980', yPos, 7);
    
    // Título centralizado
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    textoCentralizado('INSPEÇÃO BIMESTRAL DE SEGURANÇA EM VEÍCULOS', yPos, 10);
    yPos += 5;
    doc.setFontSize(9);
    textoCentralizado('CHECK LIST - MÁQUINAS', yPos, 9);

    yPos += 6;

    // Informações do veículo - centralizadas
    doc.setFontSize(fontSize);
    doc.setFont(undefined, 'normal');
    textoCentralizado(`Operador: ${dados.operador}`, yPos, fontSize);
    yPos += lineHeight;
    textoCentralizado(`Veículo: ${dados.veiculo}`, yPos, fontSize);
    yPos += lineHeight;
    textoCentralizado(`Marca / Modelo: ${dados.marcaModelo}`, yPos, fontSize);
    yPos += lineHeight;
    textoCentralizado(`Placa: ${dados.placa}`, yPos, fontSize);
    yPos += lineHeight;
    textoCentralizado(`Ano: ${dados.ano}`, yPos, fontSize);
    yPos += lineHeight + 2;

    // Configuração da tabela - otimizada
    const tableStartX = margin;
    const tableWidth = pageWidth - 2 * margin;
    const colWidths = [10, 110, 20, 20, 20];
    const colX = [
        tableStartX,
        tableStartX + colWidths[0],
        tableStartX + colWidths[0] + colWidths[1],
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2],
        tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
    ];
    const headerHeight = 6;
    const rowHeight = 5;

    // Cabeçalho da tabela
    doc.setFillColor(42, 82, 152);
    doc.rect(tableStartX, yPos, tableWidth, headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(7);
    doc.text('ITEM', colX[0] + 3, yPos + 4);
    doc.text('DESCRIÇÃO', colX[1] + 2, yPos + 4);
    doc.text('Sim', colX[2] + 6, yPos + 4);
    doc.text('Não', colX[3] + 6, yPos + 4);
    doc.text('NA', colX[4] + 6, yPos + 4);
    yPos += headerHeight;
    doc.setTextColor(0, 0, 0);

    // Itens 1-14
    doc.setFont(undefined, 'normal');
    doc.setFontSize(6.5);
    for (let i = 0; i < 14; i++) {
        const itemNum = i + 1;
        const resposta = dados.itens[i];
        
        // Desenhar bordas da linha
        doc.rect(tableStartX, yPos, colWidths[0], rowHeight);
        doc.rect(colX[1], yPos, colWidths[1], rowHeight);
        doc.rect(colX[2], yPos, colWidths[2], rowHeight);
        doc.rect(colX[3], yPos, colWidths[3], rowHeight);
        doc.rect(colX[4], yPos, colWidths[4], rowHeight);
        
        // Número do item
        doc.setFont(undefined, 'bold');
        doc.text(itemNum.toString(), colX[0] + 3, yPos + 3.5);
        doc.setFont(undefined, 'normal');
        
        // Descrição (com quebra de linha se necessário)
        const descricao = doc.splitTextToSize(itensDescricao[i], colWidths[1] - 3);
        const descHeight = descricao.length * 3.5;
        const actualRowHeight = Math.max(rowHeight, descHeight + 1);
        
        // Ajustar altura da linha se necessário
        if (actualRowHeight > rowHeight) {
            doc.rect(tableStartX, yPos, colWidths[0], actualRowHeight);
            doc.rect(colX[1], yPos, colWidths[1], actualRowHeight);
            doc.rect(colX[2], yPos, colWidths[2], actualRowHeight);
            doc.rect(colX[3], yPos, colWidths[3], actualRowHeight);
            doc.rect(colX[4], yPos, colWidths[4], actualRowHeight);
        }
        
        doc.text(descricao, colX[1] + 1, yPos + 3);
        
        // Marcar resposta
        if (resposta === 'sim') {
            doc.setFont(undefined, 'bold');
            doc.text('X', colX[2] + 8, yPos + 3.5);
            doc.setFont(undefined, 'normal');
        } else if (resposta === 'nao') {
            doc.setFont(undefined, 'bold');
            doc.text('X', colX[3] + 8, yPos + 3.5);
            doc.setFont(undefined, 'normal');
        } else if (resposta === 'na') {
            doc.setFont(undefined, 'bold');
            doc.text('X', colX[4] + 8, yPos + 3.5);
            doc.setFont(undefined, 'normal');
        }
        
        yPos += actualRowHeight;
    }

    // Seção SINALEIRAS E FARÓIS
    yPos += 2;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8);
    doc.setFillColor(102, 126, 234);
    doc.rect(tableStartX, yPos, tableWidth, 5, 'F');
    doc.setTextColor(255, 255, 255);
    textoCentralizado('SINALEIRAS E FARÓIS', yPos + 3.5, 8);
    yPos += 6;
    doc.setTextColor(0, 0, 0);

    // Cabeçalho da tabela novamente
    doc.setFillColor(42, 82, 152);
    doc.rect(tableStartX, yPos, tableWidth, headerHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(7);
    doc.text('ITEM', colX[0] + 3, yPos + 4);
    doc.text('DESCRIÇÃO', colX[1] + 2, yPos + 4);
    doc.text('Sim', colX[2] + 6, yPos + 4);
    doc.text('Não', colX[3] + 6, yPos + 4);
    doc.text('NA', colX[4] + 6, yPos + 4);
    yPos += headerHeight;
    doc.setTextColor(0, 0, 0);

    // Itens 15-19
    doc.setFont(undefined, 'normal');
    doc.setFontSize(6.5);
    for (let i = 14; i < 19; i++) {
        const itemNum = i + 1;
        const resposta = dados.itens[i];
        
        doc.rect(tableStartX, yPos, colWidths[0], rowHeight);
        doc.rect(colX[1], yPos, colWidths[1], rowHeight);
        doc.rect(colX[2], yPos, colWidths[2], rowHeight);
        doc.rect(colX[3], yPos, colWidths[3], rowHeight);
        doc.rect(colX[4], yPos, colWidths[4], rowHeight);
        
        doc.setFont(undefined, 'bold');
        doc.text(itemNum.toString(), colX[0] + 3, yPos + 3.5);
        doc.setFont(undefined, 'normal');
        
        const descricao = doc.splitTextToSize(itensDescricao[i], colWidths[1] - 3);
        const descHeight = descricao.length * 3.5;
        const actualRowHeight = Math.max(rowHeight, descHeight + 1);
        
        if (actualRowHeight > rowHeight) {
            doc.rect(tableStartX, yPos, colWidths[0], actualRowHeight);
            doc.rect(colX[1], yPos, colWidths[1], actualRowHeight);
            doc.rect(colX[2], yPos, colWidths[2], actualRowHeight);
            doc.rect(colX[3], yPos, colWidths[3], actualRowHeight);
            doc.rect(colX[4], yPos, colWidths[4], actualRowHeight);
        }
        
        doc.text(descricao, colX[1] + 1, yPos + 3);
        
        if (resposta === 'sim') {
            doc.setFont(undefined, 'bold');
            doc.text('X', colX[2] + 8, yPos + 3.5);
            doc.setFont(undefined, 'normal');
        } else if (resposta === 'nao') {
            doc.setFont(undefined, 'bold');
            doc.text('X', colX[3] + 8, yPos + 3.5);
            doc.setFont(undefined, 'normal');
        } else if (resposta === 'na') {
            doc.setFont(undefined, 'bold');
            doc.text('X', colX[4] + 8, yPos + 3.5);
            doc.setFont(undefined, 'normal');
        }
        
        yPos += actualRowHeight;
    }

    // Medidas Recomendadas
    yPos += 3;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(8);
    textoCentralizado('MEDIDAS RECOMENDADAS', yPos, 8);
    yPos += 4;
    
    // Caixa para medidas recomendadas
    const medidasHeight = 15;
    doc.rect(tableStartX, yPos, tableWidth, medidasHeight);
    yPos += 3;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(fontSize);
    if (dados.medidasRecomendadas) {
        const medidas = doc.splitTextToSize(dados.medidasRecomendadas, tableWidth - 6);
        doc.text(medidas, tableStartX + 3, yPos);
    } else {
        doc.text('Nenhuma medida recomendada.', tableStartX + 3, yPos);
    }

    // Rodapé centralizado
    yPos = pageHeight - 12;
    doc.setFontSize(fontSize);
    textoCentralizado(`Tec. Segurança: ${dados.tecnicoSeguranca}`, yPos, fontSize);
    yPos += lineHeight;
    textoCentralizado(`Data: ${dados.dia}/${dados.mes}/${dados.anoData}`, yPos, fontSize);

    // Salvar PDF
    const fileName = `Inspecao_${dados.placa}_${dados.dia}_${dados.mes}_${dados.anoData}.pdf`;
    doc.save(fileName);
    
    alert('PDF gerado com sucesso!');
}

// Função para enviar via WhatsApp
function enviarWhatsApp() {
    if (!validarFormulario()) {
        return;
    }

    const dados = coletarDadosFormulario();
    
    // Criar mensagem formatada
    let mensagem = `*INSPEÇÃO BIMESTRAL DE SEGURANÇA EM VEÍCULOS*\n`;
    mensagem += `*CHECK LIST - MÁQUINAS*\n\n`;
    mensagem += `*DASCO ENGENHARIA LTDA*\n\n`;
    mensagem += `*INFORMAÇÕES DO VEÍCULO:*\n`;
    mensagem += `Operador: ${dados.operador}\n`;
    mensagem += `Veículo: ${dados.veiculo}\n`;
    mensagem += `Marca/Modelo: ${dados.marcaModelo}\n`;
    mensagem += `Placa: ${dados.placa}\n`;
    mensagem += `Ano: ${dados.ano}\n\n`;
    mensagem += `*CHECKLIST:*\n\n`;

    // Adicionar itens 1-14
    for (let i = 0; i < 14; i++) {
        const resposta = dados.itens[i];
        let respostaTexto = '';
        if (resposta === 'sim') respostaTexto = '✓ Sim';
        else if (resposta === 'nao') respostaTexto = '✗ Não';
        else respostaTexto = '○ N/A';
        
        mensagem += `${i + 1}. ${itensDescricao[i]}: ${respostaTexto}\n`;
    }

    mensagem += `\n*SINALEIRAS E FARÓIS:*\n\n`;

    // Adicionar itens 15-19
    for (let i = 14; i < 19; i++) {
        const resposta = dados.itens[i];
        let respostaTexto = '';
        if (resposta === 'sim') respostaTexto = '✓ Sim';
        else if (resposta === 'nao') respostaTexto = '✗ Não';
        else respostaTexto = '○ N/A';
        
        mensagem += `${i + 1}. ${itensDescricao[i]}: ${respostaTexto}\n`;
    }

    if (dados.medidasRecomendadas) {
        mensagem += `\n*MEDIDAS RECOMENDADAS:*\n${dados.medidasRecomendadas}\n`;
    }

    mensagem += `\n*Tec. Segurança:* ${dados.tecnicoSeguranca}\n`;
    mensagem += `*Data:* ${dados.dia}/${dados.mes}/${dados.anoData}`;

    // Codificar mensagem para URL
    const mensagemEncoded = encodeURIComponent(mensagem);
    
    // Criar link do WhatsApp
    const whatsappURL = `https://wa.me/?text=${mensagemEncoded}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappURL, '_blank');
}

// Event listeners
document.getElementById('generatePDF').addEventListener('click', gerarPDF);
document.getElementById('sendWhatsApp').addEventListener('click', enviarWhatsApp);
document.getElementById('limparCache').addEventListener('click', limparCache);

// Limpar cache quando resetar formulário
document.getElementById('inspectionForm').addEventListener('reset', function() {
    setTimeout(() => {
        salvarNoCache();
    }, 100);
});

// Validação em tempo real
document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value) {
            this.style.borderColor = '#28a745';
        }
    });
});

// Formatação automática de placa
document.getElementById('placa').addEventListener('input', function(e) {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) value = value.slice(0, 7);
    e.target.value = value;
});

// Validação de data
document.getElementById('dia').addEventListener('input', function() {
    const dia = parseInt(this.value);
    if (dia < 1 || dia > 31) {
        this.setCustomValidity('Dia deve estar entre 1 e 31');
    } else {
        this.setCustomValidity('');
    }
});

document.getElementById('mes').addEventListener('input', function() {
    const mes = parseInt(this.value);
    if (mes < 1 || mes > 12) {
        this.setCustomValidity('Mês deve estar entre 1 e 12');
    } else {
        this.setCustomValidity('');
    }
});

