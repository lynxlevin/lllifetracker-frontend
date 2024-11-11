import { useCallback, useContext, useState } from 'react';
import { AmbitionContext } from '../contexts/ambition-context';
import { AmbitionAPI } from '../apis/AmbitionAPI';

const useAmbitionContext = () => {
    const ambitionContext = useContext(AmbitionContext);

    const [isLoading, setIsLoading] = useState(false);

    const getAmbitionsWithLinks = useCallback(() => {
        setIsLoading(true);
        AmbitionAPI.listWithLinks()
            .then(res => {
                ambitionContext.setAmbitionWithLinksList(res.data);
                setIsLoading(false);
            })
            .catch(e => {
                console.error(e);
                setIsLoading(false);
            });
    }, [ambitionContext]);

    const ambitionsWithLinks = ambitionContext.ambitionWithLinksList;

    const createAmbition = (name: string, description?: string) => {
        AmbitionAPI.create({ name, description }).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    return {
        isLoading,
        getAmbitionsWithLinks,
        ambitionsWithLinks,
        createAmbition,
    };
};

export default useAmbitionContext;
