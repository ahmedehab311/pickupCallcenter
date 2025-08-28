import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaSpinner } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

function DeleteAddressAlert({
    handleDeleteAddress,
    lodaingEditDeletedAddress,
    address
}) {
    return (

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex items-center text-red-500 gap-[2px]">
                    <FiTrash2 className="text-xs" />
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will
                        permanently delete this address.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        type="button"
                        variant="outline"
                        color="info"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/80"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={lodaingEditDeletedAddress}
                    >
                        {lodaingEditDeletedAddress ? (
                            <span className="flex items-center justify-center">
                                <FaSpinner className="animate-spin mr-2" />
                            </span>
                        ) : (
                            "Ok"
                        )}
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default DeleteAddressAlert;