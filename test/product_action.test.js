const { validationResult } = require('express-validator')

function transformObject(inputObject) {
    const transformedObject = {};
  
    for (const key in inputObject) {
      if (inputObject.hasOwnProperty(key)) {
        let transformedKey;
  
        if (key === 'name') {
          transformedKey = 'nombre';
        } else if (key === 'email') {
          transformedKey = 'correo';
        } else if (key === 'password') {
          transformedKey = 'contrasena';
        } else if (key === 'numCelular') {
          transformedKey = 'telefono';
        } else if (key === 'address') {
          transformedKey = 'direccion';
        } else if (key === 'user_type') {
          transformedKey = 'tipo_usuario';
        } else {
          transformedKey = key;
        }
  
        transformedObject[transformedKey] = inputObject[key];
      }
    }
  
    return transformedObject;
  }

test('Debe enviar lo mismo que le digo',()=>{
    expect(1)
})