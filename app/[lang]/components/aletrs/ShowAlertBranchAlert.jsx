import React from 'react'

function ShowAlertBranchAlert({ showAlertBranch, setShowAlertBranch, handleCancelChange, handleConfirmChange }) {
    return (
        <AlertDialog
            open={showAlertBranch}
            onOpenChange={setShowAlertBranch}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Changing the branch will clear your cart. Do
                        you want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancelChange}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmChange}
                    >
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ShowAlertBranchAlert