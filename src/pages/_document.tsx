import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'; // Import the Script component

class MyDocument extends Document {
    render() {
        return (
            <Html data-theme="garden">
                <Head>
                    <link rel="manifest" href="/manifest.json" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
                        rel="stylesheet"
                    />
                    <link rel="apple-touch-icon" href="/icon.png"></link>
                    <meta name="theme-color" content="#000" />

                    {/* Google Analytics */}
                    <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-PPZBS5MHFX"
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());

                          gtag('config', 'G-PPZBS5MHFX');
                        `}
                    </Script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;
