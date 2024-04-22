import Routes from "./router.js";

export type Component = {
  type: keyof HTMLElementTagNameMap;
  // TODO: Make a better type for props
  props?: { [key: string]: any } & DOMAttributes;
  children?: Array<Component | string>;
};

type DOMAttributes = {
  // Form Events
  onChange?: ChangeEventHandler;
  onChangeCapture?: ChangeEventHandler;
  onInput?: ChangeEventHandler;
  onInputCapture?: ChangeEventHandler;
};

export type ChangeEventHandler<T = HTMLInputElement> = (
  e: ChangeEvent<T>,
) => void;
export type ChangeEvent<T = HTMLInputElement> = Event & {
  target: EventTarget & T;
};

/**
 * to create a new element, use this, also same for JSX parsing in the future
 *
 * @param {string} type HTML tag name
 * @param {any[]} props Set property like id, lib etc.
 * @param  {...any} children string or child elements
 * @returns
 */
export function create(
  type: keyof HTMLElementTagNameMap,
  props: { [key: string]: any } & DOMAttributes = {},
  ...children: Array<
    Component | Component[] | string | null | undefined | boolean
  >
) {
  if (Array.isArray(children)) {
    children = children.flat();
    children = children.filter((child) => {
      if (child == null) return;
      if (typeof child === "boolean") {
        return;
      }
      if (Array.isArray(child)) {
        return child;
      }
      return child;
    });
  }

  return { type, props, children } as Component;
}

function setBooleanProp($target: HTMLElement, key: string, value: boolean) {
  if (value) {
    $target.setAttribute(key, "");
  } else {
    $target.removeAttribute(key);
  }
}

//small function do like this
const extractEventName = (name: string) => name.slice(2).toLowerCase();

function isCustomProp(name: string) {
  return isEventProp(name) || name === "forceUpdate";
}

function setProp($target: HTMLElement, key: string, value: any) {
  if (isCustomProp(key)) {
  } else if (key === "className") {
    $target.setAttribute("class", value);
  } else if (typeof value === "boolean") {
    setBooleanProp($target, key, value);
  } else {
    $target.setAttribute(key, value);
  }
}

function removeProp($target: HTMLElement, key: string) {
  if (key === "className") {
    $target.removeAttribute("class");
  } else {
    $target.removeAttribute(key);
  }
}

function setProps($target: HTMLElement, props?: { [key: string]: any }) {
  if (!props) return;
  Object.keys(props).forEach((name) => {
    setProp($target, name, props[name]);
  });
}

function updateProp(
  $target: HTMLElement,
  key: string,
  newVal?: any,
  oldVal?: any,
) {
  if (!newVal) removeProp($target, key);
  if (!oldVal) setProp($target, key, newVal);
  if (oldVal !== newVal) setProp($target, key, newVal);
  if (isEventProp(key)) updateEventListener($target, key, newVal, oldVal);
}

function removeAllProps(
  $target: HTMLElement,
  oldProps: { [key: string]: any } = {},
) {
  Object.keys(oldProps).forEach((name) => {
    removeProp($target, name);
  });
}

function updateProps(
  $target: HTMLElement,
  newProps?: { [key: string]: any },
  oldProps?: { [key: string]: any },
) {
  if (!newProps) {
    removeAllProps($target, oldProps);
    return;
  }
  if (!oldProps) {
    setProps($target, newProps);
    return;
  }

  const props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach((name) => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
}

function isEventProp(name: string) {
  return /^on/.test(name);
}

function addEventListeners($target: Node, props?: { [key: string]: any }) {
  if (props === undefined) return;
  Object.keys(props).forEach((name) => {
    if (isEventProp(name)) {
      const eventName = extractEventName(name);

      if (eventName == "wheel" || eventName == "touch") {
        $target.addEventListener(eventName, props[name], { passive: false });
        return;
      }

      $target.addEventListener(extractEventName(name), props[name], {});
    }
  });
}

function updateEventListener(
  $target: Node,
  name: string,
  newVal?: any,
  oldVal?: any,
) {
  const eventName = extractEventName(name);
  $target.removeEventListener(eventName, oldVal);
  if (newVal === undefined) return;
  if (eventName == "wheel" || eventName == "touch") {
    $target.addEventListener(eventName, newVal, { passive: false });
    return;
  }
  $target.addEventListener(extractEventName(name), newVal, {});
}

function createElement(node: Component | (() => Component) | string | null) {
  if (node == null) return;

  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  if (typeof node === "function") {
    node = node();
  }

  const $el = document.createElement(node.type);
  if (node.props) setProps($el, node.props);
  addEventListeners($el, node.props);

  if (node.children == undefined) return $el;

  node.children.map(createElement).forEach((child) => {
    if (child == null) return;
    $el.appendChild(child);
  });

  return $el;
}

/**
 * updates the element in the actual DOM
 *
 * @param $parent HTML parent element
 * @param newNode new node element
 * @param oldNode old node element
 * @param [index=0] index of child node
 * @returns
 */
function updateElement(
  $parent: HTMLElement,
  newNode?: Component | string,
  oldNode?: Component | string,
  index = 0,
) {
  if (!newNode) {
    let times = ($parent.childNodes.length || 0) - index;
    while (times-- > 0) {
      if ($parent.lastChild) {
        $parent.removeChild($parent.lastChild);
      }
    }
    return;
  }

  const newElement = createElement(newNode);

  if (!newElement) return;

  if (!oldNode) {
    $parent.appendChild(newElement);
    return;
  }

  if (typeof newNode == "string" || typeof oldNode == "string") {
    if (newNode != oldNode) {
      $parent.replaceChild(newElement, $parent.childNodes[index]);
    }
    return;
  }

  if (newNode.type != oldNode.type) {
    $parent.replaceChild(newElement, $parent.childNodes[index]);
    return;
  }

  // Semi-sketchy workaround for ensuring a blank input field will be shown when setState("") is used to clear input
  if (oldNode.props?.value && !newNode.props?.value) {
    $parent.replaceChild(newElement, $parent.childNodes[index]);
    return;
  }

  updateProps(
    //TODO: THIS IS PROBABLY NOT A GOOD IDEA
    <HTMLElement>$parent.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  const newLength = newNode.children?.length || 0;
  const oldLength = oldNode.children?.length || 0;

  if ($parent.childNodes[index] == undefined) return;

  if (newLength >= oldLength) {
    newNode.children?.forEach((newChild, i) => {
      const oldChild = oldNode.children?.[i] || undefined;
      updateElement(
        <HTMLElement>$parent.childNodes[index],
        newChild,
        oldChild,
        i,
      );
    });
  } else {
    oldNode.children?.forEach((oldChild, i) => {
      const newChild = newNode.children?.[i] || undefined;
      updateElement(
        <HTMLElement>$parent.childNodes[index],
        newChild,
        oldChild,
        i,
      );
    });
  }
}

// TODO returns all properties for rendering a component
// function extractProps() { return [] }

let DOM: Component | undefined = undefined;

function redirect(url: string) {
  window.history.pushState({}, "", url);
  changeRoute();
}

function changeRoute(path?: string) {
  const $root = document.getElementById("root");
  if (!$root) {
    throw new Error(
      "Root element not found. Ensure element with id 'root' exists in index.html",
    );
  }

  let currentPath = path ? path : window.location.hash;
  if (currentPath.length === 0) {
    currentPath = "#";
  }
  const { pageComponent, metaTitle, metaDescription } =
    routeResolver(currentPath);

  setMeta(metaTitle, metaDescription);
  const newDOM = create("div", { class: "app" }, pageComponent());
  updateElement($root, newDOM, DOM);
  DOM = newDOM;
}

function routeResolver(path: string) {
  if (Routes[path]) {
    return Routes[path];
  }

  if (path.includes("?")) {
    const [route] = path.split("?");

    if (!Routes[route]) {
      return Routes["#error"];
    }

    if (!Routes[route].dynamic) {
      return Routes["#error"];
    }

    return Routes[route];
  }

  return Routes["#error"];
}

const setMeta = (title: string, description: string) => {
  if (document.title != title) document.title = title;

  let descriptionContainer = document.querySelector('meta[name="description"]');

  if (!descriptionContainer && description.length > 0) {
    descriptionContainer = document.createElement("meta");
    descriptionContainer.setAttribute("name", "description");
    document.head.appendChild(descriptionContainer);
  }

  if (description.length > 0) {
    descriptionContainer?.setAttribute("content", description);
  } else {
    descriptionContainer?.remove();
  }
};

const MyFrameWork = {
  create,
  changeRoute,
  redirect,
};

export default MyFrameWork;
