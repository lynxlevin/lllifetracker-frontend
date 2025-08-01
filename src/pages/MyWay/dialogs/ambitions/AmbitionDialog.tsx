import { Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import type { Ambition } from '../../../../types/my_way';
import { AmbitionTypography } from '../../../../components/CustomTypography';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface AmbitionDialogProps {
    onClose: () => void;
    ambition?: Ambition;
}

const AmbitionDialog = ({ onClose, ambition }: AmbitionDialogProps) => {
    const [name, setName] = useState(ambition ? ambition.name : '');
    const [description, setDescription] = useState<string>(ambition?.description ?? '');

    const { createAmbition, updateAmbition } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (ambition === undefined) {
            createAmbition(name, descriptionNullable);
        } else {
            updateAmbition(ambition.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<AmbitionTypography variant="h5" iconSize="medium" name={`大志：${ambition === undefined ? '追加' : '編集'}`} />}
            content={
                <>
                    <TextField value={name} onChange={event => setName(event.target.value)} label="内容" fullWidth />
                    <TextField
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        label="詳細"
                        multiline
                        fullWidth
                        minRows={5}
                        sx={{ marginTop: 1 }}
                    />
                    {ambition === undefined && (
                        <Typography>
                            ＊自分に生きる意味を与えてくれるような、大志を設定しましょう。生涯を通じて成し遂げたいことでも、どんな風に生きていきたいかでも構いません。疲れた時や苦しい時にやる気を取り戻せたり希望を感じられるものだと特に良いです。
                        </Typography>
                    )}
                </>
            }
            bottomPart={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {ambition === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            }
            bgColor="white"
        />
    );
};

export default AmbitionDialog;
