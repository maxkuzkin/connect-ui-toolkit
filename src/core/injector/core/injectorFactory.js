import {
  clone,
  has,
} from "@/helpers";

export default core => ({
  watch(a, b, {immediate} = {}) {
    let fn, name;

    if (typeof a === 'function') {
      name = '*';
      fn = a;
    } else {
      name = a;
      fn = b;
    }

    if (!has(name, core.watchers)) core.watchers[name] = [];

    core.watchers[name].push(() => {
      fn(name === '*' ? core.state : core.state[name]);
    });

    if (immediate) {
      fn(name === '*' ? core.state : core.state[name]);
    }
  },

  commit(data) {
    core.assign(data);

    window.top.postMessage({
      $id: core.id || null,
      data: core.state ? clone(core.state) : null,
    }, "*");
  },

  emit(name, data = true) {
    window.top.postMessage({
      $id: core.id || null,
      events: {
        [name]: data,
      },
    }, "*");
  },

  listen(name, cb) {
    core.listeners[name] = cb;
  },
});
