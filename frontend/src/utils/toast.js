
// Toast notification utility - lazy loads react-hot-toast to reduce bundle size

let toastModulePromise;

// Lazy load the toast module to avoid including it in initial bundle
const load = () => {
  if (!toastModulePromise) {
    toastModulePromise = import('react-hot-toast').then((m) => m.toast || m.default || m);
  }
  return toastModulePromise;
};

// Helper to make toast calls once module is loaded
const makeCall = (method, args) => {
  load().then((t) => {
    const fn = typeof t === 'function' ? t : t?.[method];
    if (method && t?.[method]) t[method](...args);
    else if (typeof fn === 'function') fn(...args);
  }).catch(() => {}); // Silently fail if toast can't load
  return undefined;
};

// Main toast function
function toast(...args) {
  return makeCall(null, args);
}

// Add toast methods (success, error, loading, etc.)
['success', 'error', 'loading', 'promise', 'custom', 'dismiss', 'remove'].forEach((name) => {
  toast[name] = (...args) => makeCall(name, args);
});

export default toast;
