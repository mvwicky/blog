interface AnyFunc {
  (...args: any[]): any;
}

export function debounce<F extends AnyFunc>(
  func: F,
  wait: number = 250,
  immediate: boolean = false
) {
  let timeout: number | undefined;

  return function debouncedFunction(this: ThisType<F>, ...a: Parameters<F>) {
    const later = () => {
      timeout = undefined;
      if (!immediate) {
        func.apply(this, a);
      }
    };
    const callNow = immediate && !timeout;
    window.clearTimeout(timeout);

    timeout = window.setTimeout(later, wait);
    if (callNow) {
      func.apply(this, a);
    }
  };
}
