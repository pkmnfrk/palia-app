import React from "react";

import Clock from "./Clock.js";
import Countdown from "./Countdown.js";

import help1 from "./help1.png";
import gift from "./gift.png";
import target from "./target.png";
import likes from "./like.png";
import loves from "./love.png";

import styles from "./HelpPage.module.css";

export default function HelpPage() {
    return (
        <div className={styles.helpPage}>
            <h2>What is this app?</h2>
            <p>This app is a companion app to the MMO Palia. It is meant to help streamline some of the daily and weekly tasks you might need or want to do. Note that this does not interact with the game in any way, it is meant solely for helping you stay organized.</p>
            <h2>General notes</h2>
            <p>When playing Palia, it is important to remember when various things roll over. The game is based in Eastern time zone. The current Eastern time is <Clock />. There are three main rollovers to remember:</p>
            <ul>
                <li>Hourly rollover happens at the 15 minute mark, every hour. When this happens, your farm plants grow and you are allowed to chat with Villagers again.<br/>
                The next rollover happens in <Countdown type="hourly" />.</li>
                <li>Daily rollover happens at midnight every day. When this happens, you are permitted to give another gift to villagers.<br/>
                The next rollover happens in <Countdown type="daily" />.</li>
                <li>Weekly rollover happens at midnight between Sunday and Monday. When this happens, villagers get new likes assigned to them. Additionally, your status of giving those likes is reset.<br/>
                The next rollover happens in <Countdown type="weekly" />.</li>
            </ul>
            <p>If you have more than one device (eg, a phone or a tablet), you might wish to use it in addition to a desktop browser version. The app will automatically synchronize state between multiple devices, so long as it knows they are for the same player. To allow this, there is a link at the bottom of the page. This link will open up <em>your</em> instance of the app. All the completions, gifts, etc will be shared between all instances opened with this link. Send it to your other devices, and watch the magic happen! Note however that you should keep this secret! Otherwise, someone else could open up your instance and make changes.</p>
            <h2>Villager tab</h2>
            <p>This tab is the bread and butter of the app. All villagers are listed here, along with four boxes indicating what items they would like to receive this week.</p>
            <p className={styles.imageParagraph}>
                <img className={styles.helpImage} src={help1} alt="Diagram of the villager layout, with the villager's portrait labelled as 1, a like box labelled as 2, and a completion checkbox labelled as 3"/>
            </p>
            <ol>
                <li>The portrait is not just used for identification. It supports the following interactions:
                    <ul>
                        <li>If you click or tap on it, you will toggle the villager's gifted state. When toggled on, the portrait gains a green outline, and an icon that looks like this: <img className={styles.smol} src={gift} alt="Gifted icon"/> This indicates that you have given them a gift today.<br/>
                        This automatically resets itself once the daily rollover happens.</li>
                        <li>If you right-click or long-press on it, you will toggle the villager's target state. When toggled on, the portrait gains a blue outline, and an icon that looks like this: <img className={styles.smol} src={target} alt="Target icon"/> This indicates that you want to remember to do something with the villager. What that is is up to you! Perhaps you have a gift for them? Or they have a quest?<br/>
                        Note that this also resets at daily rollover. </li>
                    </ul>
                </li>
                <li>The text boxes are to hold the villager's likes. This is globally set for the whole game every week, so any value put in these fields is shared with everyone else. Each villager has two likes and two loves. These are indicated by the <img className={styles.smol} src={likes} alt="Like"/> and <img className={styles.smol} src={loves} alt="Love"/> icons respectively. Be sure that if you are adding a like you have discovered, you add it to the correct place!<br/>
                The likes reset at weekly rollover.</li>
                <li>The completion checkbox indicates that you have given the respective item to the villager. For convenience sake, when you mark a like as completed, it will automatically mark the villager as having received a gift for today.<br/>
                Completions automatically reset at weekly rollover.</li>
            </ol>
            <h2>Bundles Tab</h2>
            <p>Once you progress far enough into the story, you will have access to Bundles, which are a specific type of challenge. This tab allows you to track which bundle items you have delivered and which are still pending.</p>
            <p>By default, spoilers are disabled. However, by using the button labelled "Spoilers are hidden", you may toggle them on. When spoilers are enabled, the location of each item will be revealed. Note that this only reveals the items themselves. If the item is crafted, this means finding the recipe. It does not tell you where to find any ingredients.</p>
        </div>
    );
}