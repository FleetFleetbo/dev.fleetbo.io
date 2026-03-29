/**
 * Tab1.jsx — Fleetbo JS in Action
 *
 * JS = Brain (orchestrates) | Native = Muscle (executes) | Alex = Architect (forges)
 *
 * Two patterns:
 *   Manager  → List + Create in one module. Fleetbo.openView('GuestManager', true)
 *   Atomic   → One action, closes. await Fleetbo.exec('Scanner', 'open', {})
 *
 * Alex (npm run alex):
 *   ✅ "Forge a guest manager with list and photo"  → Alex builds 
 *   ❌ "A guest manager with list and photo"         → Alex stays conversational
 *   Rule: use "forge", "create", "modify" to trigger code generation.
 *
 * Quick ref:
 *   Fleetbo.openView('Module', true)       → Native tab
 *   Fleetbo.exec('Module', 'action', {})   → Native overlay
 *   Fleetbo.add(db, col, json)             → Write doc
 *   Fleetbo.getDocsG(db, col)              → Read docs
 *   Fleetbo.delete(db, col, id)            → Delete doc
 */

import { useEffect, useState } from 'react';
import { PageConfig } from '@fleetbo';
 
export default function Tab1() {
    const [navMode, setNavMode] = useState("show");
    useEffect(() => {
        Fleetbo.openView('GuestManager', true, {
            emit: async (action, payload) => {
                if (action === 'HIDE_NAVBAR') setNavMode("none");
                if (action === 'SHOW_NAVBAR') setNavMode("show");
            }
        });
    }, []);
    return (<> <PageConfig navbar={navMode} /> </>);
};
