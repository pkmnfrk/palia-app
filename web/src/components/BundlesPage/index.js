import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BundleItem from "./BundleItem.js";
import Button from "components/Button.js";
import {Fireworks} from "@fireworks-js/react";

import styles from "./index.module.css";
import { setBundleSpoilers } from "features/playerSlice.js";
import bundles from "data/bundles.js";

export default function BundlesPage() {
    const [isCelebrating, setIsCelebrating] = useState(null);
    const fireworksRef = useRef(null);

    const dispatch = useDispatch();
    const showSpoilers = useSelector(state => state.player.bundle_spoilers);
    const completion = useSelector(state => state.bundle);
    const isBundleComplete = (bundle) => {
        for(let i = 0; i < bundle.items.length; i++) {
            if(!completion[`${bundle.id}_${i + 1}`]) {
                return false;
            }
        }
        return true;
    };
    const isVaultComplete = (vault) => {
        for(const bundle of vault.bundles) {
            if(!isBundleComplete(bundle)) {
                return false;
            }
        }

        return true;
    }

    const onCelebrate = (vault) => {
        if(isCelebrating || !fireworksRef.current) return;

        const timer = setTimeout(() => {
            if(fireworksRef.current) {
                fireworksRef.current.waitStop();
            }
            setIsCelebrating(null);
        }, 10_000);

        fireworksRef.current.updateOptions({
            ...fireworksRef.current.currentOptions,
            hue: vault.celebrateHue
        })
        fireworksRef.current.start();
        setIsCelebrating(timer);
    }

    return (
        <div className={styles.bundlesPage}>
            <Fireworks 
                ref={fireworksRef}
                className={styles.fireworks}
                autostart={false}
            />
            <Button className={styles.spoilerButton} active={showSpoilers} onClick={() => dispatch(setBundleSpoilers(!showSpoilers))}>Spoilers are {showSpoilers?"shown":"hidden"}</Button>

            {Object.entries(bundles).map(([vault_id, vault]) => {
                const complete = isVaultComplete(vault);
                return (
                    <div key={vault_id}>
                        <h2>{vault.name} {complete ? (<> ✅ <Button onClick={() => onCelebrate(vault)}>🎉</Button></>) : null}</h2>
                        {vault.wip ? (<p className={styles.note}>Note: this section is a work in progress</p>) : null}
                        <div className={styles.vault}>
                            {vault.bundles.map(bundle => {
                                const complete = isBundleComplete(bundle);
                                return (
                                    <div className={styles.bundleWrapper} key={bundle.id}>
                                        <h3><span className={complete ? styles.completeBundle : null}>{bundle.name}</span>{complete ? (<> ✅</>) : null}</h3>
                                        <ul className={styles.bundle}>
                                            {bundle.items.map((item, ix) => (
                                                <BundleItem
                                                    key={ix}
                                                    id={bundle.id + "_" + (ix + 1)}
                                                    type={vault_id}
                                                    item={item.item}
                                                    description={item.description}
                                                    quality={item.quality}
                                                    qty={item.qty}
                                                />
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        }
                        </div>
                        
                    </div>
                )
            })}
        </div>
    );
}