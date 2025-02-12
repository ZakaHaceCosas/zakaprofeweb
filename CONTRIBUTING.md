# Pautas de Contribución

## Idioma

- Todo debe estar en español: commits, documentación, comentarios y textos visibles en la UI.
- Los nombres de variables y funciones pueden estar en inglés (o español, eso en el fondo da igual).

## Código

- JavaScript puro, sin TypeScript (perdón :pensive:).
- Indentación de 4 espacios, sin tabs.
- Exportación directa al declarar un componente, `export default function Componente() {}`.
- Estilo K&R para llaves `{}`.

:white_check_mark: Un ejemplo de buen código:

```js
// K&R valido
export default function Enlace({ texto, url }) {
    return <a href={url}>{texto}</a>;
}
```

:x: Un ejemplo de mal código:

```js
// no K&R, no valido!
function Enlace({ texto })
{
    return <a href={url}>{texto}</a>;
}

export default Boton;
```
