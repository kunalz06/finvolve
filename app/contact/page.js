import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function Contact() {
    return (
        <div className="container section">
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <h1 className="section-title">Get in Touch</h1>
                    <p className={styles.desc}>
                        Have a project in mind? We'd love to hear from you.
                        Reach out to us via email or phone, or fill out the request form to get started.
                    </p>

                    <div className={styles.contactItems}>
                        <div className={styles.item}>
                            <div className={styles.iconBox}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3>Email Us</h3>
                                <a href="mailto:mitraricky06@gmail.com">mitraricky06@gmail.com</a>
                            </div>
                        </div>

                        <div className={styles.item}>
                            <div className={styles.iconBox}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3>Call Us</h3>
                                <a href="tel:+919907958859">+91 99079 58859</a>
                            </div>
                        </div>

                        <div className={styles.item}>
                            <div className={styles.iconBox}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3>Location</h3>
                                <p>India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
