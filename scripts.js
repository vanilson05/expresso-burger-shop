document.addEventListener('DOMContentLoaded', () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Função para atualizar o carrinho
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
                        <h4>${produto.nome}</h4>
                        <p><strong>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</strong></p>
                    </div>
                    <div class="produto-actions">
                        <button data-index="${index}" class="btn-remove-one">-</button>
                        <span>${produto.quantidade}</span>
                        <button data-index="${index}" class="btn-add-one">+</button>
                        <button data-index="${index}" class="btn-remove-all">Remover</button>
                    </div>
                `;
                produtosCarrinho.appendChild(produtoElement);

                produtoElement.querySelector('.btn-remove-one').addEventListener('click', () => {
                    removerUmItemDoCarrinho(index);
                });

                produtoElement.querySelector('.btn-add-one').addEventListener('click', () => {
                    adicionarUmItemAoCarrinho(index);
                });

                produtoElement.querySelector('.btn-remove-all').addEventListener('click', () => {
                    removerTodosItensDoCarrinho(index);
                });
            }
        });

        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (cartCountElement) cartCountElement.textContent = totalItems;
    };

    // Gera a mensagem do pedido
    const gerarMensagemWhatsApp = () => {
        if (carrinho.length === 0) return "Seu carrinho está vazio.";

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

    // Envia o pedido via WhatsApp
    const enviarPedidoWhatsApp = () => {
        const numeroWhatsApp = "5582982300284";
        const mensagem = gerarMensagemWhatsApp();

        if (mensagem === "Seu carrinho está vazio.") {
            Swal.fire({
                title: 'Carrinho Vazio!',
                text: 'Adicione itens ao carrinho antes de finalizar o pedido.',
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#4CAF50',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            return;
        }

        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.open(urlWhatsApp, "_blank");
    };

    // Adiciona um item ao carrinho
    const adicionarUmItemAoCarrinho = (index) => {
        carrinho[index].quantidade += 1;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    // Remove um item do carrinho
    const removerUmItemDoCarrinho = (index) => {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    // Remove todos os itens do carrinho
    const removerTodosItensDoCarrinho = (index) => {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    };

    // Configura os botões
    const btnFinalizarCompra = document.getElementById('finalizar-compra');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', (event) => {
            event.preventDefault();
            enviarPedidoWhatsApp();
        });
    }

    atualizarCarrinho();
});
