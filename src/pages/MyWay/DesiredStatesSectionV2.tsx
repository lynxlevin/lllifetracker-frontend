import { Stack, Typography, Paper, CircularProgress, Tabs, Tab, IconButton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useDesiredStateContext from '../../hooks/useDesiredStateContext';
import type { DesiredState } from '../../types/my_way';
import { DesiredStateIcon } from '../../components/CustomIcons';
import useDesiredStateCategoryContext from '../../hooks/useDesiredStateCategoryContext';
import AddIcon from '@mui/icons-material/Add';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DesiredStatesDialog from './dialogs/desired_states/DesiredStatesDialog';
import DesiredStateDialog from './dialogs/desired_states/DesiredStateDialog';

type DialogType = 'Create' | 'Details';

const ALL_CATEGORIES = 'ALL_CATEGORIES';
const FOCUS_ITEMS = 'FOCUS_ITEMS';

const DesiredStatesSectionV2 = () => {
    const { isLoading: isLoadingDesiredState, getDesiredStates, desiredStates } = useDesiredStateContext();
    const { isLoading: isLoadingCategory, desiredStateCategories, getDesiredStateCategories } = useDesiredStateCategoryContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(FOCUS_ITEMS);
    const [selectedDesiredStateId, setSelectedDesiredStateId] = useState<string>();

    const onSelectCategory = (_: React.SyntheticEvent, newValue: string | null) => {
        setSelectedCategoryId(newValue);
    };

    const noCategoryDesiredStates = useMemo(() => {
        return desiredStates?.filter(desiredState => desiredState.category_id === null);
    }, [desiredStates]);

    const showNoCategory = useMemo(() => {
        if (selectedCategoryId === null) return true;
        return noCategoryDesiredStates !== undefined && noCategoryDesiredStates.length > 0;
    }, [noCategoryDesiredStates, selectedCategoryId]);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                const categoryId = selectedCategoryId === null || [ALL_CATEGORIES, FOCUS_ITEMS].includes(selectedCategoryId) ? undefined : selectedCategoryId;
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} defaultParams={{ categoryId }} />;
            case 'Details':
                return (
                    <DesiredStatesDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDesiredStateId(undefined);
                        }}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={onSelectCategory}
                        selectedDesiredStateId={selectedDesiredStateId}
                        setSelectedDesiredStateId={setSelectedDesiredStateId}
                    />
                );
        }
    };

    useEffect(() => {
        if (desiredStates === undefined && !isLoadingDesiredState) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);

    useEffect(() => {
        if (desiredStateCategories === undefined && !isLoadingCategory) getDesiredStateCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStateCategories, getDesiredStateCategories]);
    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" mt={0.5}>
                    <DesiredStateIcon />
                    <Typography variant="h6" textAlign="left">
                        実現のために
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
                        onClick={() => {
                            setOpenedDialog('Details');
                        }}
                    >
                        <FullscreenIcon />
                    </IconButton>
                </Stack>
            </Stack>
            {desiredStateCategories === undefined || isLoadingCategory ? (
                <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
            ) : (
                <>
                    <Tabs value={selectedCategoryId} onChange={onSelectCategory} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        <Tab label="重点項目" value={FOCUS_ITEMS} />
                        {desiredStateCategories!.map(category => {
                            return <Tab key={category.id} label={category.name} value={category.id} />;
                        })}
                        <Tab label="ALL" value={ALL_CATEGORIES} />
                        {showNoCategory && <Tab label="なし" value={null} />}
                    </Tabs>
                    <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                        {desiredStates === undefined || isLoadingDesiredState ? (
                            <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                        ) : (
                            desiredStates!
                                .filter(
                                    desiredState =>
                                        selectedCategoryId === ALL_CATEGORIES ||
                                        (selectedCategoryId === FOCUS_ITEMS && desiredState.is_focused) ||
                                        desiredState.category_id === selectedCategoryId,
                                )
                                .map(desiredState => {
                                    return (
                                        <DesiredStateItem
                                            key={desiredState.id}
                                            desiredState={desiredState}
                                            showCategory={selectedCategoryId === FOCUS_ITEMS}
                                            onClick={() => {
                                                setOpenedDialog('Details');
                                                setSelectedDesiredStateId(desiredState.id);
                                            }}
                                        />
                                    );
                                })
                        )}
                    </Stack>
                </>
            )}
            {openedDialog && getDialog()}
        </>
    );
};

const DesiredStateItem = ({ desiredState, showCategory, onClick }: { desiredState: DesiredState; showCategory: boolean; onClick: () => void }) => {
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const category = desiredStateCategories!.find(category => category.id === desiredState.category_id);

    return (
        <Paper key={desiredState.id} sx={{ py: 1, px: 2 }} onClick={onClick}>
            {showCategory && category && (
                <Typography variant="body2" fontWeight={100}>
                    {category.name}
                </Typography>
            )}
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    <Typography variant="body1">{desiredState.is_focused && '⭐️ '}</Typography>
                    <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                        {desiredState.name}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default DesiredStatesSectionV2;
