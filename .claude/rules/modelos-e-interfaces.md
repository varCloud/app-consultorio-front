# Convención de interfaces y modelos

Todo modelo nuevo se define como un par **interface + clase que la implementa**, siguiendo el patrón `<Entidad>` / `<Entidad>Model` (el ejemplo de referencia es `User` / `UserModel implements User`):

```ts
export interface User {
  idUser: number;
  fullName: string;
  email: string;
}

export class UserModel implements User {
  idUser = 0;
  fullName = '';
  email = '';

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}
```

- La **interface** (`User`) describe la forma de los datos — se usa para tipar respuestas del backend, `@Input()`, parámetros de servicio.
- La **clase `Model`** (`UserModel`) implementa la interface y da valores por defecto — se usa para instanciar objetos nuevos en el front (ej. un formulario en blanco) sin dejar propiedades en `undefined`.
- Los nombres de propiedades siempre en **camelCase**, incluso si el endpoint del backend regresa otra convención — el mapeo de forma distinta se hace explícito en el servicio, nunca se propaga el nombre crudo del backend al modelo.
- Archivo: `src/app/entidades/<entidad-en-minusculas>.model.ts`, mismo patrón que el ya existente [menu.model.ts](../../src/app/entidades/menu.model.ts).

Ver también [constantes.md](constantes.md) (nada de valores mágicos dentro del modelo) y [clean-code.md](clean-code.md) (esto aplica incluso a modelos simples: si la entidad tiene 2-3 campos, la interface + Model de arriba es suficiente, no hace falta más estructura).
