export const renderIf = (condition, thenRender) =>
  condition ? thenRender() : null;

export const renderIfElse = (condition, thenRender) => {
  if (condition) {
    return {
      elseRender: () => thenRender(),
    };
  } else {
    return {
      elseRender: component => component(),
    };
  }
};
