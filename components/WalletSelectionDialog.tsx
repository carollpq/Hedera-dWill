import { Button, Dialog, Stack } from "@mui/material";
import { openWalletConnectModal } from "../services/wallets/walletconnect/walletConnectClient";
import MetamaskLogo from "/public/metamask-logo.svg";
import WalletConnectLogo from "/public/walletconnect-logo.svg";


interface WalletSelectionDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onClose: (value: string) => void;
}

export const WalletSelectionDialog = (props: WalletSelectionDialogProps) => {
  const { onClose, open, setOpen } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <Stack p={2} gap={1}>
        <Button
          variant="contained"
          onClick={() => {
            openWalletConnectModal()
            setOpen(false);
          }}
        >
          <img
            src={WalletConnectLogo}
            alt='walletconnect logo'
            className='walletLogoImage'
            style={{
              marginLeft: '-6px'
            }}
          />
          WalletConnect
        </Button>
      </Stack>
    </Dialog>
  );
}