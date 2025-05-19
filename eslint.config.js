import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // Không yêu cầu type trả về cho hàm
      '@typescript-eslint/no-explicit-any': 'warn', // Chỉ cảnh báo khi dùng 'any', không lỗi
      '@typescript-eslint/ban-types': 'off', // Tắt cấm một số type (như {})
      '@typescript-eslint/no-empty-function': 'off', // Cho phép hàm rỗng
    },
  },
)
