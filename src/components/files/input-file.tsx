import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputFileProps {
    inputName : string,
    labelText : string,
}

export function InputFile(props : InputFileProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={props.inputName}>{props.labelText}</Label>
      <Input id={props.inputName} type="file" />
    </div>
  )
}
