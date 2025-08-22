// ============================================
// ARQUIVO SCRIPT.JS - FUNCIONALIDADES PRINCIPAIS
// ============================================

// Inicialização dos ícones Lucide
function initializeIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Configuração dos event listeners
function setupEventListeners() {
    // Event listener para abrir o chat via botão principal
    const openChatBtn = document.getElementById('openChatBtn');
    if (openChatBtn) {
        openChatBtn.addEventListener('click', openChatWidget);
    }

    // Event listeners para os cards de ajuda rápida
    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => {
        const message = card.getAttribute('data-message');
        
        card.addEventListener('click', () => {
            if (message) {
                openChatWithMessage(message);
            } else {
                openChatWidget();
            }
        });

        // Efeito visual ao passar o mouse
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Smooth scroll para elementos internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para abrir o widget de chat
function openChatWidget() {
    try {
        // Tenta encontrar o botão de toggle do chat
        const chatToggle = document.querySelector('[data-chat="toggle"]');
        
        if (chatToggle) {
            chatToggle.click();
            showToast('Chat aberto com sucesso!', 'success');
        } else {
            // Fallback: tenta encontrar qualquer elemento relacionado ao chat
            const chatButton = document.querySelector('.chat-button, .chat-toggle, [class*="chat"]');
            if (chatButton) {
                chatButton.click();
            } else {
                showToast('Chat ainda não está disponível. Aguarde um momento...', 'warning');
                
                // Tenta novamente após um delay
                setTimeout(() => {
                    const retryToggle = document.querySelector('[data-chat="toggle"]');
                    if (retryToggle) {
                        retryToggle.click();
                        showToast('Chat carregado!', 'success');
                    }
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Erro ao abrir chat:', error);
        showToast('Erro ao abrir o chat. Tente novamente.', 'error');
    }
}

// Função para abrir o chat com mensagem pré-definida
function openChatWithMessage(message) {
    try {
        // Primeiro abre o chat
        openChatWidget();
        
        // Aguarda um pouco para o chat carregar e tenta preencher a mensagem
        setTimeout(() => {
            const chatInput = document.querySelector('input[placeholder*="question"], input[placeholder*="message"], textarea[placeholder*="question"], textarea[placeholder*="message"]');
            
            if (chatInput) {
                chatInput.value = message;
                chatInput.focus();
                
                // Dispara evento de input para notificar o sistema
                const inputEvent = new Event('input', { bubbles: true });
                chatInput.dispatchEvent(inputEvent);
                
                showToast('Pergunta pré-carregada!', 'info');
            }
        }, 1500);
        
    } catch (error) {
        console.error('Erro ao abrir chat com mensagem:', error);
        openChatWidget(); // Fallback para apenas abrir o chat
    }
}

// Sistema de notificações toast
function showToast(message, type = 'info') {
    // Remove toasts existentes
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    // Cria o elemento toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${getToastIcon(type)}
            </div>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;

    // Adiciona ao body
    document.body.appendChild(toast);

    // Inicializa ícones se necessário
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Função para obter ícone do toast baseado no tipo
function getToastIcon(type) {
    const icons = {
        info: '<i data-lucide="info"></i>',
        success: '<i data-lucide="check-circle"></i>',
        warning: '<i data-lucide="alert-triangle"></i>',
        error: '<i data-lucide="alert-circle"></i>'
    };
    return icons[type] || icons.info;
}

// Função para obter cor do toast baseado no tipo
function getToastColor(type) {
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    return colors[type] || colors.info;
}

// Configuração de animações e efeitos de scroll
function setupAnimations() {
    // Intersection Observer para animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa elementos para animação
    document.querySelectorAll('.help-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Efeito parallax no header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Função para aguardar o carregamento do chat
function waitForChatLoad() {
    return new Promise((resolve) => {
        const checkForChat = () => {
            const chatContainer = document.querySelector('[data-chat="container"], .chat-container, [class*="chat"]');
            if (chatContainer) {
                resolve(true);
            } else {
                setTimeout(checkForChat, 500);
            }
        };
        checkForChat();
    });
}

// Monitoramento do status do chat
async function monitorChatStatus() {
    const statusText = document.getElementById('statusText');
    const openChatBtn = document.getElementById('openChatBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        // Mostra loading
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }

        // Aguarda o chat carregar
        await waitForChatLoad();
        
        // Atualiza status
        if (statusText) {
            statusText.textContent = 'Online';
        }
        
        // Habilita botão
        if (openChatBtn) {
            openChatBtn.disabled = false;
        }
        
        showToast('Chat carregado e pronto para uso!', 'success');
        
    } catch (error) {
        console.error('Erro ao carregar chat:', error);
        
        if (statusText) {
            statusText.textContent = 'Erro ao carregar';
        }
        
        showToast('Erro ao carregar o chat. Recarregue a página.', 'error');
    } finally {
        // Esconde loading
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 1000);
        }
    }
}

// Adiciona estilos dinâmicos
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos para notificações toast */
        .toast-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid var(--toast-color, #3b82f6);
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            gap: 12px;
        }
        
        .toast-icon {
            flex-shrink: 0;
            color: var(--toast-color, #3b82f6);
        }
        
        .toast-message {
            flex: 1;
            font-size: 14px;
            color: #374151;
        }
        
        .toast-close {
            background: none;
            border: none;
            cursor: pointer;
            color: #9ca3af;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .toast-close:hover {
            color: #6b7280;
            background: #f3f4f6;
        }
        
        .toast-info { --toast-color: #3b82f6; }
        .toast-success { --toast-color: #10b981; }
        .toast-warning { --toast-color: #f59e0b; }
        .toast-error { --toast-color: #ef4444; }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        /* Animações suaves para elementos */
        .smooth-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
}

// Manipulador de erros global
window.addEventListener('error', (event) => {
    console.error('Erro global capturado:', event.error);
    showToast('Ocorreu um erro inesperado.', 'error');
});

// Funções para salvar preferências do usuário
function saveUserPreference(key, value) {
    try {
        localStorage.setItem(`lms-next-${key}`, JSON.stringify(value));
    } catch (error) {
        console.warn('Não foi possível salvar preferência:', error);
    }
}

function getUserPreference(key, defaultValue = null) {
    try {
        const saved = localStorage.getItem(`lms-next-${key}`);
        return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
        console.warn('Não foi possível carregar preferência:', error);
        return defaultValue;
    }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    initializeIcons();
    setupEventListeners();
    setupAnimations();
});

// Inicialização quando a janela carrega completamente
window.addEventListener('load', () => {
    addDynamicStyles();
    monitorChatStatus();
});

// Exporta funções principais para uso global
window.LMSNextChat = {
    openChat: openChatWidget,
    openChatWithMessage: openChatWithMessage,
    showToast: showToast
};