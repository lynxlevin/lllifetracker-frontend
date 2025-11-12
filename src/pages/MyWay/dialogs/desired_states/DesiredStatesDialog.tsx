import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import SortIcon from '@mui/icons-material/Sort';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import CategoryIcon from '@mui/icons-material/Category';
import StarsIcon from '@mui/icons-material/Stars';
import AddIcon from '@mui/icons-material/Add';
import DesiredStateDialog from './DesiredStateDialog';
import type { DesiredState } from '../../../../types/my_way';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import ArchivedDesiredStatesDialog from './ArchivedDesiredStatesDialog';
import SortDesiredStatesDialog from './SortDesiredStatesDialog';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import DesiredStateCategoryListDialog from './DesiredStateCategoryListDialog';
import { yellow } from '@mui/material/colors';
import AbsoluteButton from '../../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems' | 'CategoryList';

interface Props {
    onClose: () => void;
    selectedDesiredStateId?: string;
    setSelectedDesiredStateId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DesiredStatesDialog = ({ onClose, selectedDesiredStateId, setSelectedDesiredStateId }: Props) => {
    const { isLoading: isLoadingDesiredState, getDesiredStates, desiredStates } = useDesiredStateContext();

    const focusRef = useRef<HTMLDivElement>(null);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [desiredStateIdToShowEditButton, setDesiredStateIdToShowEditButton] = useState<string>();

    const mapDesiredStates = () => {
        if (desiredStates === undefined || isLoadingDesiredState) return <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;

        if (desiredStates.length === 0)
            return (
                <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                    <AddIcon /> 新規作成
                </Button>
            );

        let lastCategoryId: string | null;
        return desiredStates.map(desiredState => {
            const shouldShowCategory = lastCategoryId !== desiredState.category_id;
            lastCategoryId = desiredState.category_id;
            return (
                <Box
                    onClick={e => {
                        e.stopPropagation();
                        setDesiredStateIdToShowEditButton(prev => {
                            if (selectedDesiredStateId !== desiredState.id) return undefined;
                            return prev === desiredState.id ? undefined : desiredState.id;
                        });
                        setSelectedDesiredStateId(desiredState.id);
                    }}
                    ref={desiredState.id === selectedDesiredStateId ? focusRef : undefined}
                    key={desiredState.id}
                >
                    <DesiredStateItem
                        desiredState={desiredState}
                        focused={desiredState.id === selectedDesiredStateId}
                        greyed={selectedDesiredStateId !== undefined && desiredState.id !== selectedDesiredStateId}
                        showEditButton={desiredState.id === desiredStateIdToShowEditButton}
                        shouldShowCategory={shouldShowCategory}
                    />
                </Box>
            );
        });
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Sort':
                return <SortDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedItems':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CategoryList':
                return <DesiredStateCategoryListDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (focusRef.current === null) return;
            focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusRef.current]);

    useEffect(() => {
        if (desiredStates === undefined && !isLoadingDesiredState) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h6">大事にすること</Typography>}
            appBarMenu={
                <>
                    <IconButton
                        size="small"
                        onClick={event => {
                            setMenuAnchor(event.currentTarget);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('Create');
                            }}
                        >
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText>追加</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('Sort');
                            }}
                        >
                            <ListItemIcon>
                                <SortIcon />
                            </ListItemIcon>
                            <ListItemText>並び替え</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('ArchivedItems');
                            }}
                        >
                            <ListItemIcon>
                                <RestoreIcon />
                            </ListItemIcon>
                            <ListItemText>アーカイブ</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('CategoryList');
                            }}
                        >
                            <ListItemIcon>
                                <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText>カテゴリ</ListItemText>
                        </MenuItem>
                    </Menu>
                </>
            }
            content={
                <>
                    <Box>
                        <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                            {mapDesiredStates()}
                        </Stack>
                    </Box>
                    {openedDialog && getDialog()}
                </>
            }
        />
    );
};

const DesiredStateItem = ({
    desiredState,
    focused,
    greyed,
    showEditButton,
    shouldShowCategory,
}: {
    desiredState: DesiredState;
    focused: boolean;
    greyed: boolean;
    showEditButton: boolean;
    shouldShowCategory: boolean;
}) => {
    const { archiveDesiredState, updateDesiredState } = useDesiredStateContext();
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const category = desiredStateCategories!.find(category => category.id === desiredState.category_id);

    const turnOnIsFocused = () => {
        updateDesiredState(desiredState.id, desiredState.name, desiredState.description, desiredState.category_id, true);
    };

    const turnOffIsFocused = () => {
        updateDesiredState(desiredState.id, desiredState.name, desiredState.description, desiredState.category_id, false);
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <DesiredStateDialog
                        desiredState={desiredState}
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveDesiredState(desiredState.id);
                            setOpenedDialog(undefined);
                        }}
                        title="大事にすること：一旦保留する"
                        message={`「${desiredState.name}」を一旦保留にします。`}
                        actionName="一旦保留する"
                    />
                );
        }
    };
    return (
        <>
            {shouldShowCategory && (
                <Typography fontSize="1rem" mt={1}>
                    {category?.name ?? 'カテゴリーなし'}
                </Typography>
            )}
            <Paper
                key={desiredState.id}
                sx={{ py: 1, px: 2, backgroundColor: greyed ? '#f7f7f7' : undefined, position: 'relative' }}
                elevation={focused ? 6 : 0}
            >
                {desiredState.is_focused && <StarsIcon sx={{ position: 'absolute', top: '-2px', left: 0, fontSize: '1.2rem', color: yellow[700] }} />}
                <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Stack>
                        <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                            {desiredState.name}
                        </Typography>
                    </Stack>
                    <IconButton
                        size="small"
                        onClick={event => {
                            setMenuAnchor(event.currentTarget);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                        {desiredState.is_focused ? (
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    turnOffIsFocused();
                                }}
                            >
                                <ListItemIcon>
                                    <StarsIcon />
                                </ListItemIcon>
                                <ListItemText>フォーカスしない</ListItemText>
                            </MenuItem>
                        ) : (
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    turnOnIsFocused();
                                }}
                            >
                                <ListItemIcon>
                                    <StarsIcon sx={{ color: yellow[700] }} />
                                </ListItemIcon>
                                <ListItemText>フォーカスする</ListItemText>
                            </MenuItem>
                        )}
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('Edit');
                            }}
                        >
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText>編集</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('Archive');
                            }}
                        >
                            <ListItemIcon>
                                <ArchiveIcon />
                            </ListItemIcon>
                            <ListItemText>一旦保留</ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                    {desiredState.description}
                </Typography>
                {openedDialog && getDialog()}
                <AbsoluteButton
                    onClick={() => setOpenedDialog('Edit')}
                    size="small"
                    bottom={3}
                    right={3}
                    visible={showEditButton}
                    icon={<EditIcon fontSize="small" />}
                />
            </Paper>
        </>
    );
};

export default DesiredStatesDialog;
