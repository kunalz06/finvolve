import styles from '../terms/page.module.css';

export default function PrivacyPolicy() {
    return (
        <div className="container section">
            <div className={styles.wrapper}>
                <h1 className="section-title">Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>

                <div className={styles.content}>
                    <section>
                        <h2>1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us when you use our "Start a Project" form or "Quick Start" service. This includes:
                        </p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, and phone number.</li>
                            <li><strong>Project Details:</strong> Project type (e.g., Web Development, Android App) and project description/requirements.</li>
                            <li><strong>Payment Information:</strong> Transaction details for the "Quick Start" service. Note that we do not store your credit card or bank account details; payments are processed by our third-party payment processor, Razorpay.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul>
                            <li>Provide, maintain, and improve our software development services.</li>
                            <li>Process transactions and send you related information, including confirmations and invoices.</li>
                            <li>Communicate with you about your project requirements, updates, and support.</li>
                            <li>Respond to your comments, questions, and requests.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Sharing of Information</h2>
                        <p>
                            We do not share your personal information with third parties except in the following cases:
                        </p>
                        <ul>
                            <li><strong>Service Providers:</strong> We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., Razorpay for payment processing, Firebase for data storage).</li>
                            <li><strong>Legal Compliance:</strong> We may disclose information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use secure cloud infrastructure (Firebase) to store your project requests.
                        </p>
                    </section>

                    <section>
                        <h2>5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mitraricky06@gmail.com">mitraricky06@gmail.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
