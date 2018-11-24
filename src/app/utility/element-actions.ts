let scrollIntoView = require('scroll-into-view');

export const SCROLL_ANIMATION_TIME = 1000;

export function scroll(id: string) {
  if (elementExists(id)) {
    scrollIntoView(document.getElementById(id), {
      time: SCROLL_ANIMATION_TIME,
      align: {top: 0},
    });
  }
}

export function highlight(id: string) {
  if (elementExists(id)) {
    performAction(id, el => {
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 5000); // Length of anim
    });
  }
}

export function focusElement(id: string, selector = 'input') {
  if (elementExists(id)) {
    performAction(id, el => {
      if (el.querySelector(selector)) {
        (el.querySelector(selector) as HTMLElement).focus();
      }
    });
  }
}

function performAction(id: string, action: (el: Element) => void) {
  setTimeout(() => {
    action(document.getElementById(id));
  });
}

function elementExists(id: string) {
  return !!document.getElementById(id);
}
