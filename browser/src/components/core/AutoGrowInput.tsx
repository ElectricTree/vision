import "./AutoGrowInput.css"

import classNames from "classnames"
import { InputHTMLAttributes } from "react"

interface Props {
  value?: string
  onChange: (value: string) => void
  className?: string
  extraProps?: InputHTMLAttributes<HTMLTextAreaElement>
}

export const AutoGrowInput: React.FC<Props> = ({
  value,
  onChange,
  className,
  extraProps = {},
}) => (
  <div className={classNames("grow-wrap", className)}>
    <textarea
      {...extraProps}
      className="form-textarea block w-full"
      style={{ minHeight: 120, padding: "8px 16px" }}
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  </div>
)
