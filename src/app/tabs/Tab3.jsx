/**
 * Fleetbo Tab Redirect or Not
 * This tab is handled by a fleetbo module (or its mock in dev).
 */
import { useEffect, useState } from 'react';
import { PageConfig } from '@fleetbo';
   
export default function Tab3() {
    const [navMode, setNavMode] = useState("show");
    useEffect(() => {
        Fleetbo.openView('ProfileManager', true, {
            emit: async (action, payload) => {
                if (action === 'HIDE_NAVBAR') setNavMode("none");
                if (action === 'SHOW_NAVBAR') setNavMode("show");
                if (action === 'LOGOUT') { Fleetbo.logout(); }
                if (action === 'OPEN_EDIT_PROFILE') {
                    // await Fleetbo.exec('EditProfileModule', 'open');
                }
            }
        });
    }, []); 
    return (<> <PageConfig navbar={navMode} /> </>);
}
