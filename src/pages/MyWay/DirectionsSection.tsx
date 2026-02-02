import { Stack, Typography, Paper, CircularProgress, IconButton, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Grow } from '@mui/material';
import { useEffect, useState } from 'react';
import useDirectionContext from '../../hooks/useDirectionContext';
import type { Direction } from '../../types/my_way';
import { DirectionIcon } from '../../components/CustomIcons';
import useDirectionCategoryContext from '../../hooks/useDirectionCategoryContext';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import SortIcon from '@mui/icons-material/Sort';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import DirectionDialog from './dialogs/directions/DirectionDialog';
import { grey } from '@mui/material/colors';
import ArchivedDirectionsDialog from './dialogs/directions/ArchivedDirectionsDialog';
import SortDirectionsDialog from './dialogs/directions/SortDirectionsDialog';
import DirectionCategoryListDialog from './dialogs/directions/DirectionCategoryListDialog';
import useLocalStorage, { DirectionsDisplayMode } from '../../hooks/useLocalStorage';
import DirectionDetails from './dialogs/directions/DirectionDetails';
import HorizontalSwipeBox from '../../components/HorizontalSwipeBox';
import { TransitionGroup } from 'react-transition-group';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems' | 'CategoryList' | 'Details';

const DirectionsSection = () => {
    const { isLoading: isLoadingDirection, getDirections, directions } = useDirectionContext();
    const { isLoading: isLoadingCategory, directionCategories, getDirectionCategories } = useDirectionCategoryContext();
    const { directionsDisplayMode, setDirectionsDisplayMode } = useLocalStorage();

    const [selectedDirectionId, setSelectedDirectionId] = useState<string>();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const mapDirections = () => {
        if (directions === undefined || isLoadingDirection) return <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;
        if (directions.length === 0)
            return (
                <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                    <AddIcon /> 新規作成
                </Button>
            );

        let lastCategoryId: string | null;
        switch (directionsDisplayMode.item) {
            case 'Full':
                return directions.map(direction => {
                    const isFirstOfCategory = lastCategoryId !== direction.category_id;
                    lastCategoryId = direction.category_id;
                    return (
                        <DirectionItem
                            key={direction.id}
                            direction={direction}
                            displayMode={directionsDisplayMode}
                            onClick={() => {
                                setOpenedDialog('Details');
                                setSelectedDirectionId(direction.id);
                            }}
                            isFirstOfCategory={isFirstOfCategory}
                        />
                    );
                });
            case 'TitleOnly':
                return directions.map(direction => {
                    const isFirstOfCategory = lastCategoryId !== direction.category_id;
                    lastCategoryId = direction.category_id;
                    return (
                        <DirectionItem
                            key={direction.id}
                            direction={direction}
                            displayMode={directionsDisplayMode}
                            onClick={() => {
                                setOpenedDialog('Details');
                                setSelectedDirectionId(direction.id);
                            }}
                            isFirstOfCategory={isFirstOfCategory}
                        />
                    );
                });
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <DirectionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Sort':
                return <SortDirectionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedItems':
                return <ArchivedDirectionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CategoryList':
                return <DirectionCategoryListDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Details':
                const direction = directions?.find(direction => direction.id === selectedDirectionId);
                if (direction === undefined) return <></>;
                return (
                    <DirectionDetails
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDirectionId(undefined);
                        }}
                        direction={direction}
                    />
                );
        }
    };

    useEffect(() => {
        if (directions === undefined && !isLoadingDirection) getDirections();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directions, getDirections]);

    useEffect(() => {
        if (directionCategories === undefined && !isLoadingCategory) getDirectionCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directionCategories, getDirectionCategories]);
    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" mt={0.5} alignItems="center">
                    <DirectionIcon size="small" />
                    <Typography variant="h6" textAlign="left">
                        指針
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <IconButton
                        size="small"
                        onClick={() => {
                            setOpenedDialog('Create');
                        }}
                    >
                        <AddIcon />
                    </IconButton>
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
                                <InventoryIcon />
                            </ListItemIcon>
                            <ListItemText>保管庫</ListItemText>
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
                        <Divider />
                        <Typography variant="body2" textAlign="center" color="grey">
                            表示オプション
                        </Typography>
                        <MenuItem
                            onClick={() => {
                                setDirectionsDisplayMode({ ...directionsDisplayMode, item: 'TitleOnly' });
                                setMenuAnchor(null);
                            }}
                            disabled={directionsDisplayMode.item === 'TitleOnly'}
                        >
                            <ListItemIcon>
                                <ShortTextIcon />
                            </ListItemIcon>
                            <ListItemText>名前だけ表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDirectionsDisplayMode({ ...directionsDisplayMode, item: 'Full' });
                                setMenuAnchor(null);
                            }}
                            disabled={directionsDisplayMode.item === 'Full'}
                        >
                            <ListItemIcon>
                                <NotesIcon />
                            </ListItemIcon>
                            <ListItemText>詳細も表示</ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </Stack>
            {directionCategories === undefined || isLoadingCategory ? (
                <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
            ) : (
                <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                    {mapDirections()}
                </Stack>
            )}
            {openedDialog && getDialog()}
        </>
    );
};

const DirectionItem = ({
    direction,
    onClick,
    displayMode,
    isFirstOfCategory,
}: {
    direction: Direction;
    onClick: () => void;
    displayMode: DirectionsDisplayMode;
    isFirstOfCategory: boolean;
}) => {
    const { archiveDirection } = useDirectionContext();
    const { categoryMap } = useDirectionCategoryContext();
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<'Archive'>();

    const category = categoryMap.get(direction.category_id);

    const closeDialog = () => {
        setOpenedDialog(undefined);
    };
    const getDialog = () => {
        switch (openedDialog) {
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            archiveDirection(direction.id);
                            closeDialog();
                        }}
                        title="指針：しまっておく"
                        message={`「${direction.name}」をしまっておきます。`}
                        actionName="しまっておく"
                    />
                );
        }
    };

    return (
        <>
            {isFirstOfCategory && (
                <Typography fontSize="1rem" mt={1}>
                    {category?.name ?? 'カテゴリーなし'}
                </Typography>
            )}
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)} keepSwipeState distance={100}>
                <Stack direction="row" alignItems="center">
                    <Paper sx={{ py: 1, px: 2, position: 'relative', flexGrow: 1 }} onClick={onClick}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {direction.name}
                            </Typography>
                            {displayMode.item === 'TitleOnly' && (
                                <Stack direction="row" alignItems="center">
                                    <InfoIcon sx={{ color: grey[500], fontSize: '1.2em' }} />
                                </Stack>
                            )}
                        </Stack>
                        {displayMode.item === 'Full' && (
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                {direction.description}
                            </Typography>
                        )}
                    </Paper>
                    <TransitionGroup>
                        {swipedLeft && (
                            <Grow in={swipedLeft}>
                                <IconButton onClick={() => setOpenedDialog('Archive')}>
                                    <InventoryIcon />
                                </IconButton>
                            </Grow>
                        )}
                    </TransitionGroup>
                </Stack>
            </HorizontalSwipeBox>
            {openedDialog && getDialog()}
        </>
    );
};

export default DirectionsSection;
