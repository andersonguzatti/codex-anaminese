import InputMask from 'react-input-mask'

type Props = {
  name: string
  className?: string
  lang?: string
  placeholder?: string
  defaultValue?: string
}

export default function MaskedDateInput({ name, className, lang = 'pt-BR', placeholder, defaultValue }: Props) {
  const isPt = (lang || '').toLowerCase().startsWith('pt')
  const mask = '99/99/9999' // dd/MM/yyyy or MM/dd/yyyy, só muda a semântica
  const ph = placeholder || (isPt ? 'DD/MM/AAAA' : 'MM/DD/YYYY')

  return (
    <InputMask mask={mask} maskPlaceholder={null} defaultValue={defaultValue}>
      {(inputProps: any) => (
        <input
          {...inputProps}
          type="text"
          name={name}
          inputMode="numeric"
          pattern="[0-9/]*"
          className={className}
          placeholder={ph}
        />
      )}
    </InputMask>
  )
}

