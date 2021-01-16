const inputValidation = {
  required: [
    v => !!v || 'Zorunlu alan.',
  ],
  email: [
    v => /.+@.+/.test(v) || 'E-Posta adresi doğru değil',
  ],
}
export {
  inputValidation,
};