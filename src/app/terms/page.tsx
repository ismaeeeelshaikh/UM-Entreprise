export default function TermsPage() {
    return (
        <div className="container max-w-4xl py-12">
            <h1 className="mb-8 text-3xl font-bold">Terms and Conditions</h1>
            <div className="space-y-6 text-muted-foreground">
                <p>Last updated: {new Date().getFullYear()}</p>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">1. Introduction</h2>
                    <p>
                        Welcome to UM Entreprise! These Terms and Conditions outline the rules and regulations for the use of UM Entreprise's Website.
                        By accessing this website we assume you accept these terms and conditions. Do not continue to use UM Entreprise if you do not agree to take all of the terms and conditions stated on this page.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">2. License</h2>
                    <p>
                        Unless otherwise stated, UM Entreprise and/or its licensors own the intellectual property rights for all material on UM Entreprise. All intellectual property rights are reserved. You may access this from UM Entreprise for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">3. User Comments</h2>
                    <p>
                        Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. UM Entreprise does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of UM Entreprise,its agents and/or affiliates.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">4. Product Orders</h2>
                    <p>
                        All purchases through our website are subject to product availability. We may, in our sole discretion, limit or cancel the quantities offered on our website or limit the sales of our products or services to any person, household, geographic region or jurisdiction.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">5. Pricing</h2>
                    <p>
                        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-foreground">6. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us.
                    </p>
                </section>
            </div>
        </div>
    );
}
