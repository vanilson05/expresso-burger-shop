document.addEventListener('DOMContentLoaded', () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const atualizarCarrinho = () => {
        const produtosCarrinho = document.getElementById('produtos-carrinho');
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        const cartCountElement = document.getElementById('cart-count');

        if (produtosCarrinho) {
            produtosCarrinho.innerHTML = '';
        }
        let subtotal = 0;
        let totalItems = 0;

        carrinho.forEach((produto, index) => {
            subtotal += produto.preco * produto.quantidade;
            totalItems += produto.quantidade;

            if (produtosCarrinho) {
                const produtoElement = document.createElement('div');
                produtoElement.className = 'produto-carrinho';
                produtoElement.innerHTML = `
                    <div class="produto-info">
                        <div>
                            <h4>${produto.nome}</h4>
                            <p><strong>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</strong></p>
                        </div>
                    </div>
                    <div class="produto-actions">
                        <button data-index="${index}" class="btn-remove-one mais">-</button>
                        <span class="number-cart">${produto.quantidade}</span>
                        <button data-index="${index}" class="btn-add-one mais">+</button>
                        <button data-index="${index}" class="btn-remove-all remove-all">Remover Todos</button>
                    </div>
                `;
                produtosCarrinho.appendChild(produtoElement);

                const removeOneButton = produtoElement.querySelector('.btn-remove-one');
                removeOneButton.addEventListener('click', () => {
                    removerUmItemDoCarrinho(index);
                });

                const addOneButton = produtoElement.querySelector('.btn-add-one');
                addOneButton.addEventListener('click', () => {
                    adicionarUmItemAoCarrinho(index);
                });

                const removeAllButton = produtoElement.querySelector('.btn-remove-all');
                removeAllButton.addEventListener('click', () => {
                    removerTodosItensDoCarrinho(index);
                });
            }
        });

        if (subtotalElement) {
            subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        }
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };

    const gerarMensagemWhatsApp = () => {
        if (carrinho.length === 0) {
            return "Seu carrinho está vazio.";
        }

        let mensagem = "Olá, gostaria de finalizar o pedido:\n\n";
        let total = 0;

        carrinho.forEach(item => {
            let subtotal = item.preco * item.quantidade;
            total += subtotal;
            mensagem += `- ${item.nome} (x${item.quantidade}): R$ ${subtotal.toFixed(2)}\n`;
        });

        mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
        return mensagem;
    };

    const enviarPedidoWhatsApp = () => {
        const numeroWhatsApp = "5582982300284"; // Substitua pelo número de destino
        const mensagem = gerarMensagemWhatsApp();

        if (mensagem === "Seu carrinho está vazio.") {
            alert("Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.");
            return;
        }

        // Codifica a mensagem para garantir que os caracteres especiais sejam tratados corretamente
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        // Abre a URL do WhatsApp em uma nova aba para iniciar a conversa
        window.open(urlWhatsApp, "_blank"); 
    };

    const adicionarAoCarrinho = (nome, preco) => {
        const item = carrinho.find(produto => produto.nome === nome);
        if (item) {
            item.quantidade += 1;
        } else {
            carrinho.push({ nome, preco, quantidade: 1 });
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        window.location.href = 'carrinho.html'; // Redireciona para a página do carrinho após adicionar um item
    };

    const adicionarUmItemAoCarrinho = (index) => {
        carrinho[index].quantidade += 1;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    const removerUmItemDoCarrinho = (index) => {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    const removerTodosItensDoCarrinho = (index) => {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    const continuarComprando = () => {
        window.location.href = 'index.html'; // Redireciona para a página inicial após clicar em "Continuar Comprando"
    };

    const btnContinuarComprando = document.getElementById('btn-continuar-comprando');
    if (btnContinuarComprando) {
        btnContinuarComprando.addEventListener('click', continuarComprando);
    }

    const buttons = document.querySelectorAll('button[data-nome]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const nome = button.getAttribute('data-nome');
            const preco = parseFloat(button.getAttribute('data-preco'));
            adicionarAoCarrinho(nome, preco);
        });
    });

    const btnFinalizarCompra = document.getElementById('finalizar-compra');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', (event) => {
            event.preventDefault(); // Evita comportamento padrão, se houver
            enviarPedidoWhatsApp(); // Envia o pedido ao WhatsApp
        });
    }

    atualizarCarrinho();
});
