import styles from './page.module.css';

export default function Terms() {
    return (
        <div className="container section">
            <div className={styles.wrapper}>
                <h1 className="section-title">Terms and Conditions</h1>
                <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>

                <div className={styles.content}>
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Finvolve. By accessing our website and using our services, you agree to be bound by these Terms and Conditions.
                        </p>
                    </section>

                    <section>
                        <h2>2. Services</h2>
                        <p>
                            Finvolve provides software development services, including but not limited to web development, mobile app development, and custom software solutions.
                        </p>
                    </section>

                    <section>
                        <h2>3. Quick Start & Payments</h2>
                        <p>
                            The "Quick Start" option is a paid service for expedited project initiation. Payments made for this service are non-refundable once the consultation or development process has commenced.
                        </p>
                        <p>
                            <strong>Refund Policy:</strong> There will be no refunds after payment for the quick start program.
                        </p>
                    </section>

                    <section>
                        <h2>4. Intellectual Property</h2>
                        <p>
                            Unless otherwise agreed upon in writing, all intellectual property rights for the software developed will be transferred to the client upon full payment.
                        </p>
                    </section>

                    <section>
                        <h2>5. Limitation of Liability</h2>
                        <p>
                            Finvolve shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
                        </p>
                    </section>

                    <section>
                        <h2>6. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at <a href="mailto:mitraricky06@gmail.com">mitraricky06@gmail.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
