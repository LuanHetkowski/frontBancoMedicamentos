// Seleciona o formulário
const form = document.getElementById('medicamentoForm');
const caixaResultado = document.getElementById('containerResult');
const mensagemCarregando = document.getElementById('carregandoStatus');
const mensagemResultado = document.getElementById('ResultadoStatus');
const mensagemErro = document.getElementById('ResultadoErro');

// Adiciona um evento de submissão ao formulário
form.addEventListener('submit', function(event) {
    document.getElementById("btnPesquisar").disabled = true;
    event.preventDefault(); // Evita o recarregamento da página    
    
        // Define que o usuário passou pela página inicial        
        const itemList = document.getElementById('listaMedicamentos');
        nomeVerificacao = '';
        codigoBarraVerificacao = '';
        
        const formData = new FormData(form);
        const dadosForm = Object.fromEntries(formData);
        console.log(dadosForm);
        caixaResultado.style.display = 'grid';     
        mensagemCarregando.style.display = 'grid';
        mensagemErro.style.display = 'none'    
        mensagemResultado.style.display = 'none';

        fetch('https://100.20.92.101/read',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosForm)
        }).then(response => {
                    if (!response.ok) {                                             
                        throw new Error('Erro na requisição');
                    }
                    return response.json();
                })
                .then(data => {
                 // Limpa a lista antes de adicionar novos itens
                 itemList.innerHTML = '';
                 localStorage.clear();    
                 sessionStorage.clear();
                 sessionStorage.setItem('acessoValido', 'true');
                      
                 data.map(item => {                    
                    nomeVerificacao = item.nome;
                    codigoBarraVerificacao = item.codigoDeBarras;
                })

                  if(nomeVerificacao === '' && codigoBarraVerificacao === ''){                                     
                    const listItem = document.createElement('li');   
                    const nomeMedicamentoDigitado = document.getElementById('nome').value;          
                     listItem.textContent = 'Medicamento não encontrado\n CLIQUE AQUI PARA CADASTRAR';        
                     linha = -1;            
                    jsonModificado = {
                                        "linha": -1,                                        
                                        "nome": nomeMedicamentoDigitado                                        
                                        }

                     listItem.setAttribute('IdLinha', linha);                                         
                     localStorage.setItem(`${linha}`, JSON.stringify(jsonModificado));
                     // Adiciona evento de clique no item
                     listItem.addEventListener('click', (event) => {
                         const clickedItem = event.target;
                         const itemId = clickedItem.getAttribute('IdLinha');                         

                         const selectItem = localStorage.getItem(itemId);
                         sessionStorage.setItem('medicamentoSelecionado', selectItem);
                         
                                                  
                         window.location.href = 'PaginaInformacoes/pagina2.html';
                     });

                     itemList.appendChild(listItem);
                     document.getElementById("btnPesquisar").disabled = false; 
                     mensagemCarregando.style.display = 'none';
                    mensagemResultado.style.display = 'grid';                  
                  }else{
                 // Itera sobre os itens do JSON e adiciona à lista
                 data.forEach(item => {
                     const listItem = document.createElement('li');                    
                     listItem.innerHTML = `
                     <strong>Nome:</strong> ${item.nome}<br>
                     <strong>Concentração:</strong> ${item.concentracao}<br>
                     <strong>Quantidade:</strong> ${item.quantidadeCaixa} ${item.unidadeQuantidade}
                   `;
                     
                     // Adiciona um atributo data-* para armazenar informações extras
                     listItem.setAttribute('IdLinha', item.linha);                                         
                     localStorage.setItem(`${item.linha}`, JSON.stringify(item));
                     // Adiciona evento de clique no item
                     listItem.addEventListener('click', (event) => {
                         const clickedItem = event.target;
                         const itemId = clickedItem.getAttribute('IdLinha');                         

                         const selectItem = localStorage.getItem(itemId);
                         sessionStorage.setItem('medicamentoSelecionado', selectItem);
                         
                                                  
                         window.location.href = 'PaginaInformacoes/pagina2.html';
                     });

                     itemList.appendChild(listItem);                     
                 });
                 //Adicionar na lista botão para adicionar medicamento
                    const listItem = document.createElement('li');                    
                     listItem.textContent = 'ADICIONAR NOVO MEDICAMENTO';
                     
                     // Adiciona um atributo data-* para armazenar informações extras
                     listItem.setAttribute('IdLinha', 0);  
                     const nomeMedicamentoDigitado = document.getElementById('nome').value;          
                     jsonModificado = {
                        "linha": -1,                        
                        "nome": nomeMedicamentoDigitado                  
                        };                                       
                     localStorage.setItem('0', JSON.stringify(jsonModificado));
                     // Adiciona evento de clique no item
                     listItem.addEventListener('click', (event) => {
                         const clickedItem = event.target;
                         const itemId = clickedItem.getAttribute('IdLinha');                         

                         const selectItem = localStorage.getItem(itemId);
                         sessionStorage.setItem('medicamentoSelecionado', selectItem);
                         
                                                  
                         window.location.href = 'PaginaInformacoes/pagina2.html';
                     });

                     itemList.appendChild(listItem);
                 mensagemCarregando.style.display = 'none';
                 mensagemResultado.style.display = 'grid';
                 document.getElementById("btnPesquisar").disabled = false;
                }
                }).catch(error => {
                console.error("Erro ao carregar medicamentos: ", error);
                mensagemCarregando.style.display = 'none';
                mensagemErro.style.display = 'grid'   
                document.getElementById("btnPesquisar").disabled = false;                   
            });                 
            
           
});
        
const input = document.getElementById('nome');

  input.addEventListener('input', () => {
    // Transforma a primeira letra em maiúscula
    input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
});




