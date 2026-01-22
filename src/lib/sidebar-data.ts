import { FolderIcon, HistoryIcon, KeyIcon } from "lucide-react";



export const SidebarData = [
    {
        title: 'Main',
        items: [
            {
                title: 'Workflows',
                path: '/workflows',
                icon: FolderIcon
            },
            {
                title: 'Executions',
                path: '/executions',
                icon: HistoryIcon
            },
            {
                title: 'Credentials',
                path: '/credentials',
                icon: KeyIcon
            },
        ]
    }
]