import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { Container, TitleWrapper } from './styles';

type Node = {
    id: number;
    name: string;
    description: string;
    pipeline: string;
    dois?: string[];
    origin: string;
    level: number;
};

type Props = {
    show: boolean;
    setShow: (bool: boolean) => void;
    node?: Node;
};

export const Dialog: React.FC<Props> = ({ show, setShow, node }) => {
    return (
        <Modal show={show} onHide={() => setShow(false)}>
            {node && (
                <>
                    <Modal.Header>
                        <Modal.Title>
                            <TitleWrapper>{node.name}</TitleWrapper>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <h6>
                                ID {node.id} ☆ {node.pipeline}
                            </h6>
                            <h6>Origin: {node.origin}</h6>
                            <p>{node.description}</p>
                            <h6>DOIS</h6>
                            {node.dois && node.dois.map((doi, index) => <li key={index}>{doi}</li>)}
                        </Container>
                    </Modal.Body>
                </>
            )}
        </Modal>
    );
};
