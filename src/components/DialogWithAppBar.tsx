import { AppBar, Box, Dialog, DialogActions, DialogContent, IconButton, Toolbar } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

interface DialogWithAppBarProps {
    onClose: () => void;
    appBarCenterContent: JSX.Element;
    appBarMenu?: JSX.Element;
    content: JSX.Element;
    bottomPart?: JSX.Element;
    bgColor: BgColor;
}

type BgColor = 'grey' | 'white';

const DialogWithAppBar = ({ onClose, appBarCenterContent, appBarMenu, content, bottomPart, bgColor }: DialogWithAppBarProps) => {
    const getBgColor = () => {
        switch (bgColor) {
            case 'grey':
                return 'background.default';
            case 'white':
                return undefined;
        }
    };
    return (
        <Dialog open onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 2, bgcolor: getBgColor() }}>
                <AppBar position="fixed" sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant="dense">
                        <IconButton onClick={onClose}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                        <div style={{ flexGrow: 1 }} />
                        {appBarCenterContent}
                        <div style={{ flexGrow: 1 }} />
                        {appBarMenu === undefined ? <Box width="34px" /> : appBarMenu}
                    </Toolbar>
                </AppBar>
                <Box mt={6}>{content}</Box>
            </DialogContent>
            {bottomPart && <DialogActions sx={{ justifyContent: 'center', bgcolor: getBgColor() }}>{bottomPart}</DialogActions>}
        </Dialog>
    );
};

export default DialogWithAppBar;
