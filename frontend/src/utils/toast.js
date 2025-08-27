
let toastModulePromise;
const load = () => {
  if (!toastModulePromise) {
    toastModulePromise = import('react-hot-toast').then((m) => m.toast || m.default || m);
  }
  return toastModulePromise;
};

const makeCall = (method, args) => {
  load().then((t) => {
    const fn = typeof t === 'function' ? t : t?.[method];
    if (method && t?.[method]) t[method](...args);
    else if (typeof fn === 'function') fn(...args);
  }).catch(() => {});
  return undefined;
};

function toast(...args) {
  return makeCall(null, args);
}

['success', 'error', 'loading', 'promise', 'custom', 'dismiss', 'remove'].forEach((name) => {
  toast[name] = (...args) => makeCall(name, args);
});

export default toast;
