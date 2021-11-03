import {useCallback} from 'react'

export const useNotification = () => {

    return useCallback((text) => {
        if (window.M && text) {         // Materialize provides an easy way for you to send alerts to your users through toasts
            window.M.toast({html: text})
        }
    }, [])

}