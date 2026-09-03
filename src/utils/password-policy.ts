export const PASSWORD_REQUIREMENTS_MESSAGE =
  'A senha deve ter entre 8 e 128 caracteres, com letra maiúscula, minúscula, número e símbolo.'

export function isStrongPassword(
  password: string,
): boolean {
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)
  )
}
