function _useConfig() {
  const reverseWubi = useLocalStorage("reverseWubi", false);
  return {
    reverseWubi,
  };
}

export const useConfig = createSharedComposable(_useConfig);
