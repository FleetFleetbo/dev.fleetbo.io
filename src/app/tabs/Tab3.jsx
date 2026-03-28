/**
 * Fleetbo Tab Redirect or Not
 * This tab is handled by a fleetbo module (or its mock in dev).
 */
import { useEffect } from 'react';
import { PageConfig } from '@fleetbo';
   
export default function Tab3() {
    useEffect(() => {
        Fleetbo.openView('ProfileManager', true, {
            emit: async (action, payload) => {
                if (action === 'LOGOUT') {
                    Fleetbo.logout();
                }
                if (action === 'OPEN_EDIT_PROFILE') {
                    // await Fleetbo.exec('EditProfileModule', 'open');
                }
            }
        });
    }, []);
   
    return <PageConfig navbar="show" />;
}
