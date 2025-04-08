import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
export default function useModal() {
    const [modalContent, setModalContent] = useState(null);
    const onClose = useCallback(() => {
        setModalContent(null);
    }, []);
    const modal = useMemo(() => {
        if (modalContent === null) {
            return null;
        }
        const { title, content, closeOnClickOutside } = modalContent;
        return (_jsx(Modal, { onClose: onClose, title: title, closeOnClickOutside: closeOnClickOutside, children: content }));
    }, [modalContent, onClose]);
    const showModal = useCallback((title, 
    // eslint-disable-next-line no-shadow
    getContent, closeOnClickOutside = false) => {
        setModalContent({
            closeOnClickOutside,
            content: getContent(onClose),
            title,
        });
    }, [onClose]);
    return [modal, showModal];
}
