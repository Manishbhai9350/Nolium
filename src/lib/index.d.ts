


type NodeChangeType = NodeChange<{
    id: string;
    position: {
        x: number;
        y: number;
    };
    data: {
        label: string;
    };
}>
type EdgeChangeType = EdgeChange<{
    id: string;
    source: string;
    target: string;
}>
