// src/routes/index.tsx
import {createFileRoute, useNavigate} from '@tanstack/react-router'

function Page() {
    const navigate = useNavigate();
    void navigate({to: '/app/dashboard'});
}

export const Route = createFileRoute('/')({
    component: Page,
})