/**
 * Fleetbo Tab Redirect or Not
 *
 * This tab is handled by a fleetbo module (or its mock in dev).
 * If React renders this route (e.g. on reload), we redirect to the mock.
 */
import { useEffect, useState } from 'react';
import { PageConfig } from '@fleetbo';

export default function Tab2() {
    const [navMode, setNavMode] = useState("show");
    useEffect(() => {
        Fleetbo.openView('SampleTab', true, {
            emit: async (action, payload) => {
                if (action === 'HIDE_NAVBAR') setNavMode("none");
                if (action === 'SHOW_NAVBAR') setNavMode("show");
                if (action === 'PING_JS') {
                    console.log("Signal reçu du Métal !");
                    // Example: await Fleetbo.exec('MonOverlay', 'open');
                }
            }
        });
    }, []);
    return (<> <PageConfig navbar={navMode} /> </>);
}
