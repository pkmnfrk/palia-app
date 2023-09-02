import React from "react";

export default function ChangelogPage() {
    return (
        <>
            <h2>Sep ??, 2023</h2>
            <ul>
                <li>[Add] Changelog page</li>
                <li>[Other] Lots of internal refactoring</li>
            </ul>

            <h2>Aug 31, 2023</h2>
            <ul>
                <li>[Add] Version display in the footer</li>
                <li>[Fix] Marking a villager as gifted for the day did not save to the server (due to a typo in the URL for the endpoint)</li>
                <li>[Fix] Refreshing after a new version is published was prone to breaking due to how deployments work</li>
                <li>[Fix] caching settings were not properly set, causing static assets to be revalidated on every load. Now it should be super speedy (assuming you already had the page loaded at least once before)</li>
            </ul>

            <h2>Aug 30, 2023</h2>
            <ul>
                <li>[Add] Page will now automatically refresh when a new version is released.</li>
                <li>[Change] Villagers are now sorted into columns first, since that hurts my brain less</li>
            </ul>

            <h2>Aug 30, 2023</h2>
            <ul>
                <li>Initial release</li>
                <li>[Add] Track villager likes, your gift status, and whether you have given them their likes or not.</li>
                <li>[Add] These things will reset as appropriate (eg, nightly for gift status, weekly for likes)</li>
                <li>[Add] Support for opening your same tracker instane in multiple devices using the link at the bottom.</li>
            </ul>
        </>
    );
}