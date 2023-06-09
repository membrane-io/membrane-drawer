import { state as _state, root } from "membrane";

interface Item {
  node: any;
  tags: string[];
}
interface State {
  items: { [key: string]: Item };
}

// Make state typed
const state = _state as State;

// Initialize state
state.items = state.items ?? {};

export const Root = {
  put: ({ args: { node, name } }) => {
    let key: string = name;
    let i = name ? 2 : 1;
    while (!key || state.items[key] !== undefined) {
      key = `${name ?? "node"}${i++}`;
    }
    state.items[key] = { node, tags: [] };
    return key;
  },
  remove: ({ args: { name } }) => {
    delete state.items[name];
  },
  one: ({ args: { name } }) => state.items[name],
  rename: ({ args: { newName, oldName } }) => {
    if (newName !== oldName) {
      state.items[newName] = state.items[oldName];
      delete state.items[oldName];
    }
  },
  page: ({ args: { tag } }) => {
    return {
      items: Object.entries(state.items)
        .filter((entry) => !tag || entry[1].tags.includes(tag))
        .map(([name, { node, tags }]) => ({
          gref: root.one({ name }),
          name,
          node,
        })),
      // TODO: paginate
      next: null,
    };
  },
};
