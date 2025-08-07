import {Button, Dialog, Stack} from "@mui/material";
import {openWalletConnectModal} from "@/services/wallets/walletconnect/walletConnectClient";
import MetamaskLogo from "/public/metamask-logo.svg";
import Image from "next/image";


interface WalletSelectionDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
    const {onClose, open, setOpen} = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <Stack p={3} gap={2}>
                <h2 className="text-xl font-bold text-gray-900">Select Which Wallet to Use</h2>
                <Button
                    variant="contained"
                    onClick={() => {
                        openWalletConnectModal()
                        setOpen(false);
                    }}
                    className="flex items-center justify-center gap-2"
                >
                    <Image
                        src="/walletconnect-logo.svg"
                        alt='walletconnect logo'
                        className='walletLogoImage'
                        width={20}
                        height={20}
                        style={{
                            marginLeft: '-6px'
                        }}
                    />
                    <span>WalletConnect</span>
                </Button>
            </Stack>
        </Dialog>
    );
}