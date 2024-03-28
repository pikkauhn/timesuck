import React from 'react';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

import SigninButton from './system/SigninButton';
import SessionInfo from './system/SessionInfo';

const sesh = async () => {
    const session = await SessionInfo();
    const user = session;
    if (session) {
        return user
    } else {
        return null
    }
}

async function Navbar() {
    const user = await sesh();
    let show = false;
    if (user) {
        show = true;
    }

    const items: MenuItem[] = [
        { label: 'Home', url: '/', visible: show, id: 'home'},
        // { label: 'Register', url: '/Register', visible: !show, id: 'register'},
        { label: 'Administration', url: '/Admin', visible: show, id: 'admin'}
    ];

    const end = <SigninButton />
    return (
        <Menubar model={items} end={end} />
    )
}

export default Navbar