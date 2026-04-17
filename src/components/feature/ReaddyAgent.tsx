import { useEffect } from 'react';

const WELCOME_TEXT =
  "Bonjour 👋 Je suis l'assistant virtuel du Domaine Fendri. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos huiles d'olive premium, nos bouteilles personnalisées ou passer une commande.";

/** Recursively search for an element inside shadow roots */
function deepQuery(root: Document | Element | ShadowRoot, selector: string): HTMLElement | null {
  const direct = (root as Document | Element).querySelector?.(selector) as HTMLElement | null;
  if (direct) return direct;

  const allElements = (root as Document | Element).querySelectorAll?.('*') ?? [];
  for (const el of allElements) {
    if ((el as Element).shadowRoot) {
      const found = deepQuery((el as Element).shadowRoot!, selector);
      if (found) return found;
    }
  }
  return null;
}

export default function ReaddyAgent() {
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let welcomed = false;

    const getWelcomeMessage = (): string => {
      const script = document.querySelector(
        'script[src*="readdy.ai"]'
      ) as HTMLScriptElement | null;
      return script?.getAttribute('empty-chat-message') || WELCOME_TEXT;
    };

    const injectWelcomeMessage = () => {
      if (welcomed) return;

      const selectors = [
        '[data-readdy-widget] .chat-messages',
        '.readdy-chat-messages',
        '.vapi-chat-messages',
        '[class*="chat-messages"]',
        '[class*="chatMessages"]',
        '[class*="message-list"]',
        '[class*="messageList"]',
        '[class*="messages-container"]',
      ];

      let chatContainer: HTMLElement | null = null;
      for (const sel of selectors) {
        chatContainer = deepQuery(document, sel);
        if (chatContainer) break;
      }

      if (chatContainer && chatContainer.children.length === 0) {
        welcomed = true;

        const msg = document.createElement('div');
        msg.className = 'readdy-welcome-message';
        msg.style.cssText = [
          'padding:12px 16px',
          'margin:8px',
          'border-radius:12px',
          'background:#f5f0e8',
          'color:#1a1a0e',
          'font-size:14px',
          'line-height:1.5',
          'border-left:3px solid #d4af37',
          'box-shadow:0 1px 4px rgba(0,0,0,0.08)',
        ].join(';');
        msg.textContent = getWelcomeMessage();
        chatContainer.appendChild(msg);
      }
    };

    const showWidget = () => {
      const btn = document.querySelector('#vapi-widget-floating-button') as HTMLElement | null;
      if (btn) {
        btn.style.display = '';

        observer = new MutationObserver(() => {
          injectWelcomeMessage();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        setTimeout(showWidget, 300);
      }
    };

    showWidget();

    return () => {
      if (observer) observer.disconnect();

      const btn = document.querySelector('#vapi-widget-floating-button') as HTMLElement | null;
      if (btn) btn.style.display = 'none';

      const panels = document.querySelectorAll(
        'readdy-assistant-widget, [data-readdy-widget], #readdy-widget-root, .readdy-widget-container'
      );
      panels.forEach((panel) => {
        (panel as HTMLElement).style.display = 'none';
      });
    };
  }, []);

  return null;
}
