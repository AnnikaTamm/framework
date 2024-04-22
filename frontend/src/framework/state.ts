import framework from "./framework.js";

type StateUpdater<T> = (action: T | ((currentData: T) => T)) => void;
export type useStateType<T> = (init: T) => [T, StateUpdater<T>];
export type useEffectType = (
  callback: () => void,
  dependencyArray: Array<any>,
) => void;

const FrameworkHooks = () => {
  // currently using any
  let hooks: {
    [name: string]: any[];
  } = {};

  function ComponentHooks(name: string) {
    let ComponentIndex = 0;
    if (!hooks[name]) hooks[name] = [];

    function useState<T>(init: T): [T, StateUpdater<T>] {
      const localIndex = ComponentIndex;
      // console.log("accessing data at", localIndex, hooks[name]);

      ComponentIndex++;
      if (hooks[name][localIndex] === undefined) {
        hooks[name][localIndex] = structuredClone(init);
      }

      const setState: StateUpdater<T> = (
        action: T | ((currentData: T) => T),
      ) => {
        hooks[name][localIndex] =
          typeof action === "function"
            ? // @ts-ignore
            action(hooks[name][localIndex])
            : action;

        dispatch();
      };

      return [hooks[name][localIndex], setState];
    }

    function useEffect(callback: () => void, dependencyArray: Array<any>) {
      let hasChanged = true;

      const oldDependencies = hooks[name][ComponentIndex];

      if (oldDependencies) {
        hasChanged = false;
        dependencyArray.forEach((dependency, index) => {
          const oldDependency = oldDependencies[index];
          const areTheSame = Object.is(dependency, oldDependency);
          if (!areTheSame) {
            hasChanged = true;
          }
        });
      }

      hooks[name][ComponentIndex] = dependencyArray;
      ComponentIndex++;

      if (hasChanged) {
        resetComponentIndex();
        callback();
      }
    }

    const resetComponentIndex = () => {
      ComponentIndex = 0;
    };

    const dispatch = () => {
      resetComponentIndex();
      framework.changeRoute();
    };

    return {
      useState,
      useEffect,
    };
  }

  // const dispatchGlobal = () => {
  //   resetGlobalIndex();
  //   framework.changeRoute();
  // };

  // const resetGlobalIndex = () => {
  //   globalIndex = 0;
  // };

  return {
    ComponentHooks,
  };
};

const { ComponentHooks } = FrameworkHooks();

export { ComponentHooks };
