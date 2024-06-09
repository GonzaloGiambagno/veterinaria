import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
 
export function ErrorLogin() {
  return (
    <Alert variant="destructive" className="text-center">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertDescription className="mt-1 italic">
        El usuario y/o contraseña son incorrectos.
      </AlertDescription>
    </Alert>
  )
}