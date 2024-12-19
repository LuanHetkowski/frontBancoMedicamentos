// Obtém os parâmetros da URL
const params = new URLSearchParams(window.location.search);
const acesso = params.get('acesso');

if (acesso !== 'true') {
    const acessoValido = sessionStorage.getItem('acessoValido');
    medicamentoSelect = JSON.parse(sessionStorage.getItem('medicamentoSelecionado'));
   
        if (!acessoValido) {
            // Redireciona de volta para a página inicial se não for válido
            window.location.href = '../index.html';
        }        

        const formulario = document.getElementById("detalhesMedicamentoForm");

      // Itera sobre as chaves do JSON
      for (const chave in medicamentoSelect) {
        // Procura um campo no formulário com o mesmo nome que a chave
        const campo = formulario.elements[chave];
        if (campo) {
          campo.value = medicamentoSelect[chave]; // Define o valor do campo
        }
      }
}

function mostrarDisplay(){
    document.getElementById("barcode-video").style.display = 'grid';
    document.getElementById("escanearCodigo").disabled = true;
}

const btEcanearCodigo = document.getElementById('escanearCodigo');

// Adiciona um evento de submissão ao formulário
btEcanearCodigo.addEventListener('click', function(event) {
   // event.preventDefault(); // Evita o recarregamento da página
    mostrarDisplay();

    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector('#barcode-video'), // O elemento onde o vídeo será exibido
            constraints: {
                facingMode: "environment" // Usando a câmera traseira
            }
        },
        decoder: {
            readers: [
                "ean_reader",        // EAN-13
                "ean_8_reader",      // EAN-8
                "upc_reader",        // UPC
                "code_128_reader",   // Code 128
                "code_39_reader",    // Code 39
                "code_93_reader"     // Code 93
            ] // Tipos de códigos que serão lidos
        }
    }, function(err) {
        if (err) {
            console.log("Erro ao iniciar o scanner:", err);
            return;
        }
        Quagga.start(); // Inicia a leitura
    });

    // Quando um código de barras é detectado, ele exibe o valor
    Quagga.onDetected(function(result) {
        document.getElementById('codigoDeBarras').value = result.codeResult.code;
        document.getElementById("barcode-video").style.display = 'none';
        document.getElementById("escanearCodigo").disabled = false;
        Quagga.stop();
    });

});

const form = document.getElementById('detalhesMedicamentoForm');

// Adiciona um evento de submissão ao formulário
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o recarregamento da página
    document.getElementById("submitBtn").disabled = true;         

    const formData = new FormData(form);
    const dadosForm = Object.fromEntries(formData);
        
        Swal.fire({
        title: "Salvando Medicamento",             
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();     
        
        // jsonInformacoes = {        
        //     "codigoDeBarras": inputCodigo,
        //     "nome": inputNome,              
        //     "linha": inputInteracoes,          
        //     "classeTerapeutica": inputClasseTerap
        // };
         
         fetch('http://100.20.92.101/write', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosForm)
        })
        .then(response => {
            Swal.close(); 
            if (!response.ok) {
                throw new Error("Erro na requisição");
                document.getElementById("submitBtn").disabled = false;
            }
            return response.json(); // Processa o corpo da resposta como JSON
        })
        .then(data => {
            console.log(dadosForm);
            if (data == 1) { 
                Swal.fire({
                    title: "Medicamento salvo com sucesso",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                       // sessionStorage.clear();
                        //localStorage.clear();
                       // window.location.href = '../index.html';
                    }
                });
            } else {
                Swal.fire({
                    title: "Falha ao salvar medicamento",
                    icon: "error"
                });
                document.getElementById("submitBtn").disabled = false;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            Swal.fire({
                title: "Erro na comunicação com o servidor",
                icon: "error"
            });
            document.getElementById("submitBtn").disabled = false;
        });    
                
        },
        willClose: () => {

        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss) {
            
        }
        });

    
});

const nomeUp = document.getElementById('nome');

nomeUp.addEventListener('input', () => {
    // Transforma a primeira letra em maiúscula
    nomeUp.value = nomeUp.value.charAt(0).toUpperCase() + nomeUp.value.slice(1);
});
const classeTerapeuticaUp = document.getElementById('classeTerapeutica');

classeTerapeuticaUp.addEventListener('input', () => {
    // Transforma a primeira letra em maiúscula
    classeTerapeuticaUp.value = classeTerapeuticaUp.value.charAt(0).toUpperCase() + classeTerapeuticaUp.value.slice(1);
});
const laboratorioUp = document.getElementById('laboratorio');

laboratorioUp.addEventListener('input', () => {
    // Transforma a primeira letra em maiúscula
    laboratorioUp.value = laboratorioUp.value.charAt(0).toUpperCase() + laboratorioUp.value.slice(1);
});