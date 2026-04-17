import { useEffect } from 'react';

export default function ReaddyAgent() {
  useEffect(() => {
    let observer: MutationObserver | null = null;

    const showWidget = () => {
      const btn = document.querySelector('#vapi-widget-floating-button') as HTMLElement | null;
      if (btn) {
        btn.style.display = '';

        // Observe when the chat panel opens to inject welcome message if needed
        observer = new MutationObserver(() => {
          injectWelcomeMessage();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        setTimeout(showWidget, 300);
      }
    };

    const injectWelcomeMessage = () => {
      // Look for the chat input area — when it appears, the panel is open
      const chatContainer = document.querySelector(
        '[data-readdy-widget] .chat-messages, .readdy-chat-messages, .vapi-chat-messages'
      ) as HTMLElement | null;

      if (chatContainer && chatContainer.children.length === 0) {
        // Panel is open and empty — the empty-chat-message attribute handles the display
        // No extra injection needed; the widget reads it natively
      }
    };

    showWidget();

    return () => {
      if (observer) observer.disconnect();

      const btn = document.querySelector('#vapi-widget-floating-button') as HTMLElement | null;
      if (btn) btn.style.display = 'none';

      // Also hide any open widget panel
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
