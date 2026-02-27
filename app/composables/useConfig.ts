function _useConfig() {
  const reverseWubi = useLocalStorage("reverseWubi", false);
  const autoScroll = useLocalStorage("autoScroll", true);
  return {
    reverseWubi,
    autoScroll,
  };
}

export const useConfig = createSharedComposable(_useConfig);
