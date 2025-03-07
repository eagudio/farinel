module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const tag = openingElement.name.name; // Nome del tag (es: div, MyComponent)

        // Converti gli attributi JSX in un oggetto JS
        const attributes = openingElement.attributes.map(attr => {
          let value;
          
          if (attr.value) {
            if (t.isJSXExpressionContainer(attr.value)) {
              // Per espressioni come onClick={() => ...}
              value = attr.value.expression;
            } else {
              // Per valori stringa come type="button"
              value = t.stringLiteral(attr.value.value);
            }
          } else {
            // Per attributi booleani come disabled
            value = t.booleanLiteral(true);
          }

          return t.objectProperty(
            t.identifier(attr.name.name),
            value
          );
        });

        // Converti i figli JSX
        const children = path.node.children
          .map(child => {
            if (t.isJSXText(child)) {
              return t.stringLiteral(child.value.trim());
            }
            return child.expression || child;
          })
          .filter(Boolean);

        // Sostituisci JSX con `createElement(tag, props, ...children)`
        const callExpr = t.callExpression(
          t.identifier("Farinel.createElement"),
          [
            t.stringLiteral(tag),
            t.objectExpression(attributes),
            ...children
          ]
        );

        path.replaceWith(callExpr);
      }
    }
  };
};
