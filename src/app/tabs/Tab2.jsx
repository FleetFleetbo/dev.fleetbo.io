/**
 * Fleetbo Tab Redirect or Not
 *
 * This tab is handled by a native module (or its mock in dev).
 * If React renders this route (e.g. on reload), we redirect to the mock.
 */
import { useEffect } from 'react';
import { PageConfig } from '@fleetbo';

export default function Tab2() {
    useEffect(() => {
           Fleetbo.openView('SampleTab', true, {
               emit: async (action, payload) => {
                   if (action === 'PING_JS') {
                       console.log("Signal reçu du Métal !");
                       // Vous pouvez ouvrir un overlay ici : await Fleetbo.exec('MonOverlay', 'open');
                   }
               }
           });
       }, []);
   
    return <PageConfig navbar="show" />;
}
