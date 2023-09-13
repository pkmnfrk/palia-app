import React from "react";

export default function ChangelogPage() {
    return (
        <>  
            <h2>Sep 13, 2023 - 1.4.1</h2>
            <ul>
                <li>[Add] When completing a bundle, visually mark it different</li>
                <li>[Add] When completing a vault, visually mark it different, and allow for a fun surprise 🎆</li>
                <li>[Fix] The Emberseeker Medallion was missing the "x 6". Also, add the image from the wiki (still missing a few other images, unfortunately).</li>
                <li>[Fix] The Flametongue Ray in the Flamerod Bundle was missing incorrectly being marked as needing to be ⭐ quality.</li>
                <li>[Fix] When I added Tau, the mobile layout broke. Whoops!</li>
                <li>[Change] Lots of stuff reorganized in the source code to be better. No more dumping everything into a single "components" folder!</li>
            </ul>
            <h2>Sep 12, 2023 - 1.4.0</h2>
            <ul>
                <li>[Add] Tau is now a real villager, so he's been added to the list. Who's a good boy? You are!!!</li>
                <li>[Add] Oh boy, 🔥 new bundles have been added too. So much good stuff</li>
            </ul>
            <h2>Sep 8, 2023 - 1.3.1</h2>
            <ul>
                <li>[Fix] The websocket functionality was broken due to a few errors in the deploy process. While this broke most functionality, crucially this also broke the auto-update function. However, If you are reading this, you have manually refreshed, so we should be all good.</li>
            </ul>
            <h2>Sep 8, 2023 - 1.3.0</h2>
            <ul>
                <li>[Change] Big changes under the hood! We replaced Server-Sent Events with Websockets, which are more efficient use of resources. This shouldn't affect your usage of the app, but efficiency is always better!</li>
                <li>[Fix] When automatically setting the gifted state for a villager, remove the target from them. It was always meant to work this way, I promse 😳</li>
            </ul>
            <h2>Sep 4, 2023 - 1.2.1</h2>
            <ul>
                <li>[Add] Added a help page! Now you can see all the little features that are available, and some information about time in Palia.</li>
                <li>[Fix] Fixed the layout on narrow screens. It should no longer have weird margins that waste a tiny bit of already-precious space.</li>
                <li>[Fix] Also, on iOS the buttons incorrectly had blue text instead of black. Annoying!</li>
            </ul>
            <h2>Sep 4, 2023 - 1.2.0</h2>
            <ul>
                <li>[Add] You can now "target" villagers. If you need a reminder as to who you want to talk to or give gifts to or whatever, you can right-click or long-press (on mobile) to target them. This will do two things:
                    <ol>
                        <li>It will mark them with a special target icon and colour</li>
                        <li>It will float them to the top of the list</li>
                    </ol>
                    Hope this helps all you scatterbrains (like me)!
                </li>
                <li>[Add] When setting the completed flag on a like, we now automatically mark the villager in question as gifted. This will save an estimated 2000 clicks over the course of a year!</li>
                <li>[Change] Made the "completed" checkboxes bigger so they're easier to hit on mobile</li>
            </ul>
            <h2>Sep 4, 2023 - 1.1.2</h2>
            <ul>
                <li>[Fix] Another last second change (to fix a warning) broke the web build, causing it to constantly refresh</li>
            </ul>
            <h2>Sep 4, 2023 - 1.1.1</h2>
            <ul>
                <li>[Fix] Reduced the ping delay on the EventSource channel from 3 minutes to 45 seconds. The browser was actually disconnecting after a minute. I believe this is the cause of the weekly like rollover not automatically refreshing.</li>
                <li>[Other] Refactored the backend a little bit to make it easier to debug date-related issues.</li>
            </ul>
            <h2>Sep 2, 2023 - 1.1.0</h2>
            <ul>
                <li>[Add] Bundles tracker! Now you can easily keep track of your required bundles without visiting the Temple of the Night Sky.</li>
                <li>[Add] Additionally, you can choose to show spoilers of where each item can be found.</li>
                <li>[Add] Changelog page. Hi, you're looking at it now!</li>
                <li>[Add] Add a proper version number to the footer, alongside the SHA</li>
                <li>[Other] Lots of internal refactoring. It is now much easier to add new data types in the future, if needed</li>
            </ul>

            <h2>Aug 31, 2023 - 1.0.0</h2>
            <ul>
                <li>[Add] Version display in the footer</li>
                <li>[Fix] Marking a villager as gifted for the day did not save to the server (due to a typo in the URL for the endpoint)</li>
                <li>[Fix] Refreshing after a new version is published was prone to breaking due to how deployments work</li>
                <li>[Fix] caching settings were not properly set, causing static assets to be revalidated on every load. Now it should be super speedy (assuming you already had the page loaded at least once before)</li>
            </ul>

            <h2>Aug 30, 2023 - 0.9.1</h2>
            <ul>
                <li>[Add] Page will now automatically refresh when a new version is released.</li>
                <li>[Change] Villagers are now sorted into columns first, since that hurts my brain less</li>
            </ul>

            <h2>Aug 30, 2023 - 0.9.0</h2>
            <ul>
                <li>Initial release</li>
                <li>[Add] Track villager likes, your gift status, and whether you have given them their likes or not.</li>
                <li>[Add] These things will reset as appropriate (eg, nightly for gift status, weekly for likes)</li>
                <li>[Add] Support for opening your same tracker instane in multiple devices using the link at the bottom.</li>
            </ul>
        </>
    );
}