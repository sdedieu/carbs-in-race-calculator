export function getInputByLabel(root: HTMLElement, name: string): HTMLInputElement {
  const ariaLabelledInput = Array.from(root.querySelectorAll<HTMLInputElement>('input')).find(
    (input) => input.getAttribute('aria-label') === name,
  );

  if (ariaLabelledInput) {
    return ariaLabelledInput;
  }

  const wrappingLabel = Array.from(root.querySelectorAll('label')).find(
    (label) => label.querySelector('span')?.textContent?.trim() === name,
  );
  const input = wrappingLabel?.querySelector('input');

  if (!input) {
    throw new Error(`Expected an input labelled "${name}"`);
  }

  return input;
}

export function getButtonByName(root: HTMLElement, name: string): HTMLButtonElement {
  const button = Array.from(root.querySelectorAll('button')).find(
    (candidate) =>
      candidate.getAttribute('aria-label') === name || candidate.textContent?.trim() === name,
  );

  if (!button) {
    throw new Error(`Expected a button named "${name}"`);
  }

  return button;
}

export function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

export function normalizedText(element: Element): string {
  const content = Array.from(element.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ?? '';
      }

      return node instanceof Element ? normalizedText(node) : '';
    })
    .join(' ');

  return content.replace(/\s+/g, ' ').trim();
}
