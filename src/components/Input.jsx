import { forwardRef } from 'react'

const Input = forwardRef((props, ref) => {
  const inputProps = Object.assign({}, props, {label: undefined, children: undefined})
  return (
    <div className="flex flex-col gap-2">
      <span>{props.label}</span>
      <input
        ref={ref}
        className="disabled:cursor-not-allowed rounded-xl border-2 border-solid border-blue bg-transparent outline-none px-4 py-2"
        {...inputProps}
      />
      <>{props.children}</>
    </div>
  )
})
export default Input