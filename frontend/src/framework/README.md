# Framework Structure and Usage Guide

To use this framework, ensure you have the following directory structure:

frontend/
├── public/
│ ├── index.html
│ └── styles.css
└── src/
├── framework/
│ └── framework.ts
│ └── router.ts
│ └── server.ts
│ └── state.ts
│ └── utils.ts
├── pages/
│ ├── homePage.ts
│ └── aboutPage.ts
└── index.ts

## HTML Setup

Body tag will contain only following snipet:

```html
<div id="root"></div>
<script type="module" src="/index.js"></script>
```

## INDEX Setup

In your startup file (`index.ts`), use following snippet:

```ts
import framework from "./framework/framework.js";

window.addEventListener("hashchange", () => {
  framework.changeRoute();
});

framework.changeRoute();
```

## Making elements

Example how to do element:

```ts
import framework from "./../framework/framework.js";

const Header = () => {
  return framework.create(
    "header",
    {},
    framework.create(
      "div",
      { class: "header" },
      framework.create("h1", { class: "main_caption" }, "todos")
    )
  );
};

export default Header;
```

## Making pages

Example how to do home page:

```ts
import Header from "../components/header";
import { create } from "../framework/framework";

const HomePage = () => {
  return create("div", { class: "main_grid" }, Header());
};

export default HomePage;
```

## Making routes

In strings use wished url tag.
In pageComponent will be used your variable defined in pages file.
example how to do routing:

```ts
const Routes: routes = {
  "#": {
    pageComponent: HomePage,
    metaTitle: "Home",
    metaDescription: "This is home",
    dynamic: false,
  },
  "#About": {
    pageComponent: AboutPage,
    metaTitle: "About",
    metaDescription: "About page",
    dynamic: false,
  },
};
```

## State Setup

To use state management in your components, import ComponentHooks from state.ts:

```ts
import { ComponentHooks } from "../framework/state.js";
```

Then, within your component, use useState from ComponentHooks to manage state:

```ts
const { useState } = ComponentHooks();
const [count, setCount] = useState(0);
```

Now, count is a state variable and setCount is a function to update it. You can use them within your component as needed.
